import React from "react";
import { Link } from "react-router-dom";

import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import { date2rel, convertHashtagsToLinks } from "../utils/helpers";

const useStyles = makeStyles((theme) => ({
  container: {},
  body: {
    margin: "10px 0",
  },
}));

const UserComment = ({ username, comment }) => {
  const classes = useStyles();

  let type, mediaTitle, mediaLink, link, p;
  if (comment.video) {
    type = "video";
    mediaTitle = "a video:";
    mediaLink = `/video-player/${comment.video._id}`;
    link = `/video-player/${comment.video._id}?c=${comment._id}`;
  } else if (comment.image) {
    type = "image";
    mediaTitle = "an image:";
    mediaLink = `/image/${comment.image._id}`;
    link = `/image/${comment.image._id}?c=${comment._id}`;
  } else if (comment.note) {
    type = "note";
    mediaTitle = "a note:";
    mediaLink = `/note/${comment.note._id}`;
    link = `/note/${comment.note._id}?c=${comment._id}`;
  }

  return (
    <div className={classes.container}>
      {comment.replyId ? (
        <Typography variant="body1">
          <b>@{username}</b>{" "}
          <Link to={link}>
            <b>replied</b>
          </Link>{" "}
          to a{" "}
          <Link to={`${mediaLink}?c=${comment.replyId}`}>
            <b>comment</b>
          </Link>{" "}
          on{" "}
          <Link to={mediaLink}>
            <b>{mediaTitle}</b>
          </Link>
        </Typography>
      ) : (
        <Typography variant="body1">
          <b>@{username}</b>{" "}
          <Link to={link}>
            <b>commented</b>
          </Link>{" "}
          on{" "}
          <Link to={mediaLink}>
            <b>{mediaTitle}</b>
          </Link>
        </Typography>
      )}
      <Typography
        className={classes.body}
        variant="body1"
        dangerouslySetInnerHTML={{
          __html: comment.body,
        }}
      ></Typography>
      <Typography variant="body2">
        <i>{date2rel(comment.createdAt)}</i>
      </Typography>
    </div>
  );
};

export default UserComment;
