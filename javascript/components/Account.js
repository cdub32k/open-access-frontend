import React, { Component, Fragment, createRef } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { ActionCreators } from "../actions";

import axios from "axios";

import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import FormGroup from "@material-ui/core/FormGroup";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import { withStyles, withTheme } from "@material-ui/core/styles";

import CustomInput from "./CustomInput";
import CustomButton from "./CustomButton";

import ReactCrop from "react-image-crop";
import "react-image-crop/lib/ReactCrop.scss";

class Account extends Component {
  constructor(props) {
    super(props);

    this.state = {
      uploading: false,
      croppedImage: null,
      imageSrc: null,
      crop: {
        width: 300,
        height: 300,
        aspect: 1 / 1,
      },
      editInfo: false,
      confirmOpen: false,
      confirmDeleteText: "",
      deleting: false,
    };

    this.imageInput = createRef();
  }

  componentDidMount() {
    this.props.getUserAccountInfo(this.props.username);
  }

  uploadImage = (e) => {
    this.imageInput.current.click();
  };

  imageHandler = (e) => {
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      this.setState({ imageSrc: fileReader.result });
    };

    fileReader.readAsDataURL(e.target.files[0]);
  };

  onImageLoaded = (image) => {
    this.imageRef = image;
  };

  onCropChange = (crop) => {
    this.setState({ crop });
  };

  onCropComplete = (crop) => {
    if (this.imageRef && crop.width && crop.height) {
      const croppedImageUrl = this.getCroppedImg(this.imageRef, crop);
      this.setState({ croppedImageUrl });
    }
  };

  getCroppedImg(image, crop) {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    const reader = new FileReader();
    canvas.toBlob((blob) => {
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        this.dataURLtoFile(reader.result, "cropped.jpg");
      };
    });
  }

  dataURLtoFile(dataUrl, filename) {
    let arr = dataUrl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    let croppedImage = new File([u8arr], filename, { type: mime });
    this.setState({ croppedImage });
  }

  uploadProfilePic = (e) => {
    e.preventDefault();
    this.setState({
      uploading: true,
    });
    const data = new FormData();
    data.append("image", this.state.croppedImage);

    axios
      .post("/images/profile/upload", data)
      .then((res) => {
        this.setState({
          imageSrc: null,
          croppedImage: null,
          uploading: false,
          profilePic: res.data.user.profilePic,
        });
      })
      .catch((e) => {
        this.setState({
          uploading: false,
        });
      });
  };

  onTextChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  onSubmitHandler = (e) => {
    e.preventDefault();
    this.setState({ editInfo: false });
    this.props.updateAccountInfo({ ...this.state, profilePic: undefined });
  };

  editInfo = () => {
    this.setState({
      displayName: this.props.displayName,
      email: this.props.email,
      phoneNumber: this.props.phoneNumber,
      bio: this.props.bio,
      editInfo: true,
    });
  };

  confirmClose = () => {
    this.setState({
      confirmOpen: false,
    });
  };

  deleteAccount = () => {
    this.setState({ deleting: true });
    axios
      .delete("/users")
      .then(() => {
        this.props.logoutAfterDelete();
      })
      .catch((err) => {
        alert("Error! Account could not be deleted");
      });
  };

  render() {
    const {
      loading,
      profilePic,
      username,
      email,
      phoneNumber,
      displayName,
      bio,
      classes,
      theme,
    } = this.props;

    const {
      imageSrc,
      crop,
      editInfo,
      uploading,
      confirmOpen,
      confirmDeleteText,
      deleting,
    } = this.state;

    return (
      <div className={classes.container}>
        <Typography
          variant="h4"
          color="primary"
          style={{ width: "100%", maxWidth: 820, padding: "0 12px" }}
        >
          <Link to={`/profile/${username}`}>@{username}</Link>
          <span style={{ color: theme.palette.dark.main }}>'s Account</span>
        </Typography>
        <br />
        <div style={{ width: "100%", maxWidth: 820, padding: "0 12px" }}>
          <form
            onSubmit={this.uploadProfilePic}
            style={{
              marginBottom: 60,
            }}
          >
            <FormGroup>
              {!imageSrc && (
                <Fragment>
                  <Avatar
                    src={this.state.profilePic || profilePic}
                    className={classes.large}
                  />
                  <input
                    hidden
                    ref={this.imageInput}
                    type="file"
                    name="image"
                    onChange={this.imageHandler}
                    accept="image/gif,image/x-icon,image/jpeg,image/png"
                  />
                  <CustomButton
                    style={{ margin: "12px 0" }}
                    text="Change profile picture"
                    onClick={this.uploadImage}
                    size="small"
                  />
                </Fragment>
              )}
              {imageSrc && (
                <Fragment>
                  <ReactCrop
                    src={imageSrc}
                    crop={crop}
                    minHeight={300}
                    minWidth={300}
                    ruleOfThirds
                    keepSelection
                    onImageLoaded={this.onImageLoaded}
                    onComplete={this.onCropComplete}
                    onChange={this.onCropChange}
                  />
                  <div style={{ display: "flex" }}>
                    <CustomButton
                      style={{ margin: "12px" }}
                      text="Save"
                      onClick={this.uploadProfilePic}
                      size="small"
                    />
                    <CustomButton
                      style={{ margin: "12px 0" }}
                      text="Cancel"
                      onClick={() =>
                        this.setState({ imageSrc: null, croppedImage: null })
                      }
                      size="small"
                    />
                  </div>
                </Fragment>
              )}
            </FormGroup>
          </form>
        </div>
        {loading ||
          (uploading && <CircularProgress style={{ marginBottom: 28 }} />)}
        <Grid className={classes.sectionsContainer} container>
          <Grid className={classes.section} item xs={12} md={6}>
            {!editInfo && (
              <Fragment>
                <a onClick={this.editInfo}>edit</a>
                <Typography className={classes.userField} variant="body1">
                  <b>Display name:</b>
                  <br /> {displayName || "N/A"}
                </Typography>
                <Typography className={classes.userField} variant="body1">
                  <b>Email:</b>
                  <br /> {email || "N/A"}
                </Typography>
                <Typography className={classes.userField} variant="body1">
                  <b>Phone Number:</b>
                  <br /> {phoneNumber || "N/A"}
                </Typography>
                <Typography className={classes.userField} variant="body1">
                  <b>Bio:</b>
                  <br /> {bio || "N/A"}
                </Typography>
              </Fragment>
            )}
            {editInfo && (
              <form onSubmit={this.onSubmitHandler}>
                <div className={classes.inputContainer}>
                  <CustomInput
                    label="Display Name"
                    name="displayName"
                    value={this.state.displayName}
                    onChange={this.onTextChange}
                  />
                </div>
                <div className={classes.inputContainer}>
                  <CustomInput
                    label="Email"
                    name="email"
                    value={this.state.email}
                    onChange={this.onTextChange}
                  />
                </div>
                <div className={classes.inputContainer}>
                  <CustomInput
                    label="Phone Number"
                    name="phoneNumber"
                    value={this.state.phoneNumber}
                    onChange={this.onTextChange}
                  />
                </div>
                <div className={classes.inputContainer}>
                  <CustomInput
                    label="Bio"
                    value={this.state.bio}
                    name="bio"
                    multiline={true}
                    onChange={this.onTextChange}
                    inputProps={{ maxLength: 420 }}
                  />
                </div>
                <div className={classes.inputContainer}>
                  <CustomButton
                    style={{ marginTop: 32, marginLeft: 0 }}
                    type="submit"
                    disabled={!editInfo}
                    text="Update Info"
                  />
                  <CustomButton
                    style={{ marginTop: 32, marginLeft: 0 }}
                    onClick={() => this.setState({ editInfo: false })}
                    text="Cancel"
                  />
                </div>
              </form>
            )}
          </Grid>
          {!editInfo && (
            <Grid className={classes.section} item xs={12} md={6}>
              <Link to={"/payment"}>
                <b>Payment Info</b>
              </Link>
            </Grid>
          )}
        </Grid>
        <Grid
          className={classes.sectionsContainer}
          style={{ marginTop: 96 }}
          container
        >
          <Grid className={classes.section} item xs={12} md={6}>
            <CustomButton
              style={{
                backgroundColor: theme.palette.alert.main,
                marginLeft: 0,
              }}
              onClick={() => this.setState({ confirmOpen: true })}
              text="DELETE ACCOUNT"
            />
          </Grid>
          <Dialog
            className={classes.dialog}
            onClose={this.confirmClose}
            open={confirmOpen}
          >
            <DialogTitle>Delete your account??</DialogTitle>
            {deleting && (
              <CircularProgress style={{ margin: "auto", display: "block" }} />
            )}
            <DialogContent>
              <DialogContentText>
                This will permamently delete all your associated data from this
                network. Videos, images, notes, and comments will be removed.
                Your likes and dislikes will still contribute to the total
                counts, but nobody will be able to see the +1 was from you.
              </DialogContentText>
              <DialogContentText>
                Type your full username into the field below, and confirm the
                deletion of your account:
              </DialogContentText>
              <CustomInput
                name="confirmDeleteText"
                value={confirmDeleteText}
                onChange={this.onTextChange}
              />
            </DialogContent>
            <div className={classes.dialogActions}>
              <CustomButton
                className={classes.deleteBtn}
                text="DELETE"
                onClick={this.deleteAccount}
                disabled={deleting || confirmDeleteText != username}
              />
              <CustomButton
                style={{
                  backgroundColor: theme.palette.secondary.main,
                  color: theme.palette.light.main,
                }}
                text="cancel"
                onClick={this.confirmClose}
              />
            </div>
          </Dialog>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  loading: state.user.ai_loading,
  profilePic: state.user.profilePic,
  username: state.user.username,
  email: state.user.email,
  displayName: state.user.displayName,
  phoneNumber: state.user.phoneNumber,
  bio: state.user.bio,
});

