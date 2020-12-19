import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  token: null,
  error: null,
  loading: false,
  username: null,
  id: null,
  friends: [],
  posts: [],
  firstName: '',
  lastName: '',
  profilePic: '',
  following: [],
  followers: [],
  sharedList: []
};

const authStart = (state, action) => {
  return updateObject(state, {
    error: null,
    loading: true
  });
};

const authSuccess = (state, action) => {
  return updateObject(state, {
    token: action.token,
    error: null,
    loading: false,
  });
};

const authFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false
  });
};

const authLogout = (state, action) => {
  return updateObject(state, {
    token: null
  });
};

const addCredentials = (state, action) => {



  return updateObject(state, {
    username: action.username,
    id: action.id,
    friends: action.friends,
    posts: action.posts,
    firstName: action.firstName,
    lastName: action.lastName,
    profilePic: action.profilePic,
    following: action.following,
    followers: action.followers

  });
};

const editProfileAuth = (state, action) => {
  return updateObject (state, {
    firstName: action.editProfileObj.first_name,
    lastName: action.editProfileObj.last_name,

  })
}

const changeProfilePicAuth = (state, action) => {
  return updateObject (state, {
    profilePic: action.profilePic
  })
}

const addRemoveCloseFriend = (state, action) => {
  console.log(action.friendList)
  return updateObject(state, {
    friends: action.friendList
  })
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_START:
      return authStart(state, action);
    case actionTypes.AUTH_SUCCESS:
      return authSuccess(state, action);
    case actionTypes.AUTH_FAIL:
      return authFail(state, action);
    case actionTypes.AUTH_LOGOUT:
      return authLogout(state, action);
    case actionTypes.ADD_CREDENTIALS:
      return addCredentials(state, action);
    case actionTypes.EDIT_PROFILE_AUTH:
      return editProfileAuth(state,action);
    case actionTypes.CHANGE_PROFILE_PIC_AUTH:
      return changeProfilePicAuth(state, action);
    case actionTypes.ADD_REMOVE_CLOSE_FRIEND:
      return addRemoveCloseFriend(state, action);
    default:
      return state;
  }
};

export default reducer;

// once you are done with reducers, add it into index.js
