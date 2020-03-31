import React from 'react';
import './Containers.css';
import Sidepanel from './Sidepanel/Sidepanel'
import WebSocketInstance from '../websocket';

class Chat extends React.Component{
  // the add callbacks basically calls the commands

    constructor(props){
      super(props)
      this.state= {}

      // these will give the commands the function --> this is similar to the command
      // array in the consumer.py
      this.waitForSocketConnection(()=> {
        WebSocketInstance.addCallbacks(
          this.setMessages.bind(this),
          this.addMessages.bind(this));
        WebSocketInstance.fetchMessages(this.props.currentUser)
      })
    }
// Check the state of the socket, and if it is equal to one shits good
    waitForSocketConnection (callback) {
      const component = this;
      setTimeout(
        function(){
          if (WebSocketInstance.state() === 1){
            console.log('connection is secure');
            callback();
            return;
          } else{
              console.log('waiting for connection...')
              component.waitForSocketConnection(callback);
          }
        }, 100)

    }

    // the second parameter of that is what you will add in
    addMessages(message){
      this.setState({
        messages: [...this.state.messages, message]
      })
    }

// this to have all the messages you have been typing back and forth
    setMessages(messages) {
      this.setState({
        messages: messages.reverse()
      });
    }


    // return a list of list item which will render in the unorder friendList
    // basically run the previous messages
    renderMessages = (messages) => {
      const currentUser = 'admin';
      return messages.map(message =>(
        <li
          key = {message.id}
          className= {message.author === currentUser ? 'sent' : 'replies'}>
          <img src = 'http://emilcarlsson.se/assets/mikeross.png' />
          <p>
            {message.content}
          </p>


        </li>
      ));
    }

    render(){
      const messages = this.state.messages;
      return(
        <div id="frame">
          <Sidepanel />
          <div className="content">
            <div className="contact-profile">
              <img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="" />
              <p>username</p>
              <div className="social-media">
                <i className="fa fa-facebook" aria-hidden="true"></i>
                <i className="fa fa-twitter" aria-hidden="true"></i>
                <i className="fa fa-instagram" aria-hidden="true"></i>
              </div>
            </div>
            <div className="messages">
              <ul id="chat-log">
                {
                    messages &&
                    this.renderMessages(messages)
                }
              </ul>
            </div>
            <div className="message-input">
              <div className="wrap">
              <input id="chat-message-input" type="text" placeholder="Write your message..." />
              <i className="fa fa-paperclip attachment" aria-hidden="true"></i>
              <button id="chat-message-submit" className="submit">
                <i className="fa fa-paper-plane" aria-hidden="true"></i>
              </button>
              </div>
            </div>
          </div>
      </div>
      )
    }
}

export default Chat;
