import React, { Fragment, useState, useEffect } from "react";

import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";

import UserComment from "./UserComment";
import CustomButton from "./CustomButton";

import throttle from "lodash.throttle";

const useStyles = makeStyles((theme) => ({
  container: {
    margin: "18px 6px",
    padding: "0 32px",
    width: 1248,
  },
  contentList: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    margin: "auto",
    flexWrap: "wrap",
    padding: 0,
    width: 600,
  },
}));

const UserCommentList = ({
  loading,
  doneLoading,
  username,
  comments,
  hasMore,
  loadMore,
}) => {
  const classes = useStyles();
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (hasMore && comments.length == 0) loadMore(0);
    else doneLoading();
  }, []);

  useEffect(() => {
    if (hasMore) {
      document.addEventListener("scroll", scrollCommentsLoader);
      return () => {
        scrollCommentsLoader.cancel();
        document.removeEventListener("scroll", scrollCommentsLoader);
      };
    }
  }, [comments, page]);

  const scrollCommentsLoader = throttle(
    (e) => {
      let pos =
        (document.documentElement.scrollTop || document.body.scrollTop) +
        document.documentElement.offsetHeight;
      let max = document.documentElement.scrollHeight - 100;
      if (pos > max) {
        _loadMore();
      }
    },
    500,
    { leading: false }
  );

  const _loadMore = () => {
    loadMore(page + 1);
    setPage(page + 1);
  };

  if (!loading && (!comments || comments.length == 0))
    return (
      <div className={`${classes.container} user-comments-list content-list`}>
        <Typography variant="body1">Nothing to show here (yet)</Typography>
      </div>
    );

  return (
    <div className={`${classes.container} user-comments-list content-list`}>
      <div className={classes.contentList}>
        {comments.map((comment, i) => {
          return (
            <Fragment key={i}>
              <UserComment username={username} comment={comment} />
              <hr style={{ margin: "48px 0" }} />
            </Fragment>
          );
        })}
        {loading && <CircularProgress style={{ margin: "28px 0" }} />}
      </div>
    </div>
  );
};

export default UserCommentList;
