import * as mysql from "mysql2/promise"
import Request from "superagent"
import excludedCategories from "./excludedCategories"

const SLOW_QUERY_THRESHOLD = 5000
const BING_URL = 'https://api.cognitive.microsoft.com/bing/v7.0/images/search?count=1&q='
let db

exports.connect = async () => {
  db = await mysql.createConnection({
    host: 'localhost',//process.env.DB_HOST,
    user: 'root',//process.env.DB_USER,
    database: 'wikipage'//process.env.DB_NAME
  })
}

async function getCategoryMember(category) {
  const startTime = new Date().getTime()
  const [rows, fields] = await db.execute(`select categorylinks.cl_to,page.page_title from categorylinks inner join page on categorylinks.cl_from = page.page_id where categorylinks.cl_to = ${db.escape(category)}`)
  const elapsedTime = new Date().getTime() - startTime

  // if(elapsedTime > SLOW_QUERY_THRESHOLD){
  //   console.log(`Slow query detected! Category:${category}`)
  //   excludeCategory(category)
  // }

  const member = []
  for(let row of rows){
    member.push(row.page_title.toString())
  }

  return member
}

function isNotCategory(title){
  for(let filter of excludedCategories){
    if(title.indexOf(filter) >= 0){
      return true
    }
  }
}

async function getCategories(title) {
  const [rows, fields] = await db.execute(`select page.page_title,categorylinks.cl_to from page inner join categorylinks on page.page_id = categorylinks.cl_from where page.page_title = ${db.escape(title)};`)
  const categories = []

  for(let row of rows){
    const title = row.cl_to.toString()
    if(isNotCategory(title)){
      continue
    }
    categories.push(row.cl_to.toString())
  }
  return categories
}

exports.memberByMember = async function(title) {
  console.log(title)
  const categories = await getCategories(title)
  const members = []
  for(let category of categories){
    members.push({category: category, entries: await getCategoryMember(category)})
  }
  return members
}

exports.getImage = async (title) => {
  const res = await db.execute(`select url from image where title = ${db.escape(title)}`)
  if(res[0].length == 0){
    const res = await Request.get(`${BING_URL}${encodeURIComponent(title)}`).set("Ocp-Apim-Subscription-Key", "3ebf24197a5a4366b937f25e14869320")
    if(res.body.value[0]){
      const url = res.body.value[0].thumbnailUrl
      db.execute(`insert into image values(${db.escape(title)}, '${url}')`).catch((e) => {})
      return url
    }
    return ""
  } else {
    return res[0][0].url
  }
}

exports.getRandomPage = async function() {
  let res = await db.execute(`select page_title from page where page_random >= ${Math.random(1)} and page_namespace = 0 and page_is_redirect = 0 order by page_random limit 1;`)
  if(res[0].length == 0){
    res = await db.execute(`select page_title from page where page_random >= 0 and page_namespace = 0 and page_is_redirect = 0 order by page_random limit 1;`)
  }
  return res[0][0].page_title.toString()
}

exports.searchByTitle = async (query) => {
  return await db.execute(`select page_title from page where page_title like '${query}%' and page_namespace = 0 and page_is_redirect = 0 limit 100;`)
}
