// This will be for your over all chat. It will be used to cover
// the side pandel, when ever you recieve a text message
// or chat, it will be updated the side panel, whever you
// recieve messages from other people, it will up date as well

class WebSocketNewChatSidePanel {
  static instance = null;
  callbacks = {}

  static getInstance(){
    if(!WebSocketNewChatSidePanel.instance){
      WebSocketNewChatSidePanel.instance = new WebSocketNewChatSidePanel()
    }

    return WebSocketNewChatSidePanel.instance

  }

  constructor(){
    this.socketRef = null
  }


  connect(chatUserId){
    // This will be used for connecting to the whole chat. So the whole
    // chat in itself will be a channel, and then each smaller chat will
    // have its own channel

    // I put the connect in the apps so that we have the chat
    // already created so we can get  notificaiton and clicking
    // on the right chat when you click on the chat tab

    // GO INTO BACKEND AND START SETTING UP THE NEW CHANNEL
    const path = 'ws://127.0.0.1:8000/ws/allChats/'+chatUserId
    console.log(path)
    this.socketRef = new WebSocket(path)
    this.socketRef.onopen =() => {
      console.log('websocket open')
    }
    this.socketRef.onmessage = (e) => {
      console.log(e.data)

      // put the onmessage receiever here
      this.socketChatsList(e.data)
    }

    this.socketRef.onerror = (e) => {
      console.log('websocket is closed')
    }

    this.socketRef.onclose = () => {
      console.log('websocket is closed')

      // Do you wnat the websocket to be recursiving ??
      // We will see
      // this.connect(chatUserId);
    }



  }

  disconnect(){
    // This will be called when you leave the chat page
    console.log('disconnect')
    this.socketRef.close()
  }

  socketChatsList(data){
    // This will be all the actions
    const parsedData = JSON.parse(data);
    const command = parsedData.command
    console.log(parsedData)

    if(command == 'fetch_all_user_chats'){
      const chatList = parsedData.chats

      this.callbacks['fetch_chats'](chatList)
    }
    if(command == "update_chat_list"){
      const chatList = parsedData.chatList

      // Since this updating the chats too, the redux will be
      // similar to the fetch chats so you cna just reuse the
      // fetch_catch call back
      this.callbacks['fetch_chats'](chatList)
    }
  }

  fetchChats =(userId) => {
    // This function will fetch all the chats that a user has
    console.log('fetch chats')
    this.sendChats({
      userId: userId,
      command: 'fetch_all_user_chats'
    })
  }

  updateRecentChat = (chatId, senderId, message) =>{
    // this function will be sent with the sendNewChatCreatedMessage
    // function in the newchatwebsocket inorder to update the
    // chat function.
    this.sendChats({
      chatId: chatId,
      senderId: senderId,
      message: message,
      command: 'update_recent_chat'
    })
  }

  updateRecentChatMessage = (chatId , senderId, message) => {
    // This function will be similar to the updateRecentChat function
    // but it will create the chat itself too instead of just filling in the
    // current date of the chat
    // This will be used for when you are typeing in the chat search
    // and the chat is already created and so you just need to send it and pull
    // it up
    this.sendChats({
      chatId: chatId,
      senderId: senderId,
      message: message,
      command: 'update_recent_chat_message'
    })

  }

  updateRecentChatEvent = (chatId, senderId) => {
    // This function will be sent to the chat list when you share an event with the
    // chat

    this.sendChats({
      chatId: chatId,
      senderId: senderId,
      command: 'update_recent_chat_event'
    })
  }

  sendNewCreatedChat = (chatId) => {

    // This function will accept the new created chat id and then send it out
    // into the chatList of all other people that are part of the chat

    this.sendChats({
      chatId: chatId,
      command: "send_new_created_chat"
    })

  }

  sendSeen = (chatId, senderId) => {
    // This function will add in the people into the seen list if they have
    //  seen the message

    // You will need the chat id to get the chat and then get the curId
    // to add themselves in and then you send the chat list into the frontend
    // in order to update the event list
    this.sendChats({
      command: "send_chat_seen",
      chatId: chatId,
      senderId: senderId
    })
  }


  addCallbacks(
    fetchAllUserChats
  ){
    this.callbacks['fetch_chats'] = fetchAllUserChats
  }

  sendChats(data){
    // Used to send information into the backend
    console.log(data)

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

const ChatSidePanelWebSocketInstance = WebSocketNewChatSidePanel.getInstance()

export default ChatSidePanelWebSocketInstance;
