import React, { useRef, useEffect, Fragment } from "react";
import { connect } from "react-redux";
import { ActionCreators } from "../actions";
import { TransitionGroup, CSSTransition } from "react-transition-group";

import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";

import CommentForm from "./CommentForm";
import Comment from "./Comment";
import CustomButton from "./CustomButton";

import throttle from "lodash.throttle";

const useStyles = makeStyles((theme) => ({
  container: {
    width: "100%",
    padding: 12,
  },
  section: {
    overflow: "auto",
    maxHeight: 920,
    paddingTop: 24,
  },
}));

const CommentsSection = ({
  loading,
  newLoading,
  newReplyId,
  repliesLoading,
  comments,
  contentType,
  id,
  loadMoreComments,
  hasMore,
}) => {
  const classes = useStyles();

  const ccontainer = useRef();

  useEffect(() => {
    if (hasMore) {
      document.addEventListener("scroll", scrollWindow);
      ccontainer.current.addEventListener("scroll", scrollContainer);
      return () => {
        scrollWindow.cancel();
        scrollContainer.cancel();
        document.removeEventListener("scroll", scrollWindow);
        ccontainer.current.removeEventListener("scroll", scrollContainer);
      };
    }
  }, [comments, hasMore]);

  const scrollWindow = throttle(
    (e) => {
      if (ccontainer.current.scrollHeight != ccontainer.current.clientHeight)
        return;
      let pos =
        (document.documentElement.scrollTop || document.body.scrollTop) +
        document.documentElement.offsetHeight;
      let max = document.documentElement.scrollHeight - 100;
      if (pos > max) {
        loadMoreComments(contentType, id);
        ccontainer.current.scrollTop = ccontainer.current.scrollHeight;
      }
    },
    500,
    { leading: false }
  );
  const scrollContainer = throttle(
    (e) => {
      let pos =
        ccontainer.current.scrollHeight -
        ccontainer.current.scrollTop -
        ccontainer.current.clientHeight;
      if (pos < 20) {
        loadMoreComments(contentType, id);
        ccontainer.current.scrollTop = ccontainer.current.scrollHeight;
      }
    },
    500,
    { leading: false }
  );
  return (
    <div className={`${classes.container} comments-container`}>
      <CommentForm
        loading={newLoading && !newReplyId}
        contentType={contentType}
        id={id}
      />
      <div className={`${classes.section} comments-section`} ref={ccontainer}>
        <TransitionGroup component="section">
          {comments.map((comment, i) => (
            <CSSTransition
              timeout={500}
              classNames="comment"
              unmountOnExit
              appear
              enter
              key={comment._id}
            >
              <Comment
                newLoading={newLoading}
                newReplyId={newReplyId}
                repliesLoading={repliesLoading}
                level={1}
                type={contentType}
                mediaId={id}
                _id={comment._id}
                body={comment.body}
                user={comment.user}
                createdAt={comment.createdAt}
                replyCount={comment.replyCount}
                replies={comment.replies}
                likeCount={comment.likeCount}
                dislikeCount={comment.dislikeCount}
                liked={comment.liked}
                disliked={comment.disliked}
                highlighted={comment.highlighted}
              />
            </CSSTransition>
          ))}
        </TransitionGroup>
        {loading && (
          <CircularProgress
            disableShrink
            style={{ margin: "0 12px", display: "block" }}
          />
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
  loadMoreComments: (type, _id) =>
    dispatch(ActionCreators.loadMoreComments(type, _id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CommentsSection);