const mapDispatchToProps = (dispatch) => ({
  getUserAccountInfo: (username) =>
    dispatch(ActionCreators.getUserAccountInfoStart(username)),
  updateAccountInfo: (userInfo) =>
    dispatch(ActionCreators.updateAccountInfoStart(userInfo)),
  logoutAfterDelete: () => dispatch(ActionCreators.logout()),
});

const styles = (theme) => ({
  container: {
    width: "100%",
    maxWidth: 820,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  sectionsContainer: {
    maxWidth: 820,
  },
  section: {
    padding: "0 12px",
    marginBottom: 54,
    maxWidth: 400,
  },
  large: {
    width: 300,
    height: 300,
    border: `4px solid ${theme.palette.secondary.main}`,
    borderRadius: 0,
    marginBottom: 12,
  },
  userField: {
    marginBottom: 18,
  },
  dialog: {
    padding: 14,
    display: "flex",
    flexDirection: "column",
    width: "100%",
    maxWidth: 650,
    margin: "auto",
  },
  dialogActions: {
    display: "flex",
    justifyContent: "flex-start",
    padding: 10,
    marginTop: 18,
    marginBottom: 12,
  },
  deleteBtn: {
    backgroundColor: theme.palette.alert.main,
    color: theme.palette.light.main,
  },
  ...theme.globalClasses,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTheme(withStyles(styles)(Account)));
