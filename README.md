# Material UI Next Datepicker
## Description
This repository act as a sample of creating a datepicker in [Material UI Next](https://material-ui-next.com/) or it can be imported as a datepicker component.

## Prerequisite
```
npm install material-ui-next-datepicker --save
```

## Screenshot
![Image of Material UI Clockpicker](https://github.com/chingyawhao/material-ui-next-datepicker/blob/master/image/datepicker.png)

## Options
```
name: string
value: Date
onChange: (value:Date) => void
label?: string
error?: string
min?: Date
max?: Date
fullWidth?: boolean
```

## Basic setup
1. Make sure you installed [Material UI Next](https://material-ui-next.com/).
2. Install this package via npm.
3. Import this package and use like the following: 
```tsx
import DateFormatInput from 'material-ui-next-datepicker'

class YourComponent extends React.Component<{}, YourComponentState> {
  onChange = (date:Date) => {
    console.log(date)
    this.setState({date})
  } 
  render() {
    const {date} = this.state
    return (
      <div>
        <DateFormatInput name='date-input' value={date} onChange={this.onChange}/>
      </div>
    )
  } 
}
interface YourComponentState {
  date: Date
}
```