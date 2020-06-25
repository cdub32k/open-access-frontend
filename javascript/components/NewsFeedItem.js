import React, { useState, useEffect, memo } from "react";
import { connect } from "react-redux";
import { ActionCreators } from "../actions";

import { Link } from "react-router-dom";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import { num2str, date2rel, truncateCaptionPreview } from "../utils/helpers";

const useStyles = makeStyles({
  root: {
    width: "96%",
    margin: "12px 0",
  },
  media: {
    width: "100%",
    paddingBottom: "56.25%",
  },
  content: {},
  stats: {
    display: "flex",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    display: "flex",
    padding: 8,
  },
  avatar: {
    width: 49,
    height: 49,
    marginRight: 8,
  },
});

const NewsFeedItem = ({
  item: {
    _id,
    user: { username, profilePic },
    uploadedAt,
    title,
    caption,
    likeCount,
    dislikeCount,
    commentCount,
    thumbUrl,
  },
  type,
  subscribeToUpdates,
}) => {
  useEffect(() => {
    subscribeToUpdates(type, _id);
  }, []);

  const classes = useStyles();
  const theme = useTheme();

  let bgL, bgR, f, link;
  switch (type) {
    case "video":
      link = `/video-player/${_id}`;
      f = theme.palette.dark.main;
      bgL = theme.palette.light.main;
      bgR = theme.palette.alert.light;
      break;
    case "image":
      link = `/image/${_id}`;
      f = theme.palette.dark.main;
      bgL = theme.palette.secondary.light;
      bgR = theme.palette.secondary.main;
      break;
    case "note":
      link = `/note/${_id}`;
      f = theme.palette.light.main;
      bgL = theme.palette.primary.main;
      bgR = theme.palette.primary.dark;
      break;
    default:
      break;
  }

  const [elevation, setElevation] = useState(4);
  const onMouseOver = () => setElevation(12);
  const onMouseOut = () => setElevation(4);

  return (
    <Card
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      className={classes.root}
      elevation={elevation}
    >
      <CardContent className={classes.actions}>
        <Link to={`/profile/${username}`}>
          <Avatar src={profilePic} className={classes.avatar} />
        </Link>
        <div>
          <Typography variant="body2" className={classes.userInfo}>
            <Link to={`/profile/${username}`}>
              <b>{username}</b>
            </Link>{" "}
            posted a {type} {date2rel(uploadedAt)}
          </Typography>
          <div className={classes.stats}>
            <Typography variant="body2">
              <b>{num2str(likeCount)}</b> likes&nbsp;•&nbsp;
            </Typography>
            <Typography variant="body2">
              <b>{num2str(dislikeCount)}</b> dislikes&nbsp;•&nbsp;
            </Typography>
            <Typography variant="body2">
              <b>{num2str(commentCount)}</b> comments
            </Typography>
          </div>
        </div>
      </CardContent>
      <Link to={link}>
        {type != "note" && (
          <CardMedia
            className={classes.media}
            style={{ paddingBottom: type == "image" ? "100%" : "56.25%" }}
            image={thumbUrl}
            title={title}
          />
        )}
        {type != "image" && (
          <CardContent
            className={classes.content}
            style={{
              background: `linear-gradient(45deg, ${bgL} 68%, ${bgR})`,
            }}
          >
            {title && (
              <Typography style={{ color: f }} gutterBottom variant="h5">
                {title}
              </Typography>
            )}
            {!title && (
              <Typography
                style={{ color: f }}
                gutterBottom
                variant="h5"
                dangerouslySetInnerHTML={{
                  __html: truncateCaptionPreview(caption),
                }}
              ></Typography>
            )}
            {type != "note" && (
              <Typography
                style={{ color: f }}
                variant="body1"
                color="textSecondary"
                dangerouslySetInnerHTML={{
                  __html: truncateCaptionPreview(caption),
                }}
              ></Typography>
            )}
          </CardContent>
        )}
      </Link>
    </Card>
  );
};

const mapStateToProps = (state) => ({});
const mapDispatchToProps = (dispatch) => ({
  subscribeToUpdates: (type, _id) => {
    switch (type) {
      case "video":
        dispatch(ActionCreators.subscribeNewsfeedVideoItemUpdate(_id));
        break;
      case "image":
        dispatch(ActionCreators.subscribeNewsfeedImageItemUpdate(_id));
        break;
      case "note":
        dispatch(ActionCreators.subscribeNewsfeedNoteItemUpdate(_id));
        break;
    }
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(memo(NewsFeedItem));
