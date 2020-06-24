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
    console.log(values)
    this.setState({ [values.target.name]: values.target.value})
  }

  onDateChange = (time) => {
    console.log(time)
    this.setState({
      dateRange: time
    })
  }

  onStartTimeChange = (time) => {
    console.log(time)
    this.setState({
      timeStart: time
    })
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
        start_time: this.state.dateRange[0].toDate(),
        end_time: this.state.dateRange[1].toDate(),
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
    } console.log(setHour)
  } else if (this.state.timeStart.includes("AM")){
      setHour = parseInt(this.state.timeStart.substring(0,2))
      setMin = parseInt(this.state.timeStart.substring(3,5))
      if (setHour === 12){
        setHour = 0
      }
    }
    console.log(setHour)
    console.log(setMin)

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
            if(setMin <= min){
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
            if(setMin <= min){
              endTime.push(
                <Option key= {baseTime[i].key}>{baseTime[i].key}</Option>
              )
            }
          }
        }
      }
      console.log(endTime)
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
