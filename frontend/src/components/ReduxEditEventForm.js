import React from 'react';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import * as navActions from '../store/actions/nav';
import * as calendarEventActions from '../store/actions/calendarEvent';
import { connect } from "react-redux";
import 'antd/dist/antd.css';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { DatePicker, TimePicker, Button, Input, Select } from 'antd';
import moment from 'moment';
import './labelCSS/ReduxForm.css';
import * as dateFns from 'date-fns';
import { AimOutlined, ArrowRightOutlined } from '@ant-design/icons';


const { Option } = Select;

const { TextArea } = Input


// You can also validate the fields on the forms btw


// input component must be place in a Field component inorder to
// have props such as value, onChange and stuff be passed in
// Field basically replaces <input>


// So in order to have more control over your input types you can make
// your own components and pass them into the compoents of field
// The parameter can be pretty much anything
// Basically the field or parameter is basically all the props in the field is getting
// passed into the renderField
// With the props passed in, it makes it pretty 'universal' to all the Fields in the form
const renderField = (field) => {
  console.log(field)
  return (
    <Input
    {...field.input}
    type = {field.type}
    placeholder= {field.placeholder}
    className = 'box'/>
  )
}

const renderTextArea = (field) => {
  return (
    <TextArea
    {...field.input}
    type = {field.type}
    placeholder= {field.placeholder}
    rows = {4}
    className = 'box'
    />
  )
}

// <input {...field.input} type = {field.type} placeholder = {field.placeholder} />

const renderStartDate = (field) => {
  return (
    <DatePicker
    onChange = {field.input.onChange}
    value = {field.input.value}
    style = {{width: '110px'}}
    suffixIcon={<div></div>}
    allowClear = {false}
     />
  )
}



const renderStartDateSelect = (field) => {
  // This const will render the start time of the event
  // So before you choose any value you want to have the field
  // input as a value in your select... because the input value will be the value
  // that will be return to the field when you input a value
  // Bascially everything goes through the value first, and what ever is here inspect
  // is just for show
  return (
    <Select {...field.input} className = 'timebox'>
    {field.children}
    </Select>
  )
}

const renderEventColor = (field) => {
  // This is just used to render the color of the event
  return (
    <Input
    type = 'color'
    className = 'reduxColor'
    name = 'eventColor'
    defaultValue = '#01D4F4'
    {...field.input}/>
  )
}


const renderStartTime = () => {
    const timeFormat = "hh:mm a"
    const time = []
    let start = dateFns.startOfDay(new Date())
    let startHour = dateFns.getHours(new Date())
    let startMins = dateFns.getMinutes(new Date())
    for (let i = 0; i< 48; i++){
      const cloneTime = startHour + ':' + startMins
      time.push(
        <Option
        key = {dateFns.format(start, timeFormat)}
        value= {dateFns.format(start, timeFormat)} >
        {dateFns.format(start, timeFormat)}
        </Option>
      )
      start = dateFns.addMinutes(start, 30)
    }
    console.log(time)
    return time
  }

// const renderEndTimeSelect = (field) => {
//   return (
//     console.log(field)
//   )
// }




const { RangePicker } = DatePicker;

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

const required = value => value ? undefined : 'Required'




class ReduxEditEventForm extends React.Component{

  handleStartTimeChange = (event, value) => {
    const { change } = this.props
    // So this handleStartTimechange pretty much is used to automatically
    // change the values of the endTime, the only difference between this
    // and that of the ReactAddEventForm is that we dont need to change the
    // startTime value just the endTime value will be affected


    // Like every other time related events we have to converted all
    let startHour = parseInt(value.substring(0,2))
    let startMin = parseInt(value.substring(3,5))
    let ampm = value.substring(5,8)
    let endHour = parseInt(this.props.endTime.substring(0,2))
    let endMin = parseInt(this.props.endTime.substring(3,5))
    let endTime = ''

    console.log(startHour)

    // These if statement is used to change the startTime values to the 1-24 hour format
    if(value.includes('PM')){
      if(startHour !== 12 ){
        startHour = startHour + 12
      }
    } else if (value.includes('AM')){
      if(startHour === 12){
        startHour = 0
      }
    }

    // These if statements here is to change the end time values from 1-2 to
    // 1-24 for the end time
    if (this.props.endTime.includes('PM')){
      if (endHour !==  12){
        endHour = endHour + 12
      }
    } else if (this.props.endTime.includes('AM')){
      if(endHour === 12){
        endHour = 0
      }
    }

    // Now this is where the comparison of the times comes in an all the senarios
    if(startHour === endHour ){
      if (startMin > endMin){
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
        change('endTime', endTime )
      } else if (startMin === endMin ){
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
        change('endTime', endTime)
      }
    } else if (startHour > endHour) {
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
      change('endTime', endTime)
    }

  }

