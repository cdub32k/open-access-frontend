import React, { Component, createRef } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import axios from "axios";

import ReactCrop from "react-image-crop";
import "react-image-crop/lib/ReactCrop.scss";

import Typography from "@material-ui/core/Typography";
import FormGroup from "@material-ui/core/FormGroup";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import { withStyles } from "@material-ui/core/styles";

import CustomInput from "./CustomInput";
import CustomButton from "./CustomButton";

class VideoUploader extends Component {
  state = {
    loading: false,
    videoFile: null,
    videoSrc: null,

    thumbSrc: null,
    crop: {
      width: 300,
      height: 169,
      aspect: 16 / 9,
    },
    croppedThumb: null,

    title: "",
    caption: "",

    goToProfile: false,
  };

  constructor(props) {
    super(props);

    this.thumbInput = createRef();
    this.videoInput = createRef();
  }

  videoHandler = (e) => {
    let file = e.target.files[0];
    let blobUrl = URL.createObjectURL(file);

    this.setState({ videoFile: file, videoSrc: blobUrl });
  };

  thumbHandler = (e) => {
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      this.setState({ thumbSrc: fileReader.result });
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
      const croppedThumbUrl = this.getCroppedImg(this.imageRef, crop);
      this.setState({ croppedThumbUrl });
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
    let croppedThumb = new File([u8arr], filename, { type: mime });
    this.setState({ croppedThumb });
  }

  onTextChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  onSubmitHandler = (e) => {
    e.preventDefault();

    this.setState({
      loading: true,
    });

    const data = new FormData();
    data.append("video", this.state.videoFile);
    data.append("thumb", this.state.croppedThumb);
    data.append("title", this.state.title);
    data.append("caption", this.state.caption);

    axios.post("/videos/upload", data).then((res) => {
      if (res.data)
        this.setState({
          goToProfile: true,
          _id: res.data.video._id,
        });
    });
  };

  uploadThumb = (e) => {
    this.thumbInput.current.click();
  };

  uploadVideo = (e) => {
    this.videoInput.current.click();
  };

  render() {
    if (this.state.goToProfile)
      return <Redirect to={`/video-player/${this.state._id}`} />;

    const { classes } = this.props;
    const { _id, crop, thumbSrc, videoSrc, title, caption } = this.state;

    return (
      <div style={{ width: "100%" }}>
        <form className={classes.form} onSubmit={this.onSubmitHandler}>
          <Grid container>
            <Grid item xs={12}>
              <Typography color="primary" variant="h3">
                Upload Video
              </Typography>
              <FormGroup style={{ marginTop: 32 }}>
                <input
                  hidden
                  ref={this.videoInput}
                  type="file"
                  name="video"
                  onChange={this.videoHandler}
                  accept="video/mp4,video/x-m4v,video/*"
                />
                <CustomButton
                  style={{ margin: "12px 0" }}
                  text="Upload video"
                  onClick={this.uploadVideo}
                  size="small"
                />
              </FormGroup>
              {videoSrc && (
                <video src={videoSrc} width="320" height="180" controls />
              )}
              <FormGroup style={{ marginTop: 32 }}>
                <input
                  hidden
                  ref={this.thumbInput}
                  type="file"
                  name="thumb"
                  onChange={this.thumbHandler}
                  accept="image/*"
                />
                <CustomButton
                  style={{ margin: "12px 0" }}
                  text="Upload thumbnail"
                  onClick={this.uploadThumb}
                  size="small"
                />
              </FormGroup>
              {thumbSrc && (
                <div className={classes.thumbPreview}>
                  <ReactCrop
                    src={thumbSrc}
                    crop={crop}
                    minHeight={169}
                    minWidth={300}
                    onImageLoaded={this.onImageLoaded}
                    onComplete={this.onCropComplete}
                    onChange={this.onCropChange}
                  />
                </div>
              )}
            </Grid>
            <Grid item xs={12} sm={8} lg={6} style={{ marginTop: 48 }}>
              <div className={classes.inputContainer}>
                <CustomInput
                  name="title"
                  label="Title"
                  value={title}
                  onChange={this.onTextChange}
                />
              </div>
              <div className={classes.inputContainer}>
                <CustomInput
                  multiline={true}
                  rows={3}
                  name="caption"
                  label="Caption"
                  value={caption}
                  onChange={this.onTextChange}
                />
              </div>
              {this.state.loading && (
                <CircularProgress
                  style={{ margin: "28px 0", display: "block" }}
                  disableShrink
                />
              )}

              <CustomButton
                disabled={!thumbSrc || !videoSrc || !title || !caption}
                style={{ marginTop: 24, marginLeft: 0 }}
                text="Upload"
                type="submit"
              />
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
    maxWidth: 1450,
    justifyContent: "space-between",
    margin: "auto",
  },
  ...theme.globalClasses,
});

const mapStateToProps = (state) => ({
  username: state.user.username,
});

export default withStyles(styles)(connect(mapStateToProps)(VideoUploader));
