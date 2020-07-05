import React, { memo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import Fab from "@material-ui/core/Fab";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import Zoom from "@material-ui/core/Zoom";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "fixed",
    bottom: theme.spacing(4),
    right: theme.spacing(4),
    zIndex: 10,
    [theme.breakpoints.down("sm")]: {
      bottom: theme.spacing(1),
      right: theme.spacing(1),
    },
  },
  upArrow: {
    color: theme.palette.light.main,
    fontSize: 28,
  },
}));

function ScrollTopButton(props) {
  const classes = useStyles();

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 400,
  });

  const handleClick = (event) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Zoom in={trigger}>
      <div onClick={handleClick} className={classes.root}>
        <Fab color="secondary" size="large">
          <KeyboardArrowUpIcon className={classes.upArrow} />
        </Fab>
      </div>
    </Zoom>
  );
}

export default memo(ScrollTopButton);
