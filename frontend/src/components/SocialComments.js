import React from 'react';
import { Comment, Tooltip, List, Avatar, Input } from 'antd';
import moment from 'moment';
import './labelCSS/SocialModal.css';


const { TextArea } = Input;

class SocialComments extends React.Component{


  capitalize (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  renderTimestamp = timestamp =>{
    let prefix = '';
    const timeDiff = Math.round((new Date().getTime() - new Date(timestamp).getTime())/60000)
    if (timeDiff < 1 ) {
      prefix = `Just now`;
    } else if (timeDiff < 60 && timeDiff >1 ) {
      prefix = `${timeDiff} minutes ago`;
    }else if (timeDiff < 24*60 && timeDiff > 60) {
      prefix = `${Math.round(timeDiff/60)} hours ago`;
    } else if (timeDiff < 31*24*60 && timeDiff > 24*60) {
      prefix = `${Math.round(timeDiff/(60*24))} days ago`;
    } else {
        prefix = `${new Date(timestamp)}`;
    }

    return prefix;
  }

  render() {
    console.log(this.props)


    return (
      <div className = 'socialCommentBoxBox'>
      <div className = 'socialCommentBox'>
      <List
        className="comment-list"
        itemLayout="horizontal"
        dataSource={this.props.items}
        renderItem={item => (

            <div className = 'socialCommentItem'>

            <div className = 'socialCommentNameTag'>
              <Avatar size = {40} src = {'http://127.0.0.1:8000'+item.commentUser.profile_picture} />
              <div className = 'socialCommentName'>
                <div className = 'socialCommentUsername'>
                <b>{this.capitalize(item.commentUser.first_name)} {this.capitalize(item.commentUser.last_name)} </b>
                </div>
                <div className = 'socialCommentDate'>
                {this.renderTimestamp(new Date(item.created_on))}
                </div>


              </div>
            </div>

            <div className = 'socialCommentText'>
            {item.body}
            </div>

            </div>
        )}
      />
      <div className = 'socialCommentInput'>
        <Avatar
        size = {40}
        className ='socialPicInput'
        src = {'http://127.0.0.1:8000'+ this.props.profilePic}/>
        <TextArea
        className= 'socialBoxInput'
        // bordered = {false}
        placeholder = 'Write a comment'
        rows = {1} />
      </div>
      </div>

    </div>
    )
  }
}

export default SocialComments;
