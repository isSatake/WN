import React, { Component } from "react"
import Drawer from "material-ui/Drawer"
import MenuItem from "material-ui/MenuItem"
import IconButton from "material-ui/IconButton"
import StorageIcon from "material-ui/svg-icons/device/storage"
import DbSettingDialog from "./DbSettingDialog"

export default class SettingDrawer extends Component {
  constructor(props){
    super(props)

    this.state = {
      open: false,
      isOpenDbDialog: false
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

  toggleDrawer = () => {
    this.setState({
      open: !this.state.open
    })
  }

  toggleDbDialog = (e) => {
    this.setState({
      isOpenDbDialog: !this.state.isOpenDbDialog
    })
  }

  render = () => {
    return(
      <Drawer
        open={this.state.open}
        docked={false}
        onRequestChange={(open) => this.setState({open})} >
        <MenuItem
          leftIcon={<StorageIcon />}
          onClick={this.toggleDbDialog}>
          DB設定
        </MenuItem>
        <DbSettingDialog open={this.state.isOpenDbDialog} db={this.props.db}/>
      </Drawer>
    )
  }
}
