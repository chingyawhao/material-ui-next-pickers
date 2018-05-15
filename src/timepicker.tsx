import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as classnames from 'classnames'
import {withStyles, Theme, StyledComponentProps, StyleRules} from 'material-ui/styles'
import Popover from 'material-ui/Popover'
import Dialog from 'material-ui/Dialog'
import {FormControl, FormHelperText} from 'material-ui/Form'
import Input, {InputLabel, InputAdornment} from 'material-ui/Input'
import IconButton from 'material-ui/IconButton'
import {AccessTime as ClockIcon} from '@material-ui/icons'

import * as DateUtil from './date'
import Clock from './clock'

const styles = (theme:Theme):StyleRules => ({
  label: {
    maxWidth: '100%',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  formControl: {
    cursor: 'pointer'
  },
  input: {
    width: '180px',
    maxWidth: '100%',
    height: '19px',
    padding: '6px 0 7px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }
})
@(withStyles as any)(styles)
class TimeFormatInput extends React.Component<TimeFormatInputProps, TimeFormatInputState> {
  input:Element | Text
  clock:Element | Text
  constructor(props) {
    super(props)
    const now = new Date()
    var date = new Date(now.getTime())
    const {min, max} = props
    if(max && now.getTime() > max.getTime()) {
      date = new Date(max.getTime())
    } else if(min && now.getTime() < min.getTime()) {
      date = new Date(min.getTime())
    }
    this.state = {
      focus: false,
      clockShow: false
    }
  }
  componentDidMount() {
    window.addEventListener('click', (event) => {
      if([this.input, this.clock].reduce((contain, next) => contain && (!next || next.compareDocumentPosition(event.target as Node) < 16), true)) {
        this.closeClock()
      }
    })
  }
  onFocus = (focus:boolean) => {
    this.setState({focus})
  }
  toggleShowClock = () => {
    const {clockShow} = this.state
    this.setState({clockShow:!clockShow})
  }
  closeClock = () => {
    this.setState({clockShow:false})
  }
  render() {
    const {name, label, value, onChange, selectableMinutesInterval, anchorOrigin, transformOrigin, error, fullWidth, dialog, okToConfirm, endIcon, classes} = this.props
    const {focus, clockShow} = this.state
    return ([
      <div key='date-input' ref={input => this.input = ReactDOM.findDOMNode(input)}>
        <FormControl className={classes.formControl} onClick={this.toggleShowClock} error={error !== undefined} fullWidth>
          {label && <InputLabel shrink={focus || clockShow || value !== undefined} classes={{root:classes.label}} htmlFor={name}>{label}</InputLabel>}
          <Input name={name} value={value? DateUtil.format(value, 'h:mm a').toUpperCase():'\u00a0'}
            onFocus={() => this.onFocus(true)}
            onBlur={() => this.onFocus(false)}
            inputComponent={({value}) => <div className={classes.input}>{value}</div>}
            endAdornment={<InputAdornment position='end'>
              <IconButton onMouseDown={event => event.preventDefault()}>
                {endIcon? endIcon:<ClockIcon/>}
              </IconButton>
            </InputAdornment>}
          />
          {error && <FormHelperText error>{error}</FormHelperText>}
        </FormControl>
      </div>,
      dialog?
      <Dialog key='date-dialog' open={clockShow} onClose={this.closeClock}>
        <Clock ref={clock => this.clock = ReactDOM.findDOMNode(clock)} value={value} onChange={onChange} selectableMinutesInterval={selectableMinutesInterval} closeClock={this.closeClock} okToConfirm={okToConfirm}/>
      </Dialog> :
      <Popover key='date-popover' open={clockShow} anchorOrigin={anchorOrigin} transformOrigin={transformOrigin} anchorEl={this.input as any}>
        <Clock ref={clock => this.clock = ReactDOM.findDOMNode(clock)} value={value} onChange={onChange} selectableMinutesInterval={selectableMinutesInterval} closeClock={this.closeClock} okToConfirm={okToConfirm}/>
      </Popover>
    ])
  }
}
export interface TimeFormatInputProps extends React.Props<{}>, StyledComponentProps {
  name: string
  label?: string
  value: Date
  onChange: (value:Date, event?:React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => void
  selectableMinutesInterval?: number
  anchorOrigin?: {
    vertical: 'top' | 'center' | 'bottom'
    horizontal: 'left' | 'center' | 'right'
  }
  transformOrigin?: {
    vertical: 'top' | 'center' | 'bottom'
    horizontal: 'left' | 'center' | 'right'
  }
  error?: string
  fullWidth?: boolean
  dialog?: boolean
  okToConfirm?: boolean
  endIcon?: Node
}
export interface TimeFormatInputState {
  focus: boolean
  clockShow: boolean
}

export default TimeFormatInput