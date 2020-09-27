import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { connect } from 'react-redux';
import BaseRouter from './routes';
import LoginRouter from './LoginRoutes.js'
import 'antd/dist/antd.css';
import * as authActions from './store/actions/auth';
import WebSocketInstance from './websocket';
import NotificationWebSocketInstance from './notificationWebsocket';
import CalendarEventWebSocketInstance from './calendarEventWebsocket';
import WebSocketPostsInstance from './postWebsocket';
import ExploreWebSocketInstance from './exploreWebsocket';
import AddChatModal from './containers/Popup';
import * as navActions from './store/actions/nav';
import * as messageActions from './store/actions/messages';
import * as notificationsActions from './store/actions/notifications';
import * as calendarActions from './store/actions/calendars';
import * as newsfeedActions from './store/actions/newsfeed';
import * as exploreActions from './store/actions/explore';
import * as socialActions from './store/actions/socialCalendar';

class App extends Component {

  constructor(props) {
    super(props);
    // this.initialiseExplore()
    WebSocketInstance.addCallbacks(
      this.props.setMessages.bind(this),
      this.props.addMessage.bind(this)
    );
    NotificationWebSocketInstance.addCallbacks(
      this.props.setNotifications.bind(this),
      this.props.newNotification.bind(this)
    )
    // For the calendarEventWebosocket you just need to have one
    // action (the addEvent) because the data for the each person is
    // different so you just want to add it thats all
    CalendarEventWebSocketInstance.addCallbacks(
      this.props.addEvent.bind(this),
      this.props.acceptEventShare.bind(this),
      this.props.declineElseEventShare.bind(this),
      this.props.declineEventShare.bind(this)
    )

    WebSocketPostsInstance.addCallbacks(
      this.props.setPosts.bind(this),
      this.props.addLike.bind(this),
      this.props.unaddLike.bind(this),
      this.props.addComment.bind(this),
      this.props.deletePost.bind(this)
    )

    ExploreWebSocketInstance.addCallbacks(
      this.props.loadProfiles.bind(this),
      this.props.addFollower.bind(this),
      this.props.addFollowing.bind(this),
      this.props.loadCurProfile.bind(this),
      this.props.addUnFollowing.bind(this),
      this.props.addUnFollower.bind(this),
      this.props.addSocialLikeOld.bind(this),
      this.props.addSocialLikeOldM.bind(this),
      this.props.addSocialUnLike.bind(this),
      this.props.addSocialUnLikeM.bind(this),
      this.props.addSocialCommentOld.bind(this),
      this.props.addSocialCommentOldM.bind(this),
      this.props.addSocialEventOld.bind(this),
      this.props.addSocialCalCellNew.bind(this),
      this.props.addSocialCalCellNewM.bind(this),
      this.props.addUserSocialEvent.bind(this),
      this.props.addUserSocialEventM.bind(this)
    )
  }

//the map state to props allows us to get the state and then
//turn it to props then call those props in Layouts.js
  componentDidMount() {
  //everythign this is run it will do a try auto signup, it will give
  //App.js this method from the store
    this.props.onTryAutoSignup();
    // NotificationWebSocketInstance.connect(this.props.username)
    ExploreWebSocketInstance.connect(this.props.username)


  }

  componentWillReceiveProps(newProps){
    // NotificationWebSocketInstance.connect(newProps.username)
    if (this.props.username !== newProps.username){
      ExploreWebSocketInstance.disconnect()
      ExploreWebSocketInstance.connect(newProps.username)
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
    addMessage: message => dispatch(messageActions.addMessage(message)),
    setMessages: messages => dispatch(messageActions.setMessages(messages)),
    setNotifications: notifications => dispatch(notificationsActions.setNotifications(notifications)),
    newNotification: notification => dispatch(notificationsActions.newNotification(notification)),
    addEvent: events => dispatch(calendarActions.addEvent(events)),
    acceptEventShare: acceptShareObj => dispatch(calendarActions.acceptEventShare(acceptShareObj)),
    declineElseEventShare: declineShareObj => dispatch(calendarActions.declineElseEventShare(declineShareObj)),
    declineEventShare: declineShareObj => dispatch(calendarActions.declineEventShare(declineShareObj)),
    setPosts: likes => dispatch(newsfeedActions.loadPosts(likes)),
    addLike: like => dispatch(newsfeedActions.addPostLike(like)),
    unaddLike: unlike => dispatch(newsfeedActions.unaddPostLike(unlike)),
    addComment: comment => dispatch(newsfeedActions.addPostComment(comment)),
    deletePost: postId => dispatch(newsfeedActions.deletePost(postId)),
    loadProfiles: profiles => dispatch(exploreActions.loadProfiles(profiles)),
    addFollower: followObject => dispatch(exploreActions.addFollower(followObject)),
    addFollowing: followObject => dispatch(exploreActions.addFollowing(followObject)),
    loadCurProfile: curProfile => dispatch(exploreActions.loadCurProfile(curProfile)),
    addUnFollower: followObject => dispatch(exploreActions.addUnFollower(followObject)),
    addUnFollowing: followObject => dispatch(exploreActions.addUnFollowing(followObject)),
    addSocialLikeOld: exploreObj => dispatch(exploreActions.addSocialLikeOld(exploreObj)),
    addSocialLikeOldM: socialObj => dispatch(socialActions.addSocialLikeOldM(socialObj)),
    addSocialUnLike: exploreObj => dispatch(exploreActions.addSocialUnLike(exploreObj)),
    addSocialUnLikeM: socialObj => dispatch(socialActions.addSocialUnLikeM(socialObj)),
    addSocialCommentOld: exploreObj => dispatch(exploreActions.addSocialCommentOld(exploreObj)),
    addSocialCommentOldM: socialObj => dispatch(socialActions.addSocialCommentOldM(socialObj)),
    addSocialEventOld: exploreObj => dispatch(exploreActions.addSocialEventOld(exploreObj)),
    addSocialCalCellNew: exploreObj => dispatch(exploreActions.addSocialCalCellNew(exploreObj)),
    addSocialCalCellNewM: socialObj => dispatch(socialActions.addSocialCalCellNew(socialObj)),
    addUserSocialEvent: exploreObj => dispatch(exploreActions.addUserSocialEvent(exploreObj)),
    addUserSocialEventM: socialObj => dispatch(socialActions.addUserSocialEventM(socialObj))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
