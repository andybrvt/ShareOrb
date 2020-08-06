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
  console.log(action.followObject)
  console.log(state.profiles)
  console.log('add follower')
  return updateObject(state, {
    profiles: state.profiles.map(
      profile => profile.username === action.followObject.user.username ? {
        ...profile,
        get_followers: [...profile.get_followers, action.followObject.person_follower]
      } : profile.username === action.followObject.person_follower.username ? {
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

export const addUnFollowing = (state, action) => {
  let profiles  = state.profiles
  let person_index = ''
  let person_profile = []
  let target_profile = []
  // The target_profile will be that of the other person
  // The perosn_profile will be that of the current user profile
  for (let i = 0; i <profiles.length; i++){
      if (profiles[i].username === action.followObject.user.username ){
        // This will remove the target from the user's following
        person_index = profiles[i]['get_following'].indexOf(action.followObject.person_unfollowing)
        person_profile = profiles[i]['get_following']
        person_profile.splice(person_index, 1)
      }
      if (profiles[i].username === action.followObject.person_unfollowing.username){
        // This is to remove the actor from the targets following
        person_index = profiles[i]['get_followers'].indexOf(action.followObject.user )
        target_profile = profiles[i]['get_followers']
        target_profile.splice(person_index, 1)
      }
  }

  return updateObject (state, {
    profiles: state.profiles.map(
      profile => profile.username === action.followObject.user.username ? {
        ...profile,
        get_following: person_profile
      } : profile.username === action.followObject.person_unfollowing.username ? {
        ...profile,
        get_followers: target_profile
      } : profile
    )
  })
}

export const addUnFollower = (state, action) => {
  // The process of this will be similar to the addUnFollowing but pretty much
  // the users will be switch up because the mina user will be the other person
  // so that we have to remove follower from them and then remove a following
  // from the other person

  let profiles = state.profiles
  let person_index = ''
  let person_profile = []
  let target_profile = []
  // In this case the person_profile will be that of the person that got the following
  // we will be removing a follower from that person
  // The target_profile will be the follower and then this function will will then remove
  // the following from that person
  for (let i = 0; i < profiles.length; i++ ){
    if(profiles[i].username === action.followObject.user.username){
      person_index = profiles[i]['get_followers'].indexOf(action.followObject.person_unfollower)
      person_profile = profiles [i]['get_followers']
      person_profile.splice(person_index, 1)
    }
    if(profiles[i].username === action.followObject.person_unfollower.username){
      person_index = profiles[i]['get_following'].indexOf(action.followObject.user)
      target_profile = profiles[i]['get_following']
      target_profile.splice(person_index, 1)
    }

  }

  return updateObject (state, {
    profiles: state.profiles.map(
      profile => profile.username === action.followObject.user.username ? {
        ...profile,
        get_followers: person_profile
      } : profile.username === action.followObject.person_unfollower.username ? {
        ...profile,
        get_following: target_profile
      } : profile
    )
  })
}

export const addFollowing = (state, action) => {
  // probally gonna have to think of a way to do the binary search here
  //

  return updateObject(state, {
    profiles: state.profiles.map(
      profile => profile.username === action.followObject.user.username ? {
        ...profile,
        get_following: [...profile.get_following, action.followObject.person_following]
      } : profile.username === action.followObject.person_following.username ? {
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
    case actionTypes.ADD_UNFOLLOWING:
      return addUnFollowing(state, action)
    case actionTypes.ADD_UNFOLLOWER:
      return addUnFollower(state, action)
    default:
      return state;
  };

}

export default reducer;
