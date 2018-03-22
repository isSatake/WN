import storage from "electron-json-storage"

exports.getDBSettings = () => {
  return new Promise(resolve => {
    storage.get("db", (err, data) => {
      if(err){
        alert(err)
      }
      resolve(data)
    })
  })
}

exports.set = (json) => {
  for(let key in json){
    storage.set(key, json[key], (err) => {
      if(err){
        alert(err)
      }
    })
  }
  return
}
