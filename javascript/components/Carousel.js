import React, { useState, useRef } from "react";

import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { makeStyles } from "@material-ui/core/styles";

import AdvocateCard from "./AdvocateCard";

const useStyles = makeStyles((theme) => ({
  carousel: {},
  slides: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    margin: "auto",
    pointerEvents: "none",
    paddingTop: 30,
    marginTop: -30,
  },
  arrows: {
    display: "flex",
    justifyContent: "center",
    "& > .left, & > .right": {
      width: 44,
      height: 44,
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      background: theme.palette.primary.main,
      borderRadius: "50%",
      padding: 8,
      color: theme.palette.light.main,
      margin: 12,
      boxShadow: "0 3px 5px 0 rgba(0,0,0,.4)",
      transition: "all 100ms ease-out",
      "&:hover": {
        transform: "translateY(-4px)",
      },
    },
  },
}));

const Carousel = (props) => {
  const classes = useStyles();

  const [slide, setSlide] = useState(0);
  const slides = useRef();

  const switchSlides = (back) => {
    if (!back) {
      let scrolls;
      if (window.innerWidth < 601) scrolls = 7;
      else if (window.innerWidth < 961) scrolls = 6;
      else scrolls = 5;

      let c = Math.min(slide + 1, scrolls);
      setSlide(c);

      slides.current.scrollTo({
        left: c * 340,
        behavior: "smooth",
      });
    } else {
      let c = Math.max(slide - 1, 0);
      setSlide(c);

      slides.current.scrollTo({
        left: c * 340,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className={classes.carousel}>
      <div className={`${classes.slides} advocate-slides`} ref={slides}>
        <AdvocateCard />
        <AdvocateCard />
        <AdvocateCard />
        <AdvocateCard />
        <AdvocateCard />
        <AdvocateCard />
        <AdvocateCard />
        <AdvocateCard />
      </div>
      <div className={classes.arrows}>
        <div className="left" onClick={() => switchSlides(true)}>
          <ArrowBackIcon size="small" />
        </div>
        <div className="right" onClick={() => switchSlides()}>
          <ArrowForwardIcon size="small" />
        </div>
      </div>
    </div>
  );
};

export default Carousel;
