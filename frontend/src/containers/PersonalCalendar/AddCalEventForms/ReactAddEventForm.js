import React from 'react';
import * as dateFns from 'date-fns';
import moment from 'moment';
import { connect } from "react-redux";
import { Form } from '@ant-design/compatible';
import { DatePicker, TimePicker, Button, Input, Select, Radio } from 'antd';
import { AimOutlined, ArrowRightOutlined } from '@ant-design/icons';
import '../PersonalCalCSS/ReactForm.css';
import '@ant-design/compatible/assets/index.css';


const { TextArea } = Input

const { MonthPicker, RangePicker } = DatePicker;


const { Option } = Select;




const rangeConfig = {
  rules: [{ type: 'array', required: true, message: 'Please select time!' }],
};

// The reason for switching back to the antd form is because the redux form doenst
// support time picker that well

class ReactAddEventForm extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      dateRange: null,
      startDate: moment(new Date()),
      endDate: moment(new Date()),
      timeStart: "12:00 AM",
      timeEnd: "12:30 AM",
      title: '',
      content: '',
      location: '',
      repeatCondition: 'none',
      eventColor: '#01D4F4',
      error: false,
      person: []
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  capitalize (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }


  handleChange = (values) => {
    this.setState({ [values.target.name]: values.target.value})
  }

  onDateChange = (time) => {
    this.setState({
      dateRange: time
    })
  }

  onStartDateChange = (time) => {
    // This is to handle the onChange
    let startDate = time
    let endDate = this.state.endDate

    console.log(dateFns.isAfter(new Date(startDate),new Date(endDate)))

    if (dateFns.isAfter(new Date(startDate),new Date(endDate))){
      console.log('test1')
      this.setState({
        startDate: time,
        endDate: time,
      })
    } else {
      console.log('test2')
      this.setState({
        startDate: time
      })
    }

  }

  onEndDateChange = (time) => {
    console.log(time)
    this.setState({
      endDate: time
    })
  }

  onStartTimeChange = (time) => {
    console.log(time)
    // You basically want the end time to be 30 mins ahead of the starttime
    // so you want to check if it is and then change the state accordingly
    let startHour = parseInt(time.substring(0,2))
    let startMin = parseInt(time.substring(3,5))
    let ampm = time.substring(5,8)
    let endHour = parseInt(this.state.timeEnd.substring(0,2))
    let endMin = parseInt(this.state.timeEnd.substring(3,5))
    let endTime = ''
    console.log(startHour, endHour)
    // These if statement here is to change the start time values from 1-12 todo
    // 1-24 for the start time
    if (time.includes('PM')){
      if (startHour !==  12){
        startHour = startHour + 12
      }
    } else if (time.includes('AM')){
      if(startHour === 12){
        startHour = 0
      }
    }
    // These if statements here is to change the end time values from 1-2 to
    // 1-24 for the end time
    if (this.state.timeEnd.includes('PM')){
      if (endHour !==  12){
        endHour = endHour + 12
      }
    } else if (this.state.timeEnd.includes('AM')){
      if(endHour === 12){
        endHour = 0
      }
    }



    if (startHour < endHour){
      this.setState({
        timeStart: time,
      })
    } else if ( startHour === endHour ){
      if (startMin < endMin){
        this.setState({
          timeStart: time,
        })
      } else if (startMin > endMin){
        // If they are the same time what do I do?
        endMin = "00"
        endHour = startHour + 1
        console.log(startHour)
        console.log(endHour)
        if (startHour === 11 && ampm === ' AM'){
          endTime =   '12:' + endMin + ' PM'
        } else if (startHour === 23 && ampm === ' PM'){
          endTime =  '12:' + endMin + ' AM'
        } else {
          if (endHour < 10){
            endHour = '0'+endHour
          } else {
            if(ampm === ' AM'){
              endHour = endHour
            } else if (ampm === ' PM'){
              endHour = endHour-12
              if (endHour < 10){
                endHour = '0'+endHour
              }
            }
          }
          endTime = endHour + ':'+endMin+ampm

        }



        console.log(time, endTime)
        this.setState({
          timeStart:time,
          timeEnd: endTime
        })
      } else if (startMin === endMin){
        // This is the case where the times are identical to each other
        // REMEMBER THAT ENDHOUR AND STARTHOUR ARE USING THE 1-24 TIME
        console.log(startHour, endHour)
        if (startHour === 0 && ampm === ' AM' && startMin === 0 ){
          endTime = '12:30 AM'
        } else if (startHour === 12 && ampm === ' PM' && startMin === 0){
          endTime = '12:30 PM'
        } else {
          if (startMin === 30){
            endMin = '00'
            if (startHour === 12){
              endHour = '01'
              endTime = endHour + ':'+endMin+' PM'
            } else if (startHour === 11 && ampm === ' AM'){
                endTime =   '12:' + endMin + ' PM'
              } else if ((startHour-12) === 11 && ampm === ' PM'){
                endTime =  '12:' + endMin + ' AM'
              }
            else {
              console.log(endHour)
              endHour = startHour +1
                if (endHour<10){
                    endHour = '0'+endHour
                } else {
                  if(ampm === ' AM'){
                    endHour = endHour
                  } else if (ampm === ' PM'){
                    endHour = endHour-12
                    if (endHour < 10){
                      endHour = '0'+endHour
                    }
                  }
                }
              endTime = endHour + ':' +endMin+ampm
            }
          } else if (startMin === 0){
            endMin = '30'
            console.log(ampm)
            if (endHour<10){
                endHour = '0'+endHour
            } else {
              if(ampm === ' AM'){
                console.log('am')
                endHour = endHour
              } else if (ampm === ' PM'){
                console.log('pm')
                if (endHour === 12){
                  endHour = 12
                }else {
                  endHour = endHour-12
                  if (endHour < 10){
                    endHour = '0'+endHour
                  }
                }
              }
            }
            endTime = endHour + ':'+endMin +ampm
          }
        }



        this.setState({
          timeStart:time,
          timeEnd: endTime
        })

      }


      } else if ( startHour > endHour ){
        // let startHour = parseInt(time.substring(0,2))
        // let startMin = parseInt(time.substring(3,5))

        console.log(startHour, startMin, ampm)
        if (startHour === 11 && ampm === ' AM' && startMin === 30){
          endTime =   '12:00 PM'
        } else if (startHour === 23 && ampm === ' PM' && startMin === 30){
          endTime =  '12:00 AM'
        } else {
          if (startMin === 30){
            startMin = "00"
            startHour = startHour + 1
          } else if (startMin !== 30){
            startMin = '30'
          }
          if (startHour < 10){
            startHour = '0'+startHour
          } else{
            if(ampm === ' AM'){
              startHour = startHour
            } else if (ampm === ' PM'){
              startHour = startHour-12
              if (startHour < 10){
                if (startHour === 0){
                  startHour = '12'
                } else{
                  startHour = '0'+startHour
                }

              }
            }
          }

          endTime = startHour + ':'+startMin+ampm
        }




        this.setState({
          timeStart: time,
          timeEnd: endTime
        })
      }
    }



  onEndTimeChange = (time) => {
    console.log(time)
    this.setState({
      timeEnd: time
    })
  }

  handleFriendChange = (value) => {
    console.log(value)
    this.setState({
      person: value
    })
  }

  handleValidation(){
    // You will use this to disable or non disable the button, so because of that
    // the true and false will be flipped
    let title = this.state.title
    let content = this.state.content
    let location = this.state.location
    let startDate = this.state.startDate
    let endDate = this.state.endDate
    let repeatCondition = this.state.repeatCondition
    let errors = {}
    let buttonDisabled = false

    if (title === ''){
      buttonDisabled = true
      // errors['title'] = 'Cannot be empty'
    }

    if (content === ''){
      buttonDisabled = true
      // errors['content'] = 'Cannot be empty'
    }

    if (location === ''){
      buttonDisabled = true
      // errors['location'] = 'Cannot be empty'
    }

    if (startDate === null){
      buttonDisabled = true

    }

    if (endDate === null){
      buttonDisabled = true
    }

    if (dateFns.isAfter(new Date(startDate), new Date(endDate))){
      buttonDisabled = true
    } else if (repeatCondition === "weekly" &&
      !dateFns.isSameWeek(new Date(startDate), new Date(endDate))
    ) {
      buttonDisabled = true
    } else if (repeatCondition === "daily" &&
      !dateFns.isSameDay(new Date (startDate), new Date(endDate))
    ) {
      buttonDisabled = true
    }

    console.log(buttonDisabled)
    return buttonDisabled

  }

  onRed = () => {
    let startDate = this.state.startDate
    let endDate = this.state.endDate
    let repeatCondition = this.state.repeatCondition

    let boxcolor = false

    if (dateFns.isAfter(new Date(startDate), new Date(endDate))){
      boxcolor = true
    } else if (repeatCondition === "weekly" &&
      !dateFns.isSameWeek(new Date(startDate), new Date(endDate))
    ) {
      boxcolor = true
    } else if (repeatCondition === "daily" &&
      !dateFns.isSameDay(new Date (startDate), new Date(endDate))
    ) {
      boxcolor = true
    }
    return boxcolor
  }

  onClear = () => {
    this.setState({
      title: '',
      content: '',
      location: '',
      error: false,
      person: []
    })
  }

  handleSubmit =(event) => {
    event.preventDefault();
      const submitContent = {
        title: this.state.title,
        content: this.state.content,
        location: this.state.location,
        start_date: this.state.startDate.toDate(),
        end_date: this.state.endDate.toDate(),
        start_time: this.state.timeStart,
        end_time: this.state.timeEnd,
        event_color: this.state.eventColor,
        repeatCondition:this.state.repeatCondition,
        person: this.state.person,
      }
      this.onClear()
      this.props.onSubmit(submitContent)

  }

  onFinish = values => {
    console.log('Success:', values);
  };

  onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  renderShareListSelect = () => {
    if(this.props.friendList !== undefined){
      const friendList = this.props.friendList

      let shareOptions = []

      for (let friend = 0; friend< friendList.length; friend++ ){
        shareOptions.push(
          <Option value = {friendList[friend].username}
          label = {this.capitalize(friendList[friend].username)}>
            {this.capitalize(friendList[friend].username)}
          </Option>
        )
      }

      return shareOptions
    }
  }


  renderStartTime = () => {
    const timeFormat = "hh:mm a"
    const time = []
    let start = dateFns.startOfDay(new Date())
    let startHour = dateFns.getHours(new Date())
    let startMins = dateFns.getMinutes(new Date())
    for (let i = 0; i< 48; i++){
      const cloneTime = startHour + ':' + startMins
      time.push(
        <Option key = {dateFns.format(start, timeFormat)}>{dateFns.format(start, timeFormat)}</Option>
      )
      start = dateFns.addMinutes(start, 30)
    }
    console.log(time)
    return time
  }

  renderEndTime = () => {
    // So for rendering the tiem for the end time, you first want to get the
    // time of the starting time so that you can get the time afterwards
    // but since all the time selections are strings we must first convert to ints
    // and the time after PM to plus 12 more so that you can compare. So you would
    // get the startTime in the states and convert it to int and all that stuff and then
    // you get the list of all the times and then convert to ints and then compare with the state
    // time, if it is after then you put it in the list if not then you dont (remember to put them
  // in a option tag)
    const baseTime = this.renderStartTime()
    let endTime = []

    let setHour = ''
    let setMin = ''

    if (this.state.timeStart.includes("PM")){
      setHour = parseInt(this.state.timeStart.substring(0,2))
      setMin = parseInt(this.state.timeStart.substring(3,5))
      if (setHour !== 12){
        setHour = setHour + 12
    }} else if (this.state.timeStart.includes("AM")){
      setHour = parseInt(this.state.timeStart.substring(0,2))
      setMin = parseInt(this.state.timeStart.substring(3,5))
      if (setHour === 12){
        setHour = 0
      }
    }

    for(let i = 0; i< baseTime.length; i++){
      if (baseTime[i].key.includes('PM')){
        let hour = parseInt(baseTime[i].key.substring(0,2))
        if (hour !== 12){
          hour = hour+12
        }
        const min = baseTime[i].key.substring(3,5)
        if (setHour < hour){
          endTime.push(
            <Option key= {baseTime[i].key}>{baseTime[i].key}</Option>
          )} else if (setHour === hour){
            if(setMin < min){
              endTime.push(
                <Option key= {baseTime[i].key}>{baseTime[i].key}</Option>
              )
            }
          }
        } else if (baseTime[i].key.includes("AM")) {
        let hour = parseInt(baseTime[i].key.substring(0,2))
        if (hour === 12){
          hour = 0
        }
        const min = baseTime[i].key.substring(3,5)
        if(setHour < hour){
          endTime.push(
            <Option key= {baseTime[i].key}>{baseTime[i].key}</Option>
          )} else if (setHour === hour){
            if(setMin < min){
              endTime.push(
                <Option key= {baseTime[i].key}>{baseTime[i].key}</Option>
              )
            }
          }
        }
      }
      return (endTime)
    }



  render (){
    // The name of the inputt values are important
    // it allows for us to be able to input stuff into the form item
    // because it is what connents to the onChange for the states
    console.log(this.state)
    const startChildren = this.renderStartTime();
    const endChildren = this.renderEndTime()
    console.log(this.handleValidation())

    const options = [
    { label: 'Normal', value: 'none' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Daily', value: 'daily' },
  ];
    // for (let i = 10; i < 36; i++) {
    //   children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
    // }

    return (
      <Form
      className ="reactForm"

      onSubmit = {this.handleSubmit}
      onChange = {this.handleChange}
       >
        <Form.Item>
         <Input
         name = 'title'
         className= 'reactTitle'
         placeholder = 'Title'
         value = {this.state.title}
         />
       </Form.Item>


       <Form.Item>

       <Select
       mode="multiple"
       style={{ width: '100%' }}
      onChange={this.handleFriendChange}
      value = {this.state.person}
      optionLabelProp="label"
      >
      {this.renderShareListSelect()}
      </Select>
       </Form.Item>

       <Form.Item name="Content">
        <TextArea
        name = 'content'
        className = 'reactContent'
        placeholder= 'Event Description'
        value = {this.state.content}
        rows ={4}
        style = {{width: '500px'}}/>
        <Input type = 'color' className = 'reactColor' name = 'eventColor' defaultValue = '#01D4F4'/>

      </Form.Item>




      <Form.Item name="Location" style = {{height: '10px'}} >
       <Input
        name = 'location'
        className = 'reactLocation'
        placeholder = 'Location'
        value = {this.state.location}
        />
        <AimOutlined className = 'aim'/>
     </Form.Item>

     <Form.Item
       name="range-time-picker"
      {...rangeConfig}
       className = 'timepicker'>
       <DatePicker
       className = ''
       placeholder = 'startTime'
       onChange = {this.onStartDateChange}
       value = {this.state.startDate}
       suffixIcon={<div></div>}
       allowClear = {false}
       bordered = {false}
       style = {{width: '110px'}}/>
       <ArrowRightOutlined />
       <DatePicker
       className = {` ${this.onRed() ? 'datePicker' : ''}`}
       placeholder = 'endTime'
       onChange = {this.onEndDateChange}
       value = {this.state.endDate}
       style = {{width: '110px '}}
       allowClear = {false}
       suffixIcon={<div></div>}
       />

       <br/>
       <Select
       name = 'timeStart'
       className = ''
       style={{ width: 100 }}
       showArrow  = {false}
       onChange = {this.onStartTimeChange}
       value = {this.state.timeStart}>
         {startChildren}
       </Select>


       <ArrowRightOutlined />
       <Select
       className = ''
       name = 'timeEnd'
       style={{ width: 100 }}
       showArrow  = {false}
       onChange = {this.onEndTimeChange}
       value = {this.state.timeEnd}>
         {endChildren}
       </Select>
     </Form.Item>

        <Form.Item>
        <Radio.Group
         options={options}
         name = 'repeatCondition'
         onChange={this.handleChange}
         value={this.state.repeatCondition}
         optionType="button"
       />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            xs: { span: 24, offset: 0 },
            sm: { span: 16, offset: 8 },
          }}
          className = 'buttomHolder'
        >
        <div className = 'clearButtonCon'>
          <Button onClick = {this.onClear}  >
            Clear Values
          </Button>
        </div>
        <div className = 'submitButtonCon'>
          <Button type="primary" htmlType="submit" disabled = {this.handleValidation()}>
            Submit
          </Button>
        </div>
        </Form.Item>
      </Form>
    );
  }

}

export default ReactAddEventForm;
