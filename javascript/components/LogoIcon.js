import React from "react";
import { Link } from "react-router-dom";
import { useSpring, animated } from "react-spring";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    justifyContent: "center",
    width: 60,
  },
}));

const interp = (i) => (r) =>
  `translate3d(0, ${2 * Math.sin(r + (i * 2 * Math.PI) / 1.6)}px, 0)`;

const LogoIcon = () => {
  const classes = useStyles();

  const { radians } = useSpring({
    to: { radians: 2 * Math.PI },
    loop: true,
    from: { radians: 0 },
    config: { duration: 3500 },
  });

  return (
    <Link to={"/"}>
      <div className={`${classes.container} logo-container`}>
        <animated.div
          className="logo-l"
          style={{ transform: radians.interpolate(interp(0)) }}
        >
          <animated.div
            className="ball-l"
            style={{ transform: radians.interpolate(interp(3)) }}
          />
        </animated.div>
        <animated.div
          className="logo-r"
          style={{ transform: radians.interpolate(interp(1)) }}
        >
          <animated.div
            className="ball-r"
            style={{ transform: radians.interpolate(interp(2)) }}
          />
        </animated.div>
      </div>
    </Link>
  );
};

export default LogoIcon;
