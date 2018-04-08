import React, { Component } from "react"
import Autosuggest from 'react-autosuggest'
import searchTheme from './searchTheme'

export default class Search extends Component {
  constructor(props){
    super(props)
    this.state = {
      value: "",
      suggestions: ["a", "b"]
    }
  }

  onChange = (event, { newValue, method }) => {
    this.setState({
      value: newValue
    })
  }

  onSuggestionsFetchRequested = async ({ value }) => {
    const res = await this.props.db.searchByTitle(value)
    const suggestions = []
    for(let obj of res[0]){
      suggestions.push(obj.page_title.toString())
    }
    this.setState({
      suggestions: suggestions
    })
  }

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    })
  }

  getSuggestionValue = value => value

  renderSuggestion = suggestion => {
    return(
      <div style={{ zIndex: 100 }}>
       {suggestion}
      </div>
    )
  }

  onSearch = (value) => {}

  onSelected = (event, { suggestion }) => {
    console.log(suggestion)
    console.log(this)
    this.props.requestQuery(true, suggestion)
    //フォーカスを外す
    //input.blur()
  }

  render() {
    const { value, suggestions } = this.state
    const inputProps = {
      placeholder: "Search Wikipedia",
      value,
      onChange: this.onChange
    }

    return(
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={this.getSuggestionValue}
        renderSuggestion={this.renderSuggestion}
        inputProps={inputProps}
        onSuggestionSelected={this.onSelected}
        theme={searchTheme}
      />
    )
  }
}
