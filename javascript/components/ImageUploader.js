import React, { Component, createRef, useState } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import axios from "axios";

import ReactCrop from "react-image-crop";
import "react-image-crop/lib/ReactCrop.scss";

import Typography from "@material-ui/core/Typography";
import FormGroup from "@material-ui/core/FormGroup";
import Grid from "@material-ui/core/Grid";
import ProgressPercentage from "./ProgressPercentage";
import { withStyles, withTheme } from "@material-ui/core/styles";

import CustomInput from "./CustomInput";
import CustomButton from "./CustomButton";

class ImageUploader extends Component {
  state = {
    uploading: false,
    croppedImage: null,
    imageSrc: null,
    crop: {
      width: 300,
      height: 300,
      aspect: 1 / 1,
    },

    title: "",
    caption: "",

    goToProfile: false,
    uploadPercentage: 0,
  };

  constructor(props) {
    super(props);

    this.imageInput = createRef();
  }

  onTextChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
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

  onSubmitHandler = (e) => {
    e.preventDefault();

    this.setState({
      uploading: true,
    });

    const data = new FormData();
    data.append("image", this.state.croppedImage);
    data.append("title", this.state.title);
    data.append("caption", this.state.caption);

    axios
      .post("/images/upload", data, {
        onUploadProgress: (e) => {
          this.setState({
            uploadPercentage: parseInt(Math.round((e.loaded / e.total) * 100)),
          });
        },
      })
      .then((res) => {
        if (res.data)
          this.setState({
            goToProfile: true,
            _id: res.data.image._id,
          });
      })
      .catch((err) => {
        alert("There was an error! Please try again");
        window.location.reload();
      });
  };

  uploadImage = (e) => {
    this.imageInput.current.click();
  };

  render() {
    if (this.state.goToProfile)
      return <Redirect to={`/image/${this.state._id}`} />;

    const { classes, theme, history, username } = this.props;
    const {
      uploading,
      uploadPercentage,
      crop,
      imageSrc,
      croppedImage,
      title,
      caption,
    } = this.state;
    return (
      <div style={{ width: "100%", padding: 12 }}>
        <form className={classes.form} onSubmit={this.onSubmitHandler}>
          <Grid container>
            <Grid item xs={12}>
              <Typography color="primary" variant="h3">
                New Image
              </Typography>
              <FormGroup style={{ marginTop: 32 }}>
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
                  text="Upload image"
                  onClick={this.uploadImage}
                />
              </FormGroup>
              {imageSrc && (
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
              )}
            </Grid>
            <Grid item xs={12} sm={8} lg={6} style={{ marginTop: 32 }}>
              <div className={classes.inputContainer}>
                <Typography className={classes.counter} variant="caption">
                  {title.length} / 120 chars
                </Typography>
                <CustomInput
                  name="title"
                  label="Title"
                  value={title}
                  maxLength={120}
                  onChange={this.onTextChange}
                />
              </div>
              <div className={classes.inputContainer}>
                <Typography className={classes.counter} variant="caption">
                  {caption.length} / 2000 chars
                </Typography>
                <CustomInput
                  multiline={true}
                  name="caption"
                  label="Caption"
                  value={caption}
                  maxLength={2000}
                  onChange={this.onTextChange}
                  style={{ marginBottom: 32 }}
                />
              </div>
              <CustomButton
                disabled={!imageSrc || !title || !caption}
                style={{ marginLeft: 0 }}
                disabled={uploading || !croppedImage || !title || !caption}
                text={uploading ? "Uploading..." : "Post"}
                type="submit"
              />
              {!uploading && (
                <CustomButton
                  onClick={() => history.push(`/profile/${username}`)}
                  className={classes.returnBtn}
                  text="cancel"
                />
              )}
              {uploading && (
                <ProgressPercentage
                  progress={uploadPercentage}
                  completeMessage="We received your upload. Publishing to newsfeed..."
                />
              )}
            </Grid>
          </Grid>
        </form>
      </div>
    );
  }
}

const styles = (theme) => ({
  form: {
    display: "flex",
    maxWidth: 1200,
    justifyContent: "space-between",
    margin: "auto",
  },
  counter: {
    marginBottom: 0,
    textAlign: "right",
    maxWidth: 600,
    display: "block",
  },
  ...theme.globalClasses,
});

const mapStateToProps = (state) => ({
  username: state.user.username,
});

export default withTheme(
  withStyles(styles)(connect(mapStateToProps)(ImageUploader))
);
