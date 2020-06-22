import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { ActionCreators } from "../actions";

import ReactDOM from "react-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import CheckoutForm from "./CheckoutForm";
import CircularProgress from "@material-ui/core/CircularProgress";
import { STRIPE_PK } from "../constants";
const stripePromise = loadStripe(STRIPE_PK);

import axios from "axios";

import CustomButton from "./CustomButton";

import { date2str, printCentsToCurreny, getPaymentId } from "../utils/helpers";

const useStyles = makeStyles((theme) => ({
  main: {
    margin: "48px 0",
  },
  header: {
    textDecoration: "underline",
    marginBottom: 12,
  },
  container: {
    padding: 12,
    maxWidth: 820,
  },
  dialog: {
    padding: 14,
    display: "flex",
    flexDirection: "column",
  },
  dialogActions: {
    display: "flex",
    justifyContent: "space-evenly",
    padding: 10,
    marginBottom: 12,
  },
  chargesList: {
    margin: "8px 0 32px 18px",
  },
  charge: {},
  sub: {
    "& .subCaption": {
      display: "block",
      color: theme.palette.secondary.main,
      "& span": {
        color: theme.palette.alert.main,
        textDecoration: "underline",
      },
    },
  },
  newPayment: {
    margin: "48px 0",
  },
}));

const Payment = ({
  loading,
  loadPaymentInfo,
  charges,
  subscriptions,
  active,
  activeUntil,
  location,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const [paymentId, setPaymentId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const cancelSubscription = () => {
    setDeleting(true);
    setConfirmOpen(false);
    axios.delete("/payment/subscription").then((res) => {
      if (res.data) {
        loadPaymentInfo();
        setDeleting(false);
      }
    });
  };

  useEffect(() => {
    loadPaymentInfo();
    let p = getPaymentId(location.search);
    if (p) setPaymentId(p);
  }, []);

  const confirmClose = () => {
    setConfirmOpen(false);
  };

  return (
    <Grid container className={classes.container}>
      <Grid className={classes.main} item xs={12}>
        {paymentId && (
          <Typography style={{ marginBottom: 28 }} color="primary" variant="h5">
            Payment Received! Confirmation #{paymentId}
          </Typography>
        )}
        <Typography className={classes.header} variant="h3">
          Payment Status
        </Typography>
        {!active && (
          <Typography variant="h5">
            Your account became inactive on {date2str(activeUntil)}
          </Typography>
        )}
        {active && activeUntil && (
          <Typography variant="h5">
            Account will be active until {date2str(activeUntil)}
          </Typography>
        )}
        {active && !activeUntil && (
          <div>
            <Typography variant="h5">Thank you loyal subscriber</Typography>
            <CustomButton
              text="Cancel Subscription"
              style={{ marginLeft: 0 }}
              onClick={() => setConfirmOpen(true)}
            />
          </div>
        )}
        {(loading || deleting) && (
          <CircularProgress style={{ margin: "28px 0" }} />
        )}
      </Grid>
      {(activeUntil || !active) && (
        <Grid className={classes.newPayment} item xs={12}>
          <Typography variant="h5">
            Make a new payment (1 month or subscribe)
          </Typography>
          <Elements stripe={stripePromise}>
            <CheckoutForm />
          </Elements>
        </Grid>
      )}
      <Grid style={{ marginTop: 48, marginBottom: 12 }} item xs={12}>
        <Typography className={classes.header} variant="h3">
          Payment History
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography color="primary" variant="h6">
          Subscriptions
        </Typography>
        <ul className={classes.chargesList}>
          {subscriptions.length == 0 && (
            <li>
              <div className={classes.charge}>no subscriptions</div>
            </li>
          )}
          {subscriptions.map((sub, i) => {
            return (
              <li key={i}>
                <div className={classes.sub}>
                  {printCentsToCurreny(sub.amount)}/mo. on{" "}
                  {date2str(sub.createdAt)} (confrimation #
                  <b>{sub._id.substring(sub._id.length - 8).toUpperCase()}</b>)
                  {!sub.terminated && (
                    <Typography variant="subtitle2" className="subCaption">
                      ACTIVE
                    </Typography>
                  )}
                  {sub.terminated && (
                    <Typography variant="subtitle2" className="subCaption">
                      terminated on {date2str(sub.terminatedAt)}
                    </Typography>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </Grid>
      <Grid item xs={12}>
        <Typography color="primary" variant="h6">
          1 Time Charges
        </Typography>
        <ul className={classes.chargesList}>
          {charges.length == 0 && (
            <li>
              <div className={classes.charge}>no charges</div>
            </li>
          )}
          {charges.map((charge, i) => {
            return (
              <li key={i}>
                <div className={classes.charge}>
                  {printCentsToCurreny(charge.amount)} on{" "}
                  {date2str(charge.createdAt)} (confrimation #
                  <b>
                    {charge._id.substring(charge._id.length - 8).toUpperCase()}
                  </b>
                  )
                </div>
              </li>
            );
          })}
        </ul>
      </Grid>
      <Dialog
        className={classes.dialog}
        onClose={confirmClose}
        open={confirmOpen}
      >
        <DialogTitle>Confirm cancel subscription</DialogTitle>
        <div className={classes.dialogActions}>
          <CustomButton
            style={{
              backgroundColor: theme.palette.alert.main,
              color: theme.palette.light.main,
            }}
            text="UNSUBSCRIBE"
            onClick={cancelSubscription}
          />
          <CustomButton
            style={{
              backgroundColor: theme.palette.secondary.main,
              color: theme.palette.light.main,
            }}
            text="RETURN"
            onClick={confirmClose}
          />
        </div>
      </Dialog>
    </Grid>
  );
};

const mapDispatchToProps = (dispatch) => ({
  loadPaymentInfo: () => dispatch(ActionCreators.loadUserPaymentInfoStart()),
});

const mapStateToProps = (state) => ({
  loading: state.user.loading,
  active: state.user.active,
  activeUntil: state.user.activeUntil,
  charges: state.user.payment.charges,
  subscriptions: state.user.payment.subscriptions,
});

export default connect(mapStateToProps, mapDispatchToProps)(Payment);
