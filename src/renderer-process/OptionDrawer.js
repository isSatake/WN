import React, { Component } from "react"
import Drawer from "material-ui/Drawer"
import MenuItem from "material-ui/MenuItem"
import IconButton from "material-ui/IconButton"
import { RadioButton, RadioButtonGroup } from "material-ui/RadioButton"
import GridIcon from "material-ui/svg-icons/image/grid-on"
import TimerIcon from "material-ui/svg-icons/image/timer"

export default class Search extends Component {
  constructor(props){
    super(props)

    this.state = {
      open: false
    }

    this.radioStyle = {
      group: {
        marginLeft: 30
      },
      button: {
        minHeight: 48,
        fontSize: 16
      }
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

  setColumnsSize = (e, value) => {
    this.props.setColumnsSize(value)
    this.toggleDrawer()
  }

  setWaitTime = (e, value) => {
    this.props.setWaitTime(value)
    this.toggleDrawer()
  }

  render() {
    return(
      <Drawer
        open={this.state.open}
        docked={false}
        onRequestChange={(open) => this.setState({open})} >
        <MenuItem
          leftIcon={<GridIcon />}
          open={true}
          nestedItems={[
            <RadioButtonGroup
              name="columnSize"
              defaultSelected="3"
              onChange={this.setColumnsSize}
              style={this.radioStyle.group}>
              <RadioButton style={this.radioStyle.button} value="3" label="3" />
              <RadioButton style={this.radioStyle.button} value="5" label="5" />
              <RadioButton style={this.radioStyle.button} value="9" label="9" />
            </RadioButtonGroup>
          ]}>
          グリッド数
        </MenuItem>
        <MenuItem
          leftIcon={<TimerIcon />}
          open={true}
          nestedItems={[
            <RadioButtonGroup
              name="waitTime"
              defaultSelected="500"
              onChange={this.setWaitTime}
              style={this.radioStyle.group}>
              <RadioButton style={this.radioStyle.button} value="250" label="250ms" />
              <RadioButton style={this.radioStyle.button} value="500" label="500ms" />
              <RadioButton style={this.radioStyle.button} value="1000" label="1000ms" />
            </RadioButtonGroup>
          ]}>
          クエリ待ち時間
        </MenuItem>
      </Drawer>
    )
  }
}
