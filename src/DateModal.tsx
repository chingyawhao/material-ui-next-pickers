import * as React from 'react'
import SwipeableViews from 'react-swipeable-views'
import {virtualize} from 'react-swipeable-views-utils'
import * as classnames from 'classnames'
import {withStyles, Theme, StyledComponentProps} from 'material-ui/styles'
import Typography from 'material-ui/Typography'
import Card from 'material-ui/Card'
import Button from 'material-ui/Button'
import IconButton from 'material-ui/IconButton'
import {ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon} from 'material-ui-icons'

import * as DateUtil from './util/date'
const VirtualizedSwipeableViews = virtualize(SwipeableViews)

const styles = (theme:Theme):Record<string, React.CSSProperties> => ({
  calendarContainer: {
    width: (48 * 7) + 'px'
  },
  calendarDialog: {
    maxWidth: 'calc(100vw - 64px)',
    overflow: 'hidden'
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
  currentYear: {
    backgroundColor: 'rgba(0, 0, 0, 0.04)'
  },
  invalidInput: {
    color: theme.palette.grey.A200
  },
  week: {
    display: 'flex'
  },
  labelWeekDay: {
    height: '48px',
    width: '48px',
    color: theme.palette.grey.A200,
    fontWeight: 300,
    lineHeight: '48px',
    textAlign: 'center'
  },
  weekDay: {
    flex: '1 1 auto',
    maxHeight: 'calc((100vw - 48px) / 7)'
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
class DateModal extends React.Component<DateModalProps, DateModalState> {
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
      mode: 'month',
      month: date.getMonth(),
      year: date.getFullYear(),
      yearIndex: Math.floor(date.getFullYear() / 18)
    }
  }
  componentDidUpdate(prevProps, prevState) {
    const {calendarShow, value} = this.props
    if(!prevProps.calendarShow && calendarShow && value) {
      this.setState({
        month: value.getMonth(),
        year: value.getFullYear()
      })
    }
  }
  selectDate = (date:Date) => {
    this.props.onChange(date)
  }
  showYearsCalendar = () => {
    const {year} = this.state
    this.setState({
      mode: 'year',
      yearIndex: Math.floor(year / 18)
    })
  }
  selectCalendarYear = (year:number) => {
    const {min, max} = this.props
    const {month} = this.state
    this.setState({
      mode: 'month',
      year,
      month: min && month < min.getMonth() && year === min.getFullYear()? min.getMonth():(
        max && month > max.getMonth() && year === max.getFullYear()? max.getMonth():month
      )
    })
  }
  previousYearsValid = () => {
    const {min} = this.props
    const {yearIndex} = this.state
    return yearIndex >= 1 && (min === undefined || yearIndex >= Math.ceil(min.getFullYear() / 18))
  }
  previousYears = () => {
    const {min} = this.props
    const {yearIndex} = this.state
    this.setState({
      yearIndex: yearIndex - 1
    })
  }
  nextYearsValid = () => {
    const {max} = this.props
    const {yearIndex} = this.state
    return max === undefined || yearIndex < Math.floor(max.getFullYear() / 18)
  }
  nextYears = () => {
    const {yearIndex} = this.state
    this.setState({
      yearIndex: yearIndex + 1
    })
  }
  yearInvalid = (currentYear:number) => {
    const {min, max} = this.props
    const {month, year} = this.state
    return (min && currentYear < min.getFullYear()) || (max && currentYear > max.getFullYear())
  }
  previousMonthValid = () => {
    const {min} = this.props
    const {month, year} = this.state
    return min === undefined || (month > min.getMonth() || year > min.getFullYear())
  }
  previousMonth = () => {
    const {month, year} = this.state
    this.setState({
      year: year - (month <= 0? 1:0),
      month: month <= 0? 11:month - 1
    })
  }
  nextMonthValid = () => {
    const {max} = this.props
    const {month, year} = this.state
    return max === undefined || (month < max.getMonth() || year < max.getFullYear())
  }
  nextMonth = () => {
    const {month, year} = this.state
    this.setState({
      year: year + (month >= 11? 1:0),
      month: month >= 11? 0:month + 1
    })
  }
  dayInvalid = (date:Date) => {
    const {value, min, max} = this.props
    return (value && DateUtil.sameDay(date, value)) || (min && date.getTime() < min.setHours(0, 0, 0, 0) || (max && date.getTime() > max.setHours(0, 0, 0, 0)))
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
    for(let day = firstDay; day.getMonth() === calendarFocus.month; day = new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1)) {
      if(!daysInWeekInMonth[Math.floor(counter / 7)]) {
        daysInWeekInMonth[Math.floor(counter / 7)] = [new Date(day.getFullYear(), day.getMonth(), day.getDate())]
      } else {
        daysInWeekInMonth[Math.floor(counter / 7)] = [...daysInWeekInMonth[Math.floor(counter / 7)], new Date(day.getFullYear(), day.getMonth(), day.getDate())]
      }
      counter++
    }
    for(let day = 6; !daysInWeekInMonth[daysInWeekInMonth.length - 1][day]; day--) {
      daysInWeekInMonth[daysInWeekInMonth.length - 1][day] = undefined
    }
    return daysInWeekInMonth
  }
  render() {
    const {classes, value, calendarShow, dialog} = this.props
    const {mode, year, month, yearIndex} = this.state
    return (
      mode === 'month'? <div>
        <div className={classes.calendarControl}>
          <IconButton disabled={!this.previousMonthValid()} onClick={this.previousMonth}><ChevronLeftIcon/></IconButton>
          <Button onClick={this.showYearsCalendar} className={classes.calendarMonthTitle}>
            {DateUtil.month[month].long + ', ' + year}
          </Button>
          <IconButton disabled={!this.nextMonthValid()} onClick={this.nextMonth}><ChevronRightIcon/></IconButton>
        </div>
        <div className={classes.week}>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) =>
            <Typography key={'weeklabel-' + index} className={classes.labelWeekDay} variant='body1'>{day}</Typography>
          )}
        </div>
        <VirtualizedSwipeableViews className={classnames(classes.calendarContainer, {[classes.calendarDialog]:dialog})} index={year * 12 + month} animateHeight slideRenderer={({index}) =>
          <div key={index} className={classnames(classes.calendarContainer, {[classes.calendarDialog]:dialog})}>
            {this.generateMonthCalendar(index).map((week, index) =>
              <div className={classnames(classes.week, {[classes.calendarDialog]:dialog})} key={'week-' + index}>
                {week.map((date, index) =>
                  date? <IconButton disabled={this.dayInvalid(date)} className={classnames({[classes.weekDay]:dialog, [classes.selectedDay]:value && DateUtil.sameDay(date, value)})} onClick={() => this.selectDate(date)} key={'day-' + index}>
                    <Typography className={classnames({[classes.selectedDayText]:value && DateUtil.sameDay(date, value), [classes.invalidInput]:this.dayInvalid(date)})} variant='body1'>{date.getDate()}</Typography>
                  </IconButton> : 
                  <div className={classnames({[classes.weekDay]:dialog}, classes.emptyDate)} key={'day-' + index}/>
                )}
              </div>
            )}
          </div>
        }/>
      </div> :
      mode === 'year'? <div>
        <div className={classes.calendarControl}>
          <IconButton disabled={!this.previousYearsValid()} onClick={this.previousYears}><ChevronLeftIcon/></IconButton>
          <Typography className={classes.calendarMonthTitle} variant='subheading'>
            {(yearIndex * 18) + ' - ' + (yearIndex * 18 + 17)}
          </Typography>
          <IconButton disabled={!this.nextYearsValid()} onClick={this.nextYears}><ChevronRightIcon/></IconButton>
        </div>
        <VirtualizedSwipeableViews className={classnames(classes.calendarContainer, {[classes.calendarDialog]:dialog})} index={yearIndex} animateHeight slideRenderer={({index}) =>
          <div key={index} className={classnames(classes.calendarContainer, {[classes.calendarDialog]:dialog})}>
            {this.generateYearCalendar(index).map((years, index) =>
              <div className={classes.years} key={'years-' + index}>
                {years.map((currentYear, index) =>
                  <Button className={year === currentYear? classes.currentYear:''} disabled={this.yearInvalid(currentYear)} onClick={() => this.selectCalendarYear(currentYear)} key={'year-' + index}>
                    <Typography className={classnames({[classes.invalidInput]:this.yearInvalid(currentYear)})} variant='body1'>{currentYear}</Typography>
                  </Button>
                )}
              </div>
            )}
          </div>
        }/>
      </div> : <div/>
    )
  }
}
export interface DateModalProps extends React.Props<{}>, StyledComponentProps {
  value: Date
  onChange: (value:Date) => void
  calendarShow: boolean
  min?: Date
  max?: Date
  dialog?: boolean
}
export interface DateModalState {
  mode: 'year' | 'month'
  month: number
  year: number
  yearIndex: number
}

export default DateModal