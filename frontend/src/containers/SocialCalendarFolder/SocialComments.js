import React from 'react';
import moment from 'moment';
import { Comment, Tooltip, List, Divider, Avatar, Input, Form, Button, Empty} from 'antd';
import { SendOutlined  } from '@ant-design/icons';
import ExploreWebSocketInstance from '../../exploreWebsocket';
import SocialCalCellPageWebSocketInstance from '../../socialCalCellWebsocket';
import './SocialCalCSS/SocialCellPage.css';
import * as dateFns from 'date-fns';
import {Link, withRouter} from 'react-router-dom';
const { TextArea } = Input;

class SocialComments extends React.Component{

  state = {
    comment: ''
  }

  capitalize (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  // handleSubmit = e => {
  //   console.log('comment submit')
  //   console.log(this.state.comment)
  //   if (this.state.comment !== ''){
  //     SocialCalCellPageWebSocketInstance.sendSocialCalCellComment(
  //       this.props.currentDate,
  //       this.props.curUser,
  //       this.state.comment,
  //       this.props.owner
  //     )
  //     this.setState({comment: ''})
  //   }
  //
  // }


  nameShortener = (firstName, lastName) => {
    let name = firstName+ " " +lastName
    if(name.length > 30){
      name = name.substring(0,30)+'...'
    }

    return name
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
      prefix = `${timeDiff} min`;
    }else if (timeDiff < 24*60 && timeDiff > 60) {
      prefix = `${Math.round(timeDiff/60)}h`;
    } else if (timeDiff < 31*24*60 && timeDiff > 24*60) {
      prefix = `${Math.round(timeDiff/(60*24))} days`;
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
        style={{marginLeft:'5px', marginTop:'5px', marginBottom:'10px' }}
        locale={{emptyText:<span/>}}
        className="comment-list"
        itemLayout="horizontal"
        dataSource={this.props.items}
        renderItem={item => (

          <div class="previewCommentMain">
            <div class="previewCommentLeft">
              <div className = "newsFeedCommentAvatarSect">
                <Link to={"/explore/"+item.commentUser.username} >
                  <Avatar
                    size = {30} src = {`${global.IMAGE_ENDPOINT}`+item.commentUser.profile_picture} />
                </Link>
              </div>

            </div>
            <div class="previewCommentRight">
              <div className = 'newsFeedCommentItem'>

              <div className = 'newsFeedCommentTextSect'>
                <div className = "newsFeedCommentNameTime">


                    <div className = 'newsFeedCommentName'>
                      <span class="boldedText">
                          {this.nameShortener(this.capitalize(item.commentUser.first_name), this.capitalize(item.commentUser.last_name))}
                      </span>
                      <div className = 'newsFeedCommentDate'>
                      {this.renderTimestamp(new Date(item.created_on))}
                      </div>
                    </div>
                  </div>
                    <span class="newsfeedCommentUserName">
                      {"@"+item.commentUser.username}
                    </span>


                <div className = "newsFeedCommentBody">
                  <br/>
                  <div className = 'newsFeedCommentText'>
                    {item.body}
                  </div>
                  <br/>
                  <br/>
                  <br/>
                  <div
                     onClick = {() => this.onCommentLike(this.props.match.params.postId,this.props.curId)}
                    class="LikeReplySize">
                    <i class="far fa-heart" style={{marginRight:'10px'}}></i>
                    Like
                    <Divider type="vertical"/>
                    Reply
                  </div>
                </div>


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

export default SocialComments;
