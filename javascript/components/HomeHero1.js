import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";

import CustomButton from "./CustomButton";
import heroImg from "../images/hero.jpg";

const useStyles = makeStyles((theme) => ({
  container: {
    marginBottom: 150,
    [theme.breakpoints.down("xs")]: {
      marginBottom: 100,
    },
  },
  tContainer: {
    padding: 50,
    [theme.breakpoints.down("xs")]: {
      paddingTop: 24,
    },
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
  mcountContainer: {
    display: "flex",
    flexDirection: "column",
    marginTop: 24,
  },
}));

const HomeHero = (props) => {
  const classes = useStyles();
  const [mcount, setMCount] = useState(0);

  useEffect(() => {
    axios.get("/mcount").then((res) => {
      setMCount(res.data.mcount);
    });
  }, []);

  return (
    <Grid container className={`${classes.container} home-hero-container`}>
      <Grid item xs={12} md={6} lg={5}>
        <Grid container className={`${classes.tContainer} home-hero-container`}>
          <Grid item xs={12} className={classes.title}>
            <Typography variant="h2">Open Access</Typography>
          </Grid>
          <Grid item xs={12} className={classes.blurb}>
            <Typography variant="subtitle2">
              The ultimate community for those who want to express themselves
              freely
            </Typography>
            {mcount != 0 && (
              <div className={classes.mcountContainer}>
                <Typography color="primary" variant="h4">
                  <b style={{ fontSize: 24 }}>{mcount}</b> active members
                </Typography>
                <Typography
                  style={{ marginTop: 12 }}
                  color="secondary"
                  variant="h4"
                >
                  <b style={{ fontSize: 24 }}>{5000 - mcount}</b> available
                  slots
                </Typography>
              </div>
            )}
          </Grid>
          <Grid item xs={12} className={classes.btn}>
            <Link style={{ pointerEvents: "none" }} to="/sign-up">
              <CustomButton
                disabled
                text="Become A Member"
                style={{ marginLeft: 0 }}
              />
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
