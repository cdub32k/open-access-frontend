import React, { memo } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";

const useStyles = makeStyles((theme) => ({
  container: {
    marginBottom: 32,
    width: "100%",
    maxWidth: 600,
    alignSelf: "flex-start",
  },
  avatarContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: 18,
  },
  avatar: {
    width: 300,
    height: 300,
    border: `4px solid ${theme.palette.secondary.main}`,
    animation: "pulse-light 1s infinite",
    backgroundColor: "rgba(0, 0, 0, 0.03)",
    cursor: "pointer",
  },
  bio: {
    margin: "12px 0",
  },
  paper: {
    border: `4px solid ${theme.palette.secondary.main}`,
    boxShadow: theme.shadows[5],
    padding: 0,
    maxWidth: "95%",
    "& img": {
      width: "100%",
    },
  },
  textContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  text: {
    height: 12,
    width: "75%",
    animation: "pulse-dark 1s infinite",
    backgroundColor: "rgba(0, 0, 0, 0.08)",
    margin: "2px 0",
  },
}));

const PreviewProfileHeader = () => {
  const classes = useStyles();

  return (
    <Grid container className={classes.container}>
      <Grid className={classes.avatarContainer} item xs={12} md={6}>
        <div className={classes.avatar}></div>
      </Grid>
      <Grid className={classes.textContainer} item xs={12} md={6}>
        <div className={classes.text}></div>
        <div className={classes.text}></div>
        <div className={classes.text}></div>
        <div
          className={classes.text}
          style={{ marginTop: 8, height: 120 }}
        ></div>
      </Grid>
    </Grid>
  );
};

export default memo(PreviewProfileHeader);
