import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import BaseRouter from './routes';
import LoginRouter from './LoginRoutes.js'
import 'antd/dist/antd.css';
import * as authActions from './store/actions/auth';
import WebSocketInstance from './websocket';
import NotificationWebSocketInstance from './notificationWebsocket';
import CalendarEventWebSocketInstance from './calendarEventWebsocket';
import WebSocketPostsInstance from './postWebsocket';
import WebSocketSocialNewsfeedInstance from './socialNewsfeedWebsocket';
import ExploreWebSocketInstance from './exploreWebsocket';
import EventPageWebSocketInstance from './eventPageWebsocket';
import SocialEventPageWebSocketInstance from './socialEventPageWebsocket';
import SocialCalCellPageWebSocketInstance from './socialCalCellWebsocket';
import UserPostPageWebSocketInstance from './UserPostPageWebsocket';
import NewChatWebSocketInstance from './newChatWebsocket';
import ChatSidePanelWebSocketInstance from './newChatSidePanelWebsocket';
import AddChatModal from './containers/Popup';
import * as navActions from './store/actions/nav';
import * as messageActions from './store/actions/messages';
import * as notificationsActions from './store/actions/notifications';
import * as calendarActions from './store/actions/calendars';
import * as newsfeedActions from './store/actions/newsfeed';
import * as exploreActions from './store/actions/explore';
import * as socialActions from './store/actions/socialCalendar';
import * as socialNewsfeedActions from './store/actions/socialNewsfeed';

class App extends Component {

  constructor(props) {
    super(props);
    // this.initialiseExplore()
    // this.initialisePost()

    this.initialiseSocialNewsfeed()

    // this.initialiseNotification()


    // Just these two to activate ------------------
    // this.initialiseChats()
    // ---------------------------------------------



    // DELETE THIS WEBSOCEKT INSTANC EHERE ONCE THE NEW CHAT STARTS WORKING WELL
    WebSocketInstance.addCallbacks(
      this.props.setMessages.bind(this),
      this.props.addMessage.bind(this)
    );




    NotificationWebSocketInstance.addCallbacks(
      this.props.setNotifications.bind(this),
      this.props.newNotification.bind(this),
      this.props.updateRequestList.bind(this),
      this.props.newUpRequestList.bind(this),
      this.props.authAddFollower.bind(this),
      this.props.authUpdateFollowers.bind(this),
      this.props.addOneNotificationSeen.bind(this)
    )
    // For the calendarEventWebosocket you just need to have one
    // action (the addEvent) because the data for the each person is
    // different so you just want to add it thats all
    CalendarEventWebSocketInstance.addCallbacks(
      this.props.addEvent.bind(this),
      this.props.acceptEventShare.bind(this),
      this.props.declineElseEventShare.bind(this),
      this.props.declineEventShare.bind(this),
      this.props.newNotification.bind(this),
      this.props.addOneNotificationSeen.bind(this)

    )

    WebSocketPostsInstance.addCallbacks(
      this.props.setPosts.bind(this),
      this.props.addLike.bind(this),
      this.props.unaddLike.bind(this),

      // DELETE THIS LATER
      this.props.addComment.bind(this),


      this.props.deletePost.bind(this),
      this.props.addPost.bind(this)
    )


    WebSocketSocialNewsfeedInstance.addCallbacks(
      this.props.id,
      this.props.loadSocialPosts.bind(this),
      this.props.addSocialPostLike.bind(this),
      this.props.loadCurSocialCell.bind(this),
      this.props.addFirstSocialCellPost.bind(this),
      this.props.updateSocialCellPost.bind(this)
    )




    ExploreWebSocketInstance.addCallbacks(
      this.props.loadProfile.bind(this),
      this.props.addFollowerUnfollower.bind(this),
      this.props.addSocialEventJoinLeave.bind(this),
      this.props.addSocialCell.bind(this),
      this.props.addSocialEventJoinLeavePage.bind(this),
      this.props.editProfileAuth.bind(this),
      this.props.addSocialCellCoverPic.bind(this),
      this.props.sendRequested.bind(this),
      this.props.addFollowing.bind(this)
    )

    EventPageWebSocketInstance.addCallbacks(
      this.props.loadEventInfo.bind(this),
      this.props.sendEventMessage.bind(this),
      this.props.updateEventPage.bind(this),
      this.props.updateSeenEventMessage.bind(this),
      this.props.updateGoingNotList.bind(this)
    )

    SocialEventPageWebSocketInstance.addCallbacks(
      this.props.loadSocialEventInfo.bind(this),
      this.props.sendSocialEventMessage.bind(this),
      this.props.updateSocialEventPage.bind(this),
      this.props.sendDeleteSocialEventNoti.bind(this),
      this.props.sendSocialEventInvite.bind(this)
    )

    SocialCalCellPageWebSocketInstance.addCallbacks(
      this.props.fetchSocialCalCellPage.bind(this),
      this.props.sendSocialCalCellLikeUnlike.bind(this),
      this.props.sendSocialCalCellComment.bind(this),
      this.props.addSocialEventJoinLeaveM.bind(this),
      this.props.deleteSocialCellItem.bind(this),
      this.props.addSocialDayCaption.bind(this),
      this.props.sendSocialCalCellCommentLikeUnlike.bind(this),
    )

    UserPostPageWebSocketInstance.addCallbacks(
      this.props.loadPost.bind(this),
      this.props.sendUserPostLikeUnlike.bind(this),
      // this.props.sendUserPostComment.bind(this),
      // this.props.sendCommentLike.bind(this),
      // this.props.sendCommentUnLike.bind(this)
    )

    NewChatWebSocketInstance.addCallbacks(
      this.props.setMessages.bind(this),
      this.props.addMessage.bind(this)

    )

    ChatSidePanelWebSocketInstance.addCallbacks(
      // These function is to set the chats in
      this.props.setChats.bind(this)
    )

  }

// You would want to render the newsfeed right when you get it and it wont
// keep refreshing everytime you go onto the newsfeed bc that would be hella
// annoying

