import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as classnames from 'classnames'
import {withStyles, Theme, StyledComponentProps, StyleRules} from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

import * as DateUtil from './date'

const defaultTime = new Date(1970, 1, 1)
const styles = (theme:Theme):StyleRules => ({
  clockDigitalContainer: {
    padding: '16px 16px 8px',
    display: 'flex',
    justifyContent: 'stretch',
    userSelect: 'none'
  },
  clockDigitContainer: {
    flex: '1 1',
    display: 'flex'
  },
  hourDigitContainer: {
    justifyContent: 'flex-end'
  },
  miniteDigitContainer: {
    justifyContent: 'flex-start'
  },
  digitText: {
    width: '62px',
    cursor: 'pointer',
    '&:active': {
      opacity: 0.7
    }
  },
  hourDigitText: {
    textAlign: 'right'
  },
  colonDigit: {
    width: '18px',
    textAlign: 'left'
  },
  ampmButtons: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  ampmButton: {
    minWidth: 'initial',
    minHeight: 'initial',
    padding: '4px 8px'
  },
  clockAnalogContainer: {
    padding: '16px 24px 24px'
  },
  clockBackground: {
    width: '230px',
    height: '230px',
    maxWidth: 'calc(100vw - 112px)',
    maxHeight: 'calc(100vw - 112px)',
    borderRadius: '115px',
    position: 'relative',
    background: theme.palette.background.default,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer'
  },
  clockText: {
    position: 'absolute',
    userSelect: 'none',
    height: '16px',
    width: '16px',
    lineHeight: '16px',
    textAlign: 'center'
  },
  clockTextSelected: {
    color: theme.palette.primary.contrastText
  },
  clockTextFaded: {
    opacity: 0,
    pointerEvents: 'none'
  },
  minuteDot: {
    position: 'absolute',
    height: '6px',
    width: '6px',
    borderRadius: '3px'
  },
  minuteDotSelected: {
    backgroundColor: theme.palette.primary.contrastText
  },
  clockHandContainer: {
    position: 'absolute',
    width: '2px'
  },
  clockHand: {
    position: 'relative',
    width: '100%',
    height: '100%',
    backgroundColor: theme.palette.primary.main
  },
  clockHandHead: {
    position: 'absolute',
    left: '-20px',
    top: '-21px',
    width: '42px',
    height: '42px',
    borderRadius: '21px',
    backgroundColor: theme.palette.primary.main
  },
  clockHandTail: {
    position: 'absolute',
    left: '-3px',
    bottom: '-4px',
    width: '8px',
    height: '8px',
    borderRadius: '4px',
    backgroundColor: theme.palette.primary.main
  },
  okToConfirmRow: {
    height: '48px',
    marginTop: '-8px',
    padding: '0 6px',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center'
  }
})
@(withStyles as any)(styles)
class Clock extends React.Component<ClockProps, ClockState> {
  clockface:Element
  constructor(props) {
    super(props)
    if(props.action) {
      props.action({
        resize: this.setClockRadius
      })
    }
    this.state = {
      mode: 'hour',
      selected: props.value,
      selecting: false,
      clockRadius: this.getClockRadius()
    }
  }
  componentDidMount() {
    if(!this.props.action)
      this.setClockRadius()
    window.addEventListener('resize', this.setClockRadius)
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.setClockRadius)
  }
  setClockRadius = () => {
    this.setState({clockRadius:this.getClockRadius()})
  }
  getClockRadius = () => {
    const background = this.clockface? this.clockface.getBoundingClientRect().width:230
    return background / 2 - 28
  }
  getValue = (options:any[], target:{x:number, y:number}, origin:{x:number, y:number}) => {
    const radian = Math.atan2(target.y - origin.y, target.x - origin.x)
    const angle = radian + (Math.PI / 6 * 3) < 0? radian + (Math.PI / 6 * 15):radian + (Math.PI / 6 * 3)
    const select = Math.round(angle / 2 / Math.PI * options.length)
    return options[select > options.length - 1? 0:select]
  }
  getOriginPoint = () => {
    const clockface = this.clockface.getBoundingClientRect()
    return {x:clockface.left + clockface.width / 2, y:clockface.top + clockface.height / 2}
  }
  getMouseTargetPoint = (event:React.MouseEvent<HTMLDivElement>) => {
    const mouse = event.nativeEvent
    return {x:mouse.pageX, y:mouse.pageY}
  }
  getTouchTargetPoint = (event:React.TouchEvent<HTMLDivElement>) => {
    const touch = event.nativeEvent.touches[event.nativeEvent.touches.length - 1]
    return {x:touch.pageX, y:touch.pageY}
  }
  changeValue = (label:'hour' | 'minute', selecting:number, event:React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => {
    const {value, onChange, okToConfirm} = this.props
    const {selected} = this.state
    const date = new Date((okToConfirm? selected:value) || defaultTime)
    if(selecting && label === 'hour') {
      date.setHours(selecting + ((value && value.getHours() >= 12)? 12:0))
    } else if(selecting && label === 'minute') {
      date.setMinutes(selecting)
    }
    if(selecting && okToConfirm) {
      this.setState({selecting:true, selected:date})
    } else if(selecting) {
      this.setState({selecting:true}, () => onChange(date, event))
    }
  }
  mouseSelectClock = (event:React.MouseEvent<HTMLDivElement>, label:'hour' | 'minute', options:number[]) => {
    event.preventDefault()
    const selected = this.getValue(options, this.getMouseTargetPoint(event), this.getOriginPoint())
    this.setState({selecting:true}, () => this.changeValue(label, selected, event))
  }
  touchSelectClock = (event:React.TouchEvent<HTMLDivElement>, label:'hour' | 'minute', options:number[]) => {
    event.preventDefault()
    const selected = this.getValue(options, this.getTouchTargetPoint(event), this.getOriginPoint())
    this.setState({selecting:true}, () => this.changeValue(label, selected, event))
  }
  mouseHoverClock = (event:React.MouseEvent<HTMLDivElement>, label:'hour' | 'minute', options:number[]) => {
    event.preventDefault()
    const {selecting} = this.state
    const selected = this.getValue(options, this.getMouseTargetPoint(event), this.getOriginPoint())
    if(selecting && selected !== undefined) {
      this.changeValue(label, selected, event)
    }
  }
  touchHoverClock = (event:React.TouchEvent<HTMLDivElement>, label:'hour' | 'minute', options:number[]) => {
    event.preventDefault()
    const touch = event.nativeEvent.touches[event.nativeEvent.touches.length - 1]
    const target = {x:touch.pageX, y:touch.pageY}
    const selected = this.getValue(options, this.getTouchTargetPoint(event), this.getOriginPoint())
    if(selected !== undefined) {
      this.changeValue(label, selected, event)
    }
  }
  confirmClock = (event:React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>, label:'hour' | 'minute') => {
    const {closeClock, okToConfirm} = this.props
    event.preventDefault()
    if(label === 'hour') {
      this.setState({mode:'minute', selecting:false})
    } else {
      this.setState({selecting:false}, okToConfirm? undefined:closeClock)
    }
  }
  confirmTime = (event:React.MouseEvent<HTMLElement>) => {
    const {onChange, closeClock, okToConfirm} = this.props
    if(okToConfirm) {
      closeClock()
      onChange(this.state.selected, event)
    }
  }
  clickSetMode = (mode:'hour' | 'minute') => {
    this.setState({mode})
  }
  clickAmPm = (ampm:'am' | 'pm', event:React.MouseEvent<HTMLElement>) => {
    const {value, onChange, okToConfirm} = this.props
    const {selected} = this.state
    const date = new Date((okToConfirm? selected:value) || defaultTime)
    const hour = date.getHours()
    if(hour >= 12 && ampm === 'am') {
      date.setHours(hour - 12)
    } else if(hour < 12 && ampm === 'pm') {
      date.setHours(hour + 12)
    }
    if(okToConfirm) {
      this.setState({selected:date})
    } else {
      onChange(date, event)
    }
  }
  getSelectedDate = () => {
    const {value, okToConfirm} = this.props
    const {selected} = this.state
    const selecting = okToConfirm? selected:value
    return selecting? {
      hour: selecting.getHours() >= 12? selecting.getHours() - 12:selecting.getHours(),
      minute: selecting.getMinutes(),
      ampm: selecting.getHours() >= 12? 'pm':'am'
    } : {
      hour: 0,
      minute: 0,
      ampm: 'am'
    }
  }
  render() {
    const {classes, value, okToConfirm, closeClock, selectableMinutesInterval} = this.props
    const {mode, selecting, clockRadius} = this.state
    const hours = Array.apply(undefined, {length:12}).map((number, index) => index === 0? 12:index)
    const minutes = Array.apply(undefined, {length:60}).map((number, index) => !selectableMinutesInterval?
      index:
      index % selectableMinutesInterval === 0?
      index:
      undefined
    )
    const selected = this.getSelectedDate()
    const selectAngle = (
      mode === 'hour'?
      selected.hour / hours.length :
      selected.minute / minutes.length
    ) * 2 * Math.PI - (Math.PI / 6 * 3)
    return (<div className={classes.root}>
      <div className={classnames((classes as any).clockDigitalContainer, classes.digitalContainer)}>
        <div className={classnames((classes as any).clockDigitContainer, (classes as any).hourDigitContainer)}>
          <Typography color={mode === 'hour'? 'primary':'default'} variant='display3'
            classes={{root:classnames((classes as any).digitText, (classes as any).hourDigitText)}}
            onClick={() => this.clickSetMode('hour')}
          >{selected.hour === 0? 12:selected.hour}</Typography>
        </div>
        <div><Typography variant='display3' classes={{root:(classes as any).colonDigit}}>:</Typography></div>
        <div className={classnames((classes as any).clockDigitContainer, (classes as any).miniteDigitContainer)}>
          <Typography color={mode === 'minute'? 'primary':'default'} variant='display3'
            classes={{root:(classes as any).digitText}}
            onClick={() => this.clickSetMode('minute')}
          >{DateUtil.fillInDigit(selected.minute, 2)}</Typography>
          <div className={(classes as any).ampmButtons}>
            <Button color={selected.ampm === 'am'? 'primary':'default'} classes={{root:(classes as any).ampmButton}} onClick={event => this.clickAmPm('am', event)}>AM</Button>
            <Button color={selected.ampm === 'pm'? 'primary':'default'} classes={{root:(classes as any).ampmButton}} onClick={event => this.clickAmPm('pm', event)}>PM</Button>
          </div>
        </div>
      </div>
      <div key='clock' className={(classes as any).clockAnalogContainer}
        onMouseDown={event => this.mouseSelectClock(event, mode, mode === 'hour'? hours:minutes)}
        onTouchStart={event => this.touchSelectClock(event, mode, mode === 'hour'? hours:minutes)}
        onMouseMove={event => this.mouseHoverClock(event, mode, mode === 'hour'? hours:minutes)}
        onTouchMove={event => this.touchHoverClock(event, mode, mode === 'hour'? hours:minutes)}
        onMouseUp={event => this.confirmClock(event, mode)}
        onTouchEnd={event => this.confirmClock(event, mode)}
      >
        <div className={(classes as any).clockBackground} ref={clockface => this.clockface = clockface}>
          <div className={(classes as any).clockHandContainer} 
            style={{height:clockRadius, paddingBottom:clockRadius,
              transition: selecting? '':'transform 600ms ease-in-out',
              transform:`rotate(${selectAngle + (Math.PI / 6 * 3)}rad)`
            }}
          >
            <div className={classnames((classes as any).clockHand, classes.hand)}>
              <div className={(classes as any).clockHandHead}/>
              <div className={(classes as any).clockHandTail}/>
            </div>
          </div>
          {hours.map((hour, index) => {
            const angle = index / hours.length * 2 * Math.PI - (Math.PI / 6 * 3)
            return <Typography key={hour} className={classnames(
              (classes as any).clockText,
              {[(classes as any).clockTextSelected]:mode === 'hour' && selected.hour === index},
              {[(classes as any).clockTextFaded]:mode !== 'hour'}
            )}
              style={{
                transition: selecting? 'opacity 600ms ease-in-out':'opacity 600ms ease-in-out, color 0ms 600ms',
                transform:`translate(${clockRadius * Math.cos(angle)}px, ${clockRadius * Math.sin(angle)}px)`
              }}
            >
              {hour}
            </Typography>
          })}
          {minutes.map((minute, index) => {
            const angle = index / minutes.length * 2 * Math.PI - (Math.PI / 6 * 3)
            if(minute % 5 === 0) {
              return <Typography key={index} className={classnames(
                (classes as any).clockText,
                {[`${(classes as any).clockTextSelected} ${classes.textSelected}`]:mode === 'minute' && selected.minute === index},
                {[(classes as any).clockTextFaded]:mode !== 'minute'}
              )}
                style={{
                  transition: selecting? 'opacity 600ms ease-in-out':'opacity 600ms ease-in-out, color 0ms 600ms',
                  transform:`translate(${clockRadius * Math.cos(angle)}px, ${clockRadius * Math.sin(angle)}px)`
                }}
              >
                {minute}
              </Typography>
            } else {
              return <div key={index} className={classnames(
                (classes as any).minuteDot,
                {[(classes as any).minuteDotSelected]:mode === 'minute' && selected.minute === minute},
                {[(classes as any).clockTextFaded]:mode !== 'minute'}
              )}
                style={{
                  transition: selecting? 'opacity 600ms ease-in-out':'opacity 600ms ease-in-out, background 0ms 600ms',
                  transform:`translate(${clockRadius * Math.cos(angle)}px, ${clockRadius * Math.sin(angle)}px)`
                }}
              />
            }
          })}
        </div>
      </div>
      {okToConfirm && <div className={(classes as any).okToConfirmRow}>
        <Button onClick={closeClock}>CANCEL</Button>
        <Button onClick={event => this.confirmTime(event)}>OK</Button>
      </div>}
    </div>)
  }
}
export interface ClockProps extends React.Props<{}>, StyledComponentProps {
  action: (actions:any) => void
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
}
export interface ClockState {
  mode: 'hour' | 'minute'
  selected: Date
  selecting: boolean
  clockRadius: number
}

export default Clock