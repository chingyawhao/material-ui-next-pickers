import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as classnames from 'classnames'
import {withStyles, Theme, StyledComponentProps, StyleRules} from '@material-ui/core/styles'
import Popover from '@material-ui/core/Popover'
import Dialog from '@material-ui/core/Dialog'
import FormControl, {FormControlProps} from '@material-ui/core/FormControl'
import FormHelperText, {FormHelperTextProps} from '@material-ui/core/FormHelperText'
import Input, {InputProps} from '@material-ui/core/Input'
import InputLabel, {InputLabelProps} from '@material-ui/core/InputLabel'
import InputAdornment from '@material-ui/core/InputAdornment'
import IconButton from '@material-ui/core/IconButton'
import AccessTime from '@material-ui/icons/AccessTime'

import * as DateUtil from './date'
import Clock, {ClockProps} from './clock'

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
class TimeFormatInput extends React.Component<TimeFormatInputProps, TimeFormatInputState> {
  action:any = {}
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
    window.addEventListener('click', this.onWindowClick)
  }
  componentWillUnmount() {
    window.removeEventListener('click', this.onWindowClick)
  }
  onWindowClick = (event:MouseEvent) => {
    if([this.input, this.clock].reduce((contain, next) => contain && (!next || next.compareDocumentPosition(event.target as Node) < 16), true)) {
      this.closeClock()
    }
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
    const {name, label, value, onChange, selectableMinutesInterval, anchorOrigin, transformOrigin, disabled, error, fullWidth, dialog, okToConfirm, endIcon, className, FormControlProps, InputLabelProps, InputProps, FormHelperTextProps, ClockProps, classes} = this.props
    const {focus, clockShow} = this.state
    return ([
      <div key='date-input' className={className} ref={input => this.input = ReactDOM.findDOMNode(input)}>
        <FormControl disabled={disabled} onClick={this.toggleShowClock} error={error !== undefined} fullWidth={fullWidth}
          {...{...FormControlProps, classes:FormControlProps && FormControlProps.classes? {root:classes.formControl, ...FormControlProps.classes}:{root:classes.formControl}}}
        >
          {label && <InputLabel shrink={focus || clockShow || value !== undefined} htmlFor={name}
            {...{...InputLabelProps, classes:InputLabelProps && InputLabelProps.classes? {root:classes.label, ...InputLabelProps.classes}:{root:classes.label}}}>
            {label}
          </InputLabel>}
          <Input name={name} value={value? DateUtil.format(value, 'h:mm a').toUpperCase():'\u00a0'}
            onFocus={() => this.onFocus(true)}
            onBlur={() => this.onFocus(false)}
            inputComponent={({value}) => <div className={classes.input}>{value}</div>}
            endAdornment={<InputAdornment position='end'>
              <IconButton onMouseDown={event => event.preventDefault()}>
                {endIcon? endIcon:<AccessTime/>}
              </IconButton>
            </InputAdornment>}
            {...InputProps}
          />
          {error && <FormHelperText error {...FormHelperTextProps}>{error}</FormHelperText>}
        </FormControl>
      </div>,
      dialog?
      <Dialog key='date-dialog' open={clockShow} onClose={this.closeClock}>
        <Clock
          ref={clock => this.clock = ReactDOM.findDOMNode(clock)}
          value={value} onChange={onChange} selectableMinutesInterval={selectableMinutesInterval}
          closeClock={this.closeClock} okToConfirm={okToConfirm} {...ClockProps as any}
        />
      </Dialog> :
      <Popover key='date-popover' open={clockShow}
        onEntered={() => {if(this.action.resize) this.action.resize()}}
        anchorOrigin={anchorOrigin} transformOrigin={transformOrigin} anchorEl={this.input as any}
      >
        <Clock
          action={action => this.action.resize = action.resize}
          ref={clock => this.clock = ReactDOM.findDOMNode(clock)}
          value={value} onChange={onChange} selectableMinutesInterval={selectableMinutesInterval}
          closeClock={this.closeClock} okToConfirm={okToConfirm} {...ClockProps as any}
        />
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
  disabled?: boolean
  error?: string
  fullWidth?: boolean
  dialog?: boolean
  okToConfirm?: boolean
  endIcon?: Node
  className?: string
  FormControlProps?: FormControlProps
  InputLabelProps?: InputLabelProps
  InputProps?: InputProps
  FormHelperTextProps?: FormHelperTextProps
  ClockProps?: ClockProps
}
export interface TimeFormatInputState {
  focus: boolean
  clockShow: boolean
}

export default TimeFormatInput