import React from 'react';
import NotficationWebSocketInstance from '../notificationWebsocket';
import { authAxios } from '../components/util';
import axios from 'axios';


class Notifications extends React.Component{
  state = {
    notifications: []
  }

// remember that you can add the call backs in using redux
// you like the functions in the notificationWebsocket to the notificaiton.js through callbacks and bind
// baically the information will be called to the states
  initialiseNotification(){
    this.waitForSocketConnection(() => {
      NotficationWebSocketInstance.addCallbacks(
          this.set
      )
    })
  }

  waitForSocketConnection (callback) {
    const component = this;
    setTimeout(
      function(){
        if (WebSocketNotifications.state() === 1){
          console.log('connection is secure');
          callback();
          return;
        } else{
            console.log('waiting for connection...')
            component.waitForSocketConnection(callback);
        }
      }, 100)

  }

  setNotification(notificaitons) {
        this.setState({
          notifications: notifications
        });
      }




}

// this is to create the notficaiton html
function createNotification(notification) {
    let single = `<li class="list">
                       <a href="#" title="">
                            <img src="images/resources/thumb-1.jpg" alt="">
                            <div class="mesg-meta">
                                <span>${notification.actor.username} ${notification.verb}</span>
                                <button class="btn btn-primary btn-sm accept-request" onclick="accept(this)" data-friend="${notification.actor.username}">Accept</button>
                                <button class="btn btn-danger btn-sm">Reject</button>
                                <br>
                                <i>2 min ago</i>
                            </div>
                       </a>
                   </li>`;
    $('#friend-menu').prepend(single);
}

// This is where the data sent from the Websocket is recieved
