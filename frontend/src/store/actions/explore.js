import * as actionTypes from './actionTypes';

export const addFollower = followObject => {
  // This will be for the receiving persopn
  return{
    type: actionTypes.ADD_FOLLOWER,
    followObject: followObject
  }
}

export const addFollowing = followObject =>{
  // this will be for the person doing the following
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

export const loadCurProfile = curProfile => {
  return {
    type: actionTypes.LOAD_CUR_PROFILE,
    curProfile: curProfile
  }
}
