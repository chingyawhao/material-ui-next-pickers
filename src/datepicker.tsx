import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as classnames from 'classnames'
import {withStyles, Theme, StyledComponentProps, StyleRules} from '@material-ui/core/styles'
import Popover from '@material-ui/core/Popover'
import Dialog from '@material-ui/core/Dialog'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText, {FormHelperTextProps} from '@material-ui/core/FormHelperText'
import Input, {InputProps} from '@material-ui/core/Input'
import InputLabel, {InputLabelProps} from '@material-ui/core/InputLabel'
import InputAdornment from '@material-ui/core/InputAdornment'
import IconButton from '@material-ui/core/IconButton'
import Today from '@material-ui/icons/Today'

import * as DateUtil from './date'
import Calendar, {CalendarProps} from './calendar'

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
    minWidth: '180px',
    flexGrow: 1,
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
  action:any = {}
  input:Element
  calendar:Element
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
    window.addEventListener('click', this.onWindowClick)
  }
  componentDidUpdate(prevProps, prevState) {
    if((prevProps.value && prevProps.value.getTime()) !== (this.props.value && this.props.value.getTime()) && prevState.calendarShow) {
      this.closeCalendar()
    }
  }
  componentWillUnmount() {
    window.removeEventListener('click', this.onWindowClick)
  }
  onWindowClick = (event:MouseEvent) => {
    if([this.input, this.calendar].reduce((contain, next) => contain && (!next || next.compareDocumentPosition(event.target as Node) < 16), true)) {
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
  dateValue = (date:Date) => {
    const {dateFormat} = this.props
    if(typeof dateFormat === 'string') {
      return DateUtil.format(date, dateFormat)
    } else if(typeof dateFormat === 'function') {
      return dateFormat(date)
    } else {
      return DateUtil.format(date, 'EEE, MMMM d, yyyy')
    }
  }
  render() {
    const {name, label, value, onChange, anchorOrigin, transformOrigin, disabled, error, fullWidth, dateDisabled, min, max, dialog, okToConfirm, endIcon, className, InputLabelProps, InputProps, FormHelperTextProps, CalendarProps, classes} = this.props
    const {focus, calendarShow} = this.state
    const calendarProps = {
      ref: calendar => this.calendar = ReactDOM.findDOMNode(calendar) as Element,
      value, onChange, dateDisabled, min, max,
      closeCalendar: this.closeCalendar, okToConfirm,
      ...CalendarProps
    }
    return ([
      <div key='date-input' className={className} ref={input => this.input = input}>
        <FormControl className={classes.formControl} disabled={disabled} onClick={this.toggleShowCalendar} error={error !== undefined} fullWidth={fullWidth}>
          {label && <InputLabel shrink={focus || calendarShow || value !== undefined} htmlFor={name}
            {...{...InputLabelProps, classes:InputLabelProps && InputLabelProps.classes? {root:classes.label, ...InputLabelProps.classes}:{root:classes.label}}}>
            {label}
          </InputLabel>}
          <Input name={name} value={value? this.dateValue(value):'\u00a0'}
            onFocus={() => this.onFocus(true)}
            onBlur={() => this.onFocus(false)}
            inputComponent={({value}) => <div className={classes.input}>{value}</div>}
            endAdornment={<InputAdornment position='end'>
              <IconButton onMouseDown={event => event.preventDefault()}>
                {endIcon? endIcon:<Today/>}
              </IconButton>
            </InputAdornment>}
            {...InputProps}
          />
          {error && <FormHelperText error {...FormHelperTextProps}>{error}</FormHelperText>}
        </FormControl>
      </div>,
      dialog?
      <Dialog key='date-dialog' open={calendarShow} onClose={this.closeCalendar}>
        <Calendar {...calendarProps as any}/>
      </Dialog> :
      <Popover key='date-popover'
        onEntered={() => {if(this.action.resize) this.action.resize()}}
        open={calendarShow} anchorOrigin={anchorOrigin} transformOrigin={transformOrigin} anchorEl={this.input as any}
      >
        <Calendar action={action => this.action.resize = action.resize} {...calendarProps as any}/>
      </Popover>
    ])
  }
}
export interface DateFormatInputProps extends React.Props<{}>, StyledComponentProps {
  name: string
  label?: string
  value: Date
  onChange: (value:Date, event?:React.MouseEvent<HTMLElement>) => void
  anchorOrigin?: {
    vertical: 'top' | 'center' | 'bottom'
    horizontal: 'left' | 'center' | 'right'
  }
  transformOrigin?: {
    vertical: 'top' | 'center' | 'bottom'
    horizontal: 'left' | 'center' | 'right'
  }
  disabled?: boolean
  error?: string
  dateDisabled?: (date:Date) => boolean
  min?: Date
  max?: Date
  dateFormat?: string | ((date:Date) => string)
  fullWidth?: boolean
  dialog?: boolean
  okToConfirm?: boolean
  endIcon?: Node
  className?: string
  InputLabelProps?: InputLabelProps
  InputProps?: InputProps
  FormHelperTextProps?: FormHelperTextProps
  CalendarProps?: CalendarProps
}
export interface DateFormatInputState {
  focus: boolean
  calendarShow: boolean
}

export default DateFormatInput