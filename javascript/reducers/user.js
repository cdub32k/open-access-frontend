import * as jwt_decode from "jwt-decode";
import { ActionTypes } from "../actions";
import axios from "axios";

import store from "../store";
import { ActionCreators } from "../actions";

import apolloClient from "../apollo";
import { parse } from "graphql";

import { removeNull } from "../utils/helpers";
import { API_TOKEN_NAME, REFRESH_TOKEN_NAME } from "../constants";

const initialState = {
  active: true,
  activeUntil: null,
  profilePic: "",
  email: "",
  username: "",
  error: null,
  notifications: [],
  notificationsSubscription: null,
  loggedIn: false,
  loading: true,
  ai_loading: false,
  viewed: {
    loading: true,
    username: "",
    videos: [],
    images: [],
    notes: [],
    comments: [],
    likes: [],
    dislikes: [],
  },
  payment: {
    charges: [],
    subscriptions: [],
  },
  all: [],
};

const subscribeToNotifications = (username) => {
  return apolloClient
    .subscribe({
      query: parse(`
          subscription notifications($username: String!) {
            notifications(username: $username) {
              _id
              type
              target
              targetId
              body
              sender
              read
              commentId
              createdAt
            }
          }
        `),
      variables: { username },
    })
    .subscribe({
      next({ data: { notifications } }) {
        store.dispatch(ActionCreators.addNotification(notifications));
      },
    });
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.CLEAR_ERRORS:
      return { ...state, error: null };
    case ActionTypes.LOGIN_SUCCESS: {
      let { token, refreshToken } = action.payload;
      localStorage.setItem(API_TOKEN_NAME, token);
      localStorage.setItem(REFRESH_TOKEN_NAME, refreshToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      axios.defaults.headers.common["x-refresh-token"] = refreshToken;
      let decodedToken = jwt_decode(token);

      const { username, email, profilePic } = decodedToken;

      const notificationsSubscription = subscribeToNotifications(username);

      return {
        ...state,
        loggedIn: true,
        username,
        email,
        profilePic,
        notificationsSubscription,
      };
    }
    case ActionTypes.LOGIN_ERROR:
      localStorage.removeItem(API_TOKEN_NAME);
      localStorage.removeItem(REFRESH_TOKEN_NAME);
      return { ...state, loggedIn: false, error: action.error };
    case ActionTypes.AUTO_LOGIN: {
      const token = localStorage.getItem(API_TOKEN_NAME);
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_NAME);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      axios.defaults.headers.common["x-refresh-token"] = refreshToken;
      let decodedToken = jwt_decode(token);
      const { username, email } = decodedToken;

      const notificationsSubscription = subscribeToNotifications(username);

      return {
        ...state,
        loading: true,
        loggedIn: true,
        username,
        email,
        notificationsSubscription,
      };
    }
    case ActionTypes.LOGOUT:
      localStorage.removeItem(API_TOKEN_NAME);
      localStorage.removeItem(REFRESH_TOKEN_NAME);
      state.notificationsSubscription &&
        state.notificationsSubscription.unsubscribe();
      return { ...initialState };
    case ActionTypes.USER_INFO_LOADING:
      return { ...state, loading: true };
    case ActionTypes.VIEWED_USER_LOADING:
      return { ...state, viewed: { ...state.viewed, loading: true } };
    case ActionTypes.VIEWED_USER_DONE_LOADING:
      return { ...state, viewed: { ...state.viewed, loading: false } };
    case ActionTypes.GET_USER_INFO_SUCCESS:
      return {
        ...state,
        viewed: { ...state.viewed, ...action.payload.userInfo, loading: false },
        loading: false,
      };
    case ActionTypes.MAKE_PAYMENT_START:
      return { ...state, loading: true };
    case ActionTypes.MAKE_PAYMENT_SUCCESS:
      return { ...state, loading: false };
    case ActionTypes.MAKE_PAYMENT_ERROR:
      return { ...state, loading: false };
    case ActionTypes.GET_USER_INFO_ERROR:
      return {
        ...state,
        viewed: { ...state.viewed, error: action.error },
      };
    case ActionTypes.GET_USER_ACCOUNT_INFO_START:
      return { ...state, ai_loading: true };
    case ActionTypes.GET_USER_ACCOUNT_INFO_SUCCESS:
      return {
        ...state,
        ...action.payload.userData,
        ai_loading: false,
      };
    case ActionTypes.GET_USER_ACCOUNT_INFO_ERROR:
      return {
        ...state,
        error: action.error,
        ai_loading: false,
      };
    case ActionTypes.UPDATE_ACCOUNT_INFO_START:
      return { ...state, loading: true };
    case ActionTypes.UPDATE_ACCOUNT_INFO_SUCCESS:
      return {
        ...state,
        ...action.payload.userData,
        loading: false,
      };
    case ActionTypes.UPDATE_ACCOUNT_INFO_ERROR:
      return {
        ...state,
        error: action.error,
        loading: false,
      };
    case ActionTypes.LOAD_USER_COMMENTS_PAGE_START:
      return { ...state, viewed: { ...state.viewed, loading: true } };
    case ActionTypes.LOAD_USER_COMMENTS_PAGE_SUCCESS:
      return {
        ...state,
        viewed: {
          ...state.viewed,
          comments: [...state.viewed.comments, ...action.payload.comments],
          hasMoreComments: action.payload.hasMoreComments,
          loading: false,
        },
      };
    case ActionTypes.LOAD_USER_COMMENTS_PAGE_ERROR:
      return {
        ...state,
        viewed: { ...state.viewed, error: action.error },
      };
    case ActionTypes.LOAD_USER_LIKES_PAGE_START:
      return { ...state, viewed: { ...state.viewed, loading: true } };
    case ActionTypes.LOAD_USER_LIKES_PAGE_SUCCESS:
      return {
        ...state,
        viewed: {
          ...state.viewed,
          likes: [...state.viewed.likes, ...action.payload.likes],
          hasMoreLikes: action.payload.hasMoreLikes,
          loading: false,
        },
      };
    case ActionTypes.LOAD_USER_LIKES_PAGE_ERROR:
      return {
        ...state,
        viewed: { ...state.viewed, error: action.error },
      };
    case ActionTypes.LOAD_USER_DISLIKES_PAGE_START:
      return { ...state, viewed: { ...state.viewed, loading: true } };
    case ActionTypes.LOAD_USER_DISLIKES_PAGE_SUCCESS:
      return {
        ...state,
        viewed: {
          ...state.viewed,
          dislikes: [...state.viewed.dislikes, ...action.payload.dislikes],
          hasMoreDislikes: action.payload.hasMoreDislikes,
          loading: false,
        },
      };
    case ActionTypes.LOAD_USER_DISLIKES_PAGE_ERROR:
      return {
        ...state,
        viewed: { ...state.viewed, error: action.error },
      };
    case ActionTypes.LOAD_USER_VIDEO_PAGE_START:
      return { ...state, viewed: { ...state.viewed, loading: true } };
    case ActionTypes.LOAD_USER_VIDEO_PAGE_SUCCESS:
      return {
        ...state,
        viewed: {
          ...state.viewed,
          videos: [...state.viewed.videos, ...action.payload.videos],
          hasMoreVideos: action.payload.hasMoreVideos,
          loading: false,
        },
      };
    case ActionTypes.LOAD_USER_VIDEO_PAGE_ERROR:
      return {
        ...state,
        viewed: { ...state.viewed, error: action.error },
      };
    case ActionTypes.LOAD_USER_IMAGE_PAGE_START:
      return { ...state, viewed: { ...state.viewed, loading: true } };
    case ActionTypes.LOAD_USER_IMAGE_PAGE_SUCCESS:
      return {
        ...state,
        viewed: {
          ...state.viewed,
          images: [...state.viewed.images, ...action.payload.images],
          hasMoreImages: action.payload.hasMoreImages,
          loading: false,
        },
      };
    case ActionTypes.LOAD_USER_IMAGE_PAGE_ERROR:
      return {
        ...state,
        viewed: { ...state.viewed, error: action.error },
      };
    case ActionTypes.LOAD_USER_NOTE_PAGE_START:
      return { ...state, viewed: { ...state.viewed, loading: true } };
    case ActionTypes.LOAD_USER_NOTE_PAGE_SUCCESS:
      return {
        ...state,
        viewed: {
          ...state.viewed,
          notes: [...state.viewed.notes, ...action.payload.notes],
          hasMoreNotes: action.payload.hasMoreNotes,
          loading: false,
        },
      };
    case ActionTypes.LOAD_USER_NOTE_PAGE_ERROR:
      return {
        ...state,
        viewed: { ...state.viewed, loading: false, error: action.error },
      };
    case ActionTypes.CLEAR_USER_DATA:
      return {
        ...state,
        viewed: { ...initialState.viewed },
      };
    case ActionTypes.MARK_NOTIFICATIONS_READ_SUCCESS:
      const readNotifs = state.notifications.map((notif) => {
        notif.read = true;
        return notif;
      });
      return { ...state, notifications: readNotifs };
    case ActionTypes.MARK_NOTIFICATIONS_READ_ERROR:
      return { ...state, error: action.error };
    case ActionTypes.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [action.payload.notification, ...state.notifications],
      };

    case ActionTypes.LOAD_USER_PAYMENT_INFO_START:
      return { ...state, loading: true };
    case ActionTypes.LOAD_USER_PAYMENT_INFO_SUCCESS:
      return {
        ...state,
        active: action.payload.active,
        activeUntil: action.payload.activeUntil,
        payment: {
          ...state.payment,
          charges: action.payload.charges,
          subscriptions: action.payload.subscriptions,
        },
        loading: false,
      };
    case ActionTypes.LOAD_USER_PAYMENT_INFO_ERROR:
      return {
        ...state,
        error: action.error,
        loading: false,
      };
    case ActionTypes.GET_ALL_USERNAMES:
      return {
        ...state,
        loading: true,
      };
    case ActionTypes.GET_ALL_USERNAMES_SUCCESS:
      return {
        ...state,
        loading: false,
        all: action.payload.users,
      };
    case ActionTypes.GET_ALL_USERNAMES_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    default:
      return { ...state };
  }
};

export default userReducer;
