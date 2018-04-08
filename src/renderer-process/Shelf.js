import React, { Component } from "react"
import Entry from "./Entry"

export default class Shelf extends Component {
  constructor(props){
    super(props)
    console.log('Shelf constructed')

    this.titleStyle = {
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      overflow: "hidden",
      height: 50,
      marginBottom: 20,
      borderRadius: 20,
      paddingLeft: 10,
      fontWeight: "bold",
      fontSize: 15,
      display: "flex",
      alignItems: "center",
      boxSizing: "border-box"
    }

    this.wrapperStyle = {
      height: "80%",
      width: 210,
      paddingRight: "20px"
    }

    if(this.props.isFocus){
      this.titleStyle.background = "#AAA"
    }else{
      this.titleStyle.background = "#EEE"
    }
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    if(this.props.category == nextProps.category && this.props.index == nextProps.index){
      return false
    }
    return true
  }

  getElements = () => {
    // const index = this.props.index//this.props.entries.indexOf(this.props.query)
    const offset = (this.props.rowSize - 1) / 2
    const elements = []

    for(let i = 0; i < this.props.rowSize; i++){
      const index = this.props.index - offset + i
      if(index < 0 || index >= this.props.entries.length){
        // continue
        elements.push(
          <Entry empty={true} />
        )
        continue
      }
      elements.push(
        <Entry
          debugindex={index}
          key={`entry-${i}`}
          title={this.props.entries[index]}
          isFocus={i == offset}
          db={this.props.db}
        />
      )
    }
    console.log('entries prepared')

    return elements
  }

  render = () => {
    console.log("render")

    if(this.props.empty){
      return(
        <div
          key={"0"}
          style={this.wrapperStyle}></div>
      )
    }

    return (
      <div style={this.wrapperStyle}>
        <div style={this.titleStyle}>
          <div>{this.props.category}</div>
        </div>
        <div>
          {this.getElements()}
        </div>
      </div>
    )
  }
}
