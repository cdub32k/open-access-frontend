import React, { Fragment, useState } from "react";
import { connect } from "react-redux";

import { ActionCreators } from "../actions";

import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import CustomInput from "./CustomInput";
import CustomButton from "./CustomButton";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    maxWidth: 600,
  },
  counter: {
    display: "inline-block",
    position: "absolute",
    top: -18,
  },
  textField: {},
}));

const CommentForm = ({
  loading,
  id,
  replyId,
  contentType,
  postToVideo,
  postToImage,
  postToNote,
  className,
}) => {
  const classes = useStyles();

  const [body, setBody] = useState("");

  let action;
  switch (contentType) {
    case "note":
      action = postToNote;
      break;
    case "image":
      action = postToImage;
      break;
    case "video":
      action = postToVideo;
    default:
      break;
  }

  const postComment = (e) => {
    e.preventDefault();
    action(id, body, replyId);
    setBody("");
  };

  return (
    <div className={className}>
      <form onSubmit={postComment} className={classes.container}>
        <div style={{ position: "relative", width: "100%" }}>
          <Typography className={classes.counter} variant="caption">
            {body.length} / 800 chars
          </Typography>
          <CustomInput
            value={body}
            name="body"
            onChange={(e) => setBody(e.target.value)}
            multiline
            className={classes.textField}
            maxLength={800}
          />
        </div>
        <CustomButton
          disabled={!body.trim() || loading}
          text={!replyId ? "comment" : "reply"}
          onClick={postComment}
          style={{ width: 118, margin: 0, marginLeft: 12 }}
          size="small"
        />
      </form>
      {loading && (
        <CircularProgress
          disableShrink
          style={{ margin: "10px 14px", width: 20, height: 20 }}
        />
      )}
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  postToVideo: (id, body, replyId) =>
    dispatch(ActionCreators.postVideoCommentStart(id, body, replyId)),
  postToImage: (id, body, replyId) =>
    dispatch(ActionCreators.postImageCommentStart(id, body, replyId)),
  postToNote: (id, body, replyId) =>
    dispatch(ActionCreators.postNoteCommentStart(id, body, replyId)),
});

export default connect(null, mapDispatchToProps)(CommentForm);
