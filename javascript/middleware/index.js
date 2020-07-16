import { ActionTypes, ActionCreators } from "../actions";
import axios from "axios";
axios.defaults.baseURL = process.env.API_URL;
axios.interceptors.response.use(
  (response) => {
    if (response.headers && response.headers["x-token"]) {
      localStorage.setItem(
        "open-access-api-token",
        response.headers["x-token"]
      );
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.headers["x-token"]}`;
    }
    if (response.headers && response.headers["x-refresh-token"]) {
      localStorage.setItem(
        "open-access-api-refresh-token",
        response.headers["x-refresh-token"]
      );
      axios.defaults.headers.common["x-refresh-token"] =
        response.headers["x-refresh-token"];
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

import apolloCache from "../apollo";
import { parse } from "graphql";

import { perPage } from "../constants";

const GET_ALL_USERNAMES_QUERY = `
  query Usernames {
    users {
      username
      smallPic
    }
  }
`;

const GET_USER_INFO_QUERY = `
  query UserInfo($username: String!) {
    user(username: $username) {
      active
      activeUntil
      username
      profilePic
      displayName
      bio
      joinedAt
      videos {
        _id
        user {
          username
          profilePic
        }
        title
        viewCount
        thumbUrl
        uploadedAt
        liked
        disliked
      }
      videoCount
      imageCount
      noteCount
      commentCount
      likeCount
      dislikeCount
      
    }
  }
`;

const GET_USER_PAYMENT_INFO_QUERY = `
  query UserPaymentInfo($username: String!) {
    user(username: $username) {
      active
      activeUntil
      nextBillDate
      charges {
        amount
        createdAt
        _id
      }
      subscriptions {
        _id
        amount
        terminated
        terminatedAt
        createdAt
      }
    }
  }
`;

const GET_VIDEO_INFO_QUERY = `
  query VideoInfo($videoId: String!, $cId: String) {
    video(id: $videoId, cId: $cId) {
      user {
        profilePic
        username
      }
      comments {
        _id
        user {
          username
          profilePic
        }
        body
        createdAt
        replyCount
        likeCount
        dislikeCount
        liked
        disliked
        highlighted
        replies
      }
      title
      caption
      viewCount
      likeCount
      dislikeCount
      commentCount
      url
      thumbUrl
      uploadedAt
      liked
      disliked
    }
  }
`;

const GET_IMAGE_INFO_QUERY = `
  query ImageInfo($imageId: String!, $cId: String){
    image(id: $imageId, cId: $cId) {
      user {
        profilePic
        username
      }
      comments {
        _id
        user {
          username
          profilePic
        }
        body
        createdAt
        replyCount
        likeCount
        dislikeCount
        liked
        disliked
        highlighted
        replies
      }
      title
      caption
      url
      likeCount
      dislikeCount
      commentCount
      uploadedAt
      liked
      disliked
    }
  }
`;

const GET_NOTE_INFO_QUERY = `
  query NoteInfo($noteId: String!, $cId: String) {
    note(id: $noteId, cId: $cId) {
      user {
        profilePic
        username
      }
      comments {
        _id
        user {
          username
          profilePic
        }
        body
        createdAt
        replyCount
        likeCount
        dislikeCount
        liked
        disliked
        highlighted
        replies
      }
      caption      
      likeCount
      dislikeCount
      commentCount            
      uploadedAt
      liked
      disliked
    }
  }
`;

const USER_LIKES_PAGE_QUERY = `
  query UserLikesPage($username: String!, $page: Int!) {
    likesSearch(username: $username, page: $page) {
      likes {
        ... on VideoLike {
          _id
          video {
            _id
            title
            thumbUrl
          }
          createdAt
        }
        ... on ImageLike {
          _id
          image {
            _id
            title
            url
          }
          createdAt
        }
        ... on NoteLike {
          _id
          note {
            _id
            caption
          }
          createdAt
        }
      }
    }
  }
`;
const USER_DISLIKES_PAGE_QUERY = `
  query UserDislikesPage($username: String!, $page: Int!) {
    dislikesSearch(username: $username, page: $page) {
      dislikes {
        ... on VideoDislike {
          _id
          video {
            _id
            title
            thumbUrl
          }
          createdAt
        }
        ... on ImageDislike {
          _id
          image {
            _id
            title
            url
          }
          createdAt
        }
        ... on NoteDislike {
          _id
          note {
            _id
            caption
          }
          createdAt
        }
      }
    }
  }
`;

const USER_COMMENTS_PAGE_QUERY = `
  query UserCommentPage($username: String!, $page: Int!) {
    commentsSearch(username: $username, page: $page) {
      comments {
        ... on VideoComment {
          _id
          video {
            _id
          }
          replyId
          body
          createdAt
        }
        ... on ImageComment {
          _id
          image {
            _id
          }
          body
          replyId
          createdAt
        }
        ... on NoteComment {
          _id
          note {
            _id
          }
          body
          replyId
          createdAt
        }
      }
    }
  }
`;

const VIDEO_SEARCH_RESULTS_PAGE_WITH_COUNTS_QUERY = `
  query VideoSearchResultsPage($page: Int, $query: String, $hashtag: String, $sort: Int){
    videoSearch(query: $query, hashtag: $hashtag, page: $page, sort: $sort) {
      videos {
        _id
        user {
          username
          profilePic
        }
        title
        caption
        likeCount
        dislikeCount
        commentCount
        thumbUrl
        uploadedAt
      }
      hasMore
      videoCount
      imageCount
      noteCount
    }
  }
`;
const VIDEO_SEARCH_RESULTS_PAGE_QUERY = `
  query VideoSearchResultsPage($page: Int, $query: String, $hashtag: String, $sort: Int){
    videoSearch(query: $query, hashtag: $hashtag, page: $page, sort: $sort) {
      videos {
        _id
        user {
          username
          profilePic
        }
        title
        caption
        likeCount
        dislikeCount
        commentCount
        thumbUrl
        uploadedAt
      }
      hasMore
    }
  }
`;
const IMAGE_SEARCH_RESULTS_PAGE_QUERY = `
  query ImageSearchResultsPage($page: Int, $query: String, $hashtag: String, $sort: Int){
    imageSearch(query: $query, hashtag: $hashtag, page: $page, sort: $sort) {
      images {
        _id
        user {
          username
          profilePic
        }
        thumbUrl
        likeCount
        dislikeCount
        commentCount
        uploadedAt
      }
      hasMore
    }
  }
`;
const NOTE_SEARCH_RESULTS_PAGE_QUERY = `
  query NoteSearchResultsPage($page: Int, $query: String, $hashtag: String, $sort: Int){
    noteSearch(query: $query, hashtag: $hashtag, page: $page, sort: $sort) {
      notes {
        _id
        user {
          username
          profilePic
        }
        caption
        likeCount
        dislikeCount
        commentCount
        uploadedAt
      }
      hasMore
    }
  }
`;

const USER_VIDEO_PAGE_QUERY = `
  query UserVideoPage($username: String!, $page: Int!){
    videoSearch(username: $username, page: $page) {
      videos {
        _id
        user {
          username
          profilePic
        }
        title
        viewCount
        thumbUrl
        uploadedAt
        liked
        disliked
      }
      hasMore
    }
  }
`;

const USER_IMAGE_PAGE_QUERY = `
  query UserImagePage($username: String!, $page: Int!) {
    imageSearch(username: $username, page: $page) {
      images {
        _id
        user {
          username
          profilePic
        }
        title
        likeCount
        url
        uploadedAt
        liked
        disliked
      }
      hasMore
    }
  }
`;

const USER_NOTE_PAGE_QUERY = `
  query UserNotePage($username: String!, $page: Int!) {
    noteSearch(username: $username, page: $page) {
      notes {
        _id
        user {
          username
          profilePic
        }
        commentCount
        caption
        uploadedAt
        liked
        disliked
      }
      hasMore
    }
  }
`;

const GET_USER_NOTIFICATIONS_QUERY = `
  query UserNotifications($username: String!, $page: Int) {
    user(username: $username) {
      active
      activeUntil
      notifsInfo(page: $page) {
        unreadCount
        notifications {
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
    }
  }
`;

const MARK_NOTIFICATIONS_READ_QUERY = `
  mutation MarkNotificationsRead($ids: [String]!) {
    markNotificationsRead(ids: $ids)
  }
`;

const GET_NEWSFEED_VIDEOS_QUERY = `
  query NewsfeedVideos($page: Int, $sort: Int) {
    newsfeedVideos(page: $page, sort: $sort) {
      _id
      user {
        username
        profilePic
      }
      uploadedAt
      likeCount
      dislikeCount
      commentCount
      thumbUrl
      title
      caption
    }
  }
`;
const GET_NEWSFEED_IMAGES_QUERY = `
  query NewsfeedImages($page: Int, $sort: Int) {
    newsfeedImages(page: $page, sort: $sort) {
      _id
      user {
        username
        profilePic
      }
      uploadedAt
      likeCount
      dislikeCount
      commentCount
      thumbUrl
    }
  }
`;
const GET_NEWSFEED_NOTES_QUERY = `
  query NewsfeedNotes($page: Int, $sort: Int) {
    newsfeedNotes(page: $page, sort: $sort) {
      _id
      user {
        username
        profilePic
      }
      uploadedAt
      likeCount
      dislikeCount
      commentCount
      caption
    }
  }
`;

const LOAD_MORE_IMAGE_COMMENTS_QUERY = `
  query ImageInfo($imageId: String!, $page: Int, $sort: Int) {
    image(id: $imageId) {
      comments(page: $page, sort: $sort) {
        _id
        user {
          username
          profilePic
        }
        body
        createdAt
        likeCount
        dislikeCount
        liked
        disliked
        replyCount
      }
    }
  }
`;
const LOAD_MORE_VIDEO_COMMENTS_QUERY = `
  query VideoInfo($videoId: String!, $page: Int, $sort: Int) {
    video(id: $videoId) {
      comments(page: $page, sort: $sort) {
        _id
        user {
          username
          profilePic
        }
        body
        createdAt
        likeCount
        dislikeCount
        liked
        disliked
        replyCount
      }
    }
  }
`;
const LOAD_MORE_NOTE_COMMENTS_QUERY = `
  query NoteInfo($noteId: String!, $page: Int, $sort: Int) {
    note(id: $noteId) {
      comments(page: $page, sort: $sort) {
        _id
        user {
          username
          profilePic
        }
        body
        createdAt
        likeCount
        dislikeCount
        liked
        disliked
        replyCount
      }
    }
  }
`;
const LOAD_VIDEO_COMMENT_REPLIES_QUERY = `
  query VideoCommentReplies($commentId: String!) {
    videoCommentReplies(commentId:$commentId) {
      _id
        user {
          username
          profilePic
        }
        body
        createdAt
        replyCount
        replyId
        likeCount
        dislikeCount
        liked
        disliked
    }
  }
`;

const LOAD_IMAGE_COMMENT_REPLIES_QUERY = `
  query ImageCommentReplies($commentId: String!) {
    imageCommentReplies(commentId:$commentId) {
      _id
        user {
          username
          profilePic
        }
        body
        createdAt
        replyCount
        replyId
        likeCount
        dislikeCount
        liked
        disliked
    }
  }
`;
const LOAD_NOTE_COMMENT_REPLIES_QUERY = `
  query NoteCommentReplies($commentId: String!) {
    noteCommentReplies(commentId:$commentId) {
      _id
        user {
          username
          profilePic
        }
        body
        createdAt
        replyCount
        replyId
        likeCount
        dislikeCount
        liked
        disliked
    }
  }
`;
export default [
  (store) => (next) => (action) => {
    if (action.type == ActionTypes.MARK_NOTIFICATIONS_READ_START) {
      axios
        .post("/api", {
          query: MARK_NOTIFICATIONS_READ_QUERY,
          variables: {
            ids: store.getState().user.notifications.map((notif) => notif._id),
          },
        })
        .then((res) => {
          if (res.data.data.markNotificationsRead)
            next(ActionCreators.markNotificationsReadSuccess());
          else next(ActionCreators.markNotificationsReadError());
        })
        .catch((err) => next(ActionCreators.markNotificationsReadError(err)));
    } else if (action.type == ActionTypes.LOGIN_START) {
      axios
        .post("auth/sign-in", action.payload.credentials)
        .then((res) => {
          if (res.data.auth) {
            next(
              ActionCreators.loginSuccess(res.data.token, res.data.refreshToken)
            );

            axios
              .post("/api", {
                query: GET_USER_NOTIFICATIONS_QUERY,
                variables: { username: action.payload.credentials.username },
              })
              .then((res) => {
                next(ActionCreators.getStartupInfoSuccess(res.data.data.user));
              })
              .catch((err) => next(ActionCreators.getStartupInfoError(err)));
          } else throw new Error("authentication failed!");
        })
        .catch((err) => next(ActionCreators.loginError(err)));
    } else if (action.type == ActionTypes.AUTO_LOGIN) {
      next(action);
      axios
        .post("/api", {
          query: GET_USER_NOTIFICATIONS_QUERY,
          variables: { username: action.payload.token.username },
        })
        .then((res) => {
          next(ActionCreators.getStartupInfoSuccess(res.data.data.user));
        })
        .catch((err) => next(ActionCreators.getStartupInfoError(err)));
    } else if (action.type == ActionTypes.SIGN_UP_START) {
      axios
        .post("auth/sign-up", action.payload.userInfo)
        .then((res) => {
          if (res.data.auth) {
            next(
              ActionCreators.loginSuccess(res.data.token, res.data.refreshToken)
            );
            axios
              .post("/api", {
                query: GET_USER_NOTIFICATIONS_QUERY,
                variables: { username: action.payload.userInfo.username },
              })
              .then((res) => {
                next(ActionCreators.getStartupInfoSuccess(res.data.data.user));
              })
              .catch((err) => next(ActionCreators.getStartupInfoError(err)));
          } else throw new Error("sign up failed!");
        })
        .catch((err) => next(ActionCreators.signupError(err)));
    } else if (action.type == ActionTypes.LOAD_MORE_NOTIFS) {
      let { page } = action.payload;
      let username = store.getState().user.username;

      const cachedQ = apolloCache.readQuery({
        query: parse(GET_USER_NOTIFICATIONS_QUERY),
        variables: { username, page },
      });
      if (cachedQ)
        return next(ActionCreators.loadMoreNotifsSuccess(cachedQ.user));

      axios
        .post("/api", {
          query: GET_USER_NOTIFICATIONS_QUERY,
          variables: { username, page },
        })
        .then((res) => {
          let ret = res.data.data;

          apolloCache.writeQuery({
            query: parse(GET_USER_NOTIFICATIONS_QUERY),
            variables: { username, page },
            data: { ...ret },
          });

          next(ActionCreators.loadMoreNotifsSuccess(ret.user));
        })
        .catch((err) => next(ActionCreators.loadMoreNotifsError(err)));
    } else if (action.type == ActionTypes.GET_USER_INFO_START) {
      next(ActionCreators.userInfoLoading());

      const { username } = action.payload;

      const cachedQ = apolloCache.readQuery({
        query: parse(GET_USER_INFO_QUERY),
        variables: { username },
      });
      if (cachedQ) return next(ActionCreators.getUserInfoSuccess(cachedQ.user));

      axios
        .post("api", {
          query: GET_USER_INFO_QUERY,
          variables: {
            username,
          },
        })
        .then((res) => {
          const userData = res.data.data;

          if (!userData || res.data.errors || !userData.user)
            return next(ActionCreators.getUserInfoError("NOT FOUND"));

          apolloCache.writeQuery({
            query: parse(GET_USER_INFO_QUERY),
            variables: { username },
            data: { ...userData },
          });

          next(ActionCreators.getUserInfoSuccess(userData.user));
        })
        .catch((err) => next(ActionCreators.getUserInfoError(err)));
    } else if (action.type == ActionTypes.GET_USER_ACCOUNT_INFO_START) {
      next(action);
      axios
        .post("/api", {
          query: `
            {
              user(username:"${action.payload.username}") {
                active
                activeUntil
                profilePic
                email
                username
                displayName
                phoneNumber
                bio
              }
            }
          `,
        })
        .then((res) => {
          next(ActionCreators.getUserAccountInfoSuccess(res.data.data.user));
        })
        .catch((err) => next(ActionCreators.getUserAccountInfoError(err)));
    } else if (action.type == ActionTypes.UPDATE_ACCOUNT_INFO_START) {
      next(action);
      axios
        .put("/users", action.payload.userInfo)
        .then((res) => {
          next(ActionCreators.updateAccountInfoSuccess(res.data.user));
        })
        .catch((err) => next(ActionCreators.updateAccountInfoError(err)));
    } else if (action.type == ActionTypes.LIKE_NOTE_START) {
      next(action);
      axios
        .post("/api", {
          query: `
            mutation {
              likeNote(id:"${action.payload.noteId}")
            }
          `,
        })
        .then((res) => {
          if (res.data.data.likeNote) next(ActionCreators.likeNoteSuccess());
          else next(ActionCreators.likeNoteError());
        });
    } else if (action.type == ActionTypes.DISLIKE_NOTE_START) {
      next(action);
      axios
        .post("/api", {
          query: `
            mutation {
              dislikeNote(id:"${action.payload.noteId}")
            }
          `,
        })
        .then((res) => {
          if (res.data.data.dislikeNote)
            next(ActionCreators.dislikeNoteSuccess());
          else next(ActionCreators.dislikeNoteError());
        });
    } else if (action.type == ActionTypes.LIKE_IMAGE_START) {
      next(action);
      axios
        .post("/api", {
          query: `
            mutation {
              likeImage(id:"${action.payload.imageId}")
            }
          `,
        })
        .then((res) => {
          if (res.data.data.likeImage) next(ActionCreators.likeImageSuccess());
          else next(ActionCreators.likeImageError());
        });
    } else if (action.type == ActionTypes.DISLIKE_IMAGE_START) {
      next(action);
      axios
        .post("/api", {
          query: `
            mutation {
              dislikeImage(id:"${action.payload.imageId}")
            }
          `,
        })
        .then((res) => {
          if (res.data.data.dislikeImage)
            next(ActionCreators.dislikeImageSuccess());
          else next(ActionCreators.dislikeImageError());
        });
    } else if (action.type == ActionTypes.GET_VIDEO_INFO_START) {
      next(ActionCreators.videoLoading());
      const { videoId, cId } = action.payload;

      axios
        .post("api", {
          query: GET_VIDEO_INFO_QUERY,
          variables: {
            videoId,
            cId,
          },
        })
        .then((res) => {
          const videoData = res.data.data;

          if (!videoData || res.data.errors || !videoData.video)
            return next(ActionCreators.getVideoInfoError("NOT FOUND"));

          next(ActionCreators.getVideoInfoSuccess(videoData.video));
        })
        .catch((e) => next(ActionCreators.getVideoInfoError(e)));
    } else if (action.type == ActionTypes.RECORD_VIDEO_VIEW_START) {
      axios
        .post("/api", {
          query: `
          mutation {
            viewVideo(id:"${action.payload.videoId}")
          }
        `,
        })
        .then((res) => {
          if (res.data.data.viewVideo)
            next(ActionCreators.recordVideoViewSuccess());
          else next(ActionCreators.recordVideoViewError());
        });
    } else if (action.type == ActionTypes.LIKE_VIDEO_START) {
      next(action);
      axios
        .post("/api", {
          query: `
          mutation {
            likeVideo(id:"${action.payload.videoId}")
          }
        `,
        })
        .then((res) => {
          if (res.data.data.likeVideo) next(ActionCreators.likeVideoSuccess());
          else next(ActionCreators.likeVideoError());
        });
    } else if (action.type == ActionTypes.DISLIKE_VIDEO_START) {
      next(action);
      axios
        .post("/api", {
          query: `
          mutation {
            dislikeVideo(id:"${action.payload.videoId}")
          }
        `,
        })
        .then((res) => {
          if (res.data.data.dislikeVideo)
            next(ActionCreators.dislikeVideoSuccess());
          else next(ActionCreators.dislikeVideoError());
        });
    } else if (action.type == ActionTypes.POST_VIDEO_COMMENT_START) {
      next(action);
      axios
        .post("/api", {
          query: `
            mutation CommentVideo($id:String!,$body:String!,$replyId:String) {
              commentVideo(id:$id,body:$body,replyId:$replyId)
            },
      `,
          variables: {
            id: action.payload.videoId,
            body: action.payload.body,
            replyId: action.payload.replyId,
          },
        })
        .then((res) => {
          next(ActionCreators.postVideoCommentSuccess());
        })
        .catch((err) => next(ActionCreators.postVideoCommentError(err)));
    } else if (action.type == ActionTypes.LOAD_USER_VIDEO_PAGE_START) {
      next(action);
      const { username, page } = action.payload;

      const cachedQ = apolloCache.readQuery({
        query: parse(USER_VIDEO_PAGE_QUERY),
        variables: { username, page },
      });
      if (cachedQ)
        return next(
          ActionCreators.loadUserVideoPageSuccess(
            cachedQ.videoSearch.videos,
            cachedQ.videoSearch.hasMore
          )
        );

      axios
        .post("/api", {
          query: USER_VIDEO_PAGE_QUERY,
          variables: { username, page },
        })
        .then((res) => {
          const videoData = res.data.data;

          apolloCache.writeQuery({
            query: parse(USER_VIDEO_PAGE_QUERY),
            variables: { username, page },
            data: { ...videoData },
          });

          next(
            ActionCreators.loadUserVideoPageSuccess(
              videoData.videoSearch.videos,
              videoData.videoSearch.hasMore
            )
          );
        })
        .catch((error) => {
          next(ActionCreators.loadUserVideoPageError(error));
        });
    } else if (action.type == ActionTypes.LOAD_USER_COMMENTS_PAGE_START) {
      next(action);
      const { username, page } = action.payload;

      // const cachedQ = apolloCache.readQuery({
      //   query: parse(USER_COMMENTS_PAGE_QUERY),
      //   variables: { username, page },
      // });
      // if (cachedQ)
      //   return next(
      //     ActionCreators.loadUserCommentsPageSuccess(
      //       cachedQ.commentsSearch.comments,
      //       cachedQ.commentsSearch.hasMore
      //     )
      //   );

      axios
        .post("/api", {
          query: USER_COMMENTS_PAGE_QUERY,
          variables: { username, page },
        })
        .then((res) => {
          const commentData = res.data.data;

          // apolloCache.writeQuery({
          //   query: parse(USER_COMMENTS_PAGE_QUERY),
          //   variables: { username, page },
          //   data: { ...commentData },
          // });

          next(
            ActionCreators.loadUserCommentsPageSuccess(
              commentData.commentsSearch.comments,
              commentData.commentsSearch.hasMore
            )
          );
        })
        .catch((error) => {
          next(ActionCreators.loadUserCommentsPageError(error));
        });
    } else if (action.type == ActionTypes.LOAD_USER_LIKES_PAGE_START) {
      next(action);
      const { username, page } = action.payload;

      // const cachedQ = apolloCache.readQuery({
      //   query: parse(USER_LIKES_PAGE_QUERY),
      //   variables: { username, page },
      // });
      // if (cachedQ)
      //   return next(
      //     ActionCreators.loadUserLikesPageSuccess(
      //       cachedQ.likesSearch.likes,
      //       cachedQ.likesSearch.hasMore
      //     )
      //   );

      axios
        .post("/api", {
          query: USER_LIKES_PAGE_QUERY,
          variables: { username, page },
        })
        .then((res) => {
          const likeData = res.data.data;

          // apolloCache.writeQuery({
          //   query: parse(USER_LIKES_PAGE_QUERY),
          //   variables: { username, page },
          //   data: { ...likeData },
          // });

          next(
            ActionCreators.loadUserLikesPageSuccess(
              likeData.likesSearch.likes,
              likeData.likesSearch.hasMore
            )
          );
        })
        .catch((error) => {
          next(ActionCreators.loadUserLikesPageError(error));
        });
    } else if (action.type == ActionTypes.LOAD_USER_DISLIKES_PAGE_START) {
      next(action);
      const { username, page } = action.payload;

      // const cachedQ = apolloCache.readQuery({
      //   query: parse(USER_DISLIKES_PAGE_QUERY),
      //   variables: { username, page },
      // });
      // if (cachedQ)
      //   return next(
      //     ActionCreators.loadUserDislikesPageSuccess(
      //       cachedQ.dislikesSearch.dislikes,
      //       cachedQ.dislikesSearch.hasMore
      //     )
      //   );

      axios
        .post("/api", {
          query: USER_DISLIKES_PAGE_QUERY,
          variables: { username, page },
        })
        .then((res) => {
          const dislikeData = res.data.data;

          // apolloCache.writeQuery({
          //   query: parse(USER_DISLIKES_PAGE_QUERY),
          //   variables: { username, page },
          //   data: { ...dislikeData },
          // });

          next(
            ActionCreators.loadUserDislikesPageSuccess(
              dislikeData.dislikesSearch.dislikes,
              dislikeData.dislikesSearch.hasMore
            )
          );
        })
        .catch((error) => {
          next(ActionCreators.loadUserDislikesPageError(error));
        });
    } else if (action.type == ActionTypes.LOAD_USER_IMAGE_PAGE_START) {
      next(action);
      const { username, page } = action.payload;

      const cachedQ = apolloCache.readQuery({
        query: parse(USER_IMAGE_PAGE_QUERY),
        variables: { username, page },
      });
      if (cachedQ)
        return next(
          ActionCreators.loadUserImagePageSuccess(
            cachedQ.imageSearch.images,
            cachedQ.imageSearch.hasMore
          )
        );

      axios
        .post("/api", {
          query: USER_IMAGE_PAGE_QUERY,
          variables: { username, page },
        })
        .then((res) => {
          const imageData = res.data.data;

          apolloCache.writeQuery({
            query: parse(USER_IMAGE_PAGE_QUERY),
            variables: { username, page },
            data: { ...imageData },
          });

          next(
            ActionCreators.loadUserImagePageSuccess(
              imageData.imageSearch.images,
              imageData.imageSearch.hasMore
            )
          );
        })
        .catch((error) => {
          next(ActionCreators.loadUserImagePageError(error));
        });
    } else if (action.type == ActionTypes.LOAD_USER_NOTE_PAGE_START) {
      next(action);
      const { username, page } = action.payload;

      const cachedQ = apolloCache.readQuery({
        query: parse(USER_NOTE_PAGE_QUERY),
        variables: { username, page },
      });
      if (cachedQ)
        return next(
          ActionCreators.loadUserNotePageSuccess(
            cachedQ.noteSearch.notes,
            cachedQ.noteSearch.hasMore
          )
        );

      axios
        .post("/api", {
          query: USER_NOTE_PAGE_QUERY,
          variables: { username, page },
        })
        .then((res) => {
          const noteData = res.data.data;

          apolloCache.writeQuery({
            query: parse(USER_NOTE_PAGE_QUERY),
            variables: { username, page },
            data: { ...noteData },
          });

          next(
            ActionCreators.loadUserNotePageSuccess(
              noteData.noteSearch.notes,
              noteData.noteSearch.hasMore
            )
          );
        })
        .catch((error) => {
          next(ActionCreators.loadUserNotePageError(error));
        });
    } else if (action.type == ActionTypes.GET_IMAGE_INFO_START) {
      next(ActionCreators.imageLoading());

      const { imageId, cId } = action.payload;

      axios
        .post("api", {
          query: GET_IMAGE_INFO_QUERY,
          variables: { imageId, cId },
        })
        .then((res) => {
          const imageData = res.data.data;
          if (!imageData || res.data.errors || !imageData.image)
            return next(ActionCreators.getImageInfoError("NOT FOUND"));

          next(ActionCreators.getImageInfoSuccess(imageData.image));
        })
        .catch((e) => next(ActionCreators.getImageInfoError(e)));
    } else if (action.type == ActionTypes.POST_IMAGE_COMMENT_START) {
      next(action);
      axios
        .post("/api", {
          query: `
            mutation CommentImage($id:String!,$body:String!,$replyId:String)  {
              commentImage(id:$id,body:$body,replyId:$replyId)
            }
          `,
          variables: {
            id: action.payload.imageId,
            body: action.payload.body,
            replyId: action.payload.replyId,
          },
        })
        .then((res) => next(ActionCreators.postImageCommentSuccess()))
        .catch((err) => next(ActionCreators.postImageCommentError(err)));
    } else if (action.type == ActionTypes.GET_NOTE_INFO_START) {
      next(ActionCreators.noteLoading());

      const { noteId, cId } = action.payload;

      axios
        .post("api", {
          query: GET_NOTE_INFO_QUERY,
          variables: { noteId, cId },
        })
        .then((res) => {
          const noteData = res.data.data;
          if (!noteData || res.data.errors || !noteData.note)
            return next(ActionCreators.getNoteInfoError("NOT FOUND"));

          next(ActionCreators.getNoteInfoSuccess(noteData.note));
        })
        .catch((e) => next(ActionCreators.getNoteInfoError(e)));
    } else if (action.type == ActionTypes.POST_NOTE_COMMENT_START) {
      next(action);
      axios
        .post("/api", {
          query: `
            mutation  CommentNote($id:String!,$body:String!,$replyId:String) {
              commentNote(id:$id,body:$body,replyId:$replyId)
            }
          `,
          variables: {
            id: action.payload.noteId,
            body: action.payload.body,
            replyId: action.payload.replyId,
          },
        })
        .then((res) => next(ActionCreators.postNoteCommentSuccess()))
        .catch((err) => next(ActionCreators.postNoteCommentError(err)));
    } else if (action.type == ActionTypes.LOAD_NEWSFEED_VIDEO_START) {
      next(action);
      let page =
        store.getState().feed.videos.length > 0
          ? Math.ceil(store.getState().feed.videos.length / perPage)
          : 0;
      const cachedQ = apolloCache.readQuery({
        query: parse(GET_NEWSFEED_VIDEOS_QUERY),
        variables: { page, sort: action.payload.sort },
      });
      if (cachedQ)
        return next(
          ActionCreators.loadNewsfeedVideoSuccess(cachedQ.newsfeedVideos)
        );

      axios
        .post("/api", {
          query: GET_NEWSFEED_VIDEOS_QUERY,
          variables: { page, sort: action.payload.sort },
        })
        .then((res) => {
          const videoData = res.data.data;

          if (videoData.newsfeedVideos) {
            apolloCache.writeQuery({
              query: parse(GET_NEWSFEED_VIDEOS_QUERY),
              variables: { page, sort: action.payload.sort },
              data: { ...videoData },
            });

            next(
              ActionCreators.loadNewsfeedVideoSuccess(videoData.newsfeedVideos)
            );
          }
        })
        .catch((error) => next(ActionCreators.loadNewsfeedVideoError(error)));
    } else if (action.type == ActionTypes.LOAD_NEWSFEED_IMAGES_START) {
      next(action);
      let page =
        store.getState().feed.images.length > 0
          ? Math.ceil(store.getState().feed.images.length / perPage)
          : 0;

      const cachedQ = apolloCache.readQuery({
        query: parse(GET_NEWSFEED_IMAGES_QUERY),
        variables: { page, sort: action.payload.sort },
      });
      if (cachedQ)
        return next(
          ActionCreators.loadNewsfeedImagesSuccess(cachedQ.newsfeedImages)
        );

      axios
        .post("/api", {
          query: GET_NEWSFEED_IMAGES_QUERY,
          variables: { page, sort: action.payload.sort },
        })
        .then((res) => {
          const imageData = res.data.data;
          if (imageData.newsfeedImages) {
            apolloCache.writeQuery({
              query: parse(GET_NEWSFEED_IMAGES_QUERY),
              variables: { page, sort: action.payload.sort },
              data: { ...imageData },
            });

            next(
              ActionCreators.loadNewsfeedImagesSuccess(imageData.newsfeedImages)
            );
          }
        })
        .catch((error) => next(ActionCreators.loadNewsfeedVideoError(error)));
    } else if (action.type == ActionTypes.LOAD_NEWSFEED_NOTES_START) {
      next(action);
      let page =
        store.getState().feed.notes.length > 0
          ? Math.ceil(store.getState().feed.notes.length / perPage)
          : 0;

      const cachedQ = apolloCache.readQuery({
        query: parse(GET_NEWSFEED_NOTES_QUERY),
        variables: { page, sort: action.payload.sort },
      });
      if (cachedQ)
        return next(
          ActionCreators.loadNewsfeedNotesSuccess(cachedQ.newsfeedNotes)
        );

      axios
        .post("/api", {
          query: GET_NEWSFEED_NOTES_QUERY,
          variables: { page, sort: action.payload.sort },
        })
        .then((res) => {
          const noteData = res.data.data;

          if (noteData.newsfeedNotes) {
            apolloCache.writeQuery({
              query: parse(GET_NEWSFEED_NOTES_QUERY),
              variables: { page, sort: action.payload.sort },
              data: { ...noteData },
            });

            next(
              ActionCreators.loadNewsfeedNotesSuccess(noteData.newsfeedNotes)
            );
          }
        })
        .catch((error) => next(ActionCreators.loadNewsfeedNotesError(error)));
    } else if (action.type == ActionTypes.LOAD_USER_PAYMENT_INFO_START) {
      next(action);
      axios
        .post("/api", {
          query: GET_USER_PAYMENT_INFO_QUERY,
          variables: {
            username: store.getState().user.username,
          },
        })
        .then((res) => {
          const pData = res.data.data;

          if (pData)
            next(ActionCreators.loadUserPaymentInfoSuccess(pData.user));
          else next(ActionCreators.loadUserNotePageError());
        })
        .catch((error) => next(ActionCreators.loadUserNotePageError(error)));
    } else if (action.type == ActionTypes.LOAD_MORE_IMAGE_COMMENTS) {
      next(action);
      let page = Math.ceil(store.getState().image.comments.length / perPage);
      let imageId = action.payload.imageId;

      axios
        .post("api", {
          query: LOAD_MORE_IMAGE_COMMENTS_QUERY,
          variables: {
            imageId,
            page,
            sort: action.payload.sort,
          },
        })
        .then((res) => {
          const imageData = res.data.data;

          if (imageData && imageData.image && imageData.image.comments) {
            next(
              ActionCreators.loadMoreCommentsSuccess(
                "image",
                imageData.image.comments
              )
            );
          }
        })
        .catch((err) =>
          next(ActionCreators.loadMoreCommentsError("image", err))
        );
    } else if (action.type == ActionTypes.LOAD_MORE_VIDEO_COMMENTS) {
      next(action);
      let page = Math.ceil(store.getState().video.comments.length / perPage);
      let videoId = action.payload.videoId;

      axios
        .post("api", {
          query: LOAD_MORE_VIDEO_COMMENTS_QUERY,
          variables: {
            videoId,
            page,
            sort: action.payload.sort,
          },
        })
        .then((res) => {
          const videoData = res.data.data;
          if (videoData && videoData.video && videoData.video.comments) {
            next(
              ActionCreators.loadMoreCommentsSuccess(
                "video",
                videoData.video.comments
              )
            );
          }
        })
        .catch((err) =>
          next(ActionCreators.loadMoreCommentsError("video", err))
        );
    } else if (action.type == ActionTypes.LOAD_MORE_NOTE_COMMENTS) {
      next(action);

      let page = Math.ceil(store.getState().note.comments.length / perPage);
      let noteId = action.payload.noteId;

      axios
        .post("api", {
          query: LOAD_MORE_NOTE_COMMENTS_QUERY,
          variables: {
            noteId,
            page,
            sort: action.payload.sort,
          },
        })
        .then((res) => {
          const noteData = res.data.data;
          if (noteData && noteData.note && noteData.note.comments) {
            next(
              ActionCreators.loadMoreCommentsSuccess(
                "note",
                noteData.note.comments
              )
            );
          }
        })
        .catch((err) =>
          next(ActionCreators.loadMoreCommentsError("note", err))
        );
    } else if (action.type == ActionTypes.GET_VIDEO_COMMENT_REPLIES) {
      next(action);
      let commentId = action.payload._id;

      axios
        .post("api", {
          query: LOAD_VIDEO_COMMENT_REPLIES_QUERY,
          variables: {
            commentId,
          },
        })
        .then((res) => {
          const replyData = res.data.data;

          next(
            ActionCreators.getCommentRepliesSuccess(
              "video",
              commentId,
              replyData.videoCommentReplies
            )
          );
        })
        .catch((err) =>
          next(ActionCreators.getCommentRepliesError("video", err))
        );
    } else if (action.type == ActionTypes.GET_IMAGE_COMMENT_REPLIES) {
      next(action);

      let commentId = action.payload._id;

      axios
        .post("api", {
          query: LOAD_IMAGE_COMMENT_REPLIES_QUERY,
          variables: {
            commentId,
          },
        })
        .then((res) => {
          const replyData = res.data.data;

          next(
            ActionCreators.getCommentRepliesSuccess(
              "image",
              commentId,
              replyData.imageCommentReplies
            )
          );
        })
        .catch((err) =>
          next(ActionCreators.getCommentRepliesError("image", err))
        );
    } else if (action.type == ActionTypes.GET_NOTE_COMMENT_REPLIES) {
      next(action);

      let commentId = action.payload._id;

      axios
        .post("api", {
          query: LOAD_NOTE_COMMENT_REPLIES_QUERY,
          variables: {
            commentId,
          },
        })
        .then((res) => {
          const replyData = res.data.data;

          next(
            ActionCreators.getCommentRepliesSuccess(
              "note",
              commentId,
              replyData.noteCommentReplies
            )
          );
        })
        .catch((err) =>
          next(ActionCreators.getCommentRepliesError("note", err))
        );
    } else if (action.type == ActionTypes.LIKE_VIDEO_COMMENT) {
      next(action);
      axios
        .post("/api", {
          query: `
            mutation {
              likeVideoComment(videoId:"${action.payload.mediaId}" , commentId:"${action.payload.commentId}")
            }
          `,
        })
        .then((res) => {
          if (res.data.data.likeVideoComment)
            next(
              ActionCreators.likeCommentSuccess(
                "video",
                action.payload.commentId
              )
            );
        });
    } else if (action.type == ActionTypes.DISLIKE_VIDEO_COMMENT) {
      next(action);
      axios
        .post("/api", {
          query: `
            mutation {
              dislikeVideoComment(videoId:"${action.payload.mediaId}" , commentId:"${action.payload.commentId}")
            }
          `,
        })
        .then((res) => {
          if (res.data.data.dislikeVideoComment)
            next(
              ActionCreators.dislikeCommentSuccess(
                "video",
                action.payload.commentId
              )
            );
        });
    } else if (action.type == ActionTypes.LIKE_IMAGE_COMMENT) {
      next(action);
      axios
        .post("/api", {
          query: `
            mutation {
              likeImageComment(imageId:"${action.payload.mediaId}" , commentId:"${action.payload.commentId}")
            }
          `,
        })
        .then((res) => {
          if (res.data.data.likeImageComment)
            next(
              ActionCreators.likeCommentSuccess(
                "image",
                action.payload.commentId
              )
            );
        });
    } else if (action.type == ActionTypes.DISLIKE_IMAGE_COMMENT) {
      next(action);
      axios
        .post("/api", {
          query: `
            mutation {
              dislikeImageComment(imageId:"${action.payload.mediaId}" , commentId:"${action.payload.commentId}")
            }
          `,
        })
        .then((res) => {
          if (res.data.data.dislikeImageComment)
            next(
              ActionCreators.dislikeCommentSuccess(
                "image",
                action.payload.commentId
              )
            );
        });
    } else if (action.type == ActionTypes.LIKE_NOTE_COMMENT) {
      next(action);
      axios
        .post("/api", {
          query: `
            mutation {
              likeNoteComment(noteId:"${action.payload.mediaId}" , commentId:"${action.payload.commentId}")
            }
          `,
        })
        .then((res) => {
          if (res.data.data.likeNoteComment)
            next(
              ActionCreators.likeCommentSuccess(
                "note",
                action.payload.commentId
              )
            );
        });
    } else if (action.type == ActionTypes.DISLIKE_NOTE_COMMENT) {
      next(action);
      axios
        .post("/api", {
          query: `
            mutation {
              dislikeNoteComment(noteId:"${action.payload.mediaId}" , commentId:"${action.payload.commentId}")
            }
          `,
        })
        .then((res) => {
          if (res.data.data.dislikeNoteComment)
            next(
              ActionCreators.dislikeCommentSuccess(
                "note",
                action.payload.commentId
              )
            );
        });
    } else if (action.type == ActionTypes.LOAD_VIDEO_SEARCH_RESULTS_START) {
      next(action);
      const { query, hashtag, sort } = action.payload;

      let page = Math.ceil(store.getState().feed.videos.length / perPage);

      let q = page
        ? VIDEO_SEARCH_RESULTS_PAGE_QUERY
        : VIDEO_SEARCH_RESULTS_PAGE_WITH_COUNTS_QUERY;
      const cachedQ = apolloCache.readQuery({
        query: parse(q),
        variables: { page, query, hashtag, sort },
      });
      if (cachedQ)
        return next(
          ActionCreators.loadVideoSearchResultsSuccess(
            cachedQ.videoSearch.videos,
            cachedQ.videoSearch.hasMore,
            cachedQ.videoSearch.videoCount,
            cachedQ.videoSearch.imageCount,
            cachedQ.videoSearch.noteCount
          )
        );

      axios
        .post("/api", {
          query: q,
          variables: { page, query, hashtag, sort },
        })
        .then((res) => {
          const videoData = res.data.data;

          apolloCache.writeQuery({
            query: parse(q),
            variables: { page, query, hashtag, sort },
            data: { ...videoData },
          });

          next(
            ActionCreators.loadVideoSearchResultsSuccess(
              videoData.videoSearch.videos,
              videoData.videoSearch.hasMore,
              videoData.videoSearch.videoCount,
              videoData.videoSearch.imageCount,
              videoData.videoSearch.noteCount
            )
          );
        })
        .catch((error) => ActionCreators.loadVideoSearchResultsError(error));
    } else if (action.type == ActionTypes.LOAD_IMAGE_SEARCH_RESULTS_START) {
      next(action);
      const { query, hashtag, sort } = action.payload;

      let page = Math.ceil(store.getState().feed.images.length / perPage);

      const cachedQ = apolloCache.readQuery({
        query: parse(IMAGE_SEARCH_RESULTS_PAGE_QUERY),
        variables: { page, query, hashtag, sort },
      });
      if (cachedQ)
        return next(
          ActionCreators.loadImageSearchResultsSuccess(
            cachedQ.imageSearch.images,
            cachedQ.imageSearch.hasMore
          )
        );

      axios
        .post("/api", {
          query: IMAGE_SEARCH_RESULTS_PAGE_QUERY,
          variables: { page, query, hashtag, sort },
        })
        .then((res) => {
          const imageData = res.data.data;

          apolloCache.writeQuery({
            query: parse(IMAGE_SEARCH_RESULTS_PAGE_QUERY),
            variables: { page, query, hashtag, sort },
            data: { ...imageData },
          });

          next(
            ActionCreators.loadImageSearchResultsSuccess(
              imageData.imageSearch.images,
              imageData.imageSearch.hasMore
            )
          );
        })
        .catch((error) => ActionCreators.loadImageSearchResultsError(error));
    } else if (action.type == ActionTypes.LOAD_NOTE_SEARCH_RESULTS_START) {
      next(action);
      const { query, hashtag, sort } = action.payload;

      let page = Math.ceil(store.getState().feed.notes.length / perPage);

      const cachedQ = apolloCache.readQuery({
        query: parse(NOTE_SEARCH_RESULTS_PAGE_QUERY),
        variables: { page, query, hashtag, sort },
      });
      if (cachedQ)
        return next(
          ActionCreators.loadNoteSearchResultsSuccess(
            cachedQ.noteSearch.notes,
            cachedQ.noteSearch.hasMore
          )
        );

      axios
        .post("/api", {
          query: NOTE_SEARCH_RESULTS_PAGE_QUERY,
          variables: { page, query, hashtag, sort },
        })
        .then((res) => {
          const noteData = res.data.data;

          apolloCache.writeQuery({
            query: parse(NOTE_SEARCH_RESULTS_PAGE_QUERY),
            variables: { page, query, hashtag, sort },
            data: { ...noteData },
          });

          next(
            ActionCreators.loadNoteSearchResultsSuccess(
              noteData.noteSearch.notes,
              noteData.noteSearch.hasMore
            )
          );
        })
        .catch((error) => ActionCreators.loadNoteSearchResultsError(error));
    } else if (action.type == ActionTypes.GET_ALL_USERNAMES) {
      next(action);

      const cachedQ = apolloCache.readQuery({
        query: parse(GET_ALL_USERNAMES_QUERY),
      });
      if (cachedQ)
        return next(ActionCreators.getAllUsernamesSuccess(cachedQ.users));

      axios
        .post("/api", {
          query: GET_ALL_USERNAMES_QUERY,
        })
        .then((res) => {
          const userData = res.data.data;

          apolloCache.writeQuery({
            query: parse(GET_ALL_USERNAMES_QUERY),
            data: { ...userData },
          });

          next(ActionCreators.getAllUsernamesSuccess(userData.users));
        })
        .catch((error) => ActionCreators.getAllUsernamesSuccess(error));
    } else next(action);
  },
];
