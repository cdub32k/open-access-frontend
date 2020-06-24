import React, { useEffect, Fragment } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";

import { ActionCreators } from "../actions";

import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";

import VideoPlayer from "./VideoPlayer";
import PreviewVideoPlayer from "./PreviewVideoPlayer";
import CommentsSection from "./CommentsSection";
import MediaOwnerActions from "./MediaOwnerActions";
import { getCommentId, getVideoTimestamp } from "../utils/helpers";
import Error from "./Error";

const useStyles = makeStyles((theme) => ({
  ownerActions: {
    position: "absolute",
    top: 0,
    right: 16,
    backgroundColor: "rgba(255,255,255,0.4)",
    borderRadius: "50%",
    [theme.breakpoints.down("sm")]: {
      right: 12,
    },
  },
  playerSection: {
    position: "relative",
    [theme.breakpoints.up("md")]: {
      paddingRight: 4,
    },
    [theme.breakpoints.down("sm")]: {
      paddingRight: 0,
    },
  },
}));

const VideoPage = ({
  loading,
  commentsLoading,
  newCommentLoading,
  newCommentReplyId,
  repliesLoading,
  error,
  user,
  title,
  caption,
  viewCount,
  likeCount,
  dislikeCount,
  commentCount,
  url,
  thumbUrl,
  uploadedAt,
  liked,
  disliked,
  comments,
  match,
  location,
  mineUsername,
  getVideoInfo,
  clearVideoData,
  hasMoreComments,
}) => {
  if (error) return <Error />;

  const { videoId } = match.params;
  let c = getCommentId(location.search);
  useEffect(() => {
    getVideoInfo(videoId, c);
    return () => clearVideoData();
  }, []);
  useEffect(() => {
    if (url) {
      let ts = getVideoTimestamp(location.search);
      if (ts) setTimeout(() => vidJump(videoId, ts.h, ts.m, ts.s), 0);
    }
  }, [url]);

  const classes = useStyles();
  return (
    <Grid container>
      <Grid item xs={12} md={8} className={classes.playerSection}>
        {loading ? (
          <PreviewVideoPlayer />
        ) : (
          <Fragment>
            <VideoPlayer
              _id={videoId}
              user={user}
              title={title}
              caption={caption}
              viewCount={viewCount}
              url={url}
              thumbUrl={thumbUrl}
              likeCount={likeCount}
              dislikeCount={dislikeCount}
              commentCount={commentCount}
              uploadedAt={uploadedAt}
              liked={liked}
              disliked={disliked}
            />
            {user.username == mineUsername && (
              <MediaOwnerActions
                className={classes.ownerActions}
                _id={videoId}
                type="video"
                editForm={<Redirect to={`/video/edit/${videoId}`} />}
              />
            )}
          </Fragment>
        )}
      </Grid>
      <Grid item xs={12} md={4}>
        <CommentsSection
          loading={commentsLoading}
          newLoading={newCommentLoading}
          newReplyId={newCommentReplyId}
          repliesLoading={repliesLoading}
          comments={comments}
          contentType="video"
          id={videoId}
          hasMoreComments={hasMoreComments}
        />
      </Grid>
    </Grid>
  );
};

const mapStateToProps = (state) => ({
  loading: state.video.loading,
  commentsLoading: state.video.commentsLoading,
  newCommentLoading: state.video.newCommentLoading,
  newCommentReplyId: state.video.newCommentReplyId,
  repliesLoading: state.video.repliesLoading,
  error: state.video.error,
  user: state.video.user,
  title: state.video.title,
  caption: state.video.caption,
  viewCount: state.video.viewCount,
  likeCount: state.video.likeCount,
  dislikeCount: state.video.dislikeCount,
  commentCount: state.video.commentCount,
  liked: state.video.liked,
  disliked: state.video.disliked,
  url: state.video.url,
  thumbUrl: state.video.thumbUrl,
  uploadedAt: state.video.uploadedAt,
  comments: state.video.comments,
  mineUsername: state.user.username,
  hasMoreComments: state.video.hasMoreComments,
});

const mapDispatchToProps = (dispatch) => ({
  getVideoInfo: (videoId, cId) =>
    dispatch(ActionCreators.getVideoInfoStart(videoId, cId)),

  clearVideoData: () => dispatch(ActionCreators.clearVideoData()),
});

export default connect(mapStateToProps, mapDispatchToProps)(VideoPage);
