const fillInDigit = (number:number, digit:number) => {
  const max = Math.pow(10, digit)
  var clean = (number % max).toString()
  while(clean.length < digit) clean = '0' + clean
  return clean
}
export const month = [{
  short: 'Jan',
  long: 'January'
}, {
  short: 'Feb',
  long: 'February'
}, {
  short: 'Mar',
  long: 'March'
}, {
  short: 'Apr',
  long: 'April'
}, {
  short: 'May',
  long: 'May'
}, {
  short: 'Jun',
  long: 'June'
}, {
  short: 'Jul',
  long: 'July'
}, {
  short: 'Aug',
  long: 'August'
}, {
  short: 'Sep',
  long: 'September'
}, {
  short: 'Oct',
  long: 'October'
}, {
  short: 'Nov',
  long: 'November'
}, {
  short: 'Dec',
  long: 'December'
}]
export const day = [{
    short: 'Sun',
    long: 'Sunday'
  }, {
    short: 'Mon',
    long: 'Monday'
  }, {
    short: 'Tue',
    long: 'Tuesday'
  }, {
    short: 'Wed',
    long: 'Wednesday'
  }, {
    short: 'Thu',
    long: 'Thursday'
  }, {
    short: 'Fri',
    long: 'Friday'
  }, {
    short: 'Sat',
    long: 'Saturday'
}]
export const format = (date:Date, format:string) =>
  [[{
    keyword: 'dd',
    word: fillInDigit(date.getDate(), 2)
  }, {
    keyword: 'd',
    word: date.getDate().toString()
  }], [{
    keyword: 'MMMM',
    word: month[date.getMonth()].long
  }, {
    keyword: 'MMM',
    word: month[date.getMonth()].short
  }, {
    keyword: 'MM',
    word: fillInDigit(date.getMonth() + 1, 2)
  }, {
    keyword: 'M',
    word: (date.getMonth() + 1).toString()
  }], [{
    keyword: 'yyyy',
    word: fillInDigit(date.getFullYear(), 4)
  }, {
    keyword: 'yy',
    word: fillInDigit(date.getFullYear(), 2)
  }], [{
    keyword: 'EEE',
    word: day[date.getDay()].short
  }, {
    keyword: 'EEEE',
    word: day[date.getDay()].long
  }]].reduce((dateString, formattings) => {
    var foundFormatting
    for(var i = 0; i < formattings.length; i++) {
      if(dateString.includes(formattings[i].keyword)) {
        foundFormatting = formattings[i]
        break
      }
    }
    if(foundFormatting) {
      return dateString.replace(foundFormatting.keyword, foundFormatting.word)
    } else {
      return dateString
    }
  }, format)

export const sameDay = (dateA, dateB) => {
  if(dateA !== undefined && dateB !== undefined) {
    return dateA.getDate() === dateB.getDate() && dateA.getMonth() === dateB.getMonth() && dateA.getFullYear() === dateB.getFullYear()
  } else {
    return false
  }
}