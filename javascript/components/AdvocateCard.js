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
    overflowY: "auto",
    overflowX: "hidden",
    pointerEvents: "all",
  },
}));

const AdvocateCard = ({ profilePic }) => {
  const classes = useStyles();

  return (
    <div className={classes.slide}>
      <Avatar className={classes.avatar} src={profilePic} />
      <div className={classes.content}>
        <Typography className={classes.name} variant="h6">
          Loren Robinson
        </Typography>

        <Typography className={classes.location} variant="subtitle2">
          <LocationOnIcon size="small" />
          Houston, TX
        </Typography>
        <Typography className={classes.statement} variant="body1">
          Loren is a technical architect at Plural Soundz and a healthcare
          graduate student at Deluth University. She loves all things digital,
          learning about healthcare, hiking, and watching movies.
        </Typography>
      </div>
    </div>
  );
};

export default AdvocateCard;
