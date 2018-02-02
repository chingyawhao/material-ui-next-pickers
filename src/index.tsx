import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {Manager, Target, Popper} from 'react-popper'
import Portal from 'react-travel'
import SwipeableViews from 'react-swipeable-views'
import {virtualize} from 'react-swipeable-views-utils'
import {TransitionGroup, Transition} from 'react-transition-group'
import {ComponentBase} from 'resub'
import * as classnames from 'classnames'
import {withStyles, Theme, StyledComponentProps} from 'material-ui/styles'
import Typography from 'material-ui/Typography'
import Card from 'material-ui/Card'
import {FormControl, FormHelperText} from 'material-ui/Form'
import Input, {InputLabel, InputAdornment} from 'material-ui/Input'
import Button from 'material-ui/Button'
import IconButton from 'material-ui/IconButton'
import {Today as CalendarIcon, ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon} from 'material-ui-icons'

import * as DateUtil from './util/date'
const VirtualizedSwipeableViews = virtualize(SwipeableViews)

const styles = (theme:Theme):Record<string, React.CSSProperties> => ({
  label: {
    maxWidth: '100%',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  input: {
    width: '180px',
    maxWidth: '100%',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  popper: {
    height: (8 * 48) + 'px'
  },
  popperEnter: {
    pointerEvents: 'none',
    transform: 'scaleY(0.5)',
    opacity: 0
  },
  popperEntered: {
    pointerEvents: 'all',
    transform: 'scaleY(1)',
    opacity: 1,
    transition: theme.transitions.create(['opacity', 'transform'], {duration:300})
  },
  popperExit: {
    pointerEvents: 'all',
    transform: 'scaleY(1)',
    opacity: 1
  },
  popperExited: {
    pointerEvents: 'none',
    transform: 'scaleY(0.5)',
    opacity: 0,
    transition: theme.transitions.create(['opacity', 'transform'], {duration:300})
  },
  card: {
    position: 'absolute',
    marginTop: '4px',
    marginBottom: '12px'
  },
  cardEnter: {
    opacity: 1
  },
  cardExit: {
    opacity: 0
  },
  calendarContainer: {
    width: (48 * 7) + 'px'
  },
  calendarControl: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  calendarMonthTitle: {
    fontSize: '1rem',
    fontWeight: 500,
    textTransform: 'none'
  },
  years: {
    height: '48px',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  invalidInput: {
    color: theme.palette.grey.A200
  },
  week: {
    display: 'flex'
  },
  weekDay: {
    height: '48px',
    width: '48px',
    color: theme.palette.grey.A200,
    fontWeight: 300,
    lineHeight: '48px',
    textAlign: 'center'
  },
  selectedDay: {
    border: '5px solid white',
    backgroundColor: theme.palette.primary.dark
  },
  selectedDayText: {
    color: 'white'
  },
  emptyDate: {
    height: '48px',
    width: '48px'
  }
})
@(withStyles as any)(styles)
class DateFormatInput extends React.Component<DateFormatInputProps, DateFormatInputState> {
  input:Element
  monthCalendarCard:Element
  yearCalendarCard:Element
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
      screenType: undefined,
      focus: false,
      calendarShow: false,
      calendarFocus: {
        mode: 'month',
        month: date.getMonth(),
        year: date.getFullYear(),
        yearIndex: Math.floor(date.getFullYear() / 18)
      }
    }
  }
  componentDidMount() {
    window.addEventListener('click', (event) => {
      if([this.input, this.monthCalendarCard, this.yearCalendarCard].reduce((contain, next) => contain && (!next || next.compareDocumentPosition(event.target as Node) < 16), true)) {
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
  selectDate = (date:Date) => {
    this.props.onChange(date)
  }
  toggleShowCalendar = () => {
    const {value} = this.props
    const {calendarShow, calendarFocus} = this.state
    if(calendarShow && value) {
      this.setState({
        calendarShow: true,
        calendarFocus: {
          ...calendarFocus,
          month: value.getMonth(),
          year: value.getFullYear()
        }
      })
    } else {
      this.setState({calendarShow:!calendarShow})
    }
  }
  showYearsCalendar = () => {
    const {calendarFocus} = this.state
    this.setState({
      calendarFocus: {
        ...calendarFocus,
        mode: 'year',
        yearIndex: Math.floor(calendarFocus.year / 18)
      }
    })
  }
  selectCalendarYear = (year:number) => {
    const {calendarFocus} = this.state
    this.setState({
      calendarFocus: {
        ...calendarFocus,
        mode: 'month',
        year
      }
    })
  }
  previousYearsValid = () => {
    const {min} = this.props
    const {calendarFocus} = this.state
    return calendarFocus.yearIndex >= 1 && (min === undefined || calendarFocus.yearIndex >= Math.ceil(min.getFullYear() / 18))
  }
  previousYears = () => {
    const {min} = this.props
    const {calendarFocus} = this.state
    this.setState({
      calendarFocus: {
        ...calendarFocus,
        yearIndex: calendarFocus.yearIndex - 1
      }
    })
  }
  nextYearsValid = () => {
    const {max} = this.props
    const {calendarFocus} = this.state
    return max === undefined || calendarFocus.yearIndex < Math.floor(max.getFullYear() / 18)
  }
  nextYears = () => {
    const {calendarFocus} = this.state
    this.setState({
      calendarFocus: {
        ...calendarFocus,
        yearIndex: calendarFocus.yearIndex + 1
      }
    })
  }
  yearInvalid = (year:number) => {
    const {min, max} = this.props
    const {calendarFocus} = this.state
    return calendarFocus.year === year || (min && year < min.getFullYear()) || (max && year > max.getFullYear())
  }
  previousMonthValid = () => {
    const {min} = this.props
    const {calendarFocus} = this.state
    return min === undefined || (calendarFocus.month > min.getMonth() || calendarFocus.year > min.getFullYear())
  }
  previousMonth = () => {
    const {calendarFocus} = this.state
    this.setState({
      calendarFocus: {
        ...calendarFocus,
        year: calendarFocus.year - (calendarFocus.month <= 0? 1:0),
        month: calendarFocus.month <= 0? 11:calendarFocus.month - 1
      }
    })
  }
  nextMonthValid = () => {
    const {max} = this.props
    const {calendarFocus} = this.state
    return max === undefined || (calendarFocus.month < max.getMonth() || calendarFocus.year < max.getFullYear())
  }
  nextMonth = () => {
    const {calendarFocus} = this.state
    this.setState({
      calendarFocus: {
        ...calendarFocus,
        year: calendarFocus.year + (calendarFocus.month >= 11? 1:0),
        month: calendarFocus.month >= 11? 0:calendarFocus.month + 1
      }
    })
  }
  dayInvalid = (date:Date) => {
    const {value, min, max} = this.props
    return (value && DateUtil.sameDay(date, value)) || (min && date.getTime() < min.getTime()) || (max && date.getTime() > max.getTime())
  }
  generateYearCalendar = (index:number) => {
    const years:number[][] = []
    var counter = 0
    for(var year = index * 18; year < (index + 1) * 18; year++) {
      if(!years[Math.floor(counter / 3)]) {
        years[Math.floor(counter / 3)] = [year]
      } else {
        years[Math.floor(counter / 3)] = [...years[Math.floor(counter / 3)], year]
      }
      counter++
    }
    return years
  }
  generateMonthCalendar = (index:number) => {
    const calendarFocus = {
      year: Math.floor(index / 12),
      month: index % 12
    }
    const firstDay = new Date(calendarFocus.year, calendarFocus.month, 1)
    const daysInWeekInMonth:Date[][] = [Array.apply(undefined, {length:firstDay.getDay()})]
    var counter = firstDay.getDay()
    for(var day = firstDay; day.getMonth() === calendarFocus.month; day = new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1)) {
      if(!daysInWeekInMonth[Math.floor(counter / 7)]) {
        daysInWeekInMonth[Math.floor(counter / 7)] = [new Date(day.getFullYear(), day.getMonth(), day.getDate())]
      } else {
        daysInWeekInMonth[Math.floor(counter / 7)] = [...daysInWeekInMonth[Math.floor(counter / 7)], new Date(day.getFullYear(), day.getMonth(), day.getDate())]
      }
      counter++
    }
    return daysInWeekInMonth
  }
  render() {
    const {name, label, value, error, fullWidth, min, max, classes} = this.props
    const {screenType, focus, calendarShow, calendarFocus} = this.state
    return (
      <Manager>
        <Target><div ref={input => this.input = ReactDOM.findDOMNode(input)}><FormControl error={error !== undefined} fullWidth>
          {label && <InputLabel shrink={focus || value !== undefined} classes={{root:classes.label}} htmlFor={name}>{label}</InputLabel>}
          <Input name={name} value={value? DateUtil.format(value, 'EEE, MMMM d, yyyy'):''}
            onFocus={() => this.onFocus(true)}
            onBlur={() => this.onFocus(false)}
            inputComponent={({value}) => <div className={classes.input}>{value}</div>}
            endAdornment={<InputAdornment position='end'>
              <IconButton onClick={this.toggleShowCalendar} onMouseDown={event => event.preventDefault()}>
                <CalendarIcon/>
              </IconButton>
            </InputAdornment>}
          />
          {error && <FormHelperText error>{error}</FormHelperText>}
        </FormControl></div></Target>
        <Portal>
          <Popper placement='bottom-start'>
            <Transition in={calendarShow} timeout={300}>
              {(state) =>
                <div className={classnames({
                  [classes.popperEnter]: (state === 'exited' || state === 'entering') && calendarShow,
                  [classes.popperEntered]: 'entered' && calendarShow,
                  [classes.popperExit]: (state === 'entered' || state === 'exiting') && !calendarShow,
                  [classes.popperExited]: state === 'exited' && !calendarShow
                })}>
                  <Transition ref={monthCalendarCard => this.monthCalendarCard = ReactDOM.findDOMNode(monthCalendarCard)} in={calendarFocus.mode === 'month'} unmountOnExit timeout={0}>
                    {(state) => 
                      <Card key='month-calendar' elevation={8} className={classnames(classes.card, {
                        [classes.cardEnter]: (state === 'entered' || state === 'entering') && calendarFocus.mode === 'month',
                        [classes.cardExit]: (state === 'exited' || state === 'exiting') && calendarFocus.mode !== 'month'
                      })}>
                        <div className={classes.calendarControl}>
                          <IconButton disabled={!this.previousMonthValid()} onClick={this.previousMonth}><ChevronLeftIcon/></IconButton>
                          <Button onClick={this.showYearsCalendar} className={classes.calendarMonthTitle}>
                            {DateUtil.month[calendarFocus.month].long + ', ' + calendarFocus.year}
                          </Button>
                          <IconButton disabled={!this.nextMonthValid()} onClick={this.nextMonth}><ChevronRightIcon/></IconButton>
                        </div>
                        <div className={classes.week}>
                          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) =>
                            <Typography key={'weeklabel-' + index} className={classes.weekDay} type='body1'>{day}</Typography>
                          )}
                        </div>
                        <VirtualizedSwipeableViews className={classes.calendarContainer} index={calendarFocus.year * 12 + calendarFocus.month} animateHeight slideRenderer={({index}) =>
                          <div key={index} className={classes.calendarContainer}>
                            {this.generateMonthCalendar(index).map((week, index) =>
                              <div className={classes.week} key={'week-' + index}>
                                {week.map((date, index) =>
                                  date? <IconButton disabled={this.dayInvalid(date)} className={classnames({[classes.selectedDay]:value && DateUtil.sameDay(date, value)})} onClick={() => this.selectDate(date)} key={'day-' + index}>
                                    <Typography className={classnames({[classes.selectedDayText]:value && DateUtil.sameDay(date, value), [classes.invalidInput]:this.dayInvalid(date)})} type='body1'>{date.getDate()}</Typography>
                                  </IconButton> : 
                                  <div className={classes.emptyDate} key={'day-' + index}/>
                                )}
                              </div>
                            )}
                          </div>
                        }/>
                      </Card>
                    }
                  </Transition>
                  <Transition ref={yearCalendarCard => this.yearCalendarCard = ReactDOM.findDOMNode(yearCalendarCard)} in={calendarFocus.mode === 'year'} unmountOnExit timeout={0}>
                    {(state) =>
                      <Card key='year-calendar' elevation={8} className={classnames(classes.card, {
                        [classes.cardEnter]: (state === 'entered' || state === 'entering') && calendarFocus.mode === 'year',
                        [classes.cardExit]: (state === 'exited' || state === 'exiting') && calendarFocus.mode !== 'year'
                      })}>
                        <div className={classes.calendarControl}>
                          <IconButton disabled={!this.previousYearsValid()} onClick={this.previousYears}><ChevronLeftIcon/></IconButton>
                          <Typography className={classes.calendarMonthTitle} type='subheading'>
                            {(calendarFocus.yearIndex * 18) + ' - ' + (calendarFocus.yearIndex * 18 + 17)}
                          </Typography>
                          <IconButton disabled={!this.nextYearsValid()} onClick={this.nextYears}><ChevronRightIcon/></IconButton>
                        </div>
                        <VirtualizedSwipeableViews className={classes.calendarContainer} index={calendarFocus.yearIndex} animateHeight slideRenderer={({index}) =>
                          <div key={index} className={classes.calendarContainer}>
                            {this.generateYearCalendar(index).map((years, index) =>
                              <div className={classes.years} key={'years-' + index}>
                                {years.map((year, index) =>
                                  <Button raised={calendarFocus.year === year} disabled={this.yearInvalid(year)} onClick={() => this.selectCalendarYear(year)} key={'year-' + index}>
                                    <Typography className={classnames({[classes.invalidInput]:this.yearInvalid(year)})} type='body1'>{year}</Typography>
                                  </Button>
                                )}
                              </div>
                            )}
                          </div>
                        }/>
                      </Card>
                    }
                  </Transition>
                </div>
              }
            </Transition>
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
  screenType: 'xl-desktop' | 'lg-desktop' | 'md-desktop' | 'sm-tablet' | 'xs-phone'
  focus: boolean
  calendarShow: boolean
  calendarFocus: {
    mode: 'year' | 'month'
    month: number
    year: number
    yearIndex: number
  }
}

export default DateFormatInput