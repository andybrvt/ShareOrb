import * as actionTypes from './actionTypes';

export const addFollower = followObject => {
  // This will be for the receiving persopn
  return{
    type: actionTypes.ADD_FOLLOWER,
    followObject: followObject
  }
}

export const openProfileEdit = () =>{
  return {
    type: actionTypes.OPEN_PROFILE_EDIT
  }
}

export const closeProfileEdit = () => {
  return {
    type: actionTypes.CLOSE_PROFILE_EDIT
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

export const openChangeProfilePic = () => {
  return {
    type: actionTypes.OPEN_CHANGE_PROFILE_PIC
  }
}

export const closeChangeProfilePic = () => {
  return {
    type: actionTypes.CLOSE_CHANGE_PROFILE_PIC
  }
}


export const addUnFollower = (followObject) => {
  // This will be used for the person getting the follower
  // basically not you
  return {
    type: actionTypes.ADD_UNFOLLOWER,
    followObject: followObject
  }
}

export const addUnFollowing = (followObject) =>{
  // This one will be used for you as the person doing the unfollowing
  return {
    type: actionTypes.ADD_UNFOLLOWING,
    followObject: followObject
  }
}

export const addSocialLikeNew = (exploreObj) => {
  // This will be used for the social calendar liking when there is a new cal cell
  return{
    type: actionTypes.ADD_SOCIAL_LIKE_NEW,
    exploreObj: exploreObj
  }
}

export const addSocialLikeOld = (exploreObj) => {
  // This will be used for the social calendar liking when there is an exisiting
  // cal cell
  return {
    type: actionTypes.ADD_SOCIAL_LIKE_OLD,
    exploreObj: exploreObj
  }
}

export const addSocialUnLike = (exploreObj) => {
  // This will be used for unliking the socialcals
  return{
    type: actionTypes.ADD_SOCIAL_UNLIKE,
    exploreObj: exploreObj
  }
}

export const addSocialCommentNew = (exploreObj) =>{
  // This will be used for adding the comments when you create
  // a new socialcalcell
  return {
    type: actionTypes.ADD_SOCIAL_COMMENT_NEW,
    exploreObj: exploreObj
  }
}

export const addSocialCommentOld = (exploreObj) => {
  // This will be used for the adding the comments when the social cell
  // is already created
  return{
    type: actionTypes.ADD_SOCIAL_COMMENT_OLD,
    exploreObj: exploreObj
  }
}


export const addSocialEventNew = (exploreObj) => {
  // This will be used to add the events in whe nyou are creating  a
  // new soicalcell
  return {
    type:actionTypes.ADD_SOCIAL_EVENT_NEW,
    exploreObj: exploreObj
  }
}

export const addSocialEventOld = (exploreObj) => {
  // This will be used to add the events in when you are creating an event
  // old socialCal
  return{
    type: actionTypes.ADD_SOCIAL_EVENT_OLD,
    exploreObj: exploreObj
  }
}
