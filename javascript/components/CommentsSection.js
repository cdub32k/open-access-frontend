import React, { useRef, useEffect, Fragment } from "react";
import { connect } from "react-redux";
import { ActionCreators } from "../actions";
import { TransitionGroup, CSSTransition } from "react-transition-group";

import { makeStyles } from "@material-ui/core/styles";

import CommentForm from "./CommentForm";
import Comment from "./Comment";
import CustomButton from "./CustomButton";

const useStyles = makeStyles((theme) => ({
  container: {
    width: "100%",
    padding: 12,
  },
  section: {
    overflow: "auto",
    maxHeight: 800,
    paddingTop: 24,
  },
}));

const CommentsSection = ({
  comments,
  contentType,
  id,
  loadMoreComments,
  hasMoreComments,
}) => {
  const classes = useStyles();

  return (
    <div className={`${classes.container} comments-container`}>
      <CommentForm contentType={contentType} id={id} />
      <TransitionGroup
        component="section"
        className={`${classes.section} comments-section`}
      >
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
      {hasMoreComments && (
        <CustomButton
          text="Load More"
          onClick={() => loadMoreComments(contentType, id)}
        />
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
  loadMoreComments: (type, _id) =>
    dispatch(ActionCreators.loadMoreComments(type, _id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CommentsSection);
