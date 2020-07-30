import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
  profiles: [],
  followers: [],
  following: []
}

export const loadProfiles = (state, action) =>{
  console.log(action)
  return updateObject(state, {
    profiles: action.profiles
  })
}

export const addFollower = (state, action) => {
  return updateObject(state, {
    followers: action.followObject,
    following: action.followObject
  })
}

export const addFollowing = (state, action) => {
  return updateObject(state, {
    followers: action.followObject,
    following: action.followObject
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
