import React from 'react';
import {
   Form,
   DatePicker,
   TimePicker,
   Button,
   Input,
   Select
  } from 'antd';
import { AimOutlined } from '@ant-design/icons';
import { connect } from "react-redux";
import './labelCSS/ReactForm.css';
import * as dateFns from 'date-fns';


const { TextArea } = Input

const { MonthPicker, RangePicker } = DatePicker;


const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const config = {
  rules: [{ type: 'object', required: true, message: 'Please select time!' }],
};

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
      timeStart: "12:00 AM",
      timeEnd: "12:30 AM",
      title: '',
      content: '',
      location: '',
      error: {}
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = (values) => {
    this.setState({ [values.target.name]: values.target.value})
  }

  onDateChange = (time) => {
    this.setState({
      dateRange: time
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
        if (endHour < 10){
          endHour = '0'+endHour
        } else {
          if(ampm === ' AM'){
            endHour = endHour
          } else if (ampm === ' PM'){
            endHour = endHour-12
          }
        }
        if (startHour === 11 && ampm === ' AM'){
          endTime =   '12:' + endMin + ' PM'
        } else if ((startHour-12) === 11 && ampm === ' PM'){
          endTime =  '12:' + endMin + ' AM'
        } else {
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
        this.setState({
          timeStart:time,
          timeEnd: endTime
        })
      }


      } else if ( startHour > endHour ){
        // let startHour = parseInt(time.substring(0,2))
        // let startMin = parseInt(time.substring(3,5))
        if (startMin === 30){
          startMin = "00"
          startHour = startHour + 1
        } else if (startMin !== 30){
          startMin = '30'
        }
        if (startHour < 10){
          startHour = '0'+startHour
        } else{
          if(ampm === 'AM'){
            endHour = endHour
          } else if (ampm === 'PM'){
            endHour = endHour-12
          }
        }
        if ((startHour+11) === 11 && ampm === ' AM'){
          endTime =   '12:' + startMin + ' PM'
        } else if ((startHour-1) === 11 && ampm === ' PM'){
          endTime =  '12:' + startMin + ' AM'
        } else {
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

  handleValidation(){
    let title = this.state.title
    let content = this.state.content
    let location = this.state.location
    let dateRange = this.state.dateRange
    let errors = {}
    let formIsValid = true

    if (title === ''){
      formIsValid = false
      errors['title'] = 'Cannot be empty'
    }

    if (content === ''){
      formIsValid = false
      errors['content'] = 'Cannot be empty'
    }

    if (location === ''){
      formIsValid = false
      errors['location'] = 'Cannot be empty'
    }

    if (dateRange === null){
      formIsValid = false
      errors['dateRange'] = 'Cannot be empty'
    }

    this.setState ({
      error: errors
    })

    return formIsValid

  }

  onClear = () => {
    this.setState({
      dateRange: null,
      title: '',
      content: '',
      location: '',
      error: {}
    })
  }

  handleSubmit =(event) => {
    event.preventDefault();
    if(this.handleValidation()){
      const submitContent = {
        title: this.state.title,
        content: this.state.content,
        location: this.state.location,
        start_date: this.state.dateRange[0].toDate(),
        end_date: this.state.dateRange[1].toDate(),
        start_time: this.state.timeStart,
        end_time: this.state.timeEnd
      }
      this.onClear()
      this.props.onSubmit(submitContent)
    } else {
      console.log('Form has an error')
    }
  }

  onFinish = values => {
    console.log('Success:', values);
  };

  onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

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
    console.log(this.renderEndTime())
    const startChildren = this.renderStartTime();
    const endChildren = this.renderEndTime()
    // for (let i = 10; i < 36; i++) {
    //   children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
    // }

    return (
      <Form
      className ="reactForm"
      {...formItemLayout}
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
         <span style = {{color: 'red'}}>{this.state.error["title"]}</span>
       </Form.Item>
       <Form.Item name="Content">
        <TextArea
        name = 'content'
        className = 'reactContent'
        placeholder= 'Event Description'
        value = {this.state.content}
        rows ={4}
        style = {{width: '500px'}}/>
        <Input type = 'color' className = 'reactColor'/>

        <span style = {{color: 'red'}}>{this.state.error['content']}</span>
      </Form.Item>

      <Form.Item name="Location" style = {{height: '10px'}}>
       <Input
        name = 'location'
        className = 'reactLocation'
        placeholder = 'Location'
        value = {this.state.location}
        />
        <AimOutlined className = 'aim'/>
       <span style = {{color: 'red'}}>{this.state.error['location']}</span>
     </Form.Item>
        <Form.Item
          name="range-time-picker"
         {...rangeConfig}
          className = 'timepicker'>
          <RangePicker
          onChange = {this.onDateChange}
          value = {this.state.dateRange}
          />
          <Select
          defaultValue="a1"
          name = 'timeStart'
          style={{ width: 100 }}
          showArrow  = {false}
          onChange = {this.onStartTimeChange}
          value = {this.state.timeStart}>
            {startChildren}
          </Select>
          <Select
          defaultValue="a1"
          name = 'timeEnd'
          style={{ width: 100 }}
          showArrow  = {false}
          onChange = {this.onEndTimeChange}
          value = {this.state.timeEnd}>
            {endChildren}
          </Select>
          <span style = {{color: 'red'}}>{this.state.error['dateRange']}</span>
        </Form.Item>
        <Form.Item
          wrapperCol={{
            xs: { span: 24, offset: 0 },
            sm: { span: 16, offset: 8 },
          }}
          className = 'buttomHolder'
        >
        <div className = 'clearButtonCon'>
          <Button onClick = {this.onClear}>
            Clear Values
          </Button>
        </div>
        <div className = 'submitButtonCon'>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </div>
        </Form.Item>
      </Form>
    );
  }

}

export default ReactAddEventForm;
