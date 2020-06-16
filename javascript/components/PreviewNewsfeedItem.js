import React, { memo } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles({
  root: {
    width: "96%",
    margin: "12px 0",
    animation: "pulse-light 1s infinite",
    backgroundColor: "rgba(0, 0, 0, 0.03)",
  },
  userInfo: {
    width: "50%",
    height: 44,
    "& div": {
      backgroundColor: "rgba(0,0,0,0.08)",
      animation: "pluse-dark 1s infinite",
      margin: "4px 0",
      height: 16,
    },
  },
  media: {
    width: "100%",
    paddingBottom: "56.25%",
  },
  content: {
    height: 84,
    backgroundColor: "rgba(0,0,0,0.08)",
    animation: "pluse-dark 1s infinite",
  },
  stats: {
    display: "flex",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    display: "flex",
    padding: 8,
  },
  avatar: {
    width: 49,
    height: 49,
    marginRight: 8,
  },
});

const PreviewNewsFeedItem = ({ type }) => {
  const classes = useStyles();

  switch (type) {
    case "video":
      break;
    case "image":
      break;
    case "note":
      break;
    default:
      break;
  }

  return (
    <Card className={classes.root}>
      <CardContent className={classes.actions}>
        <Avatar className={classes.avatar} />
        <div style={{ width: "100%" }}>
          <div className={classes.userInfo}>
            <div></div>
            <div></div>
          </div>
          <div className={classes.stats}>
            <div variant="body2">
              <div></div>
            </div>
            <div>
              <div></div>
            </div>
            <div>
              <div></div>
            </div>
          </div>
        </div>
      </CardContent>
      {type != "note" && (
        <div
          className={classes.media}
          style={{ paddingBottom: type == "image" ? "100%" : "56.25%" }}
        ></div>
      )}
      {type != "image" && (
        <CardContent className={classes.content}>
          <div></div>
          {type != "note" && <div></div>}
        </CardContent>
      )}
    </Card>
  );
};

export default memo(PreviewNewsFeedItem);
