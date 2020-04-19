import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { connect } from 'react-redux';
import BaseRouter from './routes';
import 'antd/dist/antd.css';
import * as authActions from './store/actions/auth';
import WebSocketInstance from './websocket';
import NotificationWebSocketInstance from './notificationWebsocket';
import CustomLayout from './containers/Layouts';
import AddChatModal from './containers/Popup';
import * as navActions from './store/actions/nav';
import * as messageActions from './store/actions/messages';
import * as notificationsActions from './store/actions/notifications';



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
    console.log(newProps)
    console.log('right here')
    NotificationWebSocketInstance.connect(newProps.username)
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
  }

  render() {
    console.log(this.props)
    return (
      <div>
        <Router>
          <CustomLayout {...this.props}>
              <BaseRouter   {...this.props}/>
          </CustomLayout>
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
    newNotification: notification => dispatch(notificationsActions.newNotification(notification))

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
