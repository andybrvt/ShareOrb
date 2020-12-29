import axios from "axios";
import * as actionTypes from "./actionTypes";
import React, {useState, useEffect } from 'react';
import  { authAxios } from '../../components/util';


export const authStart = () => {
  return {
    type: actionTypes.AUTH_START
  };
};

export const authSuccess = (token) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    token: token,

  };
};


export const addCredentials = (
   username,
   id,
   friends,
   posts,
   firstName,
   lastName,
   profilePic,
   following,
   followers,
   phone_number,
   email,
   dob
 ) => {
  return {
    type: actionTypes.ADD_CREDENTIALS,
    username: username,
    id: id,
    friends: friends,
    posts: posts,
    firstName: firstName,
    lastName: lastName,
    profilePic: profilePic,
    following: following,
    followers: followers,
    phone_number: phone_number,
    email:email,
    dob: dob
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
  localStorage.removeItem("username");
  localStorage.removeItem('id')
  localStorage.removeItem('friends')
  localStorage.removeItem('posts')
  localStorage.removeItem('firstName')
  localStorage.removeItem('lastName')
  localStorage.removeItem('profilePic')
  localStorage.removeItem('following')
  localStorage.removeItem('followers')
  localStorage.removeItem('suggestedFriends')
  localStorage.removeItem('phone_number')
  localStorage.removeItem('email')
  localStorage.removeItem('dob')
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


        authAxios.get('http://127.0.0.1:8000/userprofile/suggestedFriends')
          .then(res=> {
            localStorage.setItem("suggestedFriends", (res.data.username));

         });


        axios.post("http://127.0.0.1:8000/rest-auth/login/", {
          username: username,
          password: password
        })


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

        dispatch(authSuccess(token));
        window.location.reload(true);
        return axios.get('http://127.0.0.1:8000/userprofile/current-user')
      })
      .then(res => {
            console.log(res.data)
            const username1 = res.data.username;
            const id = res.data.id;
            const friends = res.data.friends;

            localStorage.setItem("username", username1);
            localStorage.setItem("id", id);
            localStorage.setItem('friends', friends);

            dispatch(addCredentials(
               res.data.username,
               res.data.id,
               res.data.friends,
               res.data.get_posts,
               res.data.first_name,
               res.data.last_name,
               res.data.profile_picture,
               res.data.get_following,
               res.data.get_followers
             ));
            dispatch(checkAuthTimeout(3600));

        })
          .catch(err => {
            dispatch(authFail(err));
          });
  };
};


export const grabUserCredentials = () => {
  // THIS IS THE ONE THAT GRABS THE CURRENT USER INFO
  // const[id, setID] = useState(null);
  // const[username1, setUsername1] = useState('');
  return dispatch => {


    authAxios.get('http://127.0.0.1:8000/userprofile/current-user')
      .then(res => {
        console.log(res)
        const username1 = res.data.username;
        const id = res.data.id;
        const friends = res.data.friends;
        const posts = res.data.get_posts;
        const firstName = res.data.first_name;
        const lastName = res.data.last_name;
        const profilePic = res.data.profile_picture;
        const following = res.data.get_following;
        const followers = res.data.get_followers;
        const phone_number = res.data.phone_number;
        const email = res.data.email;
        const dob = res.data.dob
        localStorage.setItem("username", username1);
        localStorage.setItem("id", id);
        localStorage.setItem('friends', friends);
        localStorage.setItem('posts', posts);
        localStorage.setItem('firstName', firstName);
        localStorage.setItem('lastName', lastName);
        localStorage.setItem('profilePic', profilePic);
        localStorage.setItem('following', following);
        localStorage.setItem('followers', followers);
        localStorage.setItem('phone_number', phone_number );
        localStorage.setItem('email', email);
        localStorage.setItem('dob', dob);
        dispatch(addCredentials(
           res.data.username,
           res.data.id,
           res.data.friends,
           res.data.get_posts,
           res.data.first_name,
           res.data.last_name,
           res.data.profile_picture,
           res.data.get_following,
           res.data.get_followers,
           res.data.phone_number,
           res.data.email,
           res.data.dob
         ));
         {/*when it times out*/}
        dispatch(checkAuthTimeout(100000));

      })
      .catch(err => {
        dispatch(authFail(err));
      });


    }

  }


export const authSignup = (first_name, last_name, dob, bio, email, phone_number, password1, password2) => {
  return dispatch => {
    dispatch(authStart());
    axios
      .post("http://127.0.0.1:8000/rest-auth/registration/", {
        first_name: first_name,
        last_name: last_name,
        dob: dob,
        bio: bio,
        email: email,
        phone_number: phone_number,
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

// Where we get token and username and id for each login
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
        dispatch(grabUserCredentials())
        const username = localStorage.getItem('username')
        const id = localStorage.getItem('id')
        dispatch(addCredentials(username, id));
        dispatch(
          checkAuthTimeout(
            (expirationDate.getTime() - new Date().getTime()) / 1000
          )
        );
      }
    }
  };
};

export const editProfileAuth = (editProfileObj) => {
  return {
    type: actionTypes.EDIT_PROFILE_AUTH,
    editProfileObj: editProfileObj
  }
}


export const changeProfilePicAuth = (profilePic) => {
  return {
    type: actionTypes.CHANGE_PROFILE_PIC_AUTH,
    profilePic: profilePic
  }
}

export const addRemoveCloseFriend = (friendList) => {
  console.log(friendList)
  return {
    type: actionTypes.ADD_REMOVE_CLOSE_FRIEND,
    friendList: friendList
  }
}
