import React, { Component } from "react"
import ReactDOM from "react-dom"
import autoBind from 'react-autobind'
import Request from "superagent"
import { cyan500 } from "material-ui/styles/colors"
import RaisedButton from 'material-ui/RaisedButton'
import db from "./db"
import storage from "./storage"
import Shelf from "./Shelf"
import Search from './Search'
import SettingDrawer from './SettingDrawer'

const COLUMNS_SIZE = 5
const QUERY_WAIT_MSEC = 500

export default class Root extends Component {
  constructor(props){
    super(props)

    this.state = {
      query: "",
      entryClusters: [], //{category: String, entries: [String]}
      columns: [],
      currentCategoryIndex: 0,
      currentEntryIndex: 0,
      drawerOpen: false,
      wikipediaOpen: false
    }

    this.rootStyle = {
      display: "flex",
      flexFlow: "column",
      margin: 20,
      font: "14px 'Lucida Grande', Helvetica, Arial, sans-serif"
    }

  }

  componentDidMount = async () => {
    const data = await storage.getDBSettings()

    if(Object.keys(data).length === 0) {
      alert("Configure DB")
      this.toggleDrawer()
      return
    }

    await db.init(data).catch((err) => {
      alert(err)
      this.toggleDrawer()
    })

    this.randomRequest()
    window.addEventListener("keydown", (e) => this.handleKeyDown(e))
  }

  randomRequest = async () => {
    this.setState({
      query: ""
    }, async () => {
      this.requestQuery(true, await db.getRandomPage())
    })
  }

  requestQuery = async (isJump = false, query = this.currentEntries()[this.state.currentEntryIndex]) => {
    console.log('submit query')
    console.log(query)
    if(!query || query.length == 0 || query == this.state.query){
      return
    }

    if(isJump){
      this.setState({
        query: ""
      })
    }

    const res = await db.memberByMember(query)
    console.log(res)

    //直前にフォーカスしていたカテゴリにピボットする
    const index = this.state.query == "" ? Math.floor(res.length / 2) : (() => {
      for(let i = 0; i < res.length; i++){
        if(res[i].category == this.state.entryClusters[this.state.currentCategoryIndex].category){
          return i
        }
      }
      return 0
    })()

    console.log(index)

    this.setState({
      currentCategoryIndex: index,
      currentEntryIndex: res[index].entries.indexOf(query),
      query: query,
      entryClusters: res
    }, () => {
      this.refreshColumns()
    })
  }

  currentEntries = () => {
    return this.state.entryClusters[this.state.currentCategoryIndex].entries
  }

  currentCategory = () => {
    return this.state.entryClusters[this.state.currentCategoryIndex].category
  }

  waitForSelect = () => {
    clearTimeout(this.timerID)
    this.timerID = setTimeout(() => {
      this.requestQuery()
    }, QUERY_WAIT_MSEC)
  }


  handleKeyDown = (e) => {
    if(e.keyCode != 37 && e.keyCode != 38 && e.keyCode != 39 && e.keyCode != 40 && e.keyCode != 13) {
      return
    }
    e.preventDefault()
    switch (e.keyCode) {
      case 38: //↑
        if (this.state.currentEntryIndex <= 0) {
          return
        }
        this.setState({
          currentEntryIndex: this.state.currentEntryIndex - 1
        }, () => {
          this.refreshColumns()
        })
        return this.waitForSelect()
      case 40: //↓
        if (this.state.currentEntryIndex >= this.currentEntries().length - 1) {
          return
        }
        this.setState({
          currentEntryIndex: this.state.currentEntryIndex + 1
        }, () => {
          this.refreshColumns()
        })
        return this.waitForSelect()
      case 37: //←
        //currentCategoryIndex
        if (this.state.currentCategoryIndex <= 0) {
          return
        }
        this.setState({
          currentCategoryIndex: this.state.currentCategoryIndex - 1,
          currentEntryIndex: this.state.entryClusters[this.state.currentCategoryIndex - 1].entries.indexOf(this.state.query)
        })
        return this.refreshColumns()
      case 39: //→
        if (this.state.currentCategoryIndex >= this.state.entryClusters.length - 1) {
          return
        }
        this.setState({
          currentCategoryIndex: this.state.currentCategoryIndex + 1,
          currentEntryIndex: this.state.entryClusters[this.state.currentCategoryIndex + 1].entries.indexOf(this.state.query)
        })
        return this.refreshColumns()
      case 13:
        this.toggleWikipedia()
        return
    }
  }

  refreshColumns = () => {
    const offset = (COLUMNS_SIZE - 1) / 2
    const columns = []
    console.log(offset)

    if(this.state.entryClusters.length == 0) {
      return
    }

    for(let i = 0; i < COLUMNS_SIZE; i++){
      const isFocus = i == offset
      const cluster = this.state.entryClusters[this.state.currentCategoryIndex - offset + i]

      if(!cluster){
        columns.push(
          <Shelf
            empty={true}
            rowSize={COLUMNS_SIZE}
          />
        )
        continue
      }

      //currentCategory以外
      const index = isFocus ? this.state.currentEntryIndex : cluster.entries.indexOf(this.state.query)

      columns.push(
        <Shelf
          debugindex={this.state.currentCategoryIndex - offset + i}
          key={`shelf-${i}`}
          rowSize={COLUMNS_SIZE}
          category={cluster ? cluster.category : ""}
          entries={cluster ? cluster.entries : ""}
          isFocus={isFocus}
          index={index}
          db={db}
        />
      )
    }
    console.log('columns updated')
    console.log(columns)

    this.setState({
      columns: columns
    })
    console.log("columns updated")
  }

  toggleDrawer = () => {
    this.setState({
      drawerOpen: !this.state.drawerOpen
    })
  }

  toggleWikipedia = () => {
    this.setState({
      wikipediaOpen: !this.state.wikipediaOpen
    })
  }

  render = () => {
    console.log("render")
    const wikipedia = (
      <iframe
        src={`https://ja.m.wikipedia.org/wiki/${this.state.query}`}
        style={{
          width: "100%",
          height: "90%",
          border: "none"
        }}
      />
    )

    return(
      <div style={this.rootStyle}>
        <div style={{ display: "flex", marginBottom: 30, height: 36 }}>
          <RaisedButton
            label="settings"
            primary={true}
            onClick={this.toggleDrawer}
            style={{ flexBasis: "20%", marginRight: 30 }}/>
          <Search
            db={db}
            requestQuery={this.requestQuery}/>
          <RaisedButton
            label="おまかせ"
            primary={true}
            onClick={this.randomRequest}
            style={{ flexBasis: "20%" }}/>
        </div>
        <div style={{ width: "1200px", display: "flex" }}>
          {this.state.columns}
        </div>
        <div style={{ position: "fixed", width: "100%", left: 0, top: this.state.wikipediaOpen ? 76 : "60%", transition: "all 300ms 0s ease"}}>
          {wikipedia}
        </div>
        <SettingDrawer
          open={this.state.drawerOpen}
          db={db} />
      </div>
    )
  }
}
