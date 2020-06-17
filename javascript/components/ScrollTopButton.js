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
  },
  upArrow: {
    color: theme.palette.dark.main,
    fontSize: 28,
  },
}));

function ScrollTopButton(props) {
  const { children, window } = props;
  const classes = useStyles();

  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 400,
  });

  const handleClick = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector(
      "html"
    );

    if (anchor) {
      anchor.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <Zoom in={trigger}>
      <div onClick={handleClick} className={classes.root}>
        <Fab color="secondary" size="medium">
          <KeyboardArrowUpIcon className={classes.upArrow} />
        </Fab>
      </div>
    </Zoom>
  );
}

export default memo(ScrollTopButton);
