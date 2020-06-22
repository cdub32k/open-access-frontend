import React, { Component, createRef } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import axios from "axios";

import ReactCrop from "react-image-crop";
import "react-image-crop/lib/ReactCrop.scss";

import Typography from "@material-ui/core/Typography";
import FormGroup from "@material-ui/core/FormGroup";
import Grid from "@material-ui/core/Grid";
import ProgressPercentage from "./ProgressPercentage";
import { withStyles } from "@material-ui/core/styles";

import CustomInput from "./CustomInput";
import CustomButton from "./CustomButton";

class VideoUploader extends Component {
  state = {
    uploading: false,
    uploadPercentage: 0,
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
      uploading: true,
    });

    const { videoFile, croppedThumb, title, caption } = this.state;

    var tmpName = videoFile.name;
    var fileExtension = tmpName.split(".")[tmpName.split(".").length - 1];
    let fileName = Date.now() + "." + fileExtension;

    let fileType = videoFile.type;

    axios
      .post("/auth/sign-s3", {
        fileName: `vid/${this.props.username}/${fileName}`,
        fileType,
      })
      .then((res) => {
        if (res.data.signedRequest) {
          const { signedRequest, videoUrl } = res.data;

          //s3 requires to delete Authorization header
          let token = axios.defaults.headers.common["Authorization"];
          delete axios.defaults.headers.common["Authorization"];
          axios
            .put(signedRequest, videoFile, {
              headers: {
                "Content-Type": videoFile.type,
              },
              onUploadProgress: (e) => {
                this.setState({
                  uploadPercentage: parseInt(
                    Math.round((e.loaded / e.total) * 100)
                  ),
                });
              },
            })
            .then((res) => {
              axios.defaults.headers.common["Authorization"] = token;

              const data = new FormData();
              data.append("thumb", this.state.croppedThumb);
              data.append("title", this.state.title);
              data.append("caption", this.state.caption);
              data.append("videoUrl", videoUrl);
              axios
                .post("/videos/upload", data)
                .then((res) => {
                  if (res.data)
                    this.setState({
                      goToProfile: true,
                      _id: res.data.video._id,
                    });
                })
                .catch((err) => {
                  alert("There was an error! Please try again");
                  //window.location.reload();
                });
            })
            .catch((err) => {
              axios.defaults.headers.common["Authorization"] = token;

              alert("There was an error! Please try again");
              //window.location.reload();
            });
        }
      })
      .catch((err) => {
        alert("There was an error! Please try again");
        //window.location.reload();
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
    const {
      uploading,
      uploadPercentage,
      _id,
      crop,
      thumbSrc,
      videoSrc,
      videoFile,
      croppedThumb,
      title,
      caption,
    } = this.state;
    return (
      <div style={{ width: "100%", padding: 12 }}>
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
                  accept="video/mp4,video/ogg,video/,video/webm"
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
                    ruleOfThirds
                    keepSelection
                    onImageLoaded={this.onImageLoaded}
                    onComplete={this.onCropComplete}
                    onChange={this.onCropChange}
                  />
                </div>
              )}
            </Grid>
            <Grid item xs={12} style={{ marginTop: 48 }}>
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
                />
              </div>
              {uploading && (
                <ProgressPercentage
                  progress={uploadPercentage}
                  completeMessage="We received your upload. Publishing to newsfeed..."
                  style={{ marginTop: 28 }}
                />
              )}

              <CustomButton
                disabled={!thumbSrc || !videoSrc || !title || !caption}
                style={{ marginTop: 28, marginLeft: 0 }}
                disabled={
                  uploading || !videoFile || !croppedThumb || !title || !caption
                }
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
    maxWidth: 820,
    display: "flex",
    justifyContent: "space-between",
    margin: "auto",
  },
  counter: {
    marginBottom: 5,
    display: "block",
  },
  ...theme.globalClasses,
});

const mapStateToProps = (state) => ({
  username: state.user.username,
});

export default withStyles(styles)(connect(mapStateToProps)(VideoUploader));
