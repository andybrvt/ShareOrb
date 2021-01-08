import React from 'react';
import * as dateFns from 'date-fns';
import moment from 'moment';
import { connect } from "react-redux";
import { Form } from '@ant-design/compatible';
import { ReactBingmaps } from 'react-bingmaps';
import { Avatar, DatePicker, TimePicker, Button, Input, Select, Radio, Drawer } from 'antd';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { AimOutlined, PictureOutlined, ArrowRightOutlined, UserOutlined, SearchOutlined } from '@ant-design/icons';



const { Option } = Select;

const { TextArea } = Input


const validate = values => {
  const errors = {}
  // This is used to check if certain fields are properly checked and so it deosn't
  // mess with the editing of events
  console.log(values)
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

const renderField = (field) => {
  // This is for the title and location most, but mostly for title

  console.log(field.meta)
  return (
    <span>
    <Input style={{width:'50%', height:'30px', fontSize:'15px'}}
    {...field.input}
    type = {field.type}
    placeholder= {field.placeholder}
    style={{display:'inline-block'}}
    className = 'box'
    maxLength = "125"
    />

    </span>
  )
}

const renderTextArea = (field) => {

  // This is for content field
  return (
    <TextArea
    {...field.input}
    rows={4}
    type = {field.type}
    placeholder = {field.placeholder}
    />
  )

}

const renderRadioSelect = (field) => {
  // render the radio to pick normal date, weekly, or daily
  console.log(field)
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

const renderStartTimeSelect = (field) => {
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
    // This will render the specific date selections for the tiem select
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

  const renderFriendSelect = (field) => {
    console.log(field.input.value)

    return (
      <Select
        mode="multiple"
        style={{ width: '82%',
         marginTop:'30px', }}

        onChange = {field.input.onChange}
        value = {field.input.value}
        placeholder="Add friends"
        className = 'selectBox'
        optionLabelProp="label"
      >
      {field.children}

      </Select>
    )

  }

  const renderLocationField = (field) => {
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

  const renderEventColor = (field) => {
    // This is just used to render the color of the event
    return (
      <Input
      style = {{width: '45px', marginRight:'15px'}}
      type = 'color'
      className = 'reduxColor'
      name = 'eventColor'
      {...field.input}/>
    )
  }




class DetailEditEventForm extends React.Component{
// This class will be similar to the redux edit event but will be more detailed
  // For detail comments on how redux forms work, check ReduxEditEventForm
  state = {
    visible: false,
    invitedList:[],
    locationField:'Shanghai'

   };

  onClose = () => {
    this.setState({
      visible: !this.state.visible,

    });
  };

  capitalize (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  onInputChange = (event) => {
            this.setState({ locationField: event.target.locationField })
            console.log(this.state.locationField)
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

  handleReoccuringChange = (event) => {

    // This is to handle the change between how much the event is gonna repeated
     const { change } = this.props

     change('repeatCondition', event.target.value)
     console.log(this.props)

  }



  onRed = () => {
    let startDate = this.props.startDate
    let endDate = this.props.endDate
    let repeatCondition = ''
    if (this.props.repeatCondition){
        repeatCondition = this.props.repeatCondition
    }

    let boxcolor = false

    console.log(repeatCondition)


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


  renderEndDate = (field) => {
    console.log(field.meta)
    return (
      <DatePicker
      onChange = {field.input.onChange}
      value = {field.input.value}
      style = {{width: '110px'}}
      suffixIcon={<div></div>}
      allowClear = {false}
      // className = {` ${this.onRed() ? 'datePicker' : ''}`}
      />
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

  renderShareListSelect = () => {
    if(this.props.friendList !== undefined){
      const friendList = this.props.friendList
      console.log(friendList)
      let shareOptions = []

      for (let i = 0; i< friendList.length; i++ ){
        shareOptions.push(

          <Option value = {friendList[i].username}
          label = {
            <div style={{padding:'3px'}}>
            <Avatar size={15} style={{marginRight:'10px', marginBottom:'5px'}} src= {`${global.API_ENDPOINT}`+friendList[i].profile_picture} />

            <span>{this.capitalize(friendList[i].first_name)+" "+this.capitalize(friendList[i].last_name)}</span>
            </div>
        }>
            <div style={{padding:'10px'}}>
              <Avatar
                style={{marginRight:'10px'}}
                size="small"
                src={`${global.API_ENDPOINT}`+friendList[i].profile_picture}/>
              <span>
                {this.capitalize(friendList[i].first_name)+" "+this.capitalize(friendList[i].last_name)}
                <br/>
                <div
                  class="headerPostText"
                  style={{marginLeft:'35px'}}
                >
                  {"@"+friendList[i].username}
                </div>
              </span>
            </div>

          </Option>
        )
      }

      return shareOptions
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




  onCancelEventClick = () => {
    this.setState({
      visible: false
    })
  }


  render(){
    const friendList = this.props.friendList
    console.log(this.props)
    console.log(this.state)


    const {handleSubmit, pristine, invalid, reset} = this.props;

    let eventType = ""
    let eventId = ""
    let username = ""
    let eventHostId = ""
    if(this.props.info.host){
      username = this.props.info.host.username
      eventHostId = this.props.info.host.id
    }
    if(this.props.friends){
      if(this.props.friends.length > 0){
        eventType = "shared"
      } else {
        eventType = "single"
      }

    }
    if(this.props.info.id){
      eventId = this.props.info.id
    }


    console.log(eventId)

    return(
      <div>



      <Drawer

          width={500}
          visible={this.props.visible}
          onClose={this.onClose}


          bodyStyle={{ paddingBottom: 80 }}
          footer={
            <div>{ this.props.addEvent ?
              <div className = 'reduxButton' style={{padding:'10px'}}>
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

              <div style={{float:'right', marginRight:'50px'}}>
              <Button
              onClick = {() => this.props.onDelete(eventId, eventType)}
              >
              Delete
              </Button>
              <Button
              type = 'primary'
              onClick = {handleSubmit}
              style = {{left: '20px', fontSize: '15px'}}
              disabled = {pristine || invalid || this.onRed()}
              >Update</Button>
              </div>

             }</div>


           }>
           <div class="hideScroll">

            <div class = 'reduxTitle'>
              <Button
                style={{float:'left', marginRight:'15px', display:'inline-block'}} type="primary" shape="circle" size={'large'}>
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

            <div style={{display:'flex', height:'30px', width:'600px'}} className = 'pointerEvent outerContainerPeople'>
              <div class="innerContainerPeople">
                <i style={{marginLeft:'10px', marginRight:'25px'}}  class="fas fa-clock"></i>

                     <Field
                       class="pointerEvent"
                       name = 'startDate'
                       component = {renderStartDate}
                       onChange = {this.onStartDateChange}
                       type = 'date'
                     />
                   {
                     /*
                     <Field
                      name = 'endDate'
                      component = {this.renderEndDate}
                      onChange = {this.handleEndTimeChange}
                      type = 'date'
                    />
                    */
                  }


                   <Field
                     style={{display: 'inline-block',float: 'left'}}
                     name = 'startTime'
                     component = {renderStartTimeSelect}
                     onChange = {this.handleStartTimeChange}
                     >
                     {renderStartTime()}
                   </Field>

                   <Field
                     style={{display: 'inline-block', marginRight:'15px'}}
                     name = 'endTime'
                     onChange = {this.handleEndTimeChange}
                     component = {renderStartTimeSelect}
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


            <br />
            <div className  = 'reduxContent'>
            <i class="fas fa-align-justify" style={{marginLeft:'10px', marginRight:'25px', display: "inline"}}></i>

              <Field
              name = 'content'
              component= {renderTextArea}
              type= 'text'
              placeholder = 'Description'
              />
            </div>

            {/* location */}
            <div style={{height:'50px'}} className = 'outerContainerPeople'>
              <div class="innerContainerPeople">
                <i class="fas fa-globe-americas"  style={{marginLeft:'10px', marginRight:'25px'}} ></i>
                <Field
                  name = 'location'
                  placeholder="Location"
                  component= {renderLocationField}
                  type= 'text'
                />

              <AimOutlined style={{marginLeft:'15px', fontSize:'15px', marginRight:'15px'}} className = 'aim'/>
                <Field
                    name = 'eventColor'
                    component = {renderEventColor}
                    type = 'text'
                />
            </div>

            {/*
            <div className = "noMap">
                <div class="noMapFrame">
                <PictureOutlined />
                <br />
                <span> No Location </span>
                </div>
            </div>
            */}



            <div style={{marginBottom:'100px'}}></div>

            {/*
            <div class="mapEventCard" style={{height:300, float:'left',  marginTop:100}}>
              <p style={{fontSize:'20px', color:'black'}}
                className="eventDetails"> Location </p>
              <div style={{height:'100px'}}>

              </div>



            </div>
            */}



            </div>






          </div>
        </Drawer>

      </div>

    )
  }
}

DetailEditEventForm = reduxForm({
  form: "detailEventEdit",
  enableReinitialize: true,
  validate //validate the fields to make sure they are correct
}) (DetailEditEventForm);

const selector = formValueSelector("detailEventEdit");

export default connect(state => ({
  edit: selector(state, 'edit'),
  title: selector(state, 'title'),
  friends: selector(state, 'friends'),
  content: selector (state, 'content'),
  location: selector (state, 'location'),
  startTime: selector(state, 'startTime'),
  endTime: selector(state, 'endTime'),
  startDate: selector(state, 'startDate'),
  endDate: selector(state, 'endDate'),
  repeatCondition: selector(state, 'repeatCondition')
}))(DetailEditEventForm);
