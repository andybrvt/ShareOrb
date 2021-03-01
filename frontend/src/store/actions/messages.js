import axios from "axios";
import * as actionTypes from "./actionTypes";

export const addMessage = message => {
  return{
    type: actionTypes.ADD_MESSAGE,
    message: message
  };
};

// This will set the messages when you first fetch the messages for the chat
export const setMessages = (messages, curChat) => {
  console.log(messages, curChat)
  return {
    type: actionTypes.SET_MESSAGES,
    messages: messages,
    curChat: curChat
  }
}



export const setChats = chats => {
  console.log(chats)
  return {
    type: actionTypes.SET_CHATS,
    chats: chats
  }
}

export const updateMessage = (message) => {
  return {
    type: actionTypes.UPDATE_MESSAGE,
    message: message
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
    axios.get(`${global.API_ENDPOINT}/chat/?username=${username}`)
      .then(res => dispatch(getUserChatsSuccesss(res.data)));
  };
};
