import React, { useEffect, useState } from "react";
import axios from "axios";

import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";

import CustomInput from "./CustomInput";
import CustomButton from "./CustomButton";

const useStyles = makeStyles((theme) => ({
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
      <div>
        <Typography variant="h3" color="primary">
          Reset Password
        </Typography>
        <div className={classes.inputContainer}>
          <CustomInput
            label="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />
        </div>
        <div className={classes.inputContainer}>
          <CustomInput
            label="Confirm Password"
            value={cPassword}
            onChange={(e) => setCPassword(e.target.value)}
            minLength={6}
            required
          />
        </div>
        <CustomButton
          className={classes.btn}
          disabled={!password || password.length < 6 || password != cPassword}
          text="Update Password"
          onClick={updatePassword}
        />
        {success && <Typography variant="body1">Password Updated!</Typography>}
        {error && <Typography variant="body1">{error}</Typography>}
      </div>
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
    <div>
      <Typography variant="h3" color="primary">
        Reset Password
      </Typography>
      <div className={classes.inputContainer}>
        <CustomInput
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <CustomButton
        className={classes.btn}
        disabled={!username}
        text="Send Reset Email"
        onClick={sendEmail}
      />
      {success && <Typography variant="body1">Email sent!</Typography>}
      {error && (
        <Typography variant="body1">
          There was an error. Try again please
        </Typography>
      )}
    </div>
  );
};

export default PasswordReset;
