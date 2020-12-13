// This websocket will be used for the new chat
class WebSocketNewChat {
  static instance = null;
  callbacks = {}

  static getInstance(){
    if(!WebSocketNewChat.instance){
      WebSocketNewChat.instance = new WebSocketNewChat()
    }

    return WebSocketNewChat.instance

  }

  constuctor(){
    this.socketRef = null
  }

  connect(newChatId){
    // This will be the connection between the channel and websocket
    const path = 'ws://127.0.0.1:8000/ws/newChat/'+newChatId
    console.log(path)
    // makes a new websocket object to connect with the path
    this.socketRef = new WebSocket(path)
    this.socketRef.onopen =() => {
      console.log('websocket open')
    }
    this.socketRef.onmessage = (e) => {
      console.log(e.data)

      // put the onmessage receiever here
      this.socketNewChatMessages(e.data)
    }

    this.socketRef.onerror = (e) => {
      console.log('websocket is closed')
    }

    this.socketRef.onclose = () => {
      console.log('websocket is closed')

      // Do you wnat the websocket to be recursiving ??
      // We will see
      // this.connect(userId);
    }


  }


  disconnect(){
    // this will call the disconnect method in the backend
    console.log('disconnect')
    this.socketRef.close();
  }

  socketNewChatMessages(data){
    // This is where the messages from the back end gets processe
    const parsedData = JSON.parse(data);
    const command = parsedData.command
    console.log(parsedData)

    if(command === "fetch_messages"){
      const messages = parsedData.messages

      this.callbacks['set_messages'](messages)
    }
    if(command === "send_new_chat_created_message"){
      const message = parsedData.newMessage

      // Put call backs here
      this.callbacks['send_message'](message)
    }
  }

  fetchMessages = (chatId) => {
    // This function will send a command into the backend consumer to fetch
    // the chat from the chatId
    console.log('fetch chat messages')
    this.sendMessage({
      command: 'fetch_new_chat_messages',
      chatId: chatId
    })
  }

  sendNewChatCreatedMessage = (chatId, senderId, message) => {
    // This function will recieve in put when you are sending a message
    // and then send it inot the backedn to channel to create all messages

    console.log(chatId, senderId, message)
    this.sendMessage({
      command: "send_new_chat_created_message",
      chatId: chatId,
      senderId: senderId,
      message: message
    })
  }

  // now callbacks
  addCallbacks(
    setMessages,
    sendMessage
  ){
    // add callbacks here
    this.callbacks['set_messages'] = setMessages
    this.callbacks['send_message'] = sendMessage
  }

  sendMessage(data){
    // Used to send information into the backend
    console.log(data)

// START RIGHT HERE
    try {
      this.socketRef.send(JSON.stringify({...data}))
    } catch (err) {
      console.log(err.message);
    }
  }

  state(){
    return this.socketRef.readyState
  }

  waitForSocketConnection(callback){
    const socket = this.socketRef;
    const recursion = this.waitForSocketConnection;
    setTimeout(
      function(){
        if(socket.readyState === 1){
          console.log('connection is secure');
          if (callback != null){
            callback()
          }
          return;
        } else {
          console.log('waiting for connection...')
          recursion(callback)
        }
      }, 1)
  }



}

const NewChatWebSocketInstance = WebSocketNewChat.getInstance()

export default NewChatWebSocketInstance;
