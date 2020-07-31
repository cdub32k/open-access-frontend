import React from "react";

import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  container: {
    maxWidth: 350,
    height: 300,
    padding: 20,
    margin: 10,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    transition: "all 200ms ease-out",
    alignItems: "center",
    textAlign: "center",
    cursor: "pointer",
    "&:hover": {
      boxShadow: `0 0 35px -2px rgba(0,0,0,0.22)`,
    },
    "&:hover .icon": {
      color: theme.palette.secondary.main,
      transform: "scale(1.5)",
    },
  },
  icon: {
    transition: "all 200ms ease-out",
  },
  title: {
    margin: "20px 0",
  },
  body: {},
}));

const HeroCard = ({ Icon, title, body }) => {
  const classes = useStyles();

  return (
    <Grid item xs={12} md={6} lg={4} className={classes.container}>
      <Icon fontSize="large" className={`${classes.icon} icon`} />
      <Typography variant="h5" className={classes.title}>
        {title}
      </Typography>
      <Typography
        variant="body1"
        className={classes.body}
        dangerouslySetInnerHTML={{
          __html: body,
        }}
      ></Typography>
    </Grid>
  );
};

export default HeroCard;
