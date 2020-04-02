import React from 'react';
import './Chat.css';
import Sidepanel from './ChatComponents/Sidepanel';
import TopPanel from './ChatComponents/Toppanel';
import WebSocketInstance from '../websocket';
import { authAxios } from '../components/util';
import axios from 'axios';

class Chat extends React.Component{
  // the add callbacks basically calls the commands

    constructor(props){
      super(props)
      this.state= {
        messages: [],
        friendList:[]
      }

      // these will give the commands the function --> this is similar to the command
      // array in the consumer.py
      this.waitForSocketConnection(()=> {
        WebSocketInstance.addCallbacks(
          this.setMessages.bind(this),
          this.addMessages.bind(this));
        WebSocketInstance.fetchMessages(this.props.username)
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
      console.log(messages)
      this.setState({
        messages: messages.reverse()
      });
    }

    componentWillReceiveProps(newProps) {
      console.log(newProps)
      if(newProps.isAuthenticated){
        authAxios.get('http://127.0.0.1:8000/userprofile/current-user')
          .then(res=> {
            console.log(res.data)
            this.setState({
              friendList:res.data.friends,
           });
          });
      }
    }

    // Whenever you want to add anything you have to do it in an object format
    // have to name the from
    // you would then set the message state back to empty
    sendMessageHandler = e => {
      e.preventDefault();
      const messageObject = {
        from: 'admin',
        content: this.state.message
      }
      WebSocketInstance.newChatMessage(messageObject);
      this.setState({
        message: ''
      })
      console.log(this.state)
    }

    messageChangeHandler = event => {
      this.setState({
        message: event.target.value
      })
    }


    // return a list of list item which will render in the unorder friendList
    // basically run the previous messages
    // this one is linked to the backend websocket and renders the messages
    renderTimestamp = timestamp =>{
      let prefix = '';
      const timeDiff = Math.round((new Date().getTime() - new Date(timestamp).getTime())/60000)
      if (timeDiff <1 ) {
        prefix = `Just now`;
      } else if (timeDiff < 60 && timeDiff >1 ) {
        prefix = `${timeDiff} minutes ago`;
      }else if (timeDiff < 24*60 && timeDiff > 60) {
        prefix = `${Math.round(timeDiff/60)} hours ago`;
      } else if (timeDiff < 31*24*60 && timeDiff > 24*60) {
        prefix = `${Math.round(timeDiff/60*24)} days ago`;
      } else {
          prefix = `${new Date(timestamp)}`;
      }

      return prefix;
    }

    renderMessages = (messages) => {
      const currentUser = 'admin';
      return messages.map(message =>(
        <li
          key = {message.id}
          className= {message.author === currentUser ? 'sent' : 'replies'}>
          <img src = 'http://emilcarlsson.se/assets/mikeross.png' />
          <p>
            {message.content}
            <br />
            <small>
            { this.renderTimestamp(message.timestamp)}
            </small>
          </p>


        </li>
      ));
    }

    scrollToBottom = () => {
      this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    }

    componentDidMount() {
      this.scrollToBottom();
    }

    componentDidUpdate() {
      this.scrollToBottom();
    }

    render(){
      // console.log(this.props.currentUser)
      console.log(this.state)
      console.log(this.props)
      const messages = this.state.messages;
      return(
        <div id="frame">
          <Sidepanel {...this.props} {...this.state}/>
         <div className="content">
          <TopPanel />
            <div className="messages">
              <ul id="chat-log">
                {
                    messages &&
                    this.renderMessages(messages)
                }
                <div style={{ float:"left", clear: "both" }}
                    ref={(el) => { this.messagesEnd = el; }}>
               </div>
              </ul>
            </div>
            <div className="message-input">
            <form onSubmit = {this.sendMessageHandler}>
                <div className="wrap">
                <input
                 onChange = {this.messageChangeHandler}
                 value = {this.state.message}
                 id="chat-message-input"
                 type="text"
                 placeholder="Write your message..." />
                <i className="fa fa-paperclip attachment" aria-hidden="true"></i>
                <button id="chat-message-submit" className="submit">
                  <i className="fa fa-paper-plane" aria-hidden="true"></i>
                </button>
                </div>
              </form>
            </div>
          </div>
      </div>
      )
    }
}

export default Chat;