  initialisePost(){
    // This will use to retrive the posts right when you log in
    // so that whne you go back to the page it doesnt keep  reloading
    this.waitForPostSocketConnection(() => {
      WebSocketPostsInstance.fetchPosts(this.props.id)
    })

    WebSocketPostsInstance.connect()

  }

  waitForPostSocketConnection(callback){
    const component = this
    setTimeout(
      function(){
        if(WebSocketPostsInstance.state() === 1){
          callback()
          return;
        } else {
          component.waitForPostSocketConnection(callback);
        }
      }, 100)
  }

  initialiseSocialNewsfeed(){
    // use to initialize the social newsfeed
    this.waitForSocialNewsfeedSocketConnection(() => {
      // You will fetch the social cotnent type here
      WebSocketSocialNewsfeedInstance.fetchSocialPost(this.props.id)
    })
    WebSocketSocialNewsfeedInstance.connect()

  }

  waitForSocialNewsfeedSocketConnection(callback){
    const component = this
    setTimeout(
      function(){
        if(WebSocketSocialNewsfeedInstance.state() === 1){
          callback()
          return;
        } else {
          component.waitForSocialNewsfeedSocketConnection(callback);
        }
      }, 100)
  }



// So since you are gonna render the notification and chats at the
// beginning when you first login, and to get chat notifcation,
// so you want to connect to chats channel and notificaiton websocket
// right away so that it is already connected whne you login
  initialiseChats(){
    this.waitForChatsSocketConnection(() => {
      ChatSidePanelWebSocketInstance.fetchChats(
        this.props.id
      )

    })
    ChatSidePanelWebSocketInstance.connect(this.props.id)

  }

  waitForChatsSocketConnection(callback) {
    const component = this;
    setTimeout(
      function(){

        if (ChatSidePanelWebSocketInstance.state() === 1){

          callback();
          return;
        } else{

            component.waitForChatsSocketConnection(callback);
        }
      }, 100)

  }

  initialiseNotification(){
    this.waitForNotificationSocketConnection(() => {
      NotificationWebSocketInstance.fetchFriendRequests(
        this.props.id
      )
    })
    NotificationWebSocketInstance.connect(this.props.id)

  }

  waitForNotificationSocketConnection (callback) {
    const component = this;
    setTimeout(
      function(){

        if (NotificationWebSocketInstance.state() === 1){

          callback();
          return;
        } else{

            component.waitForNotificationSocketConnection(callback);
        }
      }, 100)

  }



//the map state to props allows us to get the state and then
//turn it to props then call those props in Layouts.js
  componentDidMount() {
  //everythign this is run it will do a try auto signup, it will give
  //App.js this method from the store

    this.props.onTryAutoSignup();

  }

