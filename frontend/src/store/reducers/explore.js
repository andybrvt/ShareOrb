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

export const addFollowerFollowing = (state, action) => {
  return updateObject(state, {
    followers: action.followObject.followers,
    following: action.followObject.following
  })
}

const reducer = (state = initialState, action) => {
  switch(action.type){
    case actionTypes.LOAD_PROFILES:
      return loadProfiles(state, action);
    case actionTypes.ADD_FOLLOWER_FOLLOWING:
      return addFollowerFollowing(state, action);
    default:
      return state;
  };

}

export default reducer;
