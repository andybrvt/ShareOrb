import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";


const initialState = {

  socialPosts: [],
  curSocialCell: {}
}


const loadSocialPosts = (state, action) => {

  return updateObject(state, {
    socialPosts: action.post
  })
}

const addSocialPostLike = (state, action) => {
  return updateObject(state, {
    socialPosts: state.socialPosts.map(
      socialPost => socialPost.id === action.postObj.contentTypeId ? {
        ...socialPost,
        post: action.postObj.socialCalCellObj
      } : socialPost
    )
  })
}

const loadCurSocialCell = (state, action) => {

  return updateObject(state, {
    curSocialCell: action.socialCell
  })
}

const addFirstSocialCellPost = (state, action) => {
  console.log(action)
  return updateObject(state, {
    socialPosts: [action.socialCell, ...state.socialPosts]
  })
}

const updateSocialCellPost = (state, action) => {
  return updateObject(state, {
    socialPosts: state.socialPosts.map(
      socialPost => socialPost.id === action.socialCell.id ?
        action.socialCell : socialPost
    )
  })
}


const reducer = (state = initialState, action) => {
  switch(action.type){
    case actionTypes.LOAD_SOCIAL_POSTS:
      return loadSocialPosts(state, action);
    case actionTypes.ADD_SOCIAL_POST_LIKE:
      return addSocialPostLike(state, action);
    case actionTypes.LOAD_CUR_SOCIAL_CELL:
      return loadCurSocialCell(state, action)
    case actionTypes.ADD_FIRST_SOCIAL_CELL_POST:
      return addFirstSocialCellPost(state, action)
    case actionTypes.UPDATE_SOCIAL_CELL_POST:
      return updateSocialCellPost(state, action)
    default:
      return state;

  }
}


export default reducer;
