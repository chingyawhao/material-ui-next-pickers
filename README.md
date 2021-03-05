# Material UI Next Pickers
## Description
This repository act as a sample of creating a datepicker or timepicker in [Material UI Next](https://material-ui-next.com/) or it can be imported as a datepicker or timepicker component.

## Prerequisite
```
npm install material-ui-next-pickers --save
```

## Screenshot
![Image of Material UI DatePicker](https://github.com/chingyawhao/material-ui-next-pickers/blob/master/image/datepicker.png)
![Image of Material UI TimePicker](https://github.com/chingyawhao/material-ui-next-pickers/blob/master/image/timepicker.png)

## Options
#### Datepicker
```
name: string
label?: string
value: Date
variant?: 'standard' | 'outlined' | 'filled'
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
FormControlProps?: FormControlProps
InputLabelProps?: InputLabelProps
InputProps?: InputProps
FormHelperTextProps?: FormHelperTextProps
CalendarProps?: CalendarProps
```
#### Calendar
```
action: (actions:any) => void // only resize event
value: Date
onChange: (value:Date, event?:React.MouseEvent<HTMLElement>) => void
closeCalendar: () => void
dateDisabled?: (date:Date) => boolean
min?: Date
max?: Date
okToConfirm?: boolean
classes?: {
  root?: string
  selectedDay?: string
  selectedDayText?: string
  selectedYear?: string
  selectedYearText?: string
}
```
#### Timepicker
```
name: string
label?: string
value: Date
variant?: 'standard' | 'outlined' | 'filled'
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
```
#### Clock
```
action: (actions:any) => void // only resize event
value: Date
onChange: (value:Date, event?:React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => void
closeClock: () => void
selectableMinutesInterval?: number
okToConfirm?: boolean
classes?: {
  root?: string
  digitalContainer?: string
  clockBackground?: string
  hand?: string
  textSelected?: string
  minuteDotSelected?: string
}
```

## Basic setup
1. Make sure you installed [Material UI Next](https://material-ui-next.com/).
2. Install this package via npm.
3. Import this package and use like the following: 
```tsx
import {DateFormatInput, TimeFormatInput} from 'material-ui-next-pickers'

class YourComponent extends React.Component<{}, YourComponentState> {
  onChangeDate = (date:Date) => {
    console.log('Date: ', date)
    this.setState({date})
  } 
  onChangeTime = (time:Date) => {
    console.log('Time: ', time)
    this.setState({time})
  } 
  render() {
    const {date, time} = this.state
    return (
      <div>
        <DateFormatInput name='date-input' value={date} onChange={this.onChangeDate}/>
        <TimeFormatInput name='time-input' value={time} onChange={this.onChangeTime}/>
      </div>
    )
  } 
}
interface YourComponentState {
  date: Date
  time: Date
}
```