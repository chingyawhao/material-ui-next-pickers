import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {MuiThemeProvider, createMuiTheme, withStyles, StyledComponentProps, Theme} from 'material-ui/styles'

const theme = createMuiTheme()

import DateFormatInput from '../src'
const styles = (theme:Theme):Record<string, React.CSSProperties> => ({
  container: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
})
@(withStyles as any)(styles)
class DemoPage extends React.Component<DemoPageProps, DemoPageState> {
  constructor(props) {
    super(props)
    this.state = {
      date: undefined
    }
  }
  onChange = (date:Date) => {
    console.log(date)
    this.setState({date})
  } 
  render() {
    const {classes} = this.props
    const {date} = this.state
    return (
      <div className={classes.container}>
        <DateFormatInput name='date-input' value={date} onChange={this.onChange} label='Date'/>
      </div>
    )
  } 
}
interface DemoPageProps extends React.Props<{}>, StyledComponentProps {
}
interface DemoPageState {
  date: Date
}

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <DemoPage/>
  </MuiThemeProvider>
, document.getElementById('root'))