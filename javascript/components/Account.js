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
import { withStyles } from "@material-ui/core/styles";

import CustomInput from "./CustomInput";
import CustomButton from "./CustomButton";

import ReactCrop from "react-image-crop";
import "react-image-crop/lib/ReactCrop.scss";

class Account extends Component {
  constructor(props) {
    super(props);

    this.state = {
      croppedImage: null,
      imageSrc: null,
      crop: {
        width: 300,
        height: 300,
        aspect: 1 / 1,
      },
      editInfo: false,
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

    const data = new FormData();
    data.append("image", this.state.croppedImage);

    axios.post("/images/profile/upload", data).then((res) => {
      this.setState({
        imageSrc: null,
        croppedImage: null,
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

    this.props.updateAccountInfo({ ...this.state, profilePic: undefined });
    this.setState({ editInfo: false });
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
    } = this.props;

    const { imageSrc, crop, editInfo } = this.state;

    return (
      <div className={classes.container}>
        <Typography variant="h3" color="primary">
          Your Account
        </Typography>
        <br />
        <div>
          <form
            onSubmit={this.uploadProfilePic}
            style={{
              marginBottom: 32,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <FormGroup>
              {!imageSrc && (
                <Fragment>
                  <Avatar src={profilePic} className={classes.large} />
                  <input
                    hidden
                    ref={this.imageInput}
                    type="file"
                    name="image"
                    onChange={this.imageHandler}
                    accept="image/*"
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
        {loading && (
          <CircularProgress style={{ marginBottom: 28 }} disableShrink />
        )}
        <Grid className={classes.sectionsContainer} container>
          <Grid className={classes.section} item xs={12} md={6}>
            {!editInfo && (
              <Fragment>
                <a onClick={this.editInfo}>edit</a>
                <Typography variant="body1">
                  <b>Display name</b>
                  <br /> {displayName}
                </Typography>
                <Typography variant="body1">
                  <b>Email</b>
                  <br /> {email}
                </Typography>
                <Typography variant="body1">
                  <b>Phone Number</b>
                  <br /> {phoneNumber}
                </Typography>
                <Typography variant="body1">
                  <b>Bio</b>
                  <br /> {bio}
                </Typography>
              </Fragment>
            )}
            {editInfo && (
              <form onSubmit={this.onSubmitHandler}>
                <div className={classes.inputContainer}>
                  <CustomInput
                    label="Display Name"
                    name="displayName"
                    placeholder={displayName || ""}
                    value={this.state.displayName}
                    onChange={this.onTextChange}
                  />
                </div>
                <div className={classes.inputContainer}>
                  <CustomInput
                    label="Email"
                    name="email"
                    placeholder={email || ""}
                    value={this.state.email}
                    onChange={this.onTextChange}
                  />
                </div>
                <div className={classes.inputContainer}>
                  <CustomInput
                    label="Phone Number"
                    name="phoneNumber"
                    placeholder={phoneNumber || ""}
                    value={this.state.phoneNumber}
                    onChange={this.onTextChange}
                  />
                </div>
                <div className={classes.inputContainer}>
                  <CustomInput
                    label="Bio"
                    value={this.state.bio}
                    name="bio"
                    placeholder={bio || ""}
                    multiline={true}
                    onChange={this.onTextChange}
                    inputProps={{ maxLength: 420 }}
                  />
                </div>
                <div className={classes.inputContainer}>
                  <CustomButton
                    style={{ marginTop: 32, marginLeft: 0 }}
                    type="submit"
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
              <Link to={"/payment"}>Payment Info</Link>
            </Grid>
          )}
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  loading: state.user.loading,
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
});

const styles = (theme) => ({
  container: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  sectionsContainer: {
    maxWidth: 800,
  },
  section: {
    padding: "0 24px",
    marginBottom: 54,
    maxWidth: 400,
  },
  large: {
    width: 200,
    height: 200,
    border: `4px solid ${theme.palette.secondary.main}`,
    marginBottom: 12,
  },
  ...theme.globalClasses,
});

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(Account)
);
