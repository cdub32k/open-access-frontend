import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

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

const ImageList = ({ loading, images, hasMore, loadMore, doneLoading }) => {
  const classes = useStyles();
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (hasMore && images.length == 0) loadMore(0);
    else doneLoading();
  }, []);

  useEffect(() => {
    if (hasMore) {
      document.addEventListener("scroll", scrollImagesLoader);
      return () => {
        scrollImagesLoader.cancel();
        document.removeEventListener("scroll", scrollImagesLoader);
      };
    }
  }, [images, page]);

  const scrollImagesLoader = throttle(
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

  let imageListHTML = loading
    ? images
        .map((image) => {
          return (
            <ContentPreview
              contentType="image"
              user={image.user}
              id={image._id}
              title={image.title}
              thumbUrl={image.url}
              likeCount={image.likeCount}
              uploadedAt={image.uploadedAt}
              key={image._id}
            />
          );
        })
        .concat(
          Array.from({ length: 4 }).map((preview, i) => {
            return <PreviewPlaceholder key={i} type="image" />;
          })
        )
    : images.map((image, i) => {
        return (
          <ContentPreview
            contentType="image"
            user={image.user}
            id={image._id}
            title={image.title}
            thumbUrl={image.url}
            likeCount={image.likeCount}
            uploadedAt={image.uploadedAt}
            key={i}
          />
        );
      });

  if (!loading && (!images || images.length == 0))
    imageListHTML = (
      <Typography variant="body1">Nothing to show here (yet)</Typography>
    );

  return (
    <div className={`${classes.container} content-container`}>
      <div className={`${classes.contentList} content-list`}>
        {imageListHTML}
      </div>
    </div>
  );
};

export default ImageList;
