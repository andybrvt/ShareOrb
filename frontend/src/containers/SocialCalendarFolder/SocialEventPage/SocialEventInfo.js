import React from 'react';
import {Button, Progress, Avatar, Modal, message, notification} from 'antd';

import {PictureOutlined} from '@ant-design/icons';


class SocialEventInfo extends React.Component{

  constructor(props){
    super(props);
  }

  state = {
    edit: false,
    changeBackgroundView: false
  }

  capitalize (str) {
    if(str){
        return str.charAt(0).toUpperCase() + str.slice(1)
    }

  }

  render() {


    let title = '';
    let content = '';
    let date = ''
    let start_time = ''
    let end_time = ''
    let eventBackgroundPic = "";
    let location = '';
    let month = "";
    let day = "";
    let invited = [];

    return (
      <div className = "socialEventInfoContainer">
        <div className = "eventInfoView">

        <div className = "topSectContainier">

          {
            eventBackgroundPic === "" ?
            <div
            className = 'eventBackgroundPic'>
            <div className = "pictureFrame">
                <PictureOutlined />
                <br />
                <span> No background </span>
            </div>
            </div>

            :

            <div
            className = 'eventBackgroundWPic'>
            {/*
              <div className ="pictureFrame">

              <PictureOutlined />
              <br />
              <span> No background </span>
                </div>
              */}
              <img
              src = {'http://127.0.0.1:8000'+eventBackgroundPic}
              className = 'eventBackgroundImg'
               />
            </div>


          }

          <div className = "eventTopSide">
            <div
              className = "dateCircle"
              style = {{
                backgroundColor: "blue"
              }}
            >
            <div
            style = {{
              color: "white",
              fontSize: "20px"
            }}
            clasName = "month" > {month}</div>
            <div className = "day"> {day} </div>
            </div>

            <div className = 'eventTitle'> {this.capitalize(title)} </div>
            <div className = "eventDate"> {date} </div>
            <div className = "eventTime">{start_time}-{end_time}</div>

            <div className = "eventHost">
              <Avatar
              // src = {"http://127.0.0.1:8000"+host.profile_picture}
              />
              <span> Andy Le </span>
            </div>

            <div className = "invitedNum"> {invited.length} Invited </div>

          </div>

          </div>

          <div className = "eventInfo">
            <div className = "aboutEvent"> About the Event </div>
            {
              content === "" ?

              <div className = "contentEventEmpty"> No info... </div>
              :
              <div className = "contentEvent"> {content} </div>


            }

            <div className = "locationEventWord"> Location</div>
            {
              location === "" ?
              <div className = "contentEventEmpty"> No info... </div>
              :
              <div> {this.capitalize(location)} </div>
            }

            <div className = "eventPeopleWord"> People </div>


          </div>

        </div>
      </div>

    )
  }

}

export default SocialEventInfo;
