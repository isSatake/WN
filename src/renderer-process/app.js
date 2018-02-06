import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import Root from './root'

class App extends Component {
  render(){
    return(
      <MuiThemeProvider>
        <Root />
      </MuiThemeProvider>
    )
  }
}

window.onload = () => {
  ReactDOM.render(<App />, document.getElementById('container'))
}
