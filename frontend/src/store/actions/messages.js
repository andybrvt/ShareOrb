import axios from "axios";
import * as actionTypes from "./actionTypes";

export const addMessage = message => {
  return{
    type: actionTypes.ADD_MESSAGE,
    message: message
  };
};

// This will set the messages when you first fetch the messages for the chat
export const setMessages = messages => {
  return {
    type: actionTypes.SET_MESSAGES,
    messages: messages
  }
}



export const setChats = chats => {
  return {
    type: actionTypes.SET_CHATS,
    chats: chats
  }
}



// DELETE LATER
const getUserChatsSuccesss = chats => {
  return {
    type: actionTypes.GET_CHATS_SUCCESS,
    chats: chats
  };
};


// Since you are gonna receive data from other poeple and not just your self
// you will probally not eed this
// DELETE SOON
export const getUserChats = (username, token) => {
  return dispatch => {
    axios.defaults.headers ={
      "Content-Type": "application/json",
      Authorization: `Token ${token}`
    };
    axios.get(`http://127.0.0.1:8000/chat/?username=${username}`)
      .then(res => dispatch(getUserChatsSuccesss(res.data)));
  };
};
