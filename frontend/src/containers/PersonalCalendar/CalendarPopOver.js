import React from 'react';
import * as dateFns from 'date-fns';
import moment from 'moment';
import axios from 'axios';
import { authAxios } from '../../components/util';
import { Input,
Drawer,
message,
List,
Avatar,
Divider,
Col,
Row,
Tag,
Button,
Tooltip,
Statistic,
Progress,
DatePicker,
AvatarGroup,
notification,
Popover,
Badge
 } from 'antd';
import { UserOutlined, AntDesignOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import Liking from '../NewsfeedItems/Liking';
import CalendarEventWebSocketInstance from '../../calendarEventWebsocket';
import NotificationWebSocketInstance from '../../notificationWebsocket';
import './PersonalCalCSS/NewCalendar.css';
import 'antd/dist/antd.css';
import RemoveEventModal from './EditCalEventForms/RemoveEventModal';
import DetailEditEventForm from './EventPage/DetailEditEventForm';
import './calPopOver.css';

class CalendarPopOver extends React.Component{
  // So when ever you do calendars, for states  you always want
  // to set the currentWeek as the current day because, you can use
  // get current week to get the firstday
  constructor(props) {
        super(props)
        this.myRef = React.createRef()
    }
    state = {
      currentWeek: new Date(),
      selectedDate: new Date(),
      events: [],
      activeX: null,
      activeY: null,
    }
    declineEventMessage = () => {
      message.success('You have declined the event' , 2);
    };

    acceptEventMessage = () => {
      message.success('You have accepted the event' , 2);
    };

    openNotification = placement => {
    notification.info({
      message: `Event deleted`,
      placement,
      });
    };
    onEventPage = (eventId) => {
      this.props.history.push('/personalcal/event/'+eventId)
    }

    onSocialEventPage = (eventId) =>{
      this.props.history.push("/socialcal/event/"+eventId)
    }

    onDeleteEvent = (eventId, eventType, host) => {
      console.log(eventId)

      if (eventType === 'shared'){
        if (host.id === this.props.id){
          this.props.openEventDeleteModal(eventId);
        } else{
          CalendarEventWebSocketInstance.deleteEvent(eventId, this.props.id)
        }
      }
      if (eventType === 'single'){
        this.props.deleteEvent(eventId)
        this.openNotification('bottomLeft')
      }
    }

    onProfileClick = (username) => {
      console.log(username)
      if (username === this.props.currentUser){
        window.location.href = 'current-user/'
      } else {
        window.location.href = 'explore/'+username
      }
    }

    onAcceptShare = (eventId, host, startTime) => {
      // This will be used for accepting event shared between you and another
      // person. When accepted this will add you to the accepted list and then
      // send it to the host to as well
      this.acceptEventMessage();
      CalendarEventWebSocketInstance.acceptSharedEvent(eventId, this.props.id);
      const notificationObject = {
        command: "send_accepted_shared_event",
        actor: this.props.id,
        recipient: host.id,
        eventDate: startTime,
        eventId: eventId
      }
      NotificationWebSocketInstance.sendNotification(notificationObject)

    }

    onDeclineShare = (eventId, host, startTime) => {
      this.declineEventMessage();
      CalendarEventWebSocketInstance.declineSharedEvent(eventId, this.props.id);
      console.log('hit here')
      const notificationObject = {
        command: "send_declined_shared_event",
        actor:  this.props.id,
        recipient: host.id,
        eventDate: startTime,
        eventId: eventId
      }

      NotificationWebSocketInstance.sendNotification(notificationObject)

    }

    dayEventIndex = (start_time, end_time, day, start_index) => {
      // day index you will get the start and end days and also the start_index by getting the
      // index of the loops
      // You will need the day here so that you can extend the event to multiple weeks
      // The day index --> 3 senarios
      // *** The event range falls on the same day
      // *** The event range falls on different day but the same week
      // *** The event range falls on different weeks (This senarios has other senarios too)
          // The start day is in the week but not the end day
          // The start nor end day is in the week (gotta make preperations for this up on the place where the events gets filtered out)
          // The end day is in the week but not the start day

      console.log(start_time, end_time)
      const start = new Date(start_time)
      const end = new Date(end_time)
      const eventDay = new Date(day)
      const index = start_index + 1
      if (dateFns.isSameWeek(start, end)){
        const sameWeekDifference = Math.abs(dateFns.differenceInDays(start, end))+1
        const ratio = index + '/' + (index+sameWeekDifference)
        return ratio
      } else {
         if(dateFns.isSameWeek(start, eventDay)){
           const ratio = index+ '/'+8
           return ratio
         } else if (dateFns.isSameWeek(end, eventDay)){
           const differentWeekDifference = Math.abs(dateFns.differenceInDays(eventDay, end))+2
           return '1/'+differentWeekDifference
         } else {
           return '1/8'
         }
      }

      // return '1/8'



    }

    hourEventIndex = (start_time, end_time, start_index ) => {
      // This is to set the event in the right rows
      // The grid index start from 1-48 and when you do a grid ratio
      // it will start from the first interval and the denominator is not included
      console.log(start_time, end_time, start_index)
      let bottomIndex = ''
      const start = new Date(start_time)
      const end = new Date(end_time)
      console.log(start, end)
      // When you convert to the time, the time becomes a 0-23 hour time
      const topIndex = start_index+1 //Good up to here
      const startHour = dateFns.getHours(start)
      const endHour = dateFns.getHours(end)
      // So there is obvious gonna be issue with this when we do 11:30 pm to 12:00 AM

      const startMin = dateFns.getMinutes(start)
      const endMin = dateFns.getMinutes(end)



      console.log(endHour, startHour, endMin, startMin)
      // for the numberator of the index you want to go from the starting index
      // and then decide if you add 1 or not depending if there is a 30 mins
      console.log(Math.abs(endMin-startMin)/30)
      // if (startMin === 30 && endMin === 0){
      //      if (endHour === startHour+1){
      //        bottomIndex = topIndex +(Math.abs(endMin-startMin)/30)
      //
      //      }
      //      else {
      //        bottomIndex = topIndex + ((endHour - startHour))+(Math.abs(endMin-startMin)/30)
      //      }
      // } else {
      //      bottomIndex = topIndex + ((endHour - startHour)*2)+(Math.abs(endMin-startMin)/30)
      // }
      if (startHour === 23 && startMin === 30){
        bottomIndex = 49;
      } else if (startHour === 23 && startMin === 0) {
        if (endMin === 30){
          bottomIndex = 48
        } else {
          bottomIndex = 49
        }

      }else {
        bottomIndex = (2*(endHour)+1)+(endMin/30)

      }


      // For the denominator you have to start from the starting index and then add
      // the number of indexes depending on the hour and then add one if there is a
      // 30 min mark
      const ratio = topIndex + '/' + bottomIndex
      console.log(ratio)


      if(this.props.month){
        return ""
      } else {
        return ratio
      }
      // return ratio
      // return '2/3'
    }


    render() {


      console.log(this.props)

      let item=this.props.item;
      let date=this.props.date;
      let dayIndex=this.props.dayIndex;
      let cloneHourIndex=this.props.cloneHourIndex;
      let cloneDay=this.props.cloneDay;
      let orientation=this.props.orientation;
      let month = false;
      let seen = []

      if(this.props.month){
        month = this.props.month
      }

      if(this.props.item){
        if(this.props.item.seen){
          seen = this.props.item.seen
        }
      }

      const text = "You're host"

      console.log(item)

      return (
        <Popover placement={orientation}  content={
          <div  className={ (item.invited.length==0) ? 'popOverSizeSolo' : 'popOverSizeMultiple' }>


              {
                item.type === "social" ?

                <Tag style={{
                    fontSize:'15px', display:'inline-block'}} color="#f50"> social</Tag>

                :

                (item.invited.length==0)?
                <Tag style={{fontSize:'15px', display:'inline-block'}} color={item.color}> private</Tag>

                :
                <Tag style={{fontSize:'15px', display:'inline-block'}} color={item.color}> public</Tag>
              }




            <span style={{color:'black', marginBottom:'10px'}}>
            {
              (item.title.length>30)?
              <p style={{fontSize:'24px', display:'inline-block'}}>{item.title.substring(0,30)}...</p>

              :
              <p style={{fontSize:'24px', display:'inline-block'}}>
                {item.title}
              </p>
            }


            </span>
            <div className="popOverTopFlex">
              <div className="popOverTopLeft">
                <p style={{marginTop:'5px', fontSize:'14px', color:'black'}} class="topPopover popoverFontWeight">
                <i style={{marginRight:'10px', marginTop:'15px'}} class="far fa-calendar-alt"></i>
                <span style={{marginRight:'3px'}}>
                  {dateFns.format(cloneDay, 'iiii')},


                </span>
                {dateFns.format(new Date(item.start_time), 'MMMM')}
                &nbsp;
                {dateFns.format(new Date(item.start_time), 'd')}



                <br/>
                <i style={{marginRight:'10px', marginTop:'10px'}} class="fas fa-clock"></i>
                <span>
                    {dateFns.format(new Date(item.start_time),'h:mm a')}
                    -
                    {dateFns.format(new Date(item.end_time),'h:mm a')}
                  </span>
                <br/>
                {
                  (item.repeatCondition=="weekly")?
                  <span>
                    <i class="fas fa-redo-alt" style={{marginRight:'10px'}}></i>
                    Occurs every

                    <span>
                      &nbsp;
                      {dateFns.format(cloneDay, 'iiii')}
                      &nbsp;
                    </span>

                  </span>

                  :
                  <div>

                    {
                      (item.repeatCondition=="daily")?
                      <span>
                        <i class="fas fa-redo-alt" style={{marginRight:'10px'}}></i>
                        Occurs every day

                      </span>
                      :
                      <div>


                        {
                          (item.repeatCondition=="monthly")?
                          <span>
                            <i class="fas fa-redo-alt" style={{marginRight:'10px'}}></i>
                            Occurs every month

                          </span>
                          :
                          <div></div>
                        }




                      </div>
                    }
                 </div>

                }

                <div>
                  <i class="fas fa-user-friends" style={{marginRight:'5px'}}></i>
                  {
                    (item.invited.length==0)?
                      <span> Just You</span>

                    :
                        <span>   {item.invited.length+1} people</span>

                  }
                </div>

              </p>
              </div>

              <div className="popOverTopRight">
              {
                (item.backgroundImg)?
                <img

                src = {item.backgroundImg}
                className = 'popoverPic'
                 />
                 :
                 <div></div>
              }

              </div>
            </div>

            {/* if person is host*
              item.host
              {item.person.length==1 && item.host.username==this.props.username}


            */}

              {/* for private events and person is host*/}
            <div>
              {



                (item.invited.length==0 && item.host.id==this.props.id)?

                <div class="popOverBotFlex">
                  <Tooltip placement="bottomLeft" title="View event">
                    {
                      item.type === "social" ?

                      <Button
                      onClick = {() => this.onSocialEventPage(item.socialId)}
                      shape="circle"
                      size="large"
                      type="primary">
                         <i class="fas fa-eye"></i>
                      </Button>

                      :

                      <Button
                      onClick = {() => this.onEventPage(item.id)}
                      shape="circle"
                      size="large"
                      type="primary">
                         <i class="fas fa-eye"></i>
                      </Button>

                    }
                  </Tooltip>
                  <Tooltip placement="bottomLeft" title="Remove event">
                    <Button
                    onClick ={() => this.onDeleteEvent(item.id, 'single')}
                    shape="circle"
                    size="large"
                    type="primary"
                    style={{marginLeft:'10px'}}>
                       <i class="fas fa-times"></i>
                    </Button>
                  </Tooltip>
                </div>

                :

                <div>
                  <div class="popOverDivider"></div>

                  <div class="popOverMidFlex">
                    <div class="popOverMidLeft">
                      <div class="popOverHost">

                      <Avatar
                        shape="circle"
                        size={60}
                        src={`${global.IMAGE_ENDPOINT}`+item.host.profile_picture}
                        style={{display:'inline-block'}}
                       />
                     {

                         (item.host.username==this.props.username)?
                           <p class="centerPopUpName highlightWord"
                             onClick = {() => this.onProfileClick(item.host.username)}
                           >

                             {text}
                           </p>
                         :


                           <p class=" centerPopUpName highlightWord"
                             onClick = {() => this.onProfileClick(item.host.username)}
                           >

                             {item.host.first_name} {item.host.last_name}
                           </p>

                     }


                    </div>
                    </div>
                    <div class="popOverMidRight" style={{display:'inline-block', width:'40%'}}>
                     <div class="weekCalPopOverStat">
                       <div class="weekCalPopOverFirst">
                         <Statistic title="Going" value={item.invited.length} />
                       </div>
                       <div class="weekCalPopOverSecond">
                         <Statistic title="Invited" value={item.person.length} />
                       </div>

                     </div>
                    </div>
                  </div>
                  <div>


                    <div class="popOverBotFlex">
                      <div class="popOverBotLeft">

                        {/* user is host or user accepted */}
                        {
                          (item.host.username==this.props.username|| (item.accepted.some(e => e.id === this.props.id))

                          ||(item.host.username==this.props.username))
                          ?
                          <div>
                            <Tooltip placement="bottomLeft" title="View event">
                              {
                                item.type === "social" ?

                                <Button
                                onClick = {() => this.onSocialEventPage(item.socialId)}
                                shape="circle"
                                size="large"
                                type="primary">
                                   <i class="fas fa-eye"></i>
                                </Button>

                                :

                                <Button
                                onClick = {() => this.onEventPage(item.id)}
                                shape="circle"
                                size="large"
                                type="primary">
                                   <i class="fas fa-eye"></i>
                                </Button>

                              }


                            </Tooltip>
                            <Tooltip placement="bottomLeft" title="Remove event">
                              <Button
                              onClick ={() => this.onDeleteEvent(item.id, 'shared', item.host)}
                              shape="circle"
                              size="large"
                              type="primary"
                              style={{marginLeft:'10px'}}>
                                 <i class="fas fa-times"></i>
                              </Button>
                            </Tooltip>
                          </div>
                          :
                          <div>
                            <Tooltip placement="bottomLeft" title="View event">
                              {
                                item.type === "social" ?

                                <Button
                                onClick = {() => this.onSocialEventPage(item.socialId)}
                                shape="circle"
                                size="large"
                                type="primary">
                                   <i class="fas fa-eye"></i>
                                </Button>

                                :

                                <Button
                                onClick = {() => this.onEventPage(item.id)}
                                shape="circle"
                                size="large"
                                type="primary">
                                   <i class="fas fa-eye"></i>
                                </Button>

                              }
                            </Tooltip>
                            <Tooltip placement="bottomLeft" title="Remove event">
                              <Button
                              onClick ={() => this.onDeleteEvent(item.id, 'shared', item.host)}
                              shape="circle"
                              size="large"
                              type="primary"
                              style={{marginLeft:'10px'}}>
                                 <i class="fas fa-times"></i>
                              </Button>
                            </Tooltip>
                            <span>
                              <Tooltip placement="bottomLeft" title="Accept Invite">
                                <Button
                                type="primary"
                                shape="circle"
                                size="large"
                                style={{marginLeft:'10px'}}
                                onClick = {() => this.onAcceptShare(item.id, item.host, item.start_time)}
                                >
                                   <i style={{fontSize:'20px'}} class="fas fa-user-check"></i>
                                </Button>
                              </Tooltip>
                              <Tooltip placement="bottomLeft" title="Decline Invite">
                                <Button
                                shape="circle"
                                type="primary"
                                size="large"
                                danger
                                style={{marginLeft:'10px'}}
                                onClick = {() => this.onDeclineShare(item.id, item.host, item.start_time)}
                                >
                                   <i class="fas fa-user-times"></i>
                                </Button>
                                </Tooltip>
                              </span>
                            </div>

                          }
                      </div>
                      <div class="popOverBotRight">
                        <Liking num={5} like_people={item.accepted}/>
                      </div>
                    </div>

                  </div>
                </div>

              }
            </div>



      </div>

      }



  >

  {/* color on week calendar */}
        {   (
            (item.accepted.some(e => e.id === this.props.id))
            ||(item.invited.length==0)
            ||(item.host.username==this.props.username)
            )

           ?


            <div
               key= {item.title}
               className = "weekEvent"
               style = {{
                  gridColumn: this.dayEventIndex(item.start_time, item.end_time, date, dayIndex) ,
                  gridRow: this.hourEventIndex(item.start_time, item.end_time, cloneHourIndex),
                  backgroundColor: item.color
                }}>

                {
                  seen.includes(this.props.id) ?

                  <div></div>

                  :

                  <div
                    className = "calendarEventBadge"
                    ></div>

                }


                    <span className="pointerEvent">
                      {
                        item.type === "social" ?

                        <span className = 'eventPageTitle pointerEvent' >
                          {item.title.substring(0,19)}
                          <Tag style={{fontSize:'12px', display:'inline-block',
                            marginLeft: "3px",
                          }} color={"red"}> social</Tag>
                        </span>

                        :

                        <span className = 'eventPageTitle pointerEvent' >
                          {item.title.substring(0,19)}
                        </span>

                      }

                      {month ?
                      <span></span>

                      :

                      <br/>
                      }
                      {
                        month ?

                        <span></span>

                      :

                      <span className = 'eventTimeInfo pointerEvent'>
                        {dateFns.format(new Date(item.start_time),'h:mm a')}
                        -
                        {dateFns.format(new Date(item.end_time),'h:mm a')}

                      </span>
                      }

                      {
                        (item.host.username!=this.props.username && month === false)?
                          <Avatar style={{float:'right', marginTop:'7px'}} size={20}
                            src={`${global.IMAGE_ENDPOINT}`+item.host.profile_picture} />

                        :
                        <div></div>
                      }
                    </span>


            </div>


          :

            <div
               key= {item.title}
                onClick = {() => this.onClickItem(item)}
                 className = "weekEventAccept testLook"
                 style = {{
                  gridColumn: this.dayEventIndex(item.start_time, item.end_time, date, dayIndex) ,
                  gridRow: this.hourEventIndex(item.start_time, item.end_time, cloneHourIndex),
                  color:'white',
                  backgroundColor: item.color,
                }}>


                    <span className="pointerEvent">
                      {
                        item.type === "social" ?

                        <span className = 'eventPageTitle pointerEvent' >
                          {item.title.substring(0,19)}
                          <span className = "socialTag"> social </span>
                        </span>

                        :

                        <span className = 'eventPageTitle pointerEvent' >
                          {item.title.substring(0,19)}
                        </span>

                      }
                        {month ?
                        <span></span>

                        :

                        <br/>
                        }
                        {
                          month ?

                          <span></span>

                        :

                        <span className = 'eventTimeInfo pointerEvent'>
                          {dateFns.format(new Date(item.start_time),'h:mm a')}
                          -
                          {dateFns.format(new Date(item.end_time),'h:mm a')}

                        </span>
                        }

                    </span>

                    <span>
                        {/*
                          <Avatar.Group size={20} maxCount={2} style={{float:'right'}}>
                            <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                            <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
                            <Tooltip title="Ant User" placement="top">
                              <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
                            </Tooltip>
                            <Avatar style={{ backgroundColor: '#1890ff' }} icon={<AntDesignOutlined />} />
                        </Avatar.Group>
                        */}
                        {
                          (item.host.username!=this.props.username && month === false)?
                            <Avatar style={{float:'right', marginTop:'7px'}} size={20}
                              src={`${global.IMAGE_ENDPOINT}`+item.host.profile_picture} />

                          :
                          <div></div>
                        }
                    </span>

              </div>

        }





        </Popover>
    )

    }

}


export default CalendarPopOver;
