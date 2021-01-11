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
  sharedList: [],
  phone_number: "",
  email: "",
  dob: "",
  private: false,
  requestList: []
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

  console.log("how many times this hits")
  console.log(action)

  return updateObject(state, {
    username: action.username,
    id: action.id,
    friends: action.friends,
    posts: action.posts,
    firstName: action.firstName,
    lastName: action.lastName,
    profilePic: action.profilePic,
    following: action.following,
    followers: action.followers,
    phone_number: action.phone_number,
    email: action.email,
    dob: action.dob,
    private: action.private,
    requestList: action.requestList
  });
};

const updateCredentials = (state, action) => {
  return updateObject(state, {
    username: action.updatedUserObj.username,
    firstName: action.updatedUserObj.first_name,
    lastName: action.updatedUserObj.last_name,
    dob: action.updatedUserObj.dob,
    phone_number: action.updatedUserObj.phone_number,
    email: action.updatedUserObj.email
  })
}

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

const changePrivate = (state, action) => {
  return updateObject(state, {
    private: action.privateCall
  })
}

const updateFollowers = (state, action) => {
  return updateObject(state, {
    followers: action.followerList,
    requested: action.requestedList
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
    case actionTypes.UPDATE_CREDENTIALS:
      return updateCredentials(state, action);
    case actionTypes.EDIT_PROFILE_AUTH:
      return editProfileAuth(state,action);
    case actionTypes.CHANGE_PROFILE_PIC_AUTH:
      return changeProfilePicAuth(state, action);
    case actionTypes.CHANGE_PRIVATE:
      return changePrivate(state, action);
    case actionTypes.UPDATE_FOLLOWERS:
      return updateFollowers(state, action);
    default:
      return state;
  }
};

export default reducer;

// once you are done with reducers, add it into index.js