  handleEndTimeChange = (event) => {
    console.log(event)
    return (
      console.log('end')
    )
  }

  onRed = () => {
    let startDate = this.props.startDate
    let endDate = this.props.endDate
    let boxcolor = false

    if (dateFns.isAfter(new Date(startDate),new Date(endDate))){
      boxcolor = true
    }

    return boxcolor
  }


  renderEndDate = (field) => {
    return (
      <DatePicker
      onChange = {field.input.onChange}
      value = {field.input.value}
      style = {{width: '110px'}}
      suffixIcon={<div></div>}
      allowClear = {false}
      className = {` ${this.onRed() ? 'datePicker' : ''}`}/>
    )
  }

  onStartDateChange = (event, value) => {
    const { change } = this.props

    // So this is where the end Date will be changed if the startDate or endDate
    // seems to be ahead of the endDate
    console.log(value)
    if (dateFns.isAfter(new Date(value),new Date(this.props.endDate))){
      change('endDate', value)
    }
  }

  renderEndTimeSelect = () => {
    console.log(this.props.startTime)

    if (this.props.startTime !== undefined ){
      // So basically the way I am making this will be the same way I made the
      // date pick in the addeventform. But instead of using state, we will use
      // redux state
      const baseTime = renderStartTime()
      let endTime = []

      let setHour = ''
      let setMin = ''
      // You will be using setHour and setMin in order to compare to the
      // times in the baseTime so you will know which time to put inin the endTime

      // In order to compare, you have to convert all the tiems into the 1-24 hour time
      if (this.props.startTime.includes("PM")){
        setHour = parseInt(this.props.startTime.substring(0,2))
        setMin = parseInt(this.props.startTime.substring(3,5))
        if (setHour !== 12 ){
          setHour = setHour + 12
        }} else if (this.props.startTime.includes("AM")){
          setHour = parseInt(this.props.startTime.substring(0,2))
          setMin = parseInt(this.props.startTime.substring(3,5))
          if (setHour === 12){
            setHour = 0
          }
        }

        // Now we will run through the basetimes and then convert them to
        // the 1-24 hour format the from there compare what needs date is put into the
        // end date and what date does not get put in there
      for( let i = 0; i< baseTime.length; i++){
       if(baseTime[i].key.includes('PM')){
         let hour = parseInt(baseTime[i].key.substring(0,2))
         if (hour !== 12){
           hour = hour+12
         }
         const min = baseTime[i].key.substring(3,5)
         if (setHour < hour){
           endTime.push(
            <Option key = {baseTime[i].key}>{baseTime[i].key}</Option>
          )} else if (setHour === hour){
            if(setMin < min){
              endTime.push(
                <Option key = {baseTime[i].key}>{baseTime[i].key}</Option>
              )
            }
          }
       } else if (baseTime[i].key.includes("AM")) {
         let hour = parseInt(baseTime[i].key.substring(0,2))
         if (hour === 12){
           hour = 0
         }
         const min = baseTime[i].key.substring(3,5)
         if( setHour < hour ) {
           endTime.push(
             <Option key = {baseTime[i].key}>{baseTime[i].key}</Option>
          )} else if (setHour === hour){
            if (setMin < min){
              endTime.push(
                <Option key = {baseTime[i].key}>{baseTime[i].key}</Option>
              )
            }
          }
        }
      }
      return (endTime)
    }
  }



