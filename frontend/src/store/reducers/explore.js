import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
  showProfileEdit: false,
  changeProfilePic: false,
  profiles: [],
  curProfile: []

}

export const loadProfiles = (state, action) =>{
  console.log(action)
  return updateObject(state, {
    profiles: action.profiles
  })
}

export const loadCurProfile = (state,action) =>{
  return updateObject(state, {
    profile: action.curProfile
  })
}

export const addFollower = (state, action) => {
  // probally later on have to figure out how to do binary searh on this one
  console.log()
  return updateObject(state, {
    profiles: state.profiles.map(
      profile => profile.username === action.followObject.user ? {
        ...profile,
        get_followers: [...profile.get_followers, action.followObject.person_follower]
      } : profile.username === action.followObject.person_follower ? {
        ...profile,
        get_following: [...profile.get_following, action.followObject.user]
      } : profile
      // profile => profile.username === action.followObject.person_follower
    )
  })
}

export const openProfileEdit = (state, action) =>{
  return updateObject (state, {
    showProfileEdit: true
  })
}

export const closeProfileEdit = (state, action) => {
  return updateObject (state, {
    showProfileEdit: false
  })
}


export const openChangeProfilePic = (state, action) => {
  return updateObject (state, {
    changeProfilePic: true
  })
}

export const closeChangeProfilePic = (state, action) => {
  return updateObject (state, {
    changeProfilePic: false
  })
}

export const addFollowing = (state, action) => {
  // probally gonna have to think of a way to do the binary search here
  console.log(state.profiles)
  console.log(action.followObject.user)
  console.log('right here')
  return updateObject(state, {
    profiles: state.profiles.map(
      profile => profile.username === action.followObject.user ? {
        ...profile,
        get_following: [...profile.get_following, action.followObject.person_following]
      } : profile.username === action.followObject.person_following ? {
        ...profile,
        get_followers: [...profile.get_followers, action.followObject.user]
      } : profile
    )
  })
}

const reducer = (state = initialState, action) => {
  switch(action.type){
    case actionTypes.LOAD_PROFILES:
      return loadProfiles(state, action);
    case actionTypes.ADD_FOLLOWER:
      return addFollower(state, action);
    case actionTypes.ADD_FOLLOWING:
      return addFollowing(state, action)
    case actionTypes.LOAD_CUR_PROFILE:
      return loadCurProfile(state, action)
    case actionTypes.OPEN_PROFILE_EDIT:
      return openProfileEdit(state, action)
    case actionTypes.CLOSE_PROFILE_EDIT:
      return closeProfileEdit(state, action)
    case actionTypes.OPEN_CHANGE_PROFILE_PIC:
      return openChangeProfilePic(state, action)
    case actionTypes.CLOSE_CHANGE_PROFILE_PIC:
      return closeChangeProfilePic(state, action)
    // Start here later
    default:
      return state;
  };

}

export default reducer;
