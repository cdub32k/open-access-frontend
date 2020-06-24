import { ActionTypes } from "../actions";

import store from "../store";
import { ActionCreators } from "../actions";
import apolloClient from "../apollo";
import { parse } from "graphql";

import {
  removeNull,
  findComment,
  findAndDeleteComment,
} from "../utils/helpers";

const initialState = {
  error: null,
  user: {},
  loading: true,
  comments: [],
  commentsLoading: false,
  newCommentLoading: false,
};

const subscribeToImageItemUpdates = (imageId) => {
  return apolloClient
    .subscribe({
      query: parse(`
        subscription ImageItem($imageId: String) {
          imageItem(imageId: $imageId) {
            _id
            likeCount
            dislikeCount
            commentCount
            comments {
              _id
              user {
                username
                profilePic
              }
              body
              createdAt
              replyId
              replyCount
              likeCount
              dislikeCount
            }
          }
        }
     `),
      variables: { imageId },
    })
    .subscribe({
      next({ data: { imageItem } }) {
        store.dispatch(ActionCreators.imageItemUpdate(imageItem));
      },
    });
};

const imageReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.CLEAR_ERRORS:
      return { ...state, error: null };
    case ActionTypes.IMAGE_LOADING:
      return { ...state, loading: true };
    case ActionTypes.GET_IMAGE_INFO_SUCCESS:
      let hasMoreComments = true;
      if (action.payload.imageData.comments.length < 4) hasMoreComments = false;
      if (
        action.payload.imageData.comments[0] &&
        action.payload.imageData.comments[0].replies
      ) {
        let comm = action.payload.imageData.comments[0];

        while (comm.replies) {
          comm.replies = JSON.parse(comm.replies);
          comm = comm.replies[0];
        }
      }
      return {
        ...state,
        ...action.payload.imageData,
        hasMoreComments,
        loading: false,
      };
    case ActionTypes.GET_IMAGE_INFO_ERROR:
      return { ...state, error: action.error, loading: false };
    case ActionTypes.LIKE_IMAGE_START:
      return {
        ...state,
        liked: !state.liked,
        likeCount: state.likeCount + (state.liked ? -1 : 1),
      };
    case ActionTypes.LIKE_IMAGE_ERROR:
      return { ...state };
    case ActionTypes.DISLIKE_IMAGE_START:
      return {
        ...state,
        disliked: !state.disliked,
        dislikeCount: state.dislikeCount + (state.disliked ? -1 : 1),
      };
    case ActionTypes.DISLIKE_IMAGE_ERROR:
      return { ...state };
    case ActionTypes.POST_IMAGE_COMMENT_START:
      return {
        ...state,
        newCommentLoading: true,
        newCommentReplyId: action.payload.replyId,
      };
    case ActionTypes.POST_IMAGE_COMMENT_SUCCESS:
      return { ...state, newCommentLoading: false, newCommentReplyId: null };
    case ActionTypes.POST_IMAGE_COMMENT_ERROR:
      return {
        ...state,
        error: action.error,
        newCommentLoading: false,
        newCommentReplyId: null,
      };
    case ActionTypes.CLEAR_IMAGE_DATA:
      return { ...initialState };
    case ActionTypes.SUBSCRIBE_IMAGE_ITEM_UPDATES:
      const subscription = subscribeToImageItemUpdates(action.payload.imageId);
      return { ...state, subscription };
    case ActionTypes.IMAGE_ITEM_UPDATE:
      let i = removeNull(action.payload.image);
      if (i.comments && i.comments.length) {
        if (i.comments[0].replyId) {
          let reply = i.comments[0];

          let nComments = [...state.comments];
          let parent = findComment(nComments, reply.replyId);
          parent.replies
            ? (parent.replies = [reply, ...parent.replies])
            : (parent.replies = [reply]);
          parent.replyCount++;
          i.comments = nComments;
        } else if (
          (i.comments[0].likeCount || i.comments[0].likeCount === 0) &&
          !i.comments[0].body
        ) {
          let c = i.comments[0];

          let nComments = [...state.comments];
          let comm = findComment(nComments, c._id);
          comm.likeCount = c.likeCount;
          i.comments = nComments;
        } else if (
          (i.comments[0].dislikeCount || i.comments[0].dislikeCount === 0) &&
          !i.comments[0].body
        ) {
          let c = i.comments[0];

          let nComments = [...state.comments];
          let comm = findComment(nComments, c._id);
          comm.dislikeCount = c.dislikeCount;
          i.comments = nComments;
        } else i.comments = [...i.comments, ...state.comments];
      } else delete i["comments"];
      return { ...state, ...i };
    case ActionTypes.DELETE_IMAGE_COMMENT:
      let fComments = findAndDeleteComment(
        [...state.comments],
        action.payload._id
      );

      return {
        ...state,
        commentCount: action.payload.commentCount,
        comments: fComments,
      };
    case ActionTypes.LOAD_MORE_IMAGE_COMMENTS:
      return { ...state, commentsLoading: true };
    case ActionTypes.LOAD_MORE_IMAGE_COMMENTS_SUCCESS:
      hasMoreComments = true;
      if (action.payload.items.length < 4) hasMoreComments = false;
      return {
        ...state,
        comments: [...state.comments, ...action.payload.items],
        hasMoreComments,
        commentsLoading: false,
      };
    case ActionTypes.LOAD_MORE_IMAGE_COMMENTS_ERROR:
      return { ...state, error: action.error, commentsLoading: false };
    case ActionTypes.UPDATE_IMAGE_COMMENT:
      let nComments = [...state.comments];
      let c = findComment(nComments, action.payload._id);
      c.body = action.payload.body;
      return { ...state, comments: nComments };
    case ActionTypes.GET_IMAGE_COMMENT_REPLIES:
      return { ...state, repliesLoading: action.payload._id };
    case ActionTypes.GET_IMAGE_COMMENT_REPLIES_SUCCESS:
      nComments = [...state.comments];
      let parent = findComment(nComments, action.payload._id);
      parent.replies = action.payload.replies;
      return { ...state, comments: nComments, repliesLoading: false };
    case ActionTypes.GET_VIDEO_COMMENT_REPLIES_ERROR:
      return { ...state, error: action.error, repliesLoading: false };
    case ActionTypes.UPDATE_IMAGE:
      return { ...state, ...action.payload };
    case ActionTypes.LIKE_IMAGE_COMMENT:
      nComments = [...state.comments];
      c = findComment(nComments, action.payload.commentId);
      c.liked = !c.liked;
      c.likeCount += c.liked ? 1 : -1;
      return { ...state, comments: nComments };
    case ActionTypes.DISLIKE_IMAGE_COMMENT:
      nComments = [...state.comments];
      c = findComment(nComments, action.payload.commentId);
      c.disliked = !c.disliked;
      c.dislikeCount += c.disliked ? 1 : -1;
      return { ...state, comments: nComments };
    default:
      return state;
  }
};

export default imageReducer;
