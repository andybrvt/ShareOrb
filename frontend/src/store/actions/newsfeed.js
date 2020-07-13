import * as actionTypes from './actionTypes';


export const loadPostLike = post => {
  console.log(post)
  // The arguments that will be coming it in will be a
  // dictionary that contains both postId and the number
  // of likes so you pretty much just add them to the
  // prop dict with the post id associated with the likes
  return {
    type: actionTypes.LOAD_POST_LIKE,
    likes: post.likes,
    postId: post.postId
  }
}

export const addPostLike = like => {
  return {
    type: actionTypes.ADD_POST_LIKE,
    like: like
  }
}

export const loadPostComment = comments => {
  // The format for the comments are probally gonna be the
  // same, where the comments will have the id associated with
  // the comments and the just get added into a list or what not
  return {
    type: actionTypes.LOAD_POST_COMMENT,
    comments: comments
  }
}

export const addPostComment = comment => {
  return {
    type: actionTypes.ADD_POST_COMMENT,
    comment: comment
  }
}
