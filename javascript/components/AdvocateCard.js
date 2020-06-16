import React from "react";

import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  slide: {
    height: 350,
    width: 300,
    margin: 20,
    borderTop: `4px solid ${theme.palette.secondary.main}`,
    display: "inline-block",
    position: "relative",
    boxShadow: "0 3px 5px 0 rgba(0,0,0,.4)",
    padding: 12,
  },
  avatar: {
    position: "absolute",
    left: "50%",
    top: -50,
    transform: "translateX(-50%)",
    width: 100,
    height: 100,
  },
  content: {
    display: "flex",
    flexDirection: "column",
    whiteSpace: "break-spaces",
    alignItems: "center",
    paddingTop: 65,
  },
  location: {
    margin: 16,
  },
  statement: {
    textAlign: "center",
    maxHeight: 145,
    overflowY: "scroll",
    pointerEvents: "all",
  },
}));

const AdvocateCard = (props) => {
  const classes = useStyles();

  return (
    <div className={classes.slide} {...props}>
      <Avatar
        className={classes.avatar}
        src="http://localhost:5000/img/default-profile.png"
      />
      <div className={classes.content}>
        <Typography className={classes.name} variant="h6">
          Loren Robinson
        </Typography>

        <Typography className={classes.location} variant="subtitle2">
          <LocationOnIcon size="small" />
          Atlanta, GA
        </Typography>
        <Typography className={classes.statement} variant="body1">
          Loren is a content marketing specialist at WordStream and nutrition
          graduate student at Framingham State. She loves all things digital,
          learning about nutrition, running, traveling, and cooking.
        </Typography>
      </div>
    </div>
  );
};

export default AdvocateCard;
