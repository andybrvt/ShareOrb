import * as actionTypes from './actionTypes';

export const addFollowerFollowing = followObject => {
  return{
    type: actionTypes.ADD_FOLLOWER_FOLLOWING,
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
