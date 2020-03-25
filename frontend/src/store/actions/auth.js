import axios from "axios";
import * as actionTypes from "./actionTypes";
import React, {useState, useEffect } from 'react';
import  { authAxios } from '../../components/util';


export const authStart = () => {
  return {
    type: actionTypes.AUTH_START
  };
};

export const authSuccess = (token, username, id) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    token: token,
    username: username,
    id: id
  };
};

export const authFail = error => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error
  };
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("expirationDate");
  return {
    type: actionTypes.AUTH_LOGOUT
  };
};

export const checkAuthTimeout = expirationTime => {
  return dispatch => {
    setTimeout(() => {
      dispatch(logout());
    }, expirationTime * 1000);
  };
};

export const authLogin = (username, password) => {
  // const[id, setID] = useState(null);
  // const[username1, setUsername1] = useState('');
  return dispatch => {
    dispatch(authStart());
      axios.all([
        axios.post("http://127.0.0.1:8000/rest-auth/login/", {
          username: username,
          password: password
        }),
        axios.get('http://127.0.0.1:8000/userprofile/admin')
      ])
      .then(axios.spread((res1, res2) => {
        console.log(res1.data)
        console.log(res2.data)
        // setUsername1(res2.data.username)
        // setID(res2.data.id)
        const token = res1.data.key;
        const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
        localStorage.setItem("token", token);
        localStorage.setItem("expirationDate", expirationDate);
        dispatch(authSuccess(token,res2.data.username, res2.data.id));
        dispatch(checkAuthTimeout(3600));
      }))
      .catch(err => {
        dispatch(authFail(err));
      });
  };
};



export const authSignup = (username, email, password1, password2) => {
  return dispatch => {
    dispatch(authStart());
    axios
      .post("http://127.0.0.1:8000/rest-auth/registration/", {
        username: username,
        email: email,
        password1: password1,
        password2: password2
      })
      .then(res => {
        const token = res.data.key;
        const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
        localStorage.setItem("token", token);
        localStorage.setItem("expirationDate", expirationDate);
        dispatch(authSuccess(token));
        dispatch(checkAuthTimeout(3600));
      })
      .catch(err => {
        dispatch(authFail(err));
      });
  };
};

export const authCheckState = () => {
  return dispatch => {
    const token = localStorage.getItem("token");
    if (token === undefined) {
      dispatch(logout());
    } else {
      const expirationDate = new Date(localStorage.getItem("expirationDate"));
      if (expirationDate <= new Date()) {
        dispatch(logout());
      } else {
        dispatch(authSuccess(token));
        dispatch(
          checkAuthTimeout(
            (expirationDate.getTime() - new Date().getTime()) / 1000
          )
        );
      }
    }
  };
};