  componentWillReceiveProps(newProps){
    if(newProps.isAuthenticated){



      // Put this back later -------------------------------------

      // this.props.grabUserCredentials()
      // if(parseInt(this.props.id) !== parseInt(newProps.id)){
      //
      //   WebSocketSocialNewsfeedInstance.addCallbacks(
      //     newProps.id,
      //     this.props.loadSocialPosts.bind(this),
      //     this.props.addSocialPostLike.bind(this),
      //     this.props.loadCurSocialCell.bind(this),
      //     this.props.addFirstSocialCellPost.bind(this),
      //     this.props.updateSocialCellPost.bind(this)
      //   )
      //

      // ----------------------------------------------------




        // This if statement will see if a person has login and is isAuthenticated
        // and id has not change so we can connect to the right chat

        // THIS IS FOR THE OLD POST
        // WebSocketPostsInstance.disconnect()
        // this.waitForPostSocketConnection(() => {
        //   WebSocketPostsInstance.fetchPosts(newProps.id)
        // })
        //
        // WebSocketPostsInstance.connect()

        // WebSocketSocialNewsfeedInstance.disconnect()
        // this.waitForSocialNewsfeedSocketConnection(() => {
        //   // Fetch stuff here
        //   WebSocketSocialNewsfeedInstance.fetchSocialPost(newProps.id)
        //
        // })
        // WebSocketSocialNewsfeedInstance.connect()


        // Put this back later -----------------------------------------

        // ChatSidePanelWebSocketInstance.disconnect();
        // this.waitForChatsSocketConnection(() =>{
        //   ChatSidePanelWebSocketInstance.fetchChats(
        //     newProps.id
        //   )
        //
        // })
        // ChatSidePanelWebSocketInstance.connect(newProps.id)
        //
        //
        // NotificationWebSocketInstance.disconnect()
        // this.waitForNotificationSocketConnection(() => {
        //   NotificationWebSocketInstance.fetchFriendRequests(
        //     newProps.id
        //   )
        // })
        // NotificationWebSocketInstance.connect(newProps.username)
        // }
        // ------------------------------------------------------------------


    }

  }


  render() {
    return (
      <div>
        <Router>

                <BaseRouter   {...this.props}/>


        </Router>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null,
    username: state.auth.username,
    id: state.auth.id,


  }
}

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignup: () => dispatch(authActions.authCheckState()),
    grabUserCredentials: () => dispatch(authActions.grabUserCredentials()),
    addMessage: message => dispatch(messageActions.addMessage(message)),
    setMessages: (messages, curChat) => dispatch(messageActions.setMessages(messages, curChat)),
    setChats: chats => dispatch(messageActions.setChats(chats)),
    setNotifications: notifications => dispatch(notificationsActions.setNotifications(notifications)),
    newNotification: notification => dispatch(notificationsActions.newNotification(notification)),
    addOneNotificationSeen: () => dispatch(authActions.addOneNotificationSeen()),
    addEvent: events => dispatch(calendarActions.addEvent(events)),
    acceptEventShare: acceptShareObj => dispatch(calendarActions.acceptEventShare(acceptShareObj)),
    declineElseEventShare: declineShareObj => dispatch(calendarActions.declineElseEventShare(declineShareObj)),
    declineEventShare: declineShareObj => dispatch(calendarActions.declineEventShare(declineShareObj)),
    loadEventInfo: eventInfoObj => dispatch(calendarActions.loadEventInfo(eventInfoObj)),
    sendEventMessage: eventMessageObj => dispatch(calendarActions.sendEventMessage(eventMessageObj)),
    updateSeenEventMessage: seenEventObj => dispatch(calendarActions.updateSeenEventMessage(seenEventObj)),
    updateEventPage: updatedEventObj => dispatch(calendarActions.updateEventPage(updatedEventObj)),
    updateGoingNotList: goingObj => dispatch(calendarActions.updateGoingNotList(goingObj)),
    setPosts: likes => dispatch(newsfeedActions.loadPosts(likes)),
    addLike: like => dispatch(newsfeedActions.addPostLike(like)),
    unaddLike: unlike => dispatch(newsfeedActions.unaddPostLike(unlike)),

