import React from 'react';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import * as navActions from '../store/actions/nav';
import * as calendarEventActions from '../store/actions/calendarEvent';
import { connect } from "react-redux";
import {
   Form,
   DatePicker,
   TimePicker,
   Button,
   Input,
   Select
  } from 'antd';
import moment from 'moment';
import './labelCSS/ReactForm.css';
import * as dateFns from 'date-fns';

const { Option } = Select;



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
    <Input {...field.input} type = {field.type} placeholder= {field.placeholder}/>
  )
}

// <input {...field.input} type = {field.type} placeholder = {field.placeholder} />

const renderDateField = (field) => {
  console.log(field.input)

  return (
    <RangePicker
     format="YYYY-MM-DD"
     value = {[moment(field.input.value[0], 'YYYY-MM-DD'), moment(field.input.value[1], 'YYYY-MM-DD')]}
     // value = {[field.input.value[0], field.input.value[1]]}
     />
  )
}

const renderStartDateSelect = (field) => {
  console.log(field.input.value)
  // This const will render the start time of the event
  // So before you choose any value you want to have the field
  // input as a value in your select... because the input value will be the value
  // that will be return to the field when you input a value
  // Bascially everything goes through the value first, and what ever is here inspect
  // is just for show
  return (
    <Select {...field.input}>
    {field.children}
    </Select>
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



class ReduxEditEventForm extends React.Component{

  handleTimeChange = (event) => {
    return (
      console.log(event)

    )
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
      const {handleSubmit} = this.props;
      // For the component of the fields you can create your own stateles function
      // to be put in there but it has to be outisde of your render
      // You can call an <input/> into the field component
      // You can put in initial values when you call the props initialValue
      // you can actually call it and modify it in a higher order component and it will change
      return(
        <form>
          <div>
            <label htmlFor = 'title'> Title</label>
            <Field
            name = 'title'
            component= {renderField}
            type= 'text'
            />
          </div>
          <div>
            <label htmlFor = 'content'> Content</label>
            <Field name = 'content' component= {renderField} type= 'text'/>
          </div>
          <div>
            <label htmlFor = 'location'>Location</label>
            <Field name = 'location' component= {renderField} type= 'text'/>
          </div>
          <div>
            <label htmlFor = 'dateRange'>Date Range</label>
            <br />
            <Field name = 'dateRange' component = {renderDateField} type ='date' />
          </div>
          <div>
            <Field
            name = 'startTime'
            component = {renderStartDateSelect}
            onChange = {this.handleTimeChange}>
              {renderStartTime()}
            </Field>
            <Field
            name = 'endTime'
            component = {renderStartDateSelect}>
              {this.renderEndTimeSelect()}
            </Field>

          </div>


          <button type = 'submit' onClick = {handleSubmit}>Submit</button>
          <button onClick = {(e) => this.props.onDelete(e,this.props.calendarId)}> Delete </button>
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
  startTime: selector(state, 'startTime')
}))(ReduxEditEventForm);
