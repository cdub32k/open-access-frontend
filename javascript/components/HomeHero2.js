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
        body="Open Access is 100% user-supported and will never accept a dime from advertisers or sponsors. We answer to no one except our users, and our only goal is to create a happy community. You won't have to deal with unwanted interuptions of any kind."
      />
      <HeroCard
        Icon={PublicIcon}
        title="Unique Culture"
        body="What sets us apart is our community, which every member cherishes and loves. There is one common newsfeed and individual profiles. You can post videos, images, and text messages, and there are are comments, hashtags, and @ mentions."
      />
      <HeroCard
        Icon={SentimentSatisfiedAltIcon}
        title="Limited Membership"
        body="This is not a viral network but more of a tight-nit group. Membership is capped at 5,000 active users and it will remain this way until the end of time. There is no concept of friends, followers, or premium members, as everyone is treated as equals here."
      />
      <HeroCard
        Icon={BusinessCenterIcon}
        title="Caring Small Business"
        body="The social media companies you already know are working at such a large scale, your concerns and questions are almost always left unaddressed. Here at Open Access, take to our users' feedback to heart and response promptly. Email <b>openaccess@usa.com</b>"
      />
      <HeroCard
        Icon={RecordVoiceOverIcon}
        title="Free Speech, User Privacy"
        body="No censorship of any kind. Of course we will report any criminal activity, but aside from that everyone can feel free to speak their mind openly. Also, we track no user analytics and the data you upload to the site can be permanently deleted any time."
      />
      <HeroCard
        Icon={MonetizationOnIcon}
        title="Monthly Payment"
        body="Membership is not free for our users. At $25 per month, membership fees will go towards storage and server costs, data bandwidth, feature development, customer service, and website moderation. Payments are monthly, and you can cancel any time. No free trial."
      />
    </Grid>
  );
};

export default HomeHero;
