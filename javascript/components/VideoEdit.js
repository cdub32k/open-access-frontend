import React, { Component, createRef } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import axios from "axios";

import ReactCrop from "react-image-crop";
import "react-image-crop/lib/ReactCrop.scss";

import Typography from "@material-ui/core/Typography";
import FormGroup from "@material-ui/core/FormGroup";
import Grid from "@material-ui/core/Grid";
import { withStyles, withTheme } from "@material-ui/core/styles";

import CustomInput from "./CustomInput";
import CustomButton from "./CustomButton";

class VideoEdit extends Component {
  state = {
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
  }

  componentDidMount() {
    const GET_VIDEO_EDIT_INFO_QUERY = `
      query VideoInfo($videoId: String!) {
        video(id: $videoId) {
          _id
          title
          caption
        }
      }
    `;

    axios
      .post("/api", {
        query: GET_VIDEO_EDIT_INFO_QUERY,
        variables: { videoId: this.props.match.params.videoId },
      })
      .then((res) => {
        let videoData = res.data.data.video;
        this.setState({
          _id: videoData._id,
          title: videoData.title,
          caption: videoData.caption,
        });
      })
      .catch((e) => console.error(e));
  }

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
    const data = new FormData();
    if (this.state.croppedThumb) data.append("thumb", this.state.croppedThumb);
    data.append("title", this.state.title);
    data.append("caption", this.state.caption);

    axios.put(`/videos/${this.state._id}`, data).then((res) => {
      if (res.data)
        this.setState({
          goToProfile: true,
        });
    });
  };

  uploadThumb = (e) => {
    this.thumbInput.current.click();
  };

  render() {
    const { classes, theme } = this.props;
    const { _id, crop, thumbSrc, title, caption } = this.state;

    if (this.state.goToProfile) return <Redirect to={`/video-player/${_id}`} />;

    return (
      <div style={{ width: "100%" }}>
        <form className={classes.form} onSubmit={this.onSubmitHandler}>
          <Grid container>
            <Grid item xs={12}>
              <Typography color="primary" variant="h3">
                Edit Video
              </Typography>
              <FormGroup style={{ marginTop: 48 }}>
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
                  text="Change Thumbnail"
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
              <CustomInput
                name="title"
                label="Title"
                value={title}
                onChange={this.onTextChange}
              />
              <CustomInput
                multiline={true}
                rows={3}
                name="caption"
                label="Caption"
                value={caption}
                onChange={this.onTextChange}
              />
              <br />
              <CustomButton
                style={{
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.light.main,
                  marginTop: 24,
                  width: 100,
                }}
                text="Save"
                type="submit"
              />
              <CustomButton
                className={classes.cancelBtn}
                style={{
                  backgroundColor: theme.palette.secondary.main,
                  color: theme.palette.light.main,
                  marginTop: 24,
                  width: 100,
                }}
                text="Cancel"
                onClick={() => this.setState({ goToProfile: true })}
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
  cancelBtn: {
    marginLeft: 12,
    backgroundColor: theme.palette.secondary.main,
  },
});

const mapStateToProps = (state) => ({
  title: state.video.title,
  caption: state.video.caption,
});

export default withStyles(styles)(
  withTheme(connect(mapStateToProps)(VideoEdit))
);
