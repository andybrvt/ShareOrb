import React from 'react';
import { reset, Field, reduxForm } from 'redux-form';
import '../PersonalCalCSS/ReduxForm.css';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { DatePicker, TimePicker, Button, Input, Select, Radio } from 'antd';
import { AimOutlined, ArrowRightOutlined } from '@ant-design/icons';
import * as dateFns from 'date-fns';
import './PickEventSync.css';

const { Option } = Select;

const { TextArea } = Input

const required = value => value ? undefined : '*Required'

const renderField = (field) => {
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

const renderLocationField = (field) => {
  console.log(field.meta)
  return (
    <span>
    <Input style={{width:'50%',fontSize:'14px'}}
    {...field.input}
    type = {field.type}
    placeholder= {field.placeholder}
    className = 'box'/>

    </span>
  )
}




// <input {...field.input} type = {field.type} placeholder = {field.placeholder} />

const renderStartDate = (field) => {
  console.log(field)
  return (
    <DatePicker
    onChange = {field.input.onChange}
    value = {field.input.value}
    style = {{width: '110px', marginRight:'15px'}}
    suffixIcon={<div></div>}
    allowClear = {false}
     />
  )
}

const renderEndDate = (field) => {
  console.log(field)
  return (
    <DatePicker
    onChange = {field.input.onChange}
    value = {field.input.value}
    style = {{width: '110px'}}
    suffixIcon={<div></div>}
    allowClear = {false}
    className = {` ${field.meta.error === 'endDate error' ? 'datePicker' : ''}`}
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


  console.log(field)
  return (
    <Select
      // {...field.input}
      style = {{width: '115px', marginRight:'15px'}}
      onChange = {field.input.onChange}
      value = {field.input.value}
      className = 'timebox'>

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




const afterSubmit = (result, dispatch) =>
  dispatch(reset('event sync add event'))
// This is to reset the values of the form


// So this form is when you pick a date and you want to schedule a time
class PickEventSyncForm extends React.Component {

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
  render () {
    console.log(this.state)
    console.log(this.props)
    const {handleSubmit, pristine, invalid, reset, submitting, error } = this.props
    return (
      <form class="eSyncForm">
      <div className = 'eSyncTitle'>
        <Field
        name = 'title'
        label = 'Title'
        component= {renderField}
        type= 'text'
        validate = {required }
        placeholder = 'Title'
        />
      </div>
      {/*
      <div className = 'reduxContent'>
        <Field
        name = 'content'
        label = 'Content'
        component= {renderTextArea}
        type= 'text'
        // validate = {required}
        placeholder = 'Description'
        />
      </div>
      */}

      <div style={{height:'70px'}} className = 'outerContainerPeople'>
        <div class="innerContainerPeople">
          <i class="fas fa-globe-americas"  style={{marginRight:'25px'}} ></i>
          <Field
            name = 'location'
            placeholder="Location"
            component= {renderLocationField}
            type= 'text'


          />
      </div>
    </div>

    <div style={{display:'flex', height:'30px', width:'500px'}} className = 'pointerEvent outerContainerPeople'>
      <div class="innerContainerPeople">
        <i style={{marginRight:'25px'}}  class="fas fa-clock"></i>


            {/*


              <Field
                name = 'startDate'
                component = {renderStartDate}
                onChange = {this.onStartDateChange}
                type = 'date'
              />
            */}



           <Field
             style={{display: 'inline-block',float: 'left'}}
             name = 'startTime'
             component = {renderStartDateSelect}
             onChange = {this.handleStartTimeChange}
             >
             {renderStartTime()}
           </Field>

           <Field
             style={{display: 'inline-block', marginRight:'15px'}}
             name = 'endTime'
             onChange = {this.handleEndTimeChange}
             component = {renderStartDateSelect}
             >
             {this.renderEndTimeSelect()}
           </Field>
      </div>
    </div>

      {error && <strong style = {{color: 'red'}}>{error}</strong>}
      <div className = 'eventSyncSurroundings'>
        <div className = 'clearEventSyncFormButton' >
          <Button
          diabled = {pristine}
          onClick= {reset}>Clear Values</Button>
        </div>
        <div className = 'eventSyncSubmitButton'>
          <Button
            type = 'primary'
            onClick = {handleSubmit}
            disabled = {invalid || this.props.active === null}>
            Send Event
          </Button>
        </div>
      </div>
      </form>

    )
  }

}

PickEventSyncForm = reduxForm ({
  form: 'event sync add event',
  onSubmitSuccess: afterSubmit
}) (PickEventSyncForm)

export default PickEventSyncForm;
