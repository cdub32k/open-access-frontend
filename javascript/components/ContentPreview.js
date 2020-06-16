import React, { useState, memo } from "react";

import { Link } from "react-router-dom";

import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import { makeStyles } from "@material-ui/core/styles";

import { num2str, date2rel, truncateNotePreview } from "../utils/helpers";

const useStyles = makeStyles((theme) => ({
  container: {
    height: 240,
    width: 300,
    margin: "18px 6px",
    display: "inline-block",
    position: "relative",
  },
  thumb: {
    height: 169,
    width: 300,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  previewDetailsContainer: {
    position: "absolute",
    width: "100%",
    height: 72,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    minHeight: 44,
    lineHeight: 0,
  },
  previewDetails: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "10px",
    maxWidth: "75%",
    marginTop: 8,
  },
  link: {
    color: `${theme.palette.text.primary} !important`,
  },
}));

const ContentPreview = ({
  contentType,
  id,
  user,
  thumbUrl,
  title,
  viewCount,
  likeCount,
  commentCount,
  caption,
  uploadedAt,
}) => {
  let linkPrefix, metric;
  switch (contentType) {
    case "video":
      linkPrefix = "/video-player";
      metric = `${num2str(viewCount)} views`;
      break;
    case "image":
      linkPrefix = "/image";
      metric = `${num2str(likeCount)} likes`;
      break;
    case "note":
      linkPrefix = "/note";
      metric = `${num2str(commentCount)} comments`;
      break;
    default:
      break;
  }
  const classes = useStyles();
  const [elevation, setElevation] = useState(4);
  const onMouseOver = () => setElevation(12);
  const onMouseOut = () => setElevation(4);

  return (
    <Card
      className={`${classes.container} content-preview`}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      elevation={elevation}
    >
      <Link to={`${linkPrefix}/${id}`} className={classes.link}>
        {contentType != "note" && (
          <CardMedia
            className={
              `${classes.thumb} content-thumb` +
              (contentType == "image" ? " image-thumb" : "")
            }
            image={thumbUrl}
          />
        )}
        {contentType == "note" && (
          <CardContent className={`${classes.thumb} content-thumb`}>
            <div style={{ fontSize: 14 }}>{truncateNotePreview(caption)}</div>
          </CardContent>
        )}
      </Link>
      <CardHeader
        className={classes.previewDetailsContainer}
        avatar={<Avatar src={user.profilePic} />}
        title={<span className={classes.title}>{title}</span>}
        subheader={
          <div className={classes.previewDetails}>
            <div>{metric}</div>
            <div>{date2rel(uploadedAt)}</div>
          </div>
        }
      />
    </Card>
  );
};

export default memo(ContentPreview);
