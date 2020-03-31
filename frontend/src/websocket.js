class WebSocketService {
  // static is not called on an instance but rather called on the class itself
  static instance = null;
  // call back run after anothr function is run and it is a dictionary
  // calledback things would be fetch meessage and new message
  callbacks = {}

  // chekc if there is an instance or not
  static getInstance(){
    if (!WebSocketService.instance){
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  constructor(){
    // this sets one of the properties on WebSocketService as null
    this.socketRef = null;
  }

  // Connect to the websocket
  // This is similar to the methods in the backend, the first thing you always want to do
  // is connect to the WebSocket
  // New WebSocket calls a new Websocket instance on that path
  // Onpen is run when the websocket is connected
  // Onmessage is run when the websocket recieves information from the server
  // this.socketRef is basically our WebSocket

  connect() {
    const path ='ws://127.0.0.1:8000/ws/chat/test/';
    this.socketRef = new WebSocket(path)
    this.socketRef.onopen = () => {
      console.log('websocket open')

    }
    this.socketNewMessage(JSON.stringify({
      command: 'fetch_messages'
    }))
    this.socketRef.onmessage = (e) =>{
      this.socketNewMessage(e.data);
    }

    this.socketRef.onerror = (e) =>{
      console.log(e.message);
    }

    this.socketRef.onclose = () => {
      console.log('websocket is closed')
      this.connect();
    }
  }
  // The .command is the commands that can be like fetch methods or newmessage or whatever
  // The Object.key returns an array of all the keys in the dictionary callback
  socketNewMessage(data) {
    const parsedData = JSON.parse(data);
    const command = parsedData.command;
    if (Object.keys(this.callbacks).length === 0){
      return;
    }
    if (command === 'messages') {
      this.callback[command](parsedData.messages)
    }
    if (command === 'new_message') {
      this.callback[command](parsedData.message)
    }
  }

  // This will taken in the username and then call the command fetch_messages which will then be called in the consumers
  // Username will just be the senders username
  fetchMessages(username) {
    this.sendMessage({ command: 'fetch_messages', username: username })
  }

  // This will call the new_message command
  // You are calling the object in the sendMessage here, you convert it to a JSON and then send it into the
  // websocket
  newChatMessage(message) {
    this.sendMessage({ command: 'new_message', from: message.from, message: message.content })
  }

  // adding in the commands directly
  // this will be called in the Chat.js
  addCallbacks(messagesCallback, newMessageCallback){
    this.callbacks['messages'] = messagesCallback;
    this.callbacks['new_message'] = newMessageCallback;

  }

  // WebSocket.send() sends information from the server to the WebSocket to be sent
  // to all the other servers
  // JSON.stringify basically turns all the data into JSON, this inclues strings and int too
  // In order to send your data into the WebSocket your data needs to be in a JSON format
  // When you do ({}) <-- you are calling an object
  sendMessage(data) {
    try{
      this.socketRef.send(JSON.stringify({ ... data }))
    } catch (err) {
      console.log(err.message);
    }
  }


  state() {
    return this.socketRef.readyState;
  }
  // wati for the socket conenction to be stable
  // recursion is used to try again basically
  // The time out takes 2 parameters, the first is a function and the second is a timeout time
  // in milisec
  // Readystate gives the state of the Websocket, it can take in 4 values -->
  // 0 being it is not connected
  // 1 being it is connected and messages cna be sent
  // 2 being it is in its closing handshake
  // 3 bieng it is is closed can cannot be reopened
  // The recursion will rerun the function everytime there is an error and when
  // there is a callback then return
  waitForSocketConnection (callback) {
    const socket = this.socketRef;
    const recursion = this.waitForSocketConnection;
    setTimeout(
      function(){
        if (socket.readyState === 1){
          console.log('connection is secure');
          if (callback != null) {
            callback();
          }
          return;
        } else{
            console.log('waiting for connection...')
            recursion(callback)
        }
      }, 1)

  }
}

const WebSocketInstance = WebSocketService.getInstance();

export default WebSocketInstance;
