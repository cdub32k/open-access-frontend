import React from "react";
import { Link } from "react-router-dom";

import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";

import CustomButton from "./CustomButton";
import heroImg from "../images/hero.jpg";

const useStyles = makeStyles((theme) => ({
  container: {
    marginBottom: 150,
  },
  tContainer: {
    padding: 50,
  },
  title: {},
  blurb: {
    margin: "24px 0",
  },
  btn: {},
  heroImg: {
    width: "100%",
    borderRadius: 10,
  },
}));

const HomeHero = (props) => {
  const classes = useStyles();

  return (
    <Grid container className={`${classes.container} home-hero-container`}>
      <Grid item xs={12} md={6} lg={5}>
        <Grid container className={`${classes.tContainer} home-hero-container`}>
          <Grid item xs={12} className={classes.title}>
            <Typography variant="h2">Open Access</Typography>
          </Grid>
          <Grid item xs={12} className={classes.blurb}>
            <Typography variant="subtitle2">
              The ultimate community for those that want to express themselves
              freely
            </Typography>
          </Grid>
          <Grid item xs={12} className={classes.btn}>
            <Link to="/sign-up">
              <CustomButton text="Become A Member" style={{ marginLeft: 0 }} />
            </Link>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} md={6} lg={7}>
        <Box display={{ xs: "none", md: "inline" }}>
          <img src={heroImg} className={classes.heroImg} />
        </Box>
      </Grid>
    </Grid>
  );
};

export default HomeHero;
