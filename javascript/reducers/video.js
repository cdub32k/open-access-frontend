import { ActionTypes } from "../actions";

import store from "../store";
import { ActionCreators } from "../actions";
import apolloClient from "../apollo";
import { parse } from "graphql";

import {
  removeNull,
  findComment,
  findAndDeleteComment,
  parseLinks,
  convertVideoTimestampsToLinks,
} from "../utils/helpers";

const initialState = {
  error: null,
  user: {},
  loading: true,
  comments: [],
  hasMoreComments: false,
  commentsLoading: false,
  newCommentLoading: false,
};

const subscribeToVideoItemUpdates = (videoId) => {
  return apolloClient
    .subscribe({
      query: parse(`
        subscription VideoItem($videoId: String) {
          videoItem(videoId: $videoId) {
            _id
            likeCount
            dislikeCount
            commentCount
            viewCount
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
      variables: { videoId },
    })
    .subscribe({
      next({ data: { videoItem } }) {
        store.dispatch(ActionCreators.videoItemUpdate(videoItem));
      },
    });
};

const videoReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.CLEAR_ERRORS:
      return { ...state, error: null };
    case ActionTypes.VIDEO_LOADING:
      return { ...state, loading: true };
    case ActionTypes.GET_VIDEO_INFO_SUCCESS:
      let hasMoreComments = true;
      if (action.payload.videoData.comments.length < 4) hasMoreComments = false;
      if (
        action.payload.videoData.comments[0] &&
        action.payload.videoData.comments[0].replies
      ) {
        let comm = action.payload.videoData.comments[0];

        while (comm.replies) {
          comm.replies = JSON.parse(comm.replies);
          comm = comm.replies[0];
        }
      }
      return {
        ...state,
        ...action.payload.videoData,
        hasMoreComments,
        loading: false,
      };
    case ActionTypes.GET_VIDEO_INFO_ERROR:
      return { ...state, error: action.error, loading: false };
    case ActionTypes.RECORD_VIDEO_VIEW_SUCCESS:
      return { ...state };
    case ActionTypes.RECORD_VIDEO_VIEW_ERROR:
      return { ...state };
    case ActionTypes.LIKE_VIDEO_START:
      return {
        ...state,
        liked: !state.liked,
        likeCount: state.likeCount + (state.liked ? -1 : 1),
      };
    case ActionTypes.LIKE_VIDEO_ERROR:
      return { ...state };
    case ActionTypes.DISLIKE_VIDEO_START:
      return {
        ...state,
        disliked: !state.disliked,
        dislikeCount: state.dislikeCount + (state.disliked ? -1 : 1),
      };
    case ActionTypes.DISLIKE_VIDEO_ERROR:
      return { ...state };

    case ActionTypes.POST_VIDEO_COMMENT_START:
      return {
        ...state,
        newCommentLoading: true,
        newCommentReplyId: action.payload.replyId,
      };
    case ActionTypes.POST_VIDEO_COMMENT_SUCCESS:
      return { ...state, newCommentLoading: false, newCommentReplyId: null };
    case ActionTypes.POST_VIDEO_COMMENT_ERROR:
      return {
        ...state,
        newCommentLoading: false,
        newCommentReplyId: null,
      };
    case ActionTypes.CLEAR_VIDEO_DATA:
      return { ...initialState };
    case ActionTypes.SUBSCRIBE_VIDEO_ITEM_UPDATES:
      const subscription = subscribeToVideoItemUpdates(action.payload.videoId);
      return { ...state, subscription };
    case ActionTypes.VIDEO_ITEM_UPDATE:
      let v = removeNull(action.payload.video);
      if (v.comments && v.comments.length) {
        if (v.comments[0].replyId) {
          let reply = v.comments[0];

          let nComments = [...state.comments];
          let parent = findComment(nComments, reply.replyId);
          parent.replies
            ? (parent.replies = [reply, ...parent.replies])
            : (parent.replies = [reply]);
          parent.replyCount++;
          v.comments = nComments;
        } else if (
          (v.comments[0].likeCount || v.comments[0].likeCount === 0) &&
          !v.comments[0].body
        ) {
          let c = v.comments[0];
          let nComments = [...state.comments];
          let comm = findComment(nComments, c._id);
          comm.likeCount = c.likeCount;
          v.comments = nComments;
        } else if (
          (v.comments[0].dislikeCount || v.comments[0].dislikeCount === 0) &&
          !v.comments[0].body
        ) {
          let c = v.comments[0];
          let nComments = [...state.comments];
          let comm = findComment(nComments, c._id);

          comm.dislikeCount = c.dislikeCount;
          v.comments = nComments;
        } else v.comments = [...v.comments, ...state.comments];
      } else delete v["comments"];
      return { ...state, ...v };
    case ActionTypes.DELETE_VIDEO_COMMENT:
      let fComments = findAndDeleteComment(
        [...state.comments],
        action.payload._id
      );
      return {
        ...state,
        commentCount: action.payload.commentCount,
        comments: fComments,
      };
    case ActionTypes.LOAD_MORE_VIDEO_COMMENTS:
      return { ...state, commentsLoading: true };
    case ActionTypes.LOAD_MORE_VIDEO_COMMENTS_SUCCESS:
      hasMoreComments = true;
      if (action.payload.items.length < 4) hasMoreComments = false;
      return {
        ...state,
        comments: [...state.comments, ...action.payload.items],
        hasMoreComments,
        commentsLoading: false,
      };
    case ActionTypes.LOAD_MORE_VIDEO_COMMENTS_ERROR:
      return { ...state, commentsLoading: false };
    case ActionTypes.UPDATE_VIDEO_COMMENT:
      let nComments = [...state.comments];
      let c = findComment(nComments, action.payload._id);
      c.body = convertVideoTimestampsToLinks(
        action.payload._id,
        parseLinks(action.payload.body)
      );
      return { ...state, comments: nComments };
    case ActionTypes.GET_VIDEO_COMMENT_REPLIES:
      return { ...state, repliesLoading: action.payload._id };
    case ActionTypes.GET_VIDEO_COMMENT_REPLIES_SUCCESS:
      nComments = [...state.comments];
      let parent = findComment(nComments, action.payload._id);
      parent.replies = action.payload.replies;
      return { ...state, comments: nComments, repliesLoading: false };
    case ActionTypes.GET_VIDEO_COMMENT_REPLIES_ERROR:
      return { ...state, repliesLoading: false };
    case ActionTypes.LIKE_VIDEO_COMMENT:
      nComments = [...state.comments];
      c = findComment(nComments, action.payload.commentId);
      c.liked = !c.liked;
      c.likeCount += c.liked ? 1 : -1;
      return { ...state, comments: nComments };
    case ActionTypes.DISLIKE_VIDEO_COMMENT:
      nComments = [...state.comments];
      c = findComment(nComments, action.payload.commentId);
      c.disliked = !c.disliked;
      c.dislikeCount += c.disliked ? 1 : -1;
      return { ...state, comments: nComments };
    default:
      return state;
  }
};

export default videoReducer;
