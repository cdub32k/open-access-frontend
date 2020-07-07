import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";

import CustomButton from "./CustomButton";
import { date2rel, truncateTitlePreview } from "../utils/helpers";

import throttle from "lodash.throttle";

const useStyles = makeStyles((theme) => ({
  container: {
    margin: "32px 0",
    padding: "0 32px",
  },
  contentList: {
    display: "flex",
    justifyContent: "center",
    margin: "auto",
    flexDirection: "column",
    flexWrap: "wrap",
    padding: 0,
    width: 600,
  },
  likeLink: {
    marginBottom: 48,
  },
}));

const UserLikeList = ({ loading, doneLoading, likes, hasMore, loadMore }) => {
  const classes = useStyles();
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (hasMore && likes.length == 0) loadMore(0);
    else doneLoading();
  }, []);

  useEffect(() => {
    if (hasMore) {
      document.addEventListener("scroll", scrollLikesLoader);
      return () => {
        scrollLikesLoader.cancel();
        document.removeEventListener("scroll", scrollLikesLoader);
      };
    }
  }, [likes, page]);

  const scrollLikesLoader = throttle(
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

  if (!loading && (!likes || likes.length == 0))
    return (
      <div className={`${classes.container} user-comments-list`}>
        <Typography variant="body1">Nothing to show here (yet)</Typography>
      </div>
    );

  return (
    <div className={`${classes.container} user-comments-list`}>
      <div className={classes.contentList}>
        {likes.map((like, i) => {
          let link;
          if (like.video) {
            link = (
              <Typography variant="body1">
                a video{" "}
                <b>
                  <Link to={`/video-player/${like.video._id}`}>
                    {truncateTitlePreview(like.video.title)}
                  </Link>
                </b>
              </Typography>
            );
          } else if (like.image) {
            link = (
              <Typography variant="body1">
                an image{" "}
                <b>
                  <Link to={`/image/${like.image._id}`}>
                    {truncateTitlePreview(like.image.title)}
                  </Link>
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
              <Typography variant="body2">
                {date2rel(like.createdAt)}
              </Typography>
            </div>
          );
        })}
        {loading && <CircularProgress style={{ margin: "28px 0" }} />}
      </div>
    </div>
  );
};

export default UserLikeList;
