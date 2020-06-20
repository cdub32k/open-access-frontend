import React, { useEffect, memo } from "react";
import { connect } from "react-redux";
import { ActionCreators } from "../actions";
import ReactPlayer from "react-player";

import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";

import { makeStyles } from "@material-ui/core/styles";
import ContentActions from "./ContentActions";

import {
  date2rel,
  thousandsSeparators,
  convertHashtagsToLinks,
} from "../utils/helpers";

const useStyles = makeStyles((theme) => ({
  container: {
    position: "relative",
    width: "calc(100% - 24px);",
    margin: 12,
    marginTop: 0,
    marginBottom: 80,
    display: "inline-block",
    [theme.breakpoints.down("sm")]: {
      margin: "24px 12px",
      width: "calc(100% - 24px);",
      marginTop: 0,
      marginBottom: 80,
    },
  },
  summary: {
    display: "flex",
    justifyContent: "space-between",
  },
  playerContainer: {
    paddingBottom: "56.25%",
    position: "relative",
  },
  player: {
    position: "absolute",
    width: "100% !important",
    height: "100% !important",
    left: 0,
    bottom: 0,
  },
  header: {
    paddingBottom: 0,
  },
  views: {
    padding: 12,
  },
  caption: {
    padding: 12,
  },
  ownerActions: {
    width: 100,
    height: 50,
    backgroundColor: theme.palette.alert.main,
    color: theme.palette.light.main,
  },
}));

const VideoPlayer = ({
  _id,
  contentType,
  user,
  url,
  thumbUrl,
  title,
  viewCount,
  likeCount,
  dislikeCount,
  commentCount,
  caption,
  uploadedAt,
  recordView,
  likeVideo,
  dislikeVideo,
  liked,
  disliked,
  owner,
  username,
  subscription,
  subscribeToUpdates,
}) => {
  useEffect(() => {
    subscribeToUpdates(_id);
    return () => {
      subscription && subscription.unsubscribe();
    };
  }, []);

  const classes = useStyles();

  return (
    <Card
      className={`${classes.container} video-player-container`}
      elevation={4}
    >
      <CardMedia className={classes.playerContainer}>
        <ReactPlayer
          className={classes.player}
          url={url}
          light={thumbUrl}
          playing
          controls
          pip={false}
          onStart={() => recordView(_id)}
        />
      </CardMedia>
      <CardHeader
        avatar={<Avatar src={user.profilePic}></Avatar>}
        title={
          <span style={{ fontSize: 12 }}>
            <span style={{ fontSize: 18 }}>{title}</span>
            <br />
            <Typography variant="body2">by {user.username}</Typography>
            <Typography variant="body2">
              <i>{date2rel(uploadedAt)}</i>
            </Typography>
          </span>
        }
        className={classes.header}
      />
      <CardContent className={classes.views}>
        <Typography variant="body1">
          {thousandsSeparators(viewCount)} views
        </Typography>
      </CardContent>
      <CardContent
        className={classes.caption}
        dangerouslySetInnerHTML={{
          __html: convertHashtagsToLinks(caption),
        }}
      ></CardContent>
      <ContentActions
        contentType="video"
        liked={liked}
        disliked={disliked}
        like={() => likeVideo(_id)}
        dislike={() => dislikeVideo(_id)}
        likeCount={likeCount}
        dislikeCount={dislikeCount}
        commentCount={commentCount}
      />
    </Card>
  );
};

const mapDispatchToProps = (dispatch) => ({
  recordView: (videoId) =>
    dispatch(ActionCreators.recordVideoViewStart(videoId)),
  likeVideo: (videoId) => dispatch(ActionCreators.likeVideoStart(videoId)),
  dislikeVideo: (videoId) =>
    dispatch(ActionCreators.dislikeVideoStart(videoId)),
  subscribeToUpdates: (videoId) =>
    dispatch(ActionCreators.subscribeToVideoItemUpdates(videoId)),
});

const mapStateToProps = (state) => ({
  subscription: state.video.subscription,
});

export default connect(mapStateToProps, mapDispatchToProps)(memo(VideoPlayer));
