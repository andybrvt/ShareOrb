import React from 'react';
import './UserEventList.css';
import {PictureOutlined } from '@ant-design/icons';
import * as dateFns from 'date-fns';
import {Avatar} from 'antd';
import Liking from "../NewsfeedItems/Liking";
import userIcon from '../../components/images/user.png';
import ExploreWebSocketInstance from '../../exploreWebsocket';



class UserEventList extends React.Component{

  capitalize (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  sendJoinUserEvent = (userId, ownerId, eventId) => {
    // This will be used to send the userId and the eventid ot the
    // websocket
    // The userId will be the person wanting to join the event
    console.log(userId, eventId)
    ExploreWebSocketInstance.sendSocialEventJoinPage(userId, ownerId, eventId)
  }

  sendLeaveUserEvent = (userId, ownerId, eventId) => {
    // This is similar to the sendJoinUserEvent, difference is that you are
    // just leaving the event
    ExploreWebSocketInstance.sendSocialEventLeavePage(userId, ownerId, eventId)

  }

  openSocialEventPage = (eventId) => {
    // This function will open the social event page
    this.props.history.push("/socialcal/event/"+eventId)

  }

  dateView(date) {
    // This will be presenting the calendar day on the modal
    // console.log(dateFns.format(new Date(date), ''))
    console.log(date)
    let month = ''
    // let day = ''
    if (date !== ''){
      month = dateFns.format(dateFns.addHours(new Date(date),7), 'MMM d, yyyy')
    }

    // console.log(month)
    return (

      month


    )

  }

  timeFormater(time){
    // This will change the format of the time properly to the 1-12 hour
    console.log(time)
    const timeList = time.split(':')
    let hour = parseInt(timeList[0])
    let minutes = timeList[1]
    var suffix  = hour >= 12 ? "PM":"AM"

    console.log(11%12)
    hour = ((hour+11)%12+1)+':'+minutes+" "+ suffix
    return hour

  }

  checkUser = (personList) => {
    // Check if user exist in teh list and will return true or false
    // The person list is a dicitonary of users
    let personListId = []
    for (let i = 0; i<personList.length; i++){
      const userId = personList[i].id
      personListId.push(userId)
    }

    return personListId.includes(this.props.curId)
  }

  checkDay = (eventDay, eventTime) =>{
    // Checks if the event day and time has passed the current event date and
    // time. If it is then it will return true if it is not the it will retunr
    // false

    console.log(eventDay, eventTime)
    let eventDate = dateFns.addHours(new Date(eventDay), 7)
    const timeList = eventTime.split(":")
    eventDate = dateFns.addHours(eventDate, timeList[0])
    eventDate = dateFns.addMinutes(eventDate, timeList[1])
    console.log(eventDate)
    return dateFns.isAfter(eventDate, new Date())

  }

  profileDirect = (username) => {
    // This will direct the user to a person's profile page when they
    // click on a person's avatar

    this.props.history.push('/explore/'+username)
  }

  eventTitleLength = (title) => {

    let newTitle = title
    if(title.length> 30){
      newTitle = title.substring(0, 30)+'...'
    }

    return newTitle
  }



  renderEventCells = () => {
    console.log(this.props)

    let socialEventList = []
    if(this.props.events){
      socialEventList = this.props.events
    }

    if(socialEventList.length !== 0){
      var boxes = []
      for(let i = 0; i< socialEventList.length; i++){
        boxes.push(

            <div className = {`eventContainer
            ${this.checkDay(socialEventList[i].event_day, socialEventList[i].end_time)
              ? "" : "active" }`}>

              <div className = "eventContainerFirst">
                {

                  socialEventList[i].backgroundImg === null ?
                  <div className = 'noPicBox'>
                    <div className = "inContainer">
                      <PictureOutlined />
                      <div className = 'noPicWords'> No picture </div>
                    </div>

                  </div>
                  :
                  <div className = 'picBox'>
                    <img
                    className = "picBoxPic"
                    src = {`${global.API_ENDPOINT}`+socialEventList[i].backgroundImg} />
                  </div>
                }
              </div>



              <div className = "eventContainerSecond">

                <div className = "secondContainerFirst">
                  <div className = "eventBoxTitle">{this.eventTitleLength(this.capitalize(socialEventList[i].title))}</div>
                  <div className = "tabSect">
                    {

                        this.checkDay(socialEventList[i].event_day, socialEventList[i].end_time) ?

                          <div> </div>

                          :

                          <div className = "endTag"> Ended</div>
                      }

                  </div>

                </div>

                <div className = "secondContainerSecond">
                  <div className = "locationHolder">
                    <div className = "locationPin">
                      <i class="fas fa-map-marker-alt"></i>
                    </div>

                    <div className = "eventLocation">
                      {this.capitalize(socialEventList[i].location)}
                    </div>

                  </div>

                </div>

                <div className = "secondContainerThird">

                  <div className = 'firstHalf'>


                        <div className = "eventBoxDay">
                          <div className = "calendarIcon">
                            <i class="far fa-calendar"></i>
                          </div>
                          <div className = "dateInfo">
                            {this.dateView(socialEventList[i].event_day)}
                          </div>

                        </div>

                  </div>

                  <div className = 'secondHalf'>

                      <div className = "eventBoxHost">

                      <div className = 'hostText'>
                        Host:
                      </div>

                      <div className = "hostNameAva">
                        <div className = "hostAvatar">
                          <Avatar
                           size = {24}
                           onClick = { () => this.profileDirect(socialEventList[i].host.username)}
                           src = {`${global.API_ENDPOINT}`+socialEventList[i].host.profile_picture}
                         />
                        </div>
                     <div className = "hostName">
                       {this.capitalize(socialEventList[i].host.first_name)} {this.capitalize(socialEventList[i].host.last_name)}

                      </div>
                      </div>
                    </div>


                  </div>


                </div>

                <div className = "secondContainerFourth">

                  <div className = "firstHalf">


                      <div className = "eventBoxTimes">
                        <div className = "eventClock">
                          <i class="far fa-clock"></i>
                        </div>

                        <div className = "eventTime">
                          {this.timeFormater(socialEventList[i].start_time)} - {this.timeFormater(socialEventList[i].end_time)}
                        </div>

                      </div>


                  </div>

                  <div className = "secondHalf">



                      <div className = "eventBoxParticipant">
                        <div className = "participants"> Participants: </div>
                        <div className = "likeList">
                          <Liking
                        history = {this.props.history}
                        like_people = {socialEventList[i].persons} />
                        </div>
                      </div>



                  </div>


                </div>


              </div>

              <div className = "eventContainerThird">
                Hello
                {/*this.checkDay(socialEventList[i].event_day, socialEventList[i].end_time) ?
                    <div>
                    {
                      this.checkUser(socialEventList[i].persons) ?
                        socialEventList[i].host.id === this.props.curId ?
                        <div className = "hostButton">
                          <span className = "hostText"> Host </span>
                        </div>

                        :

                        <div
                        onClick = {() => this.sendLeaveUserEvent(this.props.curId, this.props.ownerId, socialEventList[i].id)}
                        className = "leaveButton">
                          <span className = "leaveText"> Leave </span>
                        </div>

                        :

                        <div
                        onClick = {() => this.sendJoinUserEvent(this.props.curId, this.props.ownerId, socialEventList[i].id)}
                        className = "joinButton">
                          <span className = "joinText"> Join </span>
                        </div>

                    }


                    <div
                    onClick = {() => this.openSocialEventPage(socialEventList[i].id)}
                    className = "viewButton">
                      <span className = 'viewText'> View </span>
                    </div>
                    </div>

                    :

                    <div
                    onClick = {() => this.openSocialEventPage(socialEventList[i].id)}
                    className = "viewButtonPass">
                      <span className = 'viewText'> View </span>
                    </div>

                  */}
              </div>

            </div>





        )
      }


      return <div className = "eventListContainer"> {boxes} </div>
    } else {
      return <div> No Events </div>
    }
  }


  render(){
    console.log(this.props)
    console.log(new Date())
    return (
      <div className = "eventListTabContainer">

        {this.renderEventCells()}

      </div>
    )
  }
}

export default UserEventList;
