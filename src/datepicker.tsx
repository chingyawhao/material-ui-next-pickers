import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as classnames from 'classnames'
import {withStyles, Theme, StyledComponentProps, StyleRules} from 'material-ui/styles'
import Popover from 'material-ui/Popover'
import Dialog from 'material-ui/Dialog'
import {FormControl, FormHelperText} from 'material-ui/Form'
import Input, {InputLabel, InputAdornment} from 'material-ui/Input'
import IconButton from 'material-ui/IconButton'
import {Today as CalendarIcon} from '@material-ui/icons'

import * as DateUtil from './date'
import Calendar from './calendar'

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
class DateFormatInput extends React.Component<DateFormatInputProps, DateFormatInputState> {
  input:Element | Text
  calendar:Element | Text
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
      calendarShow: false
    }
  }
  componentDidMount() {
    window.addEventListener('click', (event) => {
      if([this.input, this.calendar].reduce((contain, next) => contain && (!next || next.compareDocumentPosition(event.target as Node) < 16), true)) {
        this.closeCalendar()
      }
    })
  }
  componentDidUpdate(prevProps, prevState) {
    if((prevProps.value && prevProps.value.getTime()) !== (this.props.value && this.props.value.getTime()) && prevState.calendarShow) {
      this.closeCalendar()
    }
  }
  onFocus = (focus:boolean) => {
    this.setState({focus})
  }
  toggleShowCalendar = () => {
    const {calendarShow} = this.state
    this.setState({calendarShow:!calendarShow})
  }
  closeCalendar = () => {
    this.setState({calendarShow:false})
  }
  render() {
    const {name, label, value, onChange, anchorOrigin, transformOrigin, error, fullWidth, min, max, dialog, classes} = this.props
    const {focus, calendarShow} = this.state
    return ([
      <div key='date-input' ref={input => this.input = ReactDOM.findDOMNode(input)}>
        <FormControl className={classes.formControl} onClick={this.toggleShowCalendar} error={error !== undefined} fullWidth>
          {label && <InputLabel shrink={focus || calendarShow || value !== undefined} classes={{root:classes.label}} htmlFor={name}>{label}</InputLabel>}
          <Input name={name} value={value? DateUtil.format(value, 'EEE, MMMM d, yyyy'):'\u00a0'}
            onFocus={() => this.onFocus(true)}
            onBlur={() => this.onFocus(false)}
            inputComponent={({value}) => <div className={classes.input}>{value}</div>}
            endAdornment={<InputAdornment position='end'>
              <IconButton onMouseDown={event => event.preventDefault()}>
                <CalendarIcon/>
              </IconButton>
            </InputAdornment>}
          />
          {error && <FormHelperText error>{error}</FormHelperText>}
        </FormControl>
      </div>,
      dialog?
      <Dialog open={calendarShow} onClose={this.closeCalendar}>
        <Calendar ref={calendar => this.calendar = ReactDOM.findDOMNode(calendar)} value={value} onChange={onChange} min={min} max={max} closeCalendar={this.closeCalendar} dialog/>
      </Dialog> :
      <Popover open={calendarShow} anchorOrigin={anchorOrigin} transformOrigin={transformOrigin} anchorEl={this.input as any}>
        <Calendar ref={calendar => this.calendar = ReactDOM.findDOMNode(calendar)} value={value} onChange={onChange} min={min} max={max} closeCalendar={this.closeCalendar}/>
      </Popover>
    ])
  }
}
export interface DateFormatInputProps extends React.Props<{}>, StyledComponentProps {
  name: string
  label?: string
  value: Date
  onChange: (value:Date) => void
  anchorOrigin?: {
    vertical: 'top' | 'center' | 'bottom'
    horizontal: 'left' | 'center' | 'right'
  }
  transformOrigin?: {
    vertical: 'top' | 'center' | 'bottom'
    horizontal: 'left' | 'center' | 'right'
  }
  error?: string
  min?: Date
  max?: Date
  fullWidth?: boolean
  dialog?: boolean
}
export interface DateFormatInputState {
  focus: boolean
  calendarShow: boolean
}

export default DateFormatInput