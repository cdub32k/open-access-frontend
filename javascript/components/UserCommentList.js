import React, { useState, useEffect } from "react";

import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";

import UserComment from "./UserComment";
import CustomButton from "./CustomButton";

const useStyles = makeStyles((theme) => ({
  container: {
    margin: "32px 0",
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
            <UserComment key={i} comment={comment}>
              {comment.body}
            </UserComment>
          );
        })}
        {loading && <CircularProgress style={{ margin: "28px 0" }} />}
        {!loading && hasMore && (
          <div>
            <CustomButton
              text="Load more"
              onClick={_loadMore}
              style={{ marginLeft: 0 }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCommentList;
