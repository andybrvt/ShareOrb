import React from 'react';
import './Container_CSS/Chat.css';
import Sidepanel from './ChatComponents/Sidepanel';
import TopPanel from './ChatComponents/Toppanel';
import WebSocketInstance from '../websocket';
import { authAxios } from '../components/util';
import axios from 'axios';
import AddChatModal from './Popup';
import * as navActions from '../store/actions/nav'
import { connect } from 'react-redux';


class Chat extends React.Component{
  // the add callbacks basically calls the commands
  state= {
    messages: [],
    friendList:[],
    chatList:[]
  }
// the id is taken from the slug made by Contact.js
  initialiseChat() {
    this.waitForSocketConnection(()=> {
      // WebSocketInstance.addCallbacks(
      //   this.setMessages.bind(this),
      //   this.addMessages.bind(this));
      WebSocketInstance.fetchMessages(
        this.props.username,
        this.props.parameter.id
      )
    })
    WebSocketInstance.connect(this.props.parameter.id)
  }
    constructor(props){
      super(props)
      this.initialiseChat()
      // these will give the commands the function --> this is similar to the command
      // array in the consumer.py
    }


// Check the state of the socket, and if it is equal to one shits good
    waitForSocketConnection (callback) {
      const component = this;
      setTimeout(
        function(){
          console.log(WebSocketInstance.state())
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
//     addMessages(message){
//       this.setState({
//         messages: [...this.state.messages, message]
//       })
//     }
//
// // this to have all the messages you have been typing back and forth
//     setMessages(messages) {
//       this.setState({
//         messages: messages.reverse()
//       });
//     }
// the reason why two messages show up is because you intialized it once but then the props updated again
// so the intialized chat gets called mutliple times
// so basically you send the message and connecting to a new websocket when you change urls and not
// when the props are updated


    componentWillReceiveProps(newProps) {
      if(this.props.parameter.id !== newProps.parameter.id){
        WebSocketInstance.disconnect();
        this.waitForSocketConnection(()=> {
          WebSocketInstance.fetchMessages(
            this.props.username,
            newProps.parameter.id
          )
        })
        WebSocketInstance.connect(newProps.parameter.id)
      }
      const username = newProps.username
      if(newProps.isAuthenticated){
      axios.all([
        authAxios.get(`${global.API_ENDPOINT}/userprofile/current-user`),
        authAxios.get(`${global.API_ENDPOINT}/chat/?username=`+username)
      ])
      .then(axios.spread((get1, get2)=> {
            this.setState({
              friendList:get1.data.friends,
              chatList:get2.data,
           });
         }));
      }
    }

    // Whenever you want to add anything you have to do it in an object format
    // have to name the from
    // you would then set the message state back to empty
    sendMessageHandler = e => {
      e.preventDefault();
      const messageObject = {
        from: this.props.username,
        content: this.state.message,
        chatId: this.props.parameter.id
      }
      WebSocketInstance.newChatMessage(messageObject);
      this.setState({
        message: ''
      })

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
      if (timeDiff < 1 ) {
        prefix = `Just now`;
      } else if (timeDiff < 60 && timeDiff >1 ) {
        prefix = `${timeDiff} minutes ago`;
      }else if (timeDiff < 24*60 && timeDiff > 60) {
        prefix = `${Math.round(timeDiff/60)} hours ago`;
      } else if (timeDiff < 31*24*60 && timeDiff > 24*60) {
        prefix = `${Math.round(timeDiff/(60*24))} days ago`;
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
          className= {message.author === this.props.username ? 'sent' : 'replies'}>
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
      console.log(this.props)
      const messages = this.state.messages;
      return(
        <div id="frame">
          <Sidepanel {...this.props} {...this.state}/>
          <AddChatModal
          isVisible ={this.props.showPopup}
          close = {() => this.props.closePopup()} />
         <div className="content">
          <TopPanel />
            <div className="messages">
              <ul id="chat-log">
                {
                    this.props.messages &&
                    this.renderMessages(this.props.messages)
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

const mapStateToProps = state => {
  return {
    showPopup: state.nav.showPopup,
    messages: state.message.messages
  }
}

const mapDispatchToProps = dispatch => {
  return {
    closePopup: () => dispatch(navActions.closePopup())
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Chat);
