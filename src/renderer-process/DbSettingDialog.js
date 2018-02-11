import React, { Component } from "react"
import storage from "electron-json-storage"
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import TextField from 'material-ui/TextField'

export default class DbSettingDialog extends Component {
  constructor(props){
    super(props)

    this.state = {
      open: false
    }
  }

  componentWillReceiveProps = (nextProps) => {
    if(this.props.open == nextProps.open){
      return
    }
    this.setState({
      open: nextProps
    })
  }

  toggleDbDialog = () => {
    this.setState({
      open: !this.state.open
    })
  }

  onOk = async () => {
    const { host, port, user, password, database } = this.refs
    const json = {
      host: host.getValue(),
      port: port.getValue(),
      user: user.getValue(),
      password: password.getValue(),
      database: database.getValue()
    }
    storage.set("config", json, (err) => {
      if(err) {
        alert(err)
      }
      console.log("completed to save config")
    })

    await this.props.db.init(json).then((res) => {
      alert("succeeded to init db")
      this.toggleDbDialog()
    }).catch((err) => {
      alert(err)
      return
    })

  }

  render() {
    const actions = [
      <FlatButton
        label="OK"
        primary={true}
        onClick={this.onOk}
      />
    ]

    const { host, port, user, password, database } = this.props.db.getProps() || {}

    return(
      <Dialog
        title="DB設定"
        open={this.state.open}
        actions={actions}
        modal={false}
        onRequestClose={this.toggleDbDialog}
        autoScrollBodyContent={true}>
        <TextField floatingLabelText="MySQL hostname" defaultValue={host || "localhost"} ref="host"/>
        <br />
        <TextField floatingLabelText="MySQL portnumber" defaultValue={port || "3306"} ref="port"/>
        <br />
        <TextField floatingLabelText="MySQL username" defaultValue={user || ""} ref="user"/>
        <br />
        <TextField floatingLabelText="MySQL password" defaultValue={password || ""} ref="password"/>
        <br />
        <TextField floatingLabelText="MySQL wikipedia db name" defaultValue={database || ""}  ref="database"/>
      </Dialog>
    )
  }
}
