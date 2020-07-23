import * as actionTypes from './actionTypes';

export const addFollowerFollowing = followObject => {
  return{
    type: actionTypes.ADD_FOLLOWER_FOLLOWING,
    followObject: followObject
  }
}


export const loadFollowerFollowing = followFollowing => {
  return {
    type: actionTypes.LOAD_FOLLOWER_FOLLOWING,
    followFollowing: followFollowing
  }
}
