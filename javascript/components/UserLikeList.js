import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";

import CustomButton from "./CustomButton";
import { date2rel } from "../utils/helpers";

const useStyles = makeStyles((theme) => ({
  container: {
    margin: "32px 0",
    padding: "0 32px",
  },
  contentList: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    maxWidth: 1260,
    padding: 0,
  },
  likeLink: {
    marginBottom: 48,
  },
}));

const UserLikeList = ({ loading, likes, hasMore, loadMore }) => {
  const classes = useStyles();
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (hasMore && likes.length == 0) loadMore(0);
  }, []);

  const _loadMore = () => {
    loadMore(page + 1);
    setPage(page + 1);
  };

  if (!loading && (!likes || likes.length == 0))
    return (
      <div className={`${classes.container} user-comments-list`}>
        <Typography variant="body1">Nothing to show here (yet)</Typography>
      </div>
    );

  return (
    <div className={`${classes.container} user-comments-list`}>
      {likes.map((like, i) => {
        let link;
        if (like.video) {
          link = (
            <Typography variant="body1">
              a video{" "}
              <b>
                <Link to={`/video-player/${like.video._id}`}>
                  {like.video.title}
                </Link>
              </b>
            </Typography>
          );
        } else if (like.image) {
          link = (
            <Typography variant="body1">
              an image{" "}
              <b>
                <Link to={`/image/${like.image._id}`}>{like.image.title}</Link>
              </b>
            </Typography>
          );
        } else if (like.note) {
          link = (
            <Typography variant="body1">
              a{" "}
              <b>
                <Link to={`/note/${like.note._id}`}>note</Link>
              </b>
            </Typography>
          );
        }
        return (
          <div className={classes.likeLink} key={like._id}>
            {link}
            <Typography variant="body2">{date2rel(like.createdAt)}</Typography>
          </div>
        );
      })}
      {loading && <CircularProgress style={{ margin: "28px 0" }} />}
      {hasMore && (
        <div>
          <CustomButton
            text="Load more"
            onClick={_loadMore}
            style={{ marginLeft: 0 }}
          />
        </div>
      )}
    </div>
  );
};

export default UserLikeList;
