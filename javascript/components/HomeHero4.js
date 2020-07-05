import React, { useState } from "react";

import axios from "axios";

import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import TwitterIcon from "@material-ui/icons/Twitter";
import InstagramIcon from "@material-ui/icons/Instagram";
import FacebookIcon from "@material-ui/icons/Facebook";
import YouTubeIcon from "@material-ui/icons/YouTube";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import Box from "@material-ui/core/Box";
import Snackbar from "@material-ui/core/Snackbar";
import { makeStyles } from "@material-ui/core/styles";

import CustomButton from "./CustomButton";
import CustomInput from "./CustomInput";
import heroImg from "../images/hero2.jpg";

import { validateEmail } from "../utils/helpers";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: "150px 0px 200px 50px",
  },
  caption: {
    color: theme.palette.primary.main,
    marginBottom: 18,
  },
  error: {
    color: theme.palette.alert.main,
    display: "block",
    margin: "10px 0",
  },
  input: {
    margin: "24px 24px 24px 0",
  },
  icon: {
    color: theme.palette.dark.main,
    marginRight: 12,
    fontSize: 44,
    marginTop: 20,
    cursor: "pointer",
  },
  heroImg: {
    width: "100%",
    borderRadius: 10,
  },
  snack: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.light.main,
    borderRadius: 5,
    fontSize: 18,
  },
  black: {
    color: theme.palette.dark.main,
  },
}));

const HomeHero4 = ({ subscribe }) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [snack, setSnack] = useState(false);
  const [error, setError] = useState(false);

  const _validateEmail = (e) => {
    setValidEmail(validateEmail(e));
  };

  const sendEmail = () => {
    setLoading(true);
    if (validateEmail(email)) {
      axios
        .post("/newsletter", { email })
        .then((res) => {
          if (res.data) {
            setLoading(false);
            setEmail("");
            setSnack(true);
          } else {
            setLoading(false);
            setEmail("");
            setError("Error! Email not received, please try again.");
            setTimeout(() => setError(false), 5000);
          }
        })
        .catch((err) => {});
    } else {
      setError("Invalid email addresss");
      setTimeout(() => setError(false), 5000);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnack(false);
  };

  return (
    <Grid container className={`${classes.container} home-hero-container`}>
      <Grid item xs={12} md={6}>
        <Grid container>
          <Grid item xs={12}>
            <Typography className={classes.caption} variant="caption">
              Stay Tuned!
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h3">Want To Join?</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" style={{ maxWidth: 600 }}>
              We are taking reservations and will open the site after we receive
              1,000 emails from people who want to join.
            </Typography>
          </Grid>
          <Grid className={classes.input} item xs={12}>
            <CustomInput
              onChange={(e) => {
                _validateEmail(e.target.value);
                setEmail(e.target.value);
              }}
              value={email}
              size="medium"
              placeholder="Enter Your Email"
            />
            <CustomButton
              onClick={sendEmail}
              size="large"
              text="SEND"
              disabled={loading || !validEmail}
              style={{ display: "block", marginLeft: 0 }}
            />
            {error && (
              <Typography className={classes.error} variant="caption">
                {error}
              </Typography>
            )}
          </Grid>
          <Grid item xs={12}>
            <Typography className={classes.caption} variant="caption">
              <span className={classes.black}>Contact us:</span>{" "}
              <b>openaccess@usa.com</b>
            </Typography>
            <Grid container>
              <IconButton className={classes.icon}>
                <TwitterIcon fontSize="large" />
              </IconButton>
              <IconButton className={classes.icon}>
                <FacebookIcon fontSize="large" />
              </IconButton>
              <IconButton className={classes.icon}>
                <InstagramIcon fontSize="large" />
              </IconButton>
              <IconButton className={classes.icon}>
                <YouTubeIcon fontSize="large" />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={6}>
        <Box display={{ xs: "none", md: "inline" }}>
          <img src={heroImg} className={classes.heroImg} />
        </Box>
      </Grid>
      <Snackbar
        ContentProps={{
          classes: {
            root: classes.snack,
          },
        }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={snack}
        autoHideDuration={6000}
        onClose={handleClose}
        action={
          <React.Fragment>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
        message="Email Received!"
      />
    </Grid>
  );
};

export default HomeHero4;
