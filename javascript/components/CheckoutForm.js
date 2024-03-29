import React, { useState } from "react";
import { connect } from "react-redux";
import { ActionCreators } from "../actions";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import axios from "axios";

import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import CardSection from "./CardSection";
import CustomButton from "./CustomButton";

const useStyles = makeStyles((theme) => ({
  error: {
    fontSize: 14,
    color: theme.palette.alert.main,
    fontWeight: 700,
  },
  orderBtn: {
    marginTop: 28,
    marginLeft: 0,
  },
  star: {
    color: theme.palette.alert.main,
  },
}));

const CheckoutForm = ({
  loading,
  email,
  paymentStart,
  paymentSuccess,
  paymentError,
}) => {
  const classes = useStyles();

  const stripe = useStripe();
  const elements = useElements();

  const [subscribed, setSubscribed] = useState(false);
  const [cardError, setCardError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    paymentStart();

    if (!stripe || !elements) {
      return;
    }

    const result = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
      billing_details: {
        email,
      },
    });

    if (result.error) {
      paymentError();
      setCardError(result.error.message);
      setTimeout(() => {
        setCardError("");
      }, 5000);
    } else {
      axios
        .post("payment/process-payment", {
          payment_method: result.paymentMethod.id,
          subscribed,
        })
        .then((res) => {
          let url = window.location.pathname;
          if (!subscribed) {
            let charge = res.data.charge;
            url += `?p=${charge._id
              .substring(charge._id.length - 8)
              .toUpperCase()}`;
            window.location.href = url;
          } else {
            let sub = res.data.subscription;
            url += `?s=${sub._id.substring(sub._id.length - 8).toUpperCase()}`;
            window.location.href = url;
          }
        })
        .catch((error) => {});
    }
  };

  return (
    <div style={{ width: 425 }}>
      <form onSubmit={handleSubmit}>
        <CardSection />
        <FormGroup row>
          <FormControlLabel
            control={
              <Checkbox
                checked={subscribed}
                onChange={() => setSubscribed(!subscribed)}
                name="subscribe"
                color="primary"
              />
            }
            label={
              <span>
                <span className={classes.star}>*</span>
                <b>Subscribe</b>
              </span>
            }
          />
          <Typography variant="caption">
            <span className={classes.star}>*</span>Check this box if you would
            like to have your membership automatically renewed each month. If
            you subscribe, your first charge will not be made until your current
            membership runs out. Then, you will be automatically billed $25/mo.
          </Typography>
        </FormGroup>
        {cardError && <div className={classes.error}>{cardError}</div>}
        <CustomButton
          className={classes.orderBtn}
          type="submit"
          disabled={!stripe || loading}
          text="Confirm order"
        ></CustomButton>
      </form>
    </div>
  );
};

const mapStateToProps = (state) => ({
  loading: state.user.loading,
  email: state.user.email,
});
const mapDispatchToProps = (dispatch) => ({
  paymentStart: () => dispatch(ActionCreators.makePaymentStart()),
  paymentSuccess: () => dispatch(ActionCreators.makePaymentSuccess()),
  paymentError: (e) => dispatch(ActionCreators.makePaymentError(e)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutForm);
