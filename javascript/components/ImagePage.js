import React, { useState, useEffect, Fragment } from "react";
import { connect } from "react-redux";
import { ActionCreators } from "../actions";
import axios from "axios";

import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";

import Image_C from "./Image";
import PreviewImage from "./PreviewImage";
import CommentsSection from "./CommentsSection";
import MediaOwnerActions from "./MediaOwnerActions";
import CustomInput from "./CustomInput";
import Error from "./Error";
import { getCommentId } from "../utils/helpers";

const useStyles = makeStyles((theme) => ({
  ownerActions: {
    position: "absolute",
    top: 0,
    right: 16,
    backgroundColor: "rgba(255,255,255,0.4)",
    borderRadius: "50%",
    [theme.breakpoints.down("sm")]: {
      right: 12,
    },
  },
  imageSection: {
    position: "relative",
    [theme.breakpoints.up("md")]: {
      paddingRight: 4,
    },
    [theme.breakpoints.down("sm")]: {
      paddingRight: 0,
    },
  },
  ...theme.globalClasses,
}));

const ImagePage = ({
  loading,
  error,
  user,
  title,
  caption,
  url,
  likeCount,
  dislikeCount,
  commentCount,
  uploadedAt,
  liked,
  disliked,
  comments,
  match,
  mineUsername,
  getImageInfo,
  clearImageData,
  hasMoreComments,
  updateImage,
}) => {
  if (error) return <Error />;

  const [newTitle, setNewTitle] = useState(title);
  const [newCaption, setNewCaption] = useState(caption);

  const { imageId } = match.params;
  let c = getCommentId(location.search);
  useEffect(() => {
    getImageInfo(imageId, c);
    return () => clearImageData();
  }, []);
  useEffect(() => {
    setNewTitle(title);
    setNewCaption(caption);
  }, [title, caption]);

  const classes = useStyles();

  const update = () => {
    return axios
      .put(`/images/${imageId}`, { title: newTitle, caption: newCaption })
      .then((res) => {
        updateImage(newTitle, newCaption);
      });
  };

  return (
    <Grid container>
      <Grid item xs={12} md={8} className={classes.imageSection}>
        {loading ? (
          <PreviewImage />
        ) : (
          <Fragment>
            <Image_C
              _id={imageId}
              user={user}
              title={title}
              caption={caption}
              url={url}
              uploadedAt={uploadedAt}
              likeCount={likeCount}
              dislikeCount={dislikeCount}
              commentCount={commentCount}
              liked={liked}
              disliked={disliked}
            />
            {user.username == mineUsername && (
              <MediaOwnerActions
                className={classes.ownerActions}
                _id={imageId}
                type="image"
                editTitle="Edit Image"
                editCallback={update}
                editForm={
                  <Fragment>
                    <div className={classes.inputContainer}>
                      <CustomInput
                        name="title"
                        label="Title"
                        value={newTitle}
                        multiline={true}
                        onChange={(e) => setNewTitle(e.target.value)}
                      />
                    </div>
                    <div className={classes.inputContainer}>
                      <CustomInput
                        name="caption"
                        label="Caption"
                        value={newCaption}
                        multiline={true}
                        onChange={(e) => setNewCaption(e.target.value)}
                      />
                    </div>
                  </Fragment>
                }
              />
            )}
          </Fragment>
        )}
      </Grid>
      <Grid item xs={12} md={4}>
        <CommentsSection
          comments={comments}
          contentType="image"
          id={imageId}
          hasMoreComments={hasMoreComments}
        />
      </Grid>
    </Grid>
  );
};

const mapStateToProps = (state) => ({
  loading: state.image.loading,
  error: state.image.error,
  user: state.image.user,
  title: state.image.title,
  caption: state.image.caption,
  url: state.image.url,
  likeCount: state.image.likeCount,
  dislikeCount: state.image.dislikeCount,
  commentCount: state.image.commentCount,
  uploadedAt: state.image.uploadedAt,
  liked: state.image.liked,
  disliked: state.image.disliked,
  comments: state.image.comments,
  mineUsername: state.user.username,
  hasMoreComments: state.image.hasMoreComments,
});

const mapDispatchToProps = (dispatch) => ({
  getImageInfo: (imageId, cId) =>
    dispatch(ActionCreators.getImageInfoStart(imageId, cId)),
  clearImageData: () => dispatch(ActionCreators.clearImageData()),
  updateImage: (title, caption) =>
    dispatch(ActionCreators.updateImage(title, caption)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ImagePage);
