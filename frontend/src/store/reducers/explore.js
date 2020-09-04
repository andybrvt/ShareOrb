import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
  showProfileEdit: false,
  changeProfilePic: false,
  profiles: [],
  // curProfile: [],
  test: '',
  // profile: []

}

export const loadProfiles = (state, action) =>{
  console.log(action)
  return updateObject(state, {
    profiles: action.profiles
  })
}

export const loadCurProfile = (state,action) =>{
  // The profile will get added in when the getcurprofile is added
  // when ever the curprofile is loaded up
  console.log(action.curProfile)
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


// FOR ALL THE NEW CAL CELL BEING CREATED, YOU CAN PROBALLY JUST USE ONE
// ADD NEW SOCIALCALCELL
export const addSocialLikeNew = (state, action) =>{
  // So the task here is you have to first fine the user, then find the
  //  correct cell data and then add in the like
  console.log(action)
  const calendarOwnerId = action.exploreObj.socialCalCellObj.socialCalUser.id
  const calendarCalCellId = action.exploreObj.socialCalCellObj.id

  console.log(state.profile)
  let curProfileId = ''

  if (state.profile){
    curProfileId = state.profile.id
  }

  // Event though the profile is not in state, it is declared when the curProfile is loaded
  // in so it is there

  return updateObject(state, {
    profiles: state.profiles.map(
      profile => profile.id === calendarOwnerId ? {
        ... profile,
        get_socialCal: [... profile.get_socialCal, action.exploreObj.socialCalCellObj]
      } : profile
    ),
    profile: curProfileId === calendarOwnerId ? {
      ... state.profile,
      get_socialCal: [...state.profile.get_socialCal, action.exploreObj.socialCalCellObj]
    } : state.profile
  })
}

export const addSocialLikeOld = (state, action) => {
  // so the task here is to find the user, then find the correct cell
  // data then add in the like

  // For now I will do a double loop --> probally gonna be shit but if things seem to be better
  // and sorted I will switch to binary search
  const calendarOwnerId = action.exploreObj.socialCalCell.socialCalUser.id
  const calendarCalCellId = action.exploreObj.socialCalCell.id
  const userLike = action.exploreObj.userObj
  let curProfileId = ''

  if (state.profile){
    curProfileId = state.profile.id
  }

  console.log('like old reducer')
  return updateObject(state, {
    profiles: state.profiles.map(
      profile => profile.id === calendarOwnerId ? {
        ... profile,
        get_socialCal: profile.get_socialCal.map(
          socialCell => socialCell.id === calendarCalCellId ? {
            ...socialCell,
            people_like: [...socialCell.people_like, userLike]
          } : socialCell
        )
      } : profile
    ),
    profile: curProfileId === calendarOwnerId ? {
      ... state.profile,
      get_socialCal: state.profile.get_socialCal.map(
        socialCell => socialCell.id === calendarCalCellId ? {
          ... socialCell,
          people_like: [...socialCell.people_like, userLike]
        } : socialCell
      )
    } : state.profile
  })
}

export const addSocialUnLike = (state, action) => {
  // This will go to the profiles, find the right person using the calendarOwnerId
  // and then find the right calenadrObj then take out the user
  const calendarOwnerId = action.exploreObj.socialCalCell.socialCalUser.id
  const calendarCalCellId = action.exploreObj.socialCalCell.id
  const userLike = action.exploreObj.userObj
  let curProfileId = ''

  if (state.profile){
    curProfileId = state.profile.id
  }

  function removeUnliker(unliker) {
    return unliker.id !== userLike.id
  }

  // I might have to do a triple forloop but I  might change it later
  return updateObject(state, {
    profiles: state.profiles.map(
      profile => profile.id === calendarOwnerId ? {
        ... profile,
        get_socialCal: profile.get_socialCal.map(

          // this will get the right cal cell
          socialCell => socialCell.id === calendarCalCellId ? {
            ... socialCell,
            people_like: socialCell.people_like.filter(removeUnliker)
          } : socialCell
        )
      } : profile
    ),
    profile: curProfileId === calendarOwnerId ? {
      ... state.profile,
      get_socialCal: state.profile.get_socialCal.map(
        socialCell => socialCell.id === calendarCalCellId ? {
          ... socialCell,
          people_like: socialCell.people_like.filter(removeUnliker)
        } :socialCell
      )
    } : state.profile
  })


}

export const addSocialCommentNew = (state, action) => {
  // This will be used to add into the comments. So what you would do since this
  // is making a new calendar you would just find the right person that owns the
  // calendar then add the calendar cell to the social calendar list
  console.log(action)
  const calendarOwnerId = action.exploreObj.socialCalCellObj.socialCalUser.id
  const calendarCalCellId = action.exploreObj.socialCalCellObj.id

  let curProfileId = ''

  if (state.profile){
    curProfileId = state.profile.id
  }

  return updateObject(state, {
    profiles: state.profiles.map(
      profile => profile.id === calendarOwnerId ? {
        ... profile,
        get_socialCal : [... profile.get_socialCal, action.exploreObj.socialCalCellObj]
      } : profile
    ),
    profile: curProfileId === calendarOwnerId ? {
      ... state.profile,
      get_socialCal: [... state.profile.get_socialCal, action.exploreObj.socialCalCellObj]
    } : state.profile
  })
}

export const addSocialCommentOld = (state, action) =>{
  // This since the socialcell already exist so what will happen is that you will find
  // the person then find the cell, then go into the comments, and add the comment
  // obj in

  const calendarOwnerId = action.exploreObj.socialCalCell.socialCalUser.id
  const calendarCalCellId = action.exploreObj.socialCalCell.id
  const commentObj = action.exploreObj.socialComment
  let curProfileId = ''

  if (state.profile){
    curProfileId = state.profile.id
  }

  return updateObject(state, {
    profiles: state.profiles.map(
      profile => profile.id === calendarOwnerId ? {
        ...profile,
        get_socialCal: profile.get_socialCal.map(
          socialCell => socialCell.id === calendarCalCellId ? {
            ...socialCell,
            get_socialCalComment: [...socialCell.get_socialCalComment, commentObj]
          } :socialCell
        )
      } : profile
    ),
    profile: curProfileId === calendarOwnerId ? {
      ... state.profile,
      get_socialCal: state.profile.get_socialCal.map(
        socialCell => socialCell.id === calendarCalCellId ? {
          ... socialCell,
          get_socialCalComment: [... socialCell.get_socialCalComment, commentObj]
        } : socialCell
      )
    } : state.profile

  })
}

export const addSocialEventNew = (state, action) => {
  // This process will be simialr to all the other news
  console.log(action)
  const calendarOwnerId = action.exploreObj.socialCalCellObj.socialCalUser.id
  const calendarCalCellId = action.exploreObj.socialCalCellObj.id

  console.log(state.profile)
  let curProfileId = ''

  if (state.profile){
    curProfileId = state.profile.id
  }

  // Event though the profile is not in state, it is declared when the curProfile is loaded
  // in so it is there

  return updateObject(state, {
    profiles: state.profiles.map(
      profile => profile.id === calendarOwnerId ? {
        ... profile,
        get_socialCal: [... profile.get_socialCal, action.exploreObj.socialCalCellObj]
      } : profile
    ),
    profile: curProfileId === calendarOwnerId ? {
      ... state.profile,
      get_socialCal: [... state.profile.get_socialCal, action.exploreObj.socialCalCellObj]
    } : state.profile
  })
}

export const addSocialEventOld = (state,action) => {
  const calendarOwnerId = action.exploreObj.socialCalCell.socialCalUser.id
  const calendarCalCellId = action.exploreObj.socialCalCell.id
  const eventObj = action.exploreObj.socialEvent

  console.log(action.exploreObj.socialCalCell)
  console.log('hit here ')
  console.log(eventObj)
  let curProfileId = ''

  if (state.profile){
    curProfileId = state.profile.id
  }

  return updateObject(state, {
    profiles: state.profiles.map(
      profile => profile.id === calendarOwnerId ? {
        ...profile,
        get_socialCal: profile.get_socialCal.map(
          socialCell => socialCell.id === calendarCalCellId ? {
            ...socialCell,
            get_socialCalEvent: [...socialCell.get_socialCalEvent, eventObj]
          } :socialCell
        )
      } : profile
    ),
    profile: curProfileId === calendarOwnerId ? {
      ... state.profile,
      get_socialCal: state.profile.get_socialCal.map(
        socialCell => socialCell.id === calendarCalCellId ? {
          ... socialCell,
          get_socialCalEvent: [... socialCell.get_socialCalEvent, eventObj]
        } : socialCell
      )
    } : state.profile

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
    case actionTypes.ADD_SOCIAL_LIKE_NEW:
      return addSocialLikeNew(state, action)
    case actionTypes.ADD_SOCIAL_LIKE_OLD:
      return addSocialLikeOld(state, action)
    case actionTypes.ADD_SOCIAL_UNLIKE:
      return addSocialUnLike(state,action)
    case actionTypes.ADD_SOCIAL_COMMENT_NEW:
      return addSocialCommentNew(state, action)
    case actionTypes.ADD_SOCIAL_COMMENT_OLD:
      return addSocialCommentOld (state, action)
    case actionTypes.ADD_SOCIAL_EVENT_NEW:
      return addSocialEventNew(state, action)
    case actionTypes.ADD_SOCIAL_EVENT_OLD:
      return addSocialEventOld(state,action)
    default:
      return state;
  };

}

export default reducer;