    loadSocialPosts: post => dispatch(socialNewsfeedActions.loadSocialPosts(post)),
    addSocialPostLike: postObj => dispatch(socialNewsfeedActions.addSocialPostLike(postObj)),
    loadCurSocialCell: socialCell => dispatch(socialNewsfeedActions.loadCurSocialCell(socialCell)),
    addFirstSocialCellPost: socialCell => dispatch(socialNewsfeedActions.addFirstSocialCellPost(socialCell)),
    updateSocialCellPost: socialCell => dispatch(socialNewsfeedActions.updateSocialCellPost(socialCell)),

    updateRequestList: newRequest => dispatch(authActions.updateRequestList(newRequest)),
    newUpRequestList: requestList => dispatch(authActions.newUpRequestList(requestList)),
    authAddFollower: followerObj => dispatch(authActions.authAddFollower(followerObj)),
    authUpdateFollowers: followerList => dispatch(authActions.authUpdateFollowers(followerList)),

    // DELETE THIS LATER
    addComment: comment => dispatch(newsfeedActions.addPostComment(comment)),


    deletePost: postList => dispatch(newsfeedActions.deletePost(postList)),
    addPost: postObj => dispatch(newsfeedActions.addPost(postObj)),


    loadPost: postObj => dispatch(newsfeedActions.loadPost(postObj)),
    sendUserPostLikeUnlike: likeList => dispatch(newsfeedActions.sendUserPostLikeUnlike(likeList)),
    sendUserPostComment: commentObj => dispatch(newsfeedActions.sendUserPostComment(commentObj)),

    loadProfile: profile => dispatch(exploreActions.loadProfile(profile)),
    addFollowerUnfollower: followObject => dispatch(exploreActions.addFollowerUnfollower(followObject)),
    addSocialEventJoinLeave: (socialEventList, cellId) => dispatch(exploreActions.addSocialEventJoinLeave(socialEventList, cellId)),
    addSocialEventJoinLeavePage: (socialEventList) => dispatch(exploreActions.addSocialEventJoinLeavePage(socialEventList)),
    addSocialCell: (newSocialCellObj) => dispatch(exploreActions.addSocialCell(newSocialCellObj)),
    addSocialCellCoverPic: (coverPicture, cellId) => dispatch(exploreActions.addSocialCellCoverPic(coverPicture, cellId)),
    sendRequested: (requestedList) => dispatch(exploreActions.sendRequested(requestedList)),
    editProfileAuth: (editProfileObj) => dispatch(authActions.editProfileAuth(editProfileObj)),
    addFollowing: (followingList) => dispatch(exploreActions.addFollowing(followingList)),


    loadSocialEventInfo: socialEventInfoObj => dispatch(socialActions.loadSocialEventInfo(socialEventInfoObj)),
    sendSocialEventMessage: socialEventMessageObj => dispatch(socialActions.sendSocialEventMessage(socialEventMessageObj)),
    updateSocialEventPage: updatedSocialEvent => dispatch(socialActions.updateSocialEventPage(updatedSocialEvent)),
    sendDeleteSocialEventNoti: () => dispatch(socialActions.sendDeleteSocialEventNoti()),
    fetchSocialCalCellPage: (socialCalCellObj) => dispatch(socialActions.fetchSocialCalCellPage(socialCalCellObj)),
    sendSocialCalCellLikeUnlike: (socialCalCellLikeObj) => dispatch(socialActions.sendSocialCalCellLikeUnlike(socialCalCellLikeObj)),
    sendSocialCalCellComment: (socialCalCellCommentObj) => dispatch(socialActions.sendSocialCalCellComment(socialCalCellCommentObj)),
    sendSocialCalCellCommentLikeUnlike: (socialCalCellCommentObj) => dispatch(socialActions.sendSocialCalCellCommentLikeUnlike(socialCalCellCommentObj)),
    deleteSocialCellItem: (socialItemList) => dispatch(socialActions.deleteSocialCellItem(socialItemList)),
    addSocialEventJoinLeaveM: (socialEventList) => dispatch(socialActions.addSocialEventJoinLeaveM(socialEventList)),
    addSocialDayCaption: (socialDayCaption) => dispatch(socialActions.addSocialDayCaption(socialDayCaption)),
    sendSocialEventInvite: (inviteList) => dispatch(socialActions.sendSocialEventInvite(inviteList)),

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
