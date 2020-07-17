import React, { useState, useEffect } from "react";

import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import ContentPreview from "./ContentPreview";
import PreviewPlaceholder from "./PreviewPlaceholder";
import CustomButton from "./CustomButton";

import throttle from "lodash.throttle";

const useStyles = makeStyles((theme) => ({
  container: {
    textAlign: "center",
    margin: "32px 0",
  },
  contentList: {
    display: "flex",
    justifyContent: "flex-start",
    flexWrap: "wrap",
    width: 1248,
    padding: 0,
  },
}));

const VideoList = ({ loading, videos, loadMore, hasMore, doneLoading }) => {
  const classes = useStyles();
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (videos.length) doneLoading();
  }, []);

  useEffect(() => {
    if (hasMore) {
      document.addEventListener("scroll", scrollVideosLoader);
      return () => {
        scrollVideosLoader.cancel();
        document.removeEventListener("scroll", scrollVideosLoader);
      };
    }
  }, [videos, page]);

  const scrollVideosLoader = throttle(
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

  let videoListHTML = loading
    ? videos
        .map((video) => {
          return (
            <ContentPreview
              contentType="video"
              user={video.user}
              id={video._id}
              thumbUrl={video.thumbUrl}
              title={video.title}
              viewCount={video.viewCount}
              createdAt={video.createdAt}
              key={video._id}
            />
          );
        })
        .concat(
          Array.from({ length: 4 }).map((preview, i) => {
            return <PreviewPlaceholder key={i} />;
          })
        )
    : videos.map((video, i) => {
        return (
          <ContentPreview
            contentType="video"
            user={video.user}
            id={video._id}
            thumbUrl={video.thumbUrl}
            title={video.title}
            viewCount={video.viewCount}
            createdAt={video.createdAt}
            key={i}
          />
        );
      });

  if (!loading && (!videos || videos.length == 0))
    videoListHTML = (
      <Typography variant="body1">Nothing to show here (yet)</Typography>
    );

  return (
    <div className={`${classes.container} content-container`}>
      <div className={`${classes.contentList} content-list`}>
        {videoListHTML}
        <br />
      </div>
    </div>
  );
};

export default VideoList;
