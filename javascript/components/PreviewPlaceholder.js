import React, { memo } from "react";

import { Link } from "react-router-dom";

import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import { makeStyles } from "@material-ui/core/styles";

import { num2str, date2rel } from "../utils/helpers";

const useStyles = makeStyles((theme) => ({
  container: {
    height: 240,
    width: 300,
    margin: "18px 6px",
    display: "inline-block",
    position: "relative",
    animation: "pulse-light 1.5s infinite",
    backgroundColor: "rgba(0, 0, 0, 0.03)",
  },
  thumb: {
    height: 169,
    width: 300,
    padding: 0,
  },
  previewDetailsContainer: {
    position: "absolute",
    width: "100%",
    height: 72,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    height: 44,
    width: "50%",
    lineHeight: 0,
    animation: "pulse-dark 1.5s infinite",
    backgroundColor: "rgba(0, 0, 0, 0.08)",
  },
  previewDetails: {
    display: "flex",
    justifyContent: "space-between",
    height: 22,
    width: "75%",
    marginTop: 8,
    animation: "pulse-dark 1.5s infinite",
    backgroundColor: "rgba(0, 0, 0, 0.08)",
  },
}));

const PreviewPlaceholder = ({ type }) => {
  const classes = useStyles();
  const cardClass =
    type == "image" ? "image-preview content-preview" : "content-preview";
  const contentClass =
    type == "image" ? "image-placeholder-thumb" : "preview-placeholder-thumb";
  return (
    <Card
      className={`${classes.container} ${cardClass}`}
      style={{ height: type == "image" ? 300 : 240 }}
    >
      <CardContent
        className={`${classes.thumb} ${contentClass}`}
        style={{ height: type == "image" ? 300 : 169 }}
      />
      {type != "image" && (
        <CardHeader
          className={classes.previewDetailsContainer}
          avatar={<Avatar />}
          title={<span className={classes.title}></span>}
          subheader={
            <div className={classes.previewDetails}>
              <div></div>
              <div></div>
            </div>
          }
        />
      )}
    </Card>
  );
};

export default memo(PreviewPlaceholder);
