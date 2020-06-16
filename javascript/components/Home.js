import React from "react";

import HomeHero1 from "./HomeHero1";
import HomeHero2 from "./HomeHero2";
import HomeHero3 from "./HomeHero3";
import HomeHero4 from "./HomeHero4";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: "0 24px",
  },
}));

const Home = (props) => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <HomeHero1 />
      <HomeHero2 />
      <HomeHero3 />
      <HomeHero4 />
    </div>
  );
};

export default Home;
