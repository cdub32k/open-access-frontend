import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";

import CustomButton from "./CustomButton";
import { date2rel } from "../utils/helpers";

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
    margin: "auto",
    flexDirection: "column",
    flexWrap: "wrap",
    padding: 0,
    width: 600,
  },
  likeLink: {},
}));

const UserLikeList = ({
  loading,
  doneLoading,
  username,
  likes,
  negative,
  hasMore,
  loadMore,
}) => {
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
      let max = document.documentElement.scrollHeight - 25;
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
      <div className={`${classes.container} user-comments-list content-list`}>
        <Typography variant="body1">Nothing to show here (yet)</Typography>
      </div>
    );

  return (
    <div className={`${classes.container} user-comments-list content-list`}>
      <div className={classes.contentList}>
        {likes.map((like, i) => {
          let link;
          if (like.video) {
            link = (
              <div>
                <Typography variant="body1">
                  <b>@{like.username}</b> {negative ? "disliked " : "liked "}
                  <Link to={`/video-player/${like.video._id}`}>
                    <b>a video:</b>
                  </Link>
                </Typography>
                <Typography
                  variant="body1"
                  style={{ margin: "10px 0" }}
                  dangerouslySetInnerHTML={{
                    __html: like.video.title,
                  }}
                ></Typography>
                <Link to={`/video-player/${like.video._id}`}>
                  <img
                    width="608"
                    style={{ maxWidth: "100%", marginTop: 12 }}
                    src={like.video.thumbUrl}
                  />
                </Link>
              </div>
            );
          } else if (like.image) {
            link = (
              <div>
                <Typography variant="body1">
                  <b>@{username}</b> {negative ? "disliked " : "liked "}
                  <Link to={`/image/${like.image._id}`}>
                    <b>an image:</b> <br />
                  </Link>
                </Typography>
                <Typography
                  variant="body1"
                  style={{ margin: "10px 0" }}
                  dangerouslySetInnerHTML={{
                    __html: like.image.title,
                  }}
                ></Typography>
                <Link to={`/image/${like.image._id}`}>
                  <img
                    width="608"
                    style={{ maxWidth: "100%", marginTop: 12 }}
                    src={like.image.url}
                  />
                </Link>
              </div>
            );
          } else if (like.note) {
            link = (
              <div>
                <Typography variant="body1">
                  <b>@{username}</b> {negative ? "disliked " : "liked "}
                  <Link to={`/note/${like.note._id}`}>
                    <b>a note:</b> <br />
                  </Link>
                </Typography>
                <Typography
                  variant="body1"
                  style={{ margin: "10px 0" }}
                  dangerouslySetInnerHTML={{
                    __html: like.note.caption,
                  }}
                ></Typography>
              </div>
            );
          }
          return (
            <Fragment key={like._id}>
              <div className={classes.likeLink}>
                {link}
                <Typography variant="body2">
                  <i>{date2rel(like.createdAt)}</i>
                </Typography>
              </div>
              <hr style={{ margin: "48px 0" }} />
            </Fragment>
          );
        })}
        {loading && <CircularProgress style={{ margin: "28px 0" }} />}
      </div>
    </div>
  );
};

export default UserLikeList;
