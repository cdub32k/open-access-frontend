import React, { Component, useState } from "react";
import { connect } from "react-redux";
import { ActionCreators } from "../actions";
import axios from "axios";

import {
  useStripe,
  useElements,
  Elements,
  CardElement,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { STRIPE_PK } from "../constants";
const stripePromise = loadStripe(STRIPE_PK);

import Grid from "@material-ui/core/Grid";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import CustomInput from "./CustomInput";
import CustomButton from "./CustomButton";
import CardSection from "./CardSection";

import { validateEmail, validateUsername } from "../utils/helpers";

const useStyles = makeStyles((theme) => ({
  container: {
    position: "relative",
    maxWidth: 400,
    display: "block",
    padding: 12,
  },
  section: {
    margin: `${theme.spacing(2)}px 0 0 0`,
  },
  btn: {
    marginTop: 48,
  },
  error: {
    margin: "14px 0",
    fontSize: 14,
    color: theme.palette.alert.main,
    fontWeight: 700,
  },
  serverError: {
    position: "absolute",
    fontSize: "14px",
    top: 50,
    left: "50%",
    transform: "translateX(-50%)",
  },
  star: {
    color: theme.palette.alert.main,
  },
  ...theme.globalClasses,
}));

const SignUp = ({ error, signupStart, ...rest }) => {
  const classes = useStyles();
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [cardError, setCardError] = useState("");

  const checkEmail = (email) => {
    if (validateEmail(email)) {
      setEmailError("");
      // axios.post("/auth/check-email", { email }).then((res) => {
      //   if (res.data) {
      //     setEmailError("Email address in use");
      //   }
      // });
    } else {
      setEmailError("Invalid email address");
    }
  };

  const checkUsername = (username) => {
    if (validateUsername(username)) {
      setUsernameError("");
      axios.post("/auth/check-username", { username }).then((res) => {
        if (res.data) {
          setUsernameError("Username taken");
        }
      });
    } else {
      setUsernameError("Invalid username");
    }
  };

  const checkPassword = (password) => {
    if (password.length < 6) setPasswordError("Password too short");
    else setPasswordError("");
  };

  const updateCredentials = (e) => {
    switch (e.target.name) {
      case "email":
        setEmail(e.target.value.toLowerCase());
        checkEmail(e.target.value.toLowerCase());
        break;
      case "username":
        setUsername(e.target.value.toLowerCase());
        checkUsername(e.target.value.toLowerCase());
        break;
      case "password":
        setPassword(e.target.value);
        checkPassword(e.target.value);
        break;
      default:
        break;
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
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
      setLoading(false);
      setCardError(result.error.message);
      setTimeout(() => {
        setCardError("");
      }, 5000);
    } else {
      signupStart({
        email,
        username,
        password,
        payment_method: result.paymentMethod.id,
        subscribed,
      });
    }
  };

  return (
    <Grid className={classes.container} container justify="center">
      <Grid item xs={12}>
        <Typography variant="h3" color="primary">
          Sign up
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <form onSubmit={onSubmit}>
          <FormGroup>
            <div className={classes.section}>
              <Typography variant="h6" color="primary">
                User Info
              </Typography>
              <Grid container justify="center">
                <Grid className={classes.inputContainer} item xs={12}>
                  <CustomInput
                    value={email}
                    name="email"
                    label="Email"
                    onChange={updateCredentials}
                    required
                  />
                </Grid>
              </Grid>
              <Grid container justify="center">
                <Grid className={classes.inputContainer} item xs={12}>
                  <CustomInput
                    value={username}
                    name="username"
                    label="Username"
                    onChange={updateCredentials}
                    minLength={3}
                    maxLength={16}
                    required
                  />
                </Grid>
              </Grid>
              <Grid container justify="center">
                <Grid className={classes.inputContainer} item xs={12}>
                  <CustomInput
                    value={password}
                    name="password"
                    label="Password"
                    onChange={updateCredentials}
                    minLength={6}
                    required
                  />
                </Grid>
              </Grid>
              {emailError && <div className={classes.error}>{emailError}</div>}
              {usernameError && (
                <div className={classes.error}>{usernameError}</div>
              )}
              {passwordError && (
                <div className={classes.error}>{passwordError}</div>
              )}
            </div>
            <Grid container justify="center" style={{ marginTop: 36 }}>
              <Grid item xs={12}>
                <CardSection />
                {cardError && <div className={classes.error}>{cardError}</div>}
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
                        <span className={classes.star}>*</span>Renew every month
                      </span>
                    }
                  />
                  <Typography variant="caption" style={{ fontWeight: "bold" }}>
                    <span className={classes.star}>*</span>Check this box if you
                    would like to have your membership automatically renewed
                    each month. If you leave this box unchecked, you can still
                    renew manually and re-enter you CC information if you decide
                    to stay with us.
                  </Typography>
                </FormGroup>
              </Grid>
            </Grid>
            <Grid container justify="center" className={classes.btn}>
              <Grid item xs={12}>
                <CustomButton
                  text={loading ? "Signing up..." : "Sign up"}
                  disabled={
                    !email ||
                    !username ||
                    !password ||
                    !!emailError ||
                    !!usernameError ||
                    !!passwordError ||
                    !!cardError ||
                    loading
                  }
                  style={{ marginLeft: 0 }}
                  onClick={onSubmit}
                />
                {loading && (
                  <CircularProgress
                    style={{ verticalAlign: "middle", marginLeft: 8 }}
                  />
                )}
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption" style={{ fontWeight: "bold" }}>
                  <span className={classes.star}>*</span>You will be charged $25
                  immediately for your first month of membership
                </Typography>
              </Grid>
            </Grid>
          </FormGroup>
        </form>
      </Grid>
    </Grid>
  );
};

const SignUpContainer = (props) => {
  return (
    <Elements stripe={stripePromise}>
      <SignUp {...props} />
    </Elements>
  );
};

const mapStateToProps = (state) => ({
  error: state.user.error,
});

const mapDispatchToProps = (dispatch) => ({
  signupStart: (userInfo) => dispatch(ActionCreators.signupStart(userInfo)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SignUpContainer);
