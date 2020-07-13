import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  postLikes:{}
}

export const loadPostLike = (state, action) => {
  const postId = String(action.postId)
  const clonePostLikes = state.postLikes
  console.log(typeof postId)
  clonePostLikes[postId] = action.likes
  console.log(clonePostLikes)
  // state.postLikes[postId] = action.likes
  // const newPostLikes = { ...state.postLikes, }
  // So in the dictionary, the key will be the postId and the values
  // will be the number ofl likes
  return updateObject(state, {
    postLikes: clonePostLikes
  })
}

export const addPostLike = (state, action) => {
  console.log('stuff')
}

export const loadPostComment = (state, action) => {
  console.log('stuff')
}

export const addPostComment = (state, action ) => {
  console.log('stuff')
}



const reducer = (state = initialState, action) => {
  switch(action.type){
    case actionTypes.LOAD_POST_LIKE:
      return loadPostLike(state, action );
    case actionTypes.ADD_POST_LIKE:
      return addPostLike(state, action);
    case actionTypes.LOAD_POST_COMMENT:
      return loadPostComment(state, action);
    case actionTypes.ADD_POST_COMMENT:
      return addPostComment(state, action);
    default:
      return state;
  }
}

export default reducer;
