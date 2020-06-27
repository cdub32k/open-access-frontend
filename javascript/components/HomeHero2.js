import React from "react";
import { Link } from "react-router-dom";

import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import PublicIcon from "@material-ui/icons/Public";
import RecordVoiceOverIcon from "@material-ui/icons/RecordVoiceOver";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import SentimentSatisfiedAltIcon from "@material-ui/icons/SentimentSatisfiedAlt";
import BusinessCenterIcon from "@material-ui/icons/BusinessCenter";
import { makeStyles } from "@material-ui/core/styles";

import CustomButton from "./CustomButton";
import heroImg from "../images/hero.jpg";
import HeroCard from "./HeroCard";

const useStyles = makeStyles((theme) => ({
  container: {
    marginBottom: 150,
    justifyContent: "center",
  },
  header: {
    textAlign: "center",
    margin: 68,
  },
}));

const HomeHero = (props) => {
  const classes = useStyles();

  return (
    <Grid
      container
      className={`${classes.container} home-hero-container`}
      alignItems="center"
    >
      <Grid item xs={12} className={classes.header}>
        <Typography variant="h3">What is Open Access?</Typography>
      </Grid>
      <HeroCard
        Icon={LocalOfferIcon}
        title="No Ads"
        body="Eut occaecat do incididunt ea et. Incididunt dolor eu in aute magna aliqua voluptate ad. Culpa sint culpa labore culpa aute culpa eu ad consequat reprehenderit Lorem cillum."
      />
      <HeroCard
        Icon={PublicIcon}
        title="Unique Culture"
        body="Lorem conseaborum lnt officia laborum non in mollit commodo. Quis nisi incididunt non tempor fugiat fugiat irure ipsum adipisicing ad."
      />
      <HeroCard
        Icon={RecordVoiceOverIcon}
        title="Free Speech"
        body="Nostrud nostrud duis irure cagna. Dolor mollit exercitation lnostrud duis irure consectetur cillumabore quis laboris consequat enim fugiat eu ad."
      />
      <HeroCard
        Icon={MonetizationOnIcon}
        title="Monthly Payment"
        body="Cupidatat dolore tempor elit do nooident minim. Laborum id officia ut sit nostrud. Fugiat pariatur cillum sint eiusmod ipsum commodo sint eu eiusmod laborum Lorem minim."
      />
      <HeroCard
        Icon={SentimentSatisfiedAltIcon}
        title="Limited Membership"
        body="Nisi dolot non ad sit occaecat ea id. Exceptat sint labore Lorem ad deserunt. Pariatur do ea aute minim incididunt labore sit incididunt Lorem laborum irure."
      />
      <HeroCard
        Icon={BusinessCenterIcon}
        title="Caring Small Business"
        body="Incididunt cupidatat commodo au in incididunt adipisicing. Esse excepteur ipsum voluptate nostrud cillum et. Labore anim nulla sint officia labore velit proident reprehenderit officia aliquip non duis."
      />
    </Grid>
  );
};

export default HomeHero;
