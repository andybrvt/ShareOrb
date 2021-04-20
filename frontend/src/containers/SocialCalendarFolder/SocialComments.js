import React from 'react';
import moment from 'moment';
import { Comment, Tooltip, List, Divider, Avatar, Input, Form, Button, Empty} from 'antd';
import { SendOutlined  } from '@ant-design/icons';
import ExploreWebSocketInstance from '../../exploreWebsocket';
import SocialCalCellPageWebSocketInstance from '../../socialCalCellWebsocket';
import './SocialCalCSS/SocialCellPage.css';
import * as dateFns from 'date-fns';
import {Link, withRouter} from 'react-router-dom';
import { connect } from 'react-redux';
import * as socialCalActions  from '../../store/actions/socialCalendar';

const { TextArea } = Input;

class SocialComments extends React.Component{

  state = {
    comment: ''
  }

  componentDidMount() {
    this.initialisePage()
  }


  capitalize (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  initialisePage() {
    this.waitForSocketConnection(() =>{
      SocialCalCellPageWebSocketInstance.fetchSocialCalCellInfo(
        this.props.match.params.username,
        this.props.match.params.year,
        this.props.match.params.month,
        this.props.match.params.day
      )
    })
    if(this.props.match.params.username && this.props.match.params.year
      && this.props.match.params.month && this.props.match.params.day
    ) {
      SocialCalCellPageWebSocketInstance.connect(
        this.props.match.params.username,
        this.props.match.params.year,
        this.props.match.params.month,
        this.props.match.params.day
      )
    }

  }

  waitForSocketConnection(callback){
		// This is pretty much a recursion that tries to reconnect to the websocket
		// if it does not connect
		const component = this;
		setTimeout(
			function(){
				console.log(SocialCalCellPageWebSocketInstance.state())
				if (SocialCalCellPageWebSocketInstance.state() === 1){
					console.log('connection is secure');
					callback();
					return;
				} else {
					console.log('waiting for connection...')
					component.waitForSocketConnection(callback)
				}
			}, 100)
	}


  componentWillReceiveProps(newProps){
    if(this.props.match.params.username !== newProps.match.params.username ||
      this.props.match.params.year !== newProps.match.params.year ||
      this.props.match.params.month !== newProps.match.params.month ||
      this.props.match.params.day !== newProps.match.params.day
    ) {
      SocialCalCellPageWebSocketInstance.disconnect();
      this.waitForSocketConnection(() =>{
        SocialCalCellPageWebSocketInstance.fetchSocialCalCellInfo(
          newProps.match.params.username,
          newProps.match.params.year,
          newProps.match.params.month,
          newProps.match.params.day
        )
      })
      SocialCalCellPageWebSocketInstance.connect(
          newProps.match.params.username,
          newProps.match.params.year,
          newProps.match.params.month,
          newProps.match.params.day
      )

    }
  }

  componentWillUnmount(){
    SocialCalCellPageWebSocketInstance.disconnect();
    this.props.closeSocialCalCellPage();
  }

  onCommentLike = (socialCalCellDate, cellID, commentID, personIDLike) => {
    console.log(socialCalCellDate, cellID, commentID, personIDLike)
    SocialCalCellPageWebSocketInstance.sendCommentLike(socialCalCellDate, cellID, commentID, personIDLike)

  }

  onCommentUnlike = (personLike) => {

    console.log(personLike)
    SocialCalCellPageWebSocketInstance.sendCommentUnLike(personLike, this.props.match.params.postId)

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
    console.log(this.props.items)
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
                  <div class="LikeReplySize">
                    <span
                      onClick = {() => this.onCommentLike(
                        this.props.socialCalCellInfo.socialCaldate,
                        this.props.socialCalCellInfo.id,
                        item.id,
                        this.props.curUser,
                      )}
                      >

                      {(item.comment_people_like.includes(this.props.curId))?
                        <i class="fas fa-heart" style={{marginRight:'5px', color:'red'}}></i>

                        :
                          <i class="far fa-heart" style={{marginRight:'5px'}}></i>
                      }
                      {
                        (item.comment_like_count!=0)?
                        <span style={{marginRight:'5px'}} class="LikeReplySize">
                        {item.comment_like_count}
                        </span>
                        :''
                      }
                      Like

                    </span>

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

const mapStateToProps = state => {
  return {
    socialCalCellInfo: state.socialCal.socialCalCellInfo,
    curId: state.auth.id,
    curProfilePic: state.auth.profilePic,
    username: state.auth.username,
    likeList: state.auth.likeList,

  }
}

const mapDispatchToProps = dispatch => {
  return {
    closeSocialCalCellPage: () => dispatch(socialCalActions.closeSocialCalCellPage())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SocialComments);
