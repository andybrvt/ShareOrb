import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';


const initialState = {
  messages:[],
  chats: []
}

// makes a new list and then adds the action.message in
const addMessage = (state, action) =>{
  return updateObject(state, {
    messages: [...state.messages, action.message]
  })
};

const setMessages = (state, action) => {
  return updateObject(state, {
    messages: action.messages.reverse()
  });
};

const setChats = (state, action) => {
  return updateObject(state, {
    chats:action.chats
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
