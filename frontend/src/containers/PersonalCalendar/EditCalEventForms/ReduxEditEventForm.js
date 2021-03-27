import React from 'react';
import * as dateFns from 'date-fns';
import moment from 'moment';
import { connect } from "react-redux";
import { Form } from '@ant-design/compatible';
import { DatePicker, TimePicker, Button, Input, Select, Radio, Avatar, Tooltip} from 'antd';
import { AimOutlined, ArrowRightOutlined, UserOutlined, SearchOutlined } from '@ant-design/icons';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import * as navActions from '../../../store/actions/nav';
import * as calendarEventActions from '../../../store/actions/calendarEvent';
import '../PersonalCalCSS/ReduxForm.css';
import 'antd/dist/antd.css';
import '@ant-design/compatible/assets/index.css';
import axios from 'axios';

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
const renderRadioSelect = (field) => {
  // render the radio to pick normal date, weekly, or daily
  const options = [
  { label: 'Non-repeating', value: 'none' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Daily', value: 'daily' },
];

  return (
    <Radio.Group
          {...field.input}
          options={options}
          // value={}
          optionType="button"
        />
  )
}

const renderFriendSelect = (field) => {
  //This will render the list of friends so you can pick which friends you want
  // to share this event with
  return (
    <Select
    mode="multiple"
    notFoundContent=""
    dropdownRender={menu => (
      <div style={{ transform: "translateY(-4px)", marginBottom:'0px' }}>
        {menu}
      </div>
    )}
    style={{ width: '50%', marginTop:'20px'}}
    optionLabelProp="label"
    onChange = {field.input.onChange}
    value = {field.input.value}
    placeholder="Add friends"
        >
    {field.children}

    </Select>
  )

}

const renderField = (field) => {
  // Typical input field, most use for the title
  return (
    <span>
    <Input style={{width:'50%', height:'30px', fontSize:'15px'}}
    {...field.input}

    // onChange = {field.input.onChange}
    type = {field.type}
    placeholder= {field.placeholder}
    style={{display:'inline-block'}}
    maxLength = "80"
    className = 'box'/>

    </span>
  )
}

const renderLocationField = (field) => {
  //Typical input field, used for the location
  return (
    <span>
    <Input style={{width:'50%',fontSize:'14px'}}
    {...field.input}
    // onChange = {field.input.onChange}

    type = {field.type}
    placeholder= {field.placeholder}
    className = 'box'/>

    </span>
  )
}



const renderTextArea = (field) => {
  // Text field used for the content
  return (
    <TextArea
    {...field.input}
    // onChange = {field.input.onChange}
    type = {field.type}
    placeholder= {field.placeholder}
    rows = {2}
    className = 'box'
    style={{fontSize:'14px'}}
    />
  )
}

// <input {...field.input} type = {field.type} placeholder = {field.placeholder} />

const renderStartDate = (field) => {

  // This is used for the date selection (to pick the right day)
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



const renderStartDateTime = (field) => {
  // This const will render the start time of the event
  // So before you choose any value you want to have the field
  // input as a value in your select... because the input value will be the value
  // that will be return to the field when you input a value
  // Bascially everything goes through the value first, and what ever is here inspect
  // is just for show

  // Used to pick the right start time.
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


const renderEventColor = (field) => {
  // This is just used to render the color of the event
  return (
    <Input
    style = {{width: '45px', marginRight:'15px'}}
    type = 'color'
    className = 'reduxColor'
    name = 'eventColor'
    defaultValue = '#fadb14'
    {...field.input}/>
  )
}


const renderStartTime = () => {
  // This funciton is to fill in the child of the time select
  // example 12:00 am, 12:30 am etc

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
    return time
  }


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


const required = value => value ? undefined : 'Required'

const validate = values => {
  // As the name implies , it will validate the values of the form.
  const errors = {}

  if (!values.title){
    errors.title = "Required"
  }
  if(dateFns.isAfter(new Date(values.startDate), new Date(values.endDate))){
    errors.endDate = 'endDate error'
  } else if (values.repeatCondition === 'weekly' &&
    !dateFns.isSameWeek(new Date(values.startDate), new Date(values.endDate))
  ) {
    errors.endDate = "endDate error"
  } else if (values.repeatCondition === 'daily' &&
    !dateFns.isSameDay(new Date(values.startDate), new Date(values.endDate))
  ) {
    errors.endDate = "endDate error"
  }

  return errors
}


class ReduxEditEventForm extends React.Component{

  constructor(props){
    super(props)
    this.state = {
      geoLat: 0,
      geoLong: 0,
      testLocation:'',
    }
  }




  handleLocation=()=>{
    {/*
      xml
      http://dev.virtualearth.net/REST/v1/Locations/47.64054,-122.12934?o=xml&key=AggkvHunW4I76E1LfWo-wnjlK9SS6yVeRWyeKu3ueSfgb1_wZqOfD1R87EJPAOqD
      html
      http://dev.virtualearth.net/REST/v1/Locations/47.64054,-122.12934?&key=AggkvHunW4I76E1LfWo-wnjlK9SS6yVeRWyeKu3ueSfgb1_wZqOfD1R87EJPAOqD
      */}
    let longitude=0;
    let latitude=0;
    if (navigator.geolocation) {
        let success = position => {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        console.log(latitude, longitude);
         axios
          .get("http://dev.virtualearth.net/REST/v1/Locations/47.64054,-122.12934?&key=AggkvHunW4I76E1LfWo-wnjlK9SS6yVeRWyeKu3ueSfgb1_wZqOfD1R87EJPAOqD")
          .then(res => {
            console.log(res.data)
            this.setState({ testLocation: res.data});
          })

        };


      console.log(this.state.testLocation)
      function error() {
        console.log("Unable to retrieve your location");
      }
      navigator.geolocation.getCurrentPosition(success, error);
    }
  }

  capitalize (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  handleStartTimeChange = (event, value) => {
    const { change } = this.props
    // So this handleStartTimechange pretty much is used to automatically
    // change the values of the endTime, the only difference between this
    // and that of the ReactAddEventForm is that we dont need to change the
    // startTime value just the endTime value will be affected


    change('startTime', value)

    // Like every other time related events we have to converted all
    let startHour = parseInt(value.substring(0,2))
    let startMin = parseInt(value.substring(3,5))
    let ampm = value.substring(5,8)
    let endHour = parseInt(this.props.endTime.substring(0,2))
    let endMin = parseInt(this.props.endTime.substring(3,5))
    let endTime = ''




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
            if (endHour<10){
                endHour = '0'+endHour
            } else {
              if(ampm === ' AM'){
                endHour = endHour
              } else if (ampm === ' PM'){
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

    const {change} = this.props

  }



  handleReoccuringChange = (event) => {
     const { change } = this.props

     change('repeatCondition', event.target.value)

  }



  onRed = () => {
    // This will give an error if you were to pick a weekly, event and then you
    // make an event that exceeds the weekly mark
    let startDate = this.props.startDate
    let endDate = this.props.endDate
    let repeatCondition = ''
    if (this.props.repeatCondition){
        repeatCondition = this.props.repeatCondition
    }

    let boxcolor = false



    if (repeatCondition === 'weekly'){
      if(dateFns.differenceInDays(startDate, endDate) > 7){
        boxcolor = true
      }
    }


    if (dateFns.isAfter(new Date(startDate),new Date(endDate))){
      boxcolor = true
    }

    return boxcolor
  }


  // renderEndDate = (field) => {
  //   console.log(field.meta)
  //   return (
  //     <DatePicker
  //     onChange = {field.input.onChange}
  //     value = {field.input.value}
  //     style = {{width: '110px'}}
  //     suffixIcon={<div></div>}
  //     allowClear = {false}
  //     // className = {` ${this.onRed() ? 'datePicker' : ''}`}
  //     />
  //   )
  // }

  onStartDateChange = (event, value) => {
    const { change } = this.props

    // So this is where the end Date will be changed if the startDate or endDate
    // seems to be ahead of the endDate
    // if (dateFns.isAfter(new Date(value),new Date(this.props.endDate))){
    change('endDate', value)
    // }
  }

  renderShareListSelect = () => {
    if(this.props.following !== undefined && this.props.followers !== undefined){
      const friendList = this.props.following

      let shareOptions = []

      for (let friend = 0; friend< friendList.length; friend++ ){
        shareOptions.push(
          <Option locale={{emptyText:<span/>}} value = {friendList[friend].username}
          label = {
            this.capitalize(friendList[friend].first_name)+" "+this.capitalize(friendList[friend].last_name)
          } >
            <Avatar size={20} style={{marginRight:'10px'}}
               src= {`${global.IMAGE_ENDPOINT}`+friendList[friend].profile_picture} />
            {friendList[friend].first_name+" "+friendList[friend].last_name}
          </Option>
        )
      }

      return shareOptions
    }
  }

  handleFriendChange = (value) => {

  }

  renderEndTimeSelect = () => {

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


  newHandleSubmit = (value) => {
    this.props.handleSubmit(value)

    this.props.reset('edit event')
  }



    render(){
      console.log(this.props)
      // handleSubmit will actually run this.prop.onSubmit
      const {onChange, handleSubmit, pristine, invalid, reset} = this.props;
      // For the component of the fields you can create your own stateles function
      // to be put in there but it has to be outisde of your render
      // You can call an <input/> into the field component
      // You can put in initial values when you call the props initialValue
      // you can actually call it and modify it in a higher order component and it will change


      // EXPLAINATION OF HOW THINGS WORK IN THIS REDUX FORM
      // So basically what going on is that this is a redux form, and then there is
      // the selectors I mension at the bottom. So the selection is not what is
      // being submitted(it is pretty much just used for the end tiem and end date so that
      // when you change the start date and start time so that it can accomate
      // for the time change.
      // However, the actual submitting in a sense it is connected to the props but most
      // it is all the values from input itself, and when you input those value
      // since they are connected to the props itself, it will be passed into
      // the submit function in the eventeditpopup. so all the values that are in
      // that form even though it might not seem like it from just this file
      return(
        <form
          onChange = {this.props.onTempChange}
          style={{padding:'25px'}}>
            <div className = 'reduxTitle'>
              <Button style={{float:'left', marginRight:'15px', display:'inline-block'}} type="primary" shape="circle" size={'large'}>
                {this.props.dayNum}
              </Button>
              <Field
              name = 'title'
              component= {renderField}
              type= 'text'
              placeholder = 'Title'

              />


            </div>

            <div style={{marginLeft:'50px', marginBottom:'15px'}}>
              <Field
              name = 'repeatCondition'
              component = {renderRadioSelect}
              onChange ={this.handleReoccuringChange}
              />
            </div>

            <div style={{display:'flex', height:'30px', width:'500px'}} className = 'pointerEvent outerContainerPeople'>
              <div class="innerContainerPeople">
                <i style={{marginLeft:'10px', marginRight:'25px'}}  class="fas fa-clock"></i>

                     <Field
                       name = 'startDate'
                       component = {renderStartDate}
                       onChange = {this.onStartDateChange}
                       type = 'date'
                     />


                   <Field
                     style={{display: 'inline-block',float: 'left'}}
                     name = 'startTime'
                     component = {renderStartDateTime}
                     onChange = {this.handleStartTimeChange}
                     >
                     {renderStartTime()}
                   </Field>

                   <Field
                     style={{display: 'inline-block', marginRight:'15px'}}
                     name = 'endTime'
                     onChange = {this.handleEndTimeChange}
                     component = {renderStartDateTime}
                     >
                     {this.renderEndTimeSelect()}
                   </Field>
              </div>
            </div>



            {/* need to implement redux form to people */}
            <div>

              <i style={{marginLeft:'10px', marginRight:'21px'}} class="fas fa-user-friends"></i>
              <Field
              name = 'friends'
              type='text'

              onChange = {this.handleFriendChange}
              component = {renderFriendSelect}
              placeholder = 'Title'
              >
                {this.renderShareListSelect()}

              </Field>

              {/*<Input style={{width:'250px', marginBottom:'15px'}} placeholder="Add People" prefix={<SearchOutlined />} /> */}
            </div>


            {/* Description of event
            <div className  = 'reduxContent'>
              <Field
              name = 'content'
              component= {renderTextArea}
              type= 'text'
              placeholder = 'Description'
              />
            </div>

            */}
            {/* location */}
            <div style={{height:'70px'}} className = 'outerContainerPeople'>
              <div class="innerContainerPeople">
                <i class="fas fa-globe-americas"  style={{marginLeft:'10px', marginRight:'25px'}} ></i>
                <Field
                  name = 'location'
                  placeholder="Location"
                  component= {renderLocationField}
                  type= 'text'
                  value={this.state.longitude}

                />
              <Tooltip title="Current Location">
                <AimOutlined
                  onClick={this.handleLocation}
                  style={{marginLeft:'15px', fontSize:'15px', marginRight:'15px'}} className = 'aim'/>
              </Tooltip>
            <Field
                  name = 'eventColor'
                  component = {renderEventColor}
                  type = 'text'

              />
            </div>



            </div>


              <div className = 'reduxButton' style={{padding:'10px'}}>
              <Button
              onClick = {reset}
              >
              Clear
              </Button>

              <Button
              type = 'primary'
              onClick = {this.newHandleSubmit}
              style = {{left: '10px', fontSize: '15px'}}
              disabled = {pristine || invalid || this.onRed()}
              >Save</Button>
              </div>



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
  enableReinitialize: true,
  validate //This will reintialzie the prestine values everytime the props changes
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
  friends: selector(state, 'friends'),
  content: selector (state, 'content'),
  location: selector (state, 'content'),
  startTime: selector(state, 'startTime'),
  endTime: selector(state, 'endTime'),
  startDate: selector(state, 'startDate'),
  endDate: selector(state, 'endDate'),
  repeatCondition: selector(state, 'repeatCondition')
}))(ReduxEditEventForm);
