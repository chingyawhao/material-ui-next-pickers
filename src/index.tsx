import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {Manager, Target, Popper} from 'react-popper'
import Portal from 'react-travel'
import * as classnames from 'classnames'
import {withStyles, Theme, StyledComponentProps} from 'material-ui/styles'
import {FormControl, FormHelperText} from 'material-ui/Form'
import Input, {InputLabel, InputAdornment} from 'material-ui/Input'
import IconButton from 'material-ui/IconButton'
import {Today as CalendarIcon} from 'material-ui-icons'

import * as DateUtil from './util/date'
import DateModal from './DateModal'

const styles = (theme:Theme):Record<string, React.CSSProperties> => ({
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
  },
  popper: {
    height: (8 * 48) + 'px'
  }
})
@(withStyles as any)(styles)
class DateFormatInput extends React.Component<DateFormatInputProps, DateFormatInputState> {
  input:Element
  dateModal:Element
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
      if([this.input, this.dateModal].reduce((contain, next) => contain && (!next || next.compareDocumentPosition(event.target as Node) < 16), true)) {
        this.setState({calendarShow:false})
      }
    })
  }
  componentDidUpdate(prevProps, prevState) {
    if((prevProps.value && prevProps.value.getTime()) !== (this.props.value && this.props.value.getTime()) && prevState.calendarShow) {
      this.setState({calendarShow:false})
    }
  }
  onFocus = (focus:boolean) => {
    this.setState({focus})
  }
  toggleShowCalendar = () => {
    const {calendarShow} = this.state
    this.setState({calendarShow:!calendarShow})
  }
  render() {
    const {name, label, value, onChange, error, fullWidth, min, max, classes} = this.props
    const {focus, calendarShow} = this.state
    return (
      <Manager>
        <Target><div ref={input => this.input = ReactDOM.findDOMNode(input)}><FormControl className={classes.formControl} onClick={this.toggleShowCalendar} error={error !== undefined} fullWidth>
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
        </FormControl></div></Target>
        <Portal>
          <Popper placement='bottom-start'>
            <DateModal ref={dateModal => this.dateModal = ReactDOM.findDOMNode(dateModal)} value={value} onChange={onChange} min={min} max={max} calendarShow={calendarShow}/>
          </Popper>
        </Portal>
      </Manager>
    )
  }
}
export interface DateFormatInputProps extends React.Props<{}>, StyledComponentProps {
  name: string
  label?: string
  value: Date
  onChange: (value:Date) => void
  error?: string
  min?: Date
  max?: Date
  fullWidth?: boolean
}
export interface DateFormatInputState {
  focus: boolean
  calendarShow: boolean
}

export default DateFormatInput