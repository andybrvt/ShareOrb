import React from 'react';
import moment from 'moment';
import { Comment, Tooltip, List, Avatar, Input, Form, Button } from 'antd';
import { SendOutlined  } from '@ant-design/icons';
import ExploreWebSocketInstance from '../../exploreWebsocket';
import SocialCalCellPageWebSocketInstance from '../../socialCalCellWebsocket';
import './SocialCalCSS/SocialCellPage.css';
import * as dateFns from 'date-fns';


const { TextArea } = Input;

class SocialComments extends React.Component{

  state = {
    comment: ''
  }

  capitalize (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  handleSubmit = e => {
    console.log('comment submit')
    console.log(this.state.comment)
    if (this.state.comment !== ''){
      SocialCalCellPageWebSocketInstance.sendSocialCalCellComment(
        this.props.currentDate,
        this.props.curUser,
        this.state.comment,
        this.props.owner
      )
      this.setState({comment: ''})
    }

  }

  handleChange = e =>{
    console.log(e.target.value)
    this.setState({
      comment: e.target.value
    })

  }

  componentWillReceiveProps = (newProps) => {
    console.log(newProps)
  }

  renderTimestamp = timestamp =>{
    console.log(timestamp)
    let prefix = '';
    console.log(new Date().getTime())
    console.log(new Date(timestamp).getTime())
    const timeDiff = Math.round((new Date().getTime() - new Date(timestamp).getTime())/60000)
    console.log(timeDiff)
    if (timeDiff < 1 ) {
      prefix = `Just now`;
    } else if (timeDiff < 60 && timeDiff >= 1 ) {
      prefix = `${timeDiff} minutes ago`;
    }else if (timeDiff < 24*60 && timeDiff > 60) {
      prefix = `${Math.round(timeDiff/60)} hours ago`;
    } else if (timeDiff < 31*24*60 && timeDiff > 24*60) {
      prefix = `${Math.round(timeDiff/(60*24))} days ago`;
    } else {
        prefix = `${dateFns.format(new Date(timestamp), "MMMM d, yyyy")}`;
    }

    return prefix;
  }


  render() {
    console.log(this.props)
    console.log(this.state)

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
        <Form className = "socialInputForm">
          <Input
          className= 'socialBoxInput'
          onChange ={this.handleChange}
          value = {this.state.comment}
          // bordered = {false}
          placeholder = 'Write a comment'
          name = 'socialComment'
          onPressEnter = {this.handleSubmit}
          // rows = {1}
           />

          <button
          // type = 'submit'
          // onClick = {this.handleSubmit}
          style = {{display: 'none'}}
          />
        </Form>
      </div>
      </div>

    </div>
    )
  }
}

export default SocialComments;
