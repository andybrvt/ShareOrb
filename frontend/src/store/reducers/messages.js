import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';


const initialState = {
  messages:[],
  chats: [],
  curChatId: 0,
  curChat:{},
  unseen: 0,
}

// makes a new list and then adds the action.message in
const addMessage = (state, action) =>{
  return updateObject(state, {
    messages: [...state.messages, action.message]
  })
};

const setMessages = (state, action) => {
  console.log(action.curChat)
  return updateObject(state, {
    messages: action.messages.reverse(),
    curChat: action.curChat
  });
};

const setChats = (state, action) => {
  let curChat = ""
  console.log(action.chats)
  if(action.chats.chatList.length === 0){
    curChat = 0
  } else {
    curChat = action.chats.chatList[0].id
  }

  return updateObject(state, {
    chats:action.chats.chatList,
    unseen: action.chats.unseen,
    curChatId: curChat
  })
}


const reducer = (state= initialState, action ) => {
  switch (action.type){
    case actionTypes.ADD_MESSAGE:
     return addMessage(state, action);
    case actionTypes.SET_MESSAGES:
     return setMessages(state, action);
    case actionTypes.SET_CHATS:
     return setChats(state,action);
     default:
       return state;
  }
}

export default reducer;

// once you are done with reducers, add it into index.js
