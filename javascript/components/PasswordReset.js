import React, { useEffect, useState } from "react";
import axios from "axios";

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
  btn: {
    marginLeft: 0,
    marginTop: 18,
  },
  ...theme.globalClasses,
}));

const PasswordReset = ({ match }) => {
  let { tempKey } = match.params;
  const classes = useStyles();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  if (tempKey) {
    const [password, setPassword] = useState("");
    const [cPassword, setCPassword] = useState("");

    const updatePassword = () => {
      setError(false);
      if (password.length >= 6 && password == cPassword) {
        setLoading(true);
        axios
          .post("/auth/update-password", { tempKey, password })
          .then((res) => {
            if (res.data) {
              setSuccess(true);
              setLoading(false);
            } else {
              setLoading(false);
              setError("There was an error updating your password");
            }
          })
          .catch((err) => setLoading(false));
      } else {
        setError("passwords don't match");
      }
    };

    return (
      <Grid className={classes.container} container justify="center">
        <Grid item xs={12}>
          <Typography variant="h3" color="primary" style={{ marginBottom: 12 }}>
            Reset Password
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <form>
            <FormGroup>
              <Grid container justify="center">
                <Grid item xs={12}>
                  <div className={classes.inputContainer}>
                    <CustomInput
                      label="New Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      minLength={6}
                      required
                    />
                  </div>
                </Grid>
                <Grid item xs={12}>
                  <div className={classes.inputContainer}>
                    <CustomInput
                      label="Confirm Password"
                      value={cPassword}
                      onChange={(e) => setCPassword(e.target.value)}
                      minLength={6}
                      required
                    />
                  </div>
                </Grid>
                <Grid item xs={12} className={classes.btn}>
                  <CustomButton
                    style={{ marginLeft: 0 }}
                    disabled={
                      !password || password.length < 6 || password != cPassword
                    }
                    text="Update Password"
                    onClick={updatePassword}
                  />
                  {success && (
                    <Typography variant="body1">Password Updated!</Typography>
                  )}
                  {error && <Typography variant="body1">{error}</Typography>}
                </Grid>
              </Grid>
            </FormGroup>
          </form>
        </Grid>
      </Grid>
    );
  }

  const [username, setUsername] = useState("");

  const sendEmail = () => {
    setError(false);
    setLoading(true);
    axios
      .post("/auth/forgot-password", { username })
      .then((res) => {
        if (res.data) {
          setSuccess(true);
          setLoading(false);
        } else {
          setError(true);
          setLoading(false);
        }
      })
      .catch((err) => {
        setError(true);
        setLoading(false);
      });
  };

  return (
    <Grid className={classes.container} container justify="center">
      <Grid item xs={12}>
        <Typography variant="h3" color="primary" style={{ marginBottom: 12 }}>
          Reset Password
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <form>
          <FormGroup>
            <Grid container justify="center">
              <Grid item xs={12}>
                <div className={classes.inputContainer}>
                  <CustomInput
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </Grid>
              <Grid item xs={12} className={classes.btn}>
                <CustomButton
                  style={{ marginLeft: 0 }}
                  disabled={!username}
                  text="Send Reset Email"
                  onClick={sendEmail}
                />
                {success && (
                  <Typography variant="body1">Email sent!</Typography>
                )}
                {error && (
                  <Typography variant="body1">
                    There was an error. Try again please
                  </Typography>
                )}
              </Grid>
            </Grid>
          </FormGroup>
        </form>
      </Grid>
    </Grid>
  );
};

export default PasswordReset;
