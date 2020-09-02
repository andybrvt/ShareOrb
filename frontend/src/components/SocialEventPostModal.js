import React from 'react';
import {  Modal, Avatar } from 'antd';
import { Form } from '@ant-design/compatible';
import { DatePicker, TimePicker, Button, Input, Select } from 'antd';
// import { connect } from 'react-redux';
import * as dateFns from 'date-fns';
import { AimOutlined, ArrowRightOutlined } from '@ant-design/icons';


const { TextArea } = Input

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


class SocialEventPostModal extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      title: '',
      content: '',
      timeStart: "12:00 AM",
      timeEnd: "12:30 AM",
      location: '',
    }
  }

  handleChange = (values) => {
    this.setState({[values.target.name]: values.target.value})
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
            if (endHour < 10){
              endHour = '0'+endHour
            }
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
          if(ampm === ' AM'){
            startHour = startHour
          } else if (ampm === ' PM'){
            startHour = startHour-12
            if (startHour < 10){
              startHour = '0'+startHour
            }          }
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



  render() {

    // This
    console.log(this.props)
    let curDate = ''
    if (this.props.curDate){
      curDate = dateFns.format(new Date(this.props.curDate), 'MMMM d, yyyy')
    }

    const startChildren = this.renderStartTime();
    const endChildren = this.renderEndTime();

    return(
      <Modal
      onCancel = {this.props.close}
      visible = {this.props.view}
      >
        <Form
        onChange = {this.handleChange}
        >
          <Form.Item>
            <Input
            name = 'title'
            placeholder = 'Title'
            value = {this.state.title}
            />
          </Form.Item>

          <Form.Item>
            <TextArea
            name = 'content'
            placeholder = 'Content'
            value = {this.state.content}
            />
          </Form.Item>

          <Form.Item>
            <TextArea
            name = 'location'
            placeholder = 'Location'
            value = {this.state.location}
            />
          </Form.Item>

          <Form.Item>
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
        </Form>
      </Modal>
    )
  }

}


export default SocialEventPostModal;
