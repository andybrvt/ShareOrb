import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
  followers: [],
  following: []
}

export const loadFollowerFollowing = (state, action) =>{
  return updateObject(state, {
    followers: action.followFollowing.followers,
    following: action.followFollowing.following
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
    case actionTypes.LOAD_FOLLOWER_FOLLOWING:
      return loadFollowerFollowing(state, action);
    case actionTypes.ADD_FOLLOWER_FOLLOWING:
      return addFollowerFollowing(state, action);
    default:
      return state;
  };

}
