import React, { useState, useEffect, memo, Fragment } from "react";
import { connect } from "react-redux";
import { ActionCreators } from "../actions";
import { Link } from "react-router-dom";
import axios from "axios";
import { TransitionGroup, CSSTransition } from "react-transition-group";

import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import ThumbDownOutline from "@material-ui/icons/ThumbDownOutlined";
import { makeStyles } from "@material-ui/core/styles";

import {
  date2rel,
  num2str,
  convertHashtagsToLinks,
  parseVideoTimestampsToLinks,
} from "../utils/helpers";

import CustomInput from "./CustomInput";
import MediaOwnerActions from "./MediaOwnerActions";
import CommentForm from "./CommentForm";

const useStyles = makeStyles((theme) => ({
  container: {
    marginBottom: 54,
    maxWidth: "100%",
  },
  comment: {
    display: "flex",
    flexDirection: "column",
    marginBottom: 8,
    position: "relative",
  },
  avatar: {
    width: 49,
    height: 49,
    marginRight: 16,
  },
  avatarSection: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 8,
  },
  textSection: {
    display: "flex",
    flexDirection: "column",
    wordBreak: "break-word",
  },
  userInfo: {
    marginBottom: 12,
  },
  ownerActions: {
    position: "absolute",
    right: 10,
    top: -14,
  },
  replyLink: {
    fontSize: 11,
    cursor: "pointer",
    display: "inline-block",
    marginLeft: 12,
    marginBottom: 12,
  },
  showRepliesLink: {
    fontSize: 11,
    marginBottom: 12,
    display: "inline-block",
    cursor: "pointer",
  },
  replyForm: {
    marginLeft: 12,
    marginTop: 12,
    marginBottom: 12,
  },
  repliesSection: {
    marginLeft: 12,
  },
  actionSection: {
    "& svg": { fontSize: 12 },
    "& button ~ span": { fontSize: 11, marginLeft: -5 },
  },
  highlighted: {
    fontSize: 11,
    color: theme.palette.light.main,
    textAlign: "center",
    margin: "6px 0",
    backgroundColor: theme.palette.secondary.main,
  },
}));

