import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
  profiles: [],

}

export const loadProfiles = (state, action) =>{
  console.log(action)
  return updateObject(state, {
    profiles: action.profiles
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
    default:
      return state;
  };

}

export default reducer;
