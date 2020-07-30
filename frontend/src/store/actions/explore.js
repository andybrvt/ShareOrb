import * as actionTypes from './actionTypes';

export const addFollower = followObject => {
  return{
    type: actionTypes.ADD_FOLLOWER,
    followObject: followObject
  }
}

export const addFollowing = followObject =>{
  return {
    type: actionTypes.ADD_FOLLOWING,
    followObject: followObject
  }
}


export const loadProfiles = profiles => {
  console.log(profiles)
  return {
    type: actionTypes.LOAD_PROFILES,
    profiles: profiles
  }
}
