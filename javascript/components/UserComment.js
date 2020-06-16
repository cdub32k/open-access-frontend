import React from "react";
import { Link } from "react-router-dom";

import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import { date2rel, convertHashtagsToLinks } from "../utils/helpers";

const useStyles = makeStyles((theme) => ({
  container: {
    marginBottom: 48,
  },
  body: {
    margin: "10px 0",
  },
}));

const UserComment = ({ comment }) => {
  const classes = useStyles();

  let type, mediaTitle, mediaLink, link;
  if (comment.video) {
    type = "video";
    mediaTitle = `image ${comment.video.title}`;
    mediaLink = `/video-player/${comment.video._id}`;
    link = `/video-player/${comment.video._id}?c=${comment._id}`;
  } else if (comment.image) {
    type = "image";
    mediaTitle = `video ${comment.image.title}`;
    mediaLink = `/image/${comment.image._id}`;
    link = `/image/${comment.image._id}?c=${comment._id}`;
  } else if (comment.note) {
    type = "note";
    mediaTitle = "a note";
    mediaLink = `/note/${comment.note._id}`;
    link = `/note/${comment.note._id}?c=${comment._id}`;
  }

  return (
    <div className={classes.container}>
      {comment.replyId ? (
        <Typography variant="body1">
          <Link to={link}>replied</Link> to a comment on{" "}
          <Link to={mediaLink}>{mediaTitle}</Link>
        </Typography>
      ) : (
        <Typography variant="body1">
          <Link to={link}>commented</Link> on{" "}
          <Link to={mediaLink}>{mediaTitle}</Link>
        </Typography>
      )}
      <Typography
        className={classes.body}
        variant="body1"
        dangerouslySetInnerHTML={{
          __html: convertHashtagsToLinks(comment.body),
        }}
      ></Typography>
      <Typography variant="body2">{date2rel(comment.createdAt)}</Typography>
    </div>
  );
};

export default UserComment;
