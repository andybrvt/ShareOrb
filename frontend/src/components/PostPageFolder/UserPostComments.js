import React from 'react';
import './UserPostPage.css';
import { Comment, Tooltip, List, Avatar, Input, Form, Button } from 'antd';
import UserPostPageWebSocketInstance from '../../UserPostPageWebsocket'
import * as dateFns from 'date-fns';


class UserPostComments extends React.Component{

  state = {
    comment: ''
  }


  capitalize (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }





  heightCal = (captionLen) => {
    // This function is used to calculate the height of the comments by the
    // length of the caption

    const base = 75.5

    const final = base - (captionLen/30)
    const finalStr = final+"%"

    return finalStr;
  }

  renderTimestamp = timestamp =>{
    console.log(timestamp)
    let prefix = '';
    console.log(new Date().getTime())
    console.log(new Date(timestamp).getTime())
    const timeDiff = Math.round((new Date().getTime() - new Date(timestamp).getTime())/60000)
    console.log(timeDiff)
    if (timeDiff < 1 ) {
      prefix = `now`;
    } else if (timeDiff < 60 && timeDiff >= 1 ) {
      prefix = `${timeDiff}m`;
    }else if (timeDiff < 24*60 && timeDiff > 60) {
      prefix = `${Math.round(timeDiff/60)}h`;
    } else if (timeDiff < 31*24*60 && timeDiff > 24*60) {
      prefix = `${Math.round(timeDiff/(60*24))}d`;
    } else {
        prefix = `${dateFns.format(new Date(timestamp), "MMMM d, yyyy")}`;
    }

    return prefix;
  }

  nameShortener = (firstName, lastName) => {
    let name = firstName+ " " +lastName
    if(name.length > 30){
      name = name.substring(0,30)+'...'
    }

    return name
  }


  render(){

    let caption = ""
    if (this.props.caption){
      caption = this.props.caption
    }
    console.log(this.props)
    return(
      <div className ='socialCommentBoxBox'>
        <div className = 'socialCommentBox'>
        <List
          className="comment-list"
          itemLayout="horizontal"
          dataSource={this.props.items}
          renderItem={item => (

              <div className = 'socialCommentItem'>
                <div className = "socialCommentDate">
                  {this.renderTimestamp(new Date(item.created_on))}
                </div>

                <div className = "socialCommentAvatarSect">
                  <Avatar size = {25} src = {`${global.IMAGE_ENDPOINT}`+item.commentUser.profile_picture} />
                </div>

                <div className = "socialCommentTextSect">
                  <div className = "socialCommentNameTime">
                    <div className = "socialCommentUsername">
                      <b>
                        {this.nameShortener(this.capitalize(item.commentUser.first_name), this.capitalize(item.commentUser.last_name))}
                      </b>
                    </div>
                  </div>


                  <div className = "socialCommentBody">
                    <div className = "socialCommentText">
                        {item.body}
                    </div>

                  </div>

                </div>
                

              </div>
          )}
        />

        </div>

      </div>
    )
  }
}

export default UserPostComments;
