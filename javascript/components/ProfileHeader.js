import React, { useState, memo } from "react";
import { connect } from "react-redux";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";

import dayjs from "dayjs";

import PreviewProfileHeader from "./PreviewProfileHeader";

const useStyles = makeStyles((theme) => ({
  container: {
    marginBottom: 32,
    width: "100%",
    maxWidth: 600,
    alignSelf: "flex-start",
  },
  avatarContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: 18,
  },
  avatar: {
    width: 300,
    height: 300,
    border: `4px solid ${theme.palette.secondary.main}`,
    borderRadius: 0,
    cursor: "pointer",
  },
  bio: {
    margin: "12px 0",
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    border: `4px solid ${theme.palette.secondary.main}`,
    boxShadow: theme.shadows[5],
    padding: 0,
    maxWidth: "95%",
    maxHeight: "95%",
    "& img": {
      width: "100%",
    },
  },
  textContainer: {
    height: "100%",
    maxHeight: 300,
    textAlign: "center",
    overflowY: "auto",
    padding: "0 12px",
  },
}));

const ProfileHeader = ({
  profilePic,
  username,
  displayName,
  bio,
  createdAt,
  loading,
}) => {
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return loading ? (
    <PreviewProfileHeader />
  ) : (
    <Grid container className={classes.container}>
      <Grid className={classes.avatarContainer} item xs={12} md={6}>
        {profilePic && (
          <img
            src={profilePic}
            onClick={handleOpen}
            className={classes.avatar}
          />
        )}
        {!profilePic && <Avatar src={null} className={classes.avatar} />}
      </Grid>
      <Grid item xs={12} md={6}>
        <div className={`${classes.textContainer} profile-header-text`}>
          <Typography variant="h4">{displayName}</Typography>
          <Typography variant="body1">@{username}</Typography>
          <Typography variant="body2">
            Member since {dayjs(createdAt).format("MMM YYYY")}
          </Typography>
          <Typography
            variant="body1"
            className={classes.bio}
            dangerouslySetInnerHTML={{
              __html: bio,
            }}
          ></Typography>
        </div>
      </Grid>
      <Modal
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <img src={profilePic} />
          </div>
        </Fade>
      </Modal>
    </Grid>
  );
};

const mapStateToProps = (state) => ({
  profilePic: state.user.viewed.profilePic,
  username: state.user.viewed.username,
  displayName: state.user.viewed.displayName,
  bio: state.user.viewed.bio,
  createdAt: state.user.viewed.createdAt,
});

export default connect(mapStateToProps)(memo(ProfileHeader));
