import React, { Component, useEffect, useState } from "react";
import { connect } from "react-redux";
import { ActionCreators } from "../actions";

import { Link } from "react-router-dom";

import Grid from "@material-ui/core/Grid";
import FormGroup from "@material-ui/core/FormGroup";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";

import CustomInput from "./CustomInput";
import CustomButton from "./CustomButton";

const useStyles = makeStyles((theme) => ({
  container: {
    position: "relative",
    maxWidth: 400,
    display: "block",
    padding: 12,
    marginTop: 48,
  },
  error: {
    position: "absolute",
    fontSize: "14px",
    top: 50,
    left: "50%",
    transform: "translateX(-50%)",
  },
  btn: {
    marginTop: 12,
  },
  forgotPassword: {
    marginLeft: "auto",
    fontSize: 11,
    display: "inline-block",
  },
  ...theme.globalClasses,
}));

const Login = ({ error, loginStart }) => {
  const classes = useStyles();

  useEffect(() => {
    setLoading(false);
  }, [error]);

  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const updateCredentials = (e) => {
    switch (e.target.name) {
      case "username":
        setUsername(e.target.value.toLowerCase());
        break;
      case "password":
        setPassword(e.target.value);
        break;
      default:
        break;
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();

    setLoading(true);
    loginStart({ username, password });
  };
  const onEnter = (e) => {
    if (event.key === "Enter" && !(!username || !password || loading)) {
      onSubmit(e);
    }
  };

  return (
    <Grid className={classes.container} container justify="center">
      {error && (
        <Typography className={classes.error} variant="caption" color="error">
          User not found!
        </Typography>
      )}
      <Grid item xs={12} style={{ marginBottom: 12 }}>
        <Typography variant="h3" color="primary">
          Sign in
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <form onSubmit={onSubmit}>
          <FormGroup>
            <Grid container justify="center">
              <Grid className={classes.inputContainer} item xs={12}>
                <CustomInput
                  name="username"
                  label="Username"
                  onChange={updateCredentials}
                  onKeyDown={onEnter}
                />
              </Grid>
            </Grid>
            <Grid container justify="center">
              <Grid className={classes.inputContainer} item xs={12}>
                <CustomInput
                  name="password"
                  label="Password"
                  onChange={updateCredentials}
                  onKeyDown={onEnter}
                />
              </Grid>

              <Link className={classes.forgotPassword} to={"/password-reset"}>
                forgot password?
              </Link>
            </Grid>
            <Grid container justify="center" className={classes.btn}>
              <Grid item xs={12}>
                <CustomButton
                  text={loading ? "Signing in..." : "Sign in"}
                  style={{ marginLeft: 0 }}
                  disabled={!username || !password || loading}
                  onClick={onSubmit}
                />
                {loading && (
                  <CircularProgress
                    style={{ verticalAlign: "middle", marginLeft: 8 }}
                  />
                )}
              </Grid>
            </Grid>
          </FormGroup>
        </form>
      </Grid>
    </Grid>
  );
};

const mapStateToProps = (state) => ({
  error: state.user.error,
});

const mapDispatchToProps = (dispatch) => ({
  loginStart: (credentials) => dispatch(ActionCreators.loginStart(credentials)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