let Comment = ({
  _id,
  mediaId,
  body,
  user,
  createdAt,
  type,
  mineUsername,
  updateComment,
  replyCount,
  replyId,
  getReplies,
  replies,
  likeCount,
  dislikeCount,
  liked,
  disliked,
  like,
  dislike,
  highlighted,
  level,
}) => {
  const classes = useStyles();
  const [newBody, setNewBody] = useState(body);
  const [replyFormOpen, setReplyFormOpen] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  useEffect(() => {
    if (replies) setShowReplies(true);
  }, []);

  useEffect(() => {
    if (replies && replyFormOpen) {
      setShowReplies(true);
      setReplyFormOpen(false);
    }
  }, [replies]);

  const update = () => {
    let path;
    switch (type) {
      case "video":
        path = `/videos/comments/${_id}`;
        break;
      case "image":
        path = `/images/comments/${_id}`;
        break;
      case "note":
        path = `/notes/comments/${_id}`;
    }

    return axios.put(path, { body: newBody }).then((res) => {
      updateComment(type, _id, newBody);
    });
  };

  const showReplyForm = () => {
    setReplyFormOpen(!replyFormOpen);
  };

  const replyStyle = {};
  if (replyId) {
    replyStyle.avatar = { width: 28, height: 28 };
    replyStyle.container = { marginBottom: 20 };
  }

  const likeIcon = liked ? <FavoriteIcon /> : <FavoriteBorderIcon />;
  const dislikeIcon = disliked ? <ThumbDownIcon /> : <ThumbDownOutline />;

  body = convertHashtagsToLinks(body);
  if (type == "video") body = parseVideoTimestampsToLinks(body);

  return (
    <div className={classes.container} style={replyStyle.container}>
      {highlighted && (
        <div className={classes.highlighted}>highlighted comment</div>
      )}
      <article className={classes.comment}>
        <div className={classes.avatarSection}>
          <Link to={`/profile/${user.username}`}>
            <Avatar
              src={user.profilePic}
              className={classes.avatar}
              style={replyStyle.avatar}
            />
          </Link>
          <Typography className={classes.userInfo} variant="body2">
            <Link to={`/profile/${user.username}`}>
              <b>@{user.username}</b>
            </Link>
            &nbsp;&#8226;&nbsp;{date2rel(createdAt)}
          </Typography>
        </div>
        <div className={classes.textSection}>
          <Typography
            style={{ whiteSpace: "pre-wrap", paddingRight: 2 }}
            variant="body1"
            dangerouslySetInnerHTML={{
              __html: body,
            }}
          ></Typography>
        </div>
        {user.username == mineUsername && (
          <MediaOwnerActions
            className={classes.ownerActions}
            _id={_id}
            type={type + "Comment"}
            editTitle={"Edit Comment"}
            editForm={
              <CustomInput
                name="body"
                value={newBody}
                multiline={true}
                onChange={(e) => setNewBody(e.target.value)}
              />
            }
            editCallback={update}
          />
        )}
      </article>
      <div className={classes.actionSection}>
        <div>
          <IconButton onClick={() => like(type, mediaId, _id)}>
            {likeIcon}
          </IconButton>
          <span className={classes.metric}>{num2str(likeCount)}</span>
          <IconButton onClick={() => dislike(type, mediaId, _id)}>
            {dislikeIcon}
          </IconButton>
          <span className={classes.metric}>{num2str(dislikeCount)}</span>
        </div>
        {level < 5 && (
          <Fragment>
            <a className={classes.replyLink} onClick={showReplyForm}>
              {!replyFormOpen ? "REPLY" : "CANCEL"}
            </a>
            {replyFormOpen && (
              <CommentForm
                className={classes.replyForm}
                contentType={type}
                id={mediaId}
                replyId={_id}
              />
            )}
          </Fragment>
        )}
      </div>
      {replyCount > 0 && (
        <div className={classes.repliesSection}>
          <a
            className={classes.showRepliesLink}
            onClick={() => {
              if (!showReplies && (!replies || replies.length != replyCount))
                getReplies(type, _id);
              setShowReplies(!showReplies);
            }}
          >
            {!showReplies ? `show ${replyCount} ` : "hide "} replies
          </a>
          <TransitionGroup component="section">
            {showReplies &&
              replies &&
              replies.map((reply) => {
                return (
                  <CSSTransition
                    timeout={500}
                    classNames="comment"
                    unmountOnExit
                    appear
                    enter
                    key={reply._id}
                  >
                    <Comment
                      level={level + 1}
                      key={reply._id}
                      type={type}
                      mediaId={mediaId}
                      _id={reply._id}
                      body={reply.body}
                      user={reply.user}
                      createdAt={reply.createdAt}
                      replyCount={reply.replyCount}
                      replyId={reply.replyId}
                      replies={reply.replies}
                      likeCount={reply.likeCount}
                      dislikeCount={reply.dislikeCount}
                      liked={reply.liked}
                      disliked={reply.disliked}
                      highlighted={reply.highlighted}
                    />
                  </CSSTransition>
                );
              })}
          </TransitionGroup>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  mineUsername: state.user.username,
});
const mapDispatchToProps = (dispatch) => ({
  updateComment: (type, _id, body) =>
    dispatch(ActionCreators.updateComment(type, _id, body)),
  getReplies: (type, _id) =>
    dispatch(ActionCreators.getCommentReplies(type, _id)),
  like: (type, mediaId, commentId) =>
    dispatch(ActionCreators.likeComment(type, mediaId, commentId)),
  dislike: (type, mediaId, commentId) =>
    dispatch(ActionCreators.dislikeComment(type, mediaId, commentId)),
});

Comment = connect(mapStateToProps, mapDispatchToProps)(memo(Comment));

export default Comment;