    render(){
      console.log(this.props)
      // handleSubmit will actually run this.prop.onSubmit
      const {handleSubmit, pristine, invalid, reset} = this.props;
      // For the component of the fields you can create your own stateles function
      // to be put in there but it has to be outisde of your render
      // You can call an <input/> into the field component
      // You can put in initial values when you call the props initialValue
      // you can actually call it and modify it in a higher order component and it will change
      return(
        <form>
          <div className = 'reduxTitle'>
          
            <Field
            name = 'title'
            component= {renderField}
            type= 'text'
            placeholder = 'Title'
            validate = {required}
            />
          </div>
          <div className  = 'reduxContent'>
            <Field
            name = 'content'
            component= {renderTextArea}
            type= 'text'
            placeholder = 'Description!'
            validate = {required}
            />
          </div>
          <div className = 'reduxLocation'>
            <Field
            name = 'location'
            component= {renderField}
            type= 'text'

            />
            <AimOutlined className = 'aim'/>
            <Field
              name = 'eventColor'
              component = {renderEventColor}
              type = 'text'/>
          </div>
          <div className = 'reduxDateRange'>
            <br />
             <Field
             name = 'startDate'
             component = {renderStartDate}
             onChange = {this.onStartDateChange}
             type = 'date'
             />
             <ArrowRightOutlined />
             <Field
             name = 'endDate'
             component = {this.renderEndDate}
             type = 'date'
             />
          </div>
          <div className = 'reduxTimePicker'>
            <Field
            name = 'startTime'
            component = {renderStartDateSelect}
            onChange = {this.handleStartTimeChange}>
              {renderStartTime()}
            </Field>
            <ArrowRightOutlined />
            <Field
            name = 'endTime'
            onChange = {this.handleEndTimeChange}
            component = {renderStartDateSelect}>
              {this.renderEndTimeSelect()}
            </Field>

          </div>
          { this.props.addEvent ?
            <div className = 'reduxButton'>
            <Button
            onClick = {reset}
            >
            Clear
            </Button>
            <Button
            type = 'primary'
            onClick = {handleSubmit}
            style = {{left: '10px', fontSize: '15px'}}
            disabled = {pristine || invalid || this.onRed()}
            >Add</Button>
            </div>

            :

            <div className = 'reduxButton'>
            <Button
            onClick = {(e) => this.props.onDelete(e,this.props.calendarId)}
            >
            Delete
            </Button>
            <Button
            type = 'primary'
            onClick = {handleSubmit}
            style = {{left: '10px', fontSize: '15px'}}
            disabled = {pristine || invalid || this.onRed()}
            >Save</Button>
            </div>
           }
        </form>
      )
    }
  }

// So once you put everything in a field you will then put everything
// inside the reduxForm
// When you wrap your whole from around with redux form, redux form provides you
// will all sort of functions that is prep filled in redux form
// You can also design your own functions based on the given props to be put into the props too

// The redux form is what communicates with the store, it will provide props about
// the form state and functions to handle submission

// In order to modify this you have to call a constant outside the class
ReduxEditEventForm = reduxForm({
  form: 'edit event', //you will give the form a name
  enableReinitialize: true, //This will reintialzie the prestine values everytime the props changes
})(ReduxEditEventForm);



const selector = formValueSelector('edit event')
// The formValueSelector basically lets you select the values from a selected list that you have
// put in the paraethesis
// When you get the selector you can then choose which filed you want to take from the form through
// connecting with the file --> similar to mapStateToProps but you are just doing it directly now
// and the states in this case is the form fields
// You can basically treat it as a state but in props


// The gist of redux form is bascially the redux form can be modified and such and then
// you can pass those inputs into an action created by the redux form then those actions will
// be dispatched in into the reducers then the reduces will change the states and then if there is
// an onchange or whatever, changes the Fields in the forms
export default connect(state =>({
  title: selector(state, 'title'),
  content: selector (state, 'content'),
  location: selector (state, 'content'),
  startTime: selector(state, 'startTime'),
  endTime: selector(state, 'endTime'),
  startDate: selector(state, 'startDate'),
  endDate: selector(state, 'endDate')
}))(ReduxEditEventForm);
