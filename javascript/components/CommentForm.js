import React, { useState } from "react";
import { connect } from "react-redux";

import { ActionCreators } from "../actions";

import { makeStyles } from "@material-ui/core/styles";
import CustomInput from "./CustomInput";
import CustomButton from "./CustomButton";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    maxWidth: 600,
  },
  textField: {},
}));

const CommentForm = ({
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
    <form
      onSubmit={postComment}
      className={`${classes.container} ${className || ""}`}
    >
      <CustomInput
        value={body}
        name="body"
        onChange={(e) => setBody(e.target.value)}
        multiline
        className={classes.textField}
      />
      <CustomButton
        disabled={!body.trim()}
        text={!replyId ? "comment" : "reply"}
        onClick={postComment}
        style={{ width: 100 }}
        size="small"
      />
    </form>
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
