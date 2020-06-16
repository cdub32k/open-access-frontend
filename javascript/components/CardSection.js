import React, { Component } from "react";
import { CardElement } from "@stripe/react-stripe-js";

import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#1D1A05",
      fontFamily: '"Montserrat", sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "12px",
      "::placeholder": {
        color: "#51490e",
      },
      height: 51.25,
      border: "2px solid #E6AA68",
    },
    invalid: {
      color: "#CA3C25",
      iconColor: "#CA3C25",
    },
  },
};

const useStyles = makeStyles((theme) => ({
  ccSection: {
    margin: `${theme.spacing(2)}px 0`,
  },
  ccInput: {
    height: 40,
    border: `2px solid ${theme.palette.secondary.main}`,
    paddingTop: 12,
    marginTop: theme.spacing(2),
  },
}));

const CardSection = (props) => {
  const classes = useStyles();

  return (
    <div className={classes.ccSection}>
      <Typography variant="h6" color="primary">
        Credit Card Info
      </Typography>
      <CardElement className={classes.ccInput} options={CARD_ELEMENT_OPTIONS} />
    </div>
  );
};

export default CardSection;
