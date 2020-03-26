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


export const actionAddCredentials = () => {
  return {
    type: actionTypes.ADD_CREDENTIALS,
  };
};



export const authLogin = (username, password) => {
  // const[id, setID] = useState(null);
  // const[username1, setUsername1] = useState('');
  return dispatch => {
    dispatch(authStart());

        axios.post("http://127.0.0.1:8000/rest-auth/login/", {
          username: username,
          password: password
        }),


      .then(res => {
        console.log(res.data)


        // setUsername1(res2.data.username)
        // setID(res2.data.id)
        const token = res.data.key;
        const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
        const username1 = res.data.username;
        const id = res.data.id;
        localStorage.setItem("token", token);
        localStorage.setItem("expirationDate", expirationDate);
        
        dispatch(authSuccess(token,res.data.username, res.data.id));
        dispatch(checkAuthTimeout(3600));
      }))
      .catch(err => {
        dispatch(authFail(err));
      });

        authAxios.get('http://127.0.0.1:8000/userprofile/admin')
        .then(res => {

          const username1 = res.data.username;
          const id = res.data.id;
          localStorage.setItem("username", username1);
          localStorage.setItem("id", id)
          dispatch(authSuccess(token,res.data.username, res.data.id));
          dispatch(checkAuthTimeout(3600));

        })
        .catch(err) {
          // handle error
          console.log(err);
        })

  };
};

// export const addCredentials = () => {
//   return dispatch => {
//     dispatch(authStart());
//     authAxios.get('http://127.0.0.1:8000/userprofile/current-user')
//     .then(res => {
//       console.log(res.data)
//
//
//     })
//   }
// }


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
    const username = localStorage.getItem('username')
    const id = localStorage.getItem('id')
    if (token === undefined) {
      dispatch(logout());
    } else {
      const expirationDate = new Date(localStorage.getItem("expirationDate"));
      if (expirationDate <= new Date()) {
        dispatch(logout());
      } else {
        dispatch(authSuccess(token,username,id));
        dispatch(
          checkAuthTimeout(
            (expirationDate.getTime() - new Date().getTime()) / 1000
          )
        );
      }
    }
  };
};
