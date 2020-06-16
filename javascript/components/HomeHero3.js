import React from "react";
import { Link } from "react-router-dom";

import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";

import Carousel from "./Carousel";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: "0 100px",
    marginBottom: 150,
    justifyContent: "center",
  },
  header: {
    textAlign: "center",
    margin: 68,
  },
}));

const HomeHero = (props) => {
  const classes = useStyles();

  return (
    <Grid
      container
      className={`${classes.container} home-hero-container`}
      alignItems="center"
    >
      <Grid item xs={12} className={classes.header}>
        <Typography variant="h3">People Ready to Sign Up.</Typography>
      </Grid>
      <Grid item xs={12}>
        <Carousel />
      </Grid>
    </Grid>
  );
};

export default HomeHero;
