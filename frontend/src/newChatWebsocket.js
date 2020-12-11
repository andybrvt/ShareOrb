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

  }

  // now callbacks
  addCallbacks(){
    // add callbacks here
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
