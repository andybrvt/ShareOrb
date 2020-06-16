import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { connect } from 'react-redux';
import BaseRouter from './routes';
import 'antd/dist/antd.css';
import * as authActions from './store/actions/auth';
import WebSocketInstance from './websocket';
import NotificationWebSocketInstance from './notificationWebsocket';
import CalendarEventWebSocketInstance from './calendarEventWebsocket';
import CustomLayout from './containers/Layouts/Layouts';
import AddChatModal from './containers/Popup';
import * as navActions from './store/actions/nav';
import * as messageActions from './store/actions/messages';
import * as notificationsActions from './store/actions/notifications';
import * as calendarActions from './store/actions/calendars';
import SideMenu from './components/SideMenu/SideMenu.js';

class App extends Component {
//the map state to props allows us to get the state and then
//turn it to props then call those props in Layouts.js
  componentDidMount() {
  //everythign this is run it will do a try auto signup, it will give
  //App.js this method from the store
    this.props.onTryAutoSignup();
    // NotificationWebSocketInstance.connect(this.props.username)


  }

  componentWillReceiveProps(newProps){
    // NotificationWebSocketInstance.connect(newProps.username)
  }


  constructor(props) {
    super(props);
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
      this.props.addEvent.bind(this)
    )


  }

  render() {
    return (
      <div>
        <Router>

          <SideMenu>
            <CustomLayout {...this.props}>
                <BaseRouter   {...this.props}/>
            </CustomLayout>


          </SideMenu>



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
    addEvent: events => dispatch(calendarActions.addEvent(events))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
