import React, { Component } from "react"
import ReactDOM from "react-dom"
import Request from "superagent"
import db from "./db"
import Shelf from "./Shelf"

const COLUMNS_SIZE = 3
const QUERY_WAIT_MSEC = 500

class App extends Component {
  constructor(props){
    super(props)

    this.state = {
      query: "",
      entryClusters: [], //{category: String, entries: [String]}
      columns: [],
      currentCategoryIndex: 0,
      currentEntryIndex: 0
    }
  }

  async componentDidMount() {
    await db.connect()
    this.requestQuery("増井俊之")
    window.addEventListener("keydown", (e) => this.handleKeyDown(e))
  }

  async request(query) {
    console.log('submit query')

    const res = await db.memberByMember(query)
    console.log(res)

    //直前にフォーカスしていたカテゴリにピボットする
    const index = this.state.query == "" ? Math.floor(res.length / 2) : (() => {
      for(let i = 0; i < res.length; i++){
        if(res[i].category == this.state.entryClusters[this.state.currentCategoryIndex].category){
          return i
        }
      }
      return -1
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

  currentEntries() {
    return this.state.entryClusters[this.state.currentCategoryIndex].entries
  }

  currentCategory() {
    return this.state.entryClusters[this.state.currentCategoryIndex].category
  }

  waitForSelect() {
    clearTimeout(this.timerID)
    this.timerID = setTimeout(() => {
      this.requestQuery()
    }, QUERY_WAIT_MSEC)
  }

  requestQuery(query = this.currentEntries()[this.state.currentEntryIndex]) {
    console.log("request")
    console.log(query)
    if(!query || query.length == 0 || query == this.state.query){
      return
    }
    const encodedQuery = encodeURIComponent(query)
    this.request(query)
  }

  handleKeyDown(e) {
    if(e.keyCode != 37 && e.keyCode != 38 && e.keyCode != 39 && e.keyCode != 40) {
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
    }
  }

  refreshColumns() {
    const offset = (COLUMNS_SIZE - 1) / 2
    const columns = []

    if(this.state.entryClusters.length == 0) {
      return
    }

    for(let i = 0; i < COLUMNS_SIZE; i++){
      const isFocus = i == offset
      const cluster = this.state.entryClusters[this.state.currentCategoryIndex - offset + i]

      if(!cluster){
        columns.push(
          <Shelf empty={true} />
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
  }

  render() {
    console.log("render")
    const wikipedia = (
      <iframe
        src={`https://ja.m.wikipedia.org/wiki/${this.state.query}`}
        width="100%"
        height="90%" />
    )
    // const wikipedia = ""

    return(
      <div
        className="container-fluid"
        style={{ display: "flex" }} >
          <div style={{ width: "60%" }}>
            <div style={{ display: "flex" }}>
              {this.state.columns}
            </div>
          </div>
          <div style={{ width: "40%" }}>
            {wikipedia}
          </div>
      </div>
    )
  }
}

window.onload = () => {
  ReactDOM.render(<App />, document.getElementById("container"))
}
