import React, { memo } from "react";
import { Link } from "react-router-dom";

import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";

import LogoIcon from "./LogoIcon";

const useStyles = makeStyles((theme) => ({
  container: {
    width: 345,
  },
  caption: {},
  title: {
    flexGrow: 1,
    color: theme.palette.primary.main,
  },
  logoContainer: {
    display: "flex",
    justifyContent: "flex-start",
  },
}));

const MainLogo = (props) => {
  const classes = useStyles();

  return (
    <Grid container className={classes.container}>
      <Grid container alignItems="center" className={classes.topRow}>
        <Grid
          item
          className={classes.logoContainer}
          style={{ flexBasis: 0, marginRight: 12 }}
          xs={3}
        >
          <LogoIcon />
        </Grid>
        <Grid item className={classes.logoContainer} xs={9}>
          <Typography color="inherit" variant="h3" className={classes.title}>
            <Link to="/">Open Access</Link>
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default memo(MainLogo);
