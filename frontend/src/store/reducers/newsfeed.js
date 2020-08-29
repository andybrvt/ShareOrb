import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  posts: [],
}

export const loadPosts = (state, action) => {
  // state.postLikes[postId] = action.likes
  // const newPostLikes = { ...state.postLikes, }
  // So in the dictionary, the key will be the postId and the values
  // will be the number ofl likes
  return updateObject(state, {
    posts: action.post
  })
}

export const addPostLike = (state, action) => {
  return updateObject(state, {
    posts: state.posts.map(
      post => post.id === action.like.postId ? {
        ...post,
        like_count : post.like_count + 1,
        people_like: [...post.people_like, action.like.userObj]
      } : post
    )
  })

}

export const unaddPostLike = (state, action) => {
  let person_post = state.posts
  let person_index = ''
  let like_list = []
  for (let i = 0; i< person_post.length; i++){
    if(person_post[i].id === action.unlike.postId){
      person_index = person_post[i]['people_like'].indexOf(action.unlike.userId)
      like_list = person_post[i]['people_like']
      like_list.splice(person_index,1)
    }
  }


  return updateObject(state, {
    posts: state.posts.map(
      post => post.id === action.unlike.postId ? {
        ...post,
        people_like: like_list
      } : post
    )
  })
}


export const addPostComment = (state, action ) => {
  console.log(action.comment.comment.post)
  return updateObject(state, {
    posts: state.posts.map(
      post => post.id === action.comment.comment.post ? {
        ...post,
        post_comments: [...post.post_comments, action.comment.comment]
      } : post
    )
  })

}


const reducer = (state = initialState, action) => {
  switch(action.type){
    case actionTypes.LOAD_POSTS:
      return loadPosts(state, action );
    case actionTypes.ADD_POST_LIKE:
      return addPostLike(state, action);
    case actionTypes.UNADD_POST_LIKE:
      return unaddPostLike(state,action);
    case actionTypes.ADD_POST_COMMENT:
      return addPostComment(state, action);
    default:
      return state;
  }
}

export default reducer;
