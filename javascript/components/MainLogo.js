import React, { memo } from "react";
import { Link } from "react-router-dom";

import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";

import LogoIcon from "./LogoIcon";

const useStyles = makeStyles((theme) => ({
  container: {
    width: 420,
    margin: 12,
  },
  topRow: {
    marginBottom: 5,
  },
  caption: {},
  title: {
    flexGrow: 1,
    color: theme.palette.primary.main,
  },
}));

const MainLogo = (props) => {
  const classes = useStyles();

  return (
    <Grid container className={classes.container}>
      <Grid container alignItems="center" className={classes.topRow}>
        <Grid item xs={2}>
          <Link to="/">
            <LogoIcon />
          </Link>
        </Grid>
        <Grid item xs={10}>
          <Typography color="inherit" variant="h3" className={classes.title}>
            <Link to="/">Open Access</Link>
          </Typography>
        </Grid>
      </Grid>
      <Grid item>
        <Typography variant="subtitle1" className={classes.caption}>
          this is a free speech network
        </Typography>
      </Grid>
    </Grid>
  );
};

export default memo(MainLogo);
