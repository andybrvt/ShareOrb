import React from 'react';
import { reset, Field, reduxForm } from 'redux-form';
import '../PersonalCalCSS/ReduxForm.css';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { DatePicker, TimePicker, Button, Input, Select, Radio, Card} from 'antd';
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
    defaultValue = '#91d5ff'
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

  capitalize (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  renderStartDateSelect = (field) => {
    // This const will render the start time of the event
    // So before you choose any value you want to have the field
    // input as a value in your select... because the input value will be the value
    // that will be return to the field when you input a value
    // Bascially everything goes through the value first, and what ever is here inspect
    // is just for show
    console.log(this.props)
    console.log(this.props.startTime)

    return (
      <Select
        // {...field.input}
        style = {{width: '115px', marginRight:'15px'}}
        onChange = {field.input.onChange}
        value = {this.props.startTime}
        className = 'timebox'>

      {field.children}
      </Select>
    )
  }

  renderEndDateSelect = (field) => {
    // This const will render the start time of the event
    // So before you choose any value you want to have the field
    // input as a value in your select... because the input value will be the value
    // that will be return to the field when you input a value
    // Bascially everything goes through the value first, and what ever is here inspect
    // is just for show
    console.log(this.props)
    console.log(this.props.endTime)

    return (
      <Select
        // {...field.input}
        style = {{width: '115px', marginRight:'15px'}}
        onChange = {field.input.onChange}
        value = {this.props.endTime}
        className = 'timebox'>

      {field.children}
      </Select>
    )
  }

  handleStartTimeChange = (event, value) => {
    const { change } = this.props
    // So this handleStartTimechange pretty much is used to automatically
    // change the values of the endTime, the only difference between this
    // and that of the ReactAddEventForm is that we dont need to change the
    // startTime value just the endTime value will be affected


    console.log(value)
    change('startTime', value)

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
    // For this one,for times that the start hour is smaller than that of the
    // end time you don't need to change the value because due to the redux from
    // the value of the start time will chagne it self
    if(startHour === endHour ){
      if (startMin > endMin){
        endMin = "00"
        endHour = startHour + 1
        console.log(startHour)
        console.log(endHour)
        if (startHour === 11 && ampm === 'AM'){
          endTime = '12:'+endMin + ' PM'
        } else if (startHour === 23 && ampm === " PM"){
          endTime = '12:'+endMin + ' AM'
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


        change('endTime', endTime )
      } else if (startMin === endMin ){
        // This is the case where the times are identical to each other
        // REMEMBER THAT ENDHOUR AND STARTHOUR ARE USING THE 1-24 TIME
        console.log(startHour, endHour)
        if (startHour === 0 && ampm === ' AM' && startMin === 0){
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

        change('endTime', endTime)
      }
    } else if (startHour > endHour) {
      // let startHour = parseInt(time.substring(0,2))
      // let startMin = parseInt(time.substring(3,5))
      if (startHour === 11 && ampm === ' AM' && startMin === 30){
        endTime = '12:00 PM'
      } else if (startHour === 23 && ampm === ' PM' && startMin === 30){
        endTime = '12:00 AM'
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
              } else {
                startHour = '0'+startHour
              }
            }
          }
        }


          endTime = startHour + ':'+startMin+ampm
      }



      change('endTime', endTime)
    }

  }


  handleEndTimeChange = (event) => {
    console.log(event)

    const {change} = this.props
    return (
      console.log('endTime')
      // change('endTime', event)
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

  // his.props.initialValues.start_date.format("D")
  render () {
    console.log(this.state)
    console.log(this.props)

    const {handleSubmit, pristine, invalid, reset, submitting, error } = this.props
    return (
      <div class="eventSyncCard">
          <form class="eSyncForm">
            {/*<Button style={{float:'left', marginRight:'15px',
              display:'inline-block'}} type="primary"
             shape="circle" size={'large'}>
              {this.props.whichDay}
            </Button>
            */}
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
                     component = {this.renderStartDateSelect}
                     onChange = {this.handleStartTimeChange}
                     >
                     {renderStartTime()}
                   </Field>

                   <Field
                     style={{display: 'inline-block', marginRight:'15px'}}
                     name = 'endTime'
                     onChange = {this.handleEndTimeChange}
                     component = {this.renderEndDateSelect}
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
        </div>

    )
  }

}

PickEventSyncForm = reduxForm ({
  form: 'event sync add event',
  onSubmitSuccess: afterSubmit
}) (PickEventSyncForm)

export default PickEventSyncForm;
