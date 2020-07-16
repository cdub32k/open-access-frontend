import React, { useState, useRef, useEffect, Fragment } from "react";
import { connect } from "react-redux";
import { ActionCreators } from "../actions";
import { TransitionGroup, CSSTransition } from "react-transition-group";

import CircularProgress from "@material-ui/core/CircularProgress";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import CommentForm from "./CommentForm";
import Comment from "./Comment";
import CustomButton from "./CustomButton";

import throttle from "lodash.throttle";

const useStyles = makeStyles((theme) => ({
  container: {
    width: "100%",
    padding: 12,
    paddingTop: 0,
  },
  section: {
    overflow: "auto",
    maxHeight: 920,
    paddingTop: 24,
  },
  sortRoot: {
    padding: "6px 32px 6px 6px",
  },
  sortSelect: {
    marginLeft: 6,
  },
  sortOption: {
    padding: "4px 8px",
  },
}));

const CommentsSection = ({
  loading,
  newLoading,
  newReplyId,
  repliesLoading,
  comments,
  totalCount,
  contentType,
  id,
  loadMoreComments,
  clearComments,
  hasMore,
}) => {
  const classes = useStyles();

  const ccontainer = useRef();

  const [sort, setSort] = useState(0);

  const changeSort = (e) => {
    clearComments(contentType);
    setSort(e.target.value);
    loadMoreComments(contentType, id, e.target.value);
  };

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
      let max = document.documentElement.scrollHeight - 25;
      if (pos > max) {
        loadMoreComments(contentType, id, sort);
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
        loadMoreComments(contentType, id, sort);
        ccontainer.current.scrollTop = ccontainer.current.scrollHeight;
      }
    },
    500,
    { leading: false }
  );
  return (
    <div className={`${classes.container} comments-container`}>
      <div style={{ marginBottom: 48 }}>
        <Typography variant="h4" style={{ display: "inline" }}>
          Comments ({totalCount})
        </Typography>
        <Select
          style={{
            display: "inline-block",
            verticalAlign: "middle",
            marginLeft: 12,
          }}
          classes={{ root: classes.sortRoot, select: classes.sortSelect }}
          value={sort}
          defaultValue={0}
          onChange={changeSort}
          variant="outlined"
        >
          <MenuItem className={classes.sortOption} value={0}>
            Newest
          </MenuItem>
          <MenuItem className={classes.sortOption} value={3}>
            Most Liked
          </MenuItem>
          <MenuItem className={classes.sortOption} value={4}>
            Most Disliked
          </MenuItem>
        </Select>
      </div>
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
  loadMoreComments: (type, _id, sort) =>
    dispatch(ActionCreators.loadMoreComments(type, _id, sort)),
  clearComments: (type) => {
    dispatch(ActionCreators.clearComments(type));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(CommentsSection);
