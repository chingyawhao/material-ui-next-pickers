import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {MuiThemeProvider, createMuiTheme, withStyles, StyledComponentProps, Theme} from 'material-ui/styles'

const theme = createMuiTheme()

import DateFormatInput from '../src/datepicker'
import TimeFormatInput from '../src/timepicker'

const styles = (theme:Theme):Record<string, React.CSSProperties> => ({
  container: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  }
})
@(withStyles as any)(styles)
class DemoPage extends React.Component<DemoPageProps, DemoPageState> {
  constructor(props) {
    super(props)
    const now = new Date()
    this.state = {
      date: undefined,
      min: new Date(now.getTime() - (180 * 86400000)),
      max: new Date(now.getTime() + (120 * 86400000)),
      time: undefined
    }
  }
  onChangeDate = (date:Date) => {
    console.log('Date = ' + date)
    this.setState({date})
  }
  onChangeTime = (time:Date) => {
    console.log('Time = ' + time)
    this.setState({time})
  } 
  render() {
    const {classes} = this.props
    const {date, min, max, time} = this.state
    return (
      <div className={classes.container}>
        <DateFormatInput name='date-input' value={date} onChange={this.onChangeDate} min={min} max={max} label='Date' dialog okToConfirm/>
        <TimeFormatInput name='time-input' value={time} onChange={this.onChangeTime} label='Time' dialog okToConfirm/>
      </div>
    )
  }
}
interface DemoPageProps extends React.Props<{}>, StyledComponentProps {
}
interface DemoPageState {
  date: Date
  min: Date
  max: Date
  time: Date
}

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <DemoPage/>
  </MuiThemeProvider>
, document.getElementById('root'))