import React, { Component } from "react";

import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";

import ContentPreview from "./ContentPreview";
import PreviewPlaceholder from "./PreviewPlaceholder";
import CustomButton from "./CustomButton";

const styles = (theme) => ({
  container: {
    textAlign: "center",
    margin: "32px 0",
  },
  contentList: {
    display: "flex",
    justifyContent: "flex-start",
    flexWrap: "wrap",
    width: 1248,
    padding: 0,
  },
});

class VideoList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videoPage: 0,
    };

    this.loadMore = this.loadMore.bind(this);
  }

  componentDidMount() {
    this.props.doneLoading();
  }

  loadMore = () => {
    this.props.loadMore(this.state.videoPage + 1);
    this.setState({
      videoPage: this.state.videoPage + 1,
    });
  };

  render() {
    const { classes, loading, videos, hasMore } = this.props;
    let videoListHTML = loading
      ? videos
          .map((video) => {
            return (
              <ContentPreview
                contentType="video"
                user={video.user}
                id={video._id}
                thumbUrl={video.thumbUrl}
                title={video.title}
                viewCount={video.viewCount}
                uploadedAt={video.uploadedAt}
                key={video._id}
              />
            );
          })
          .concat(
            Array.from({ length: 4 }).map((preview, i) => {
              return <PreviewPlaceholder key={i} />;
            })
          )
      : videos.map((video, i) => {
          return (
            <ContentPreview
              contentType="video"
              user={video.user}
              id={video._id}
              thumbUrl={video.thumbUrl}
              title={video.title}
              viewCount={video.viewCount}
              uploadedAt={video.uploadedAt}
              key={i}
            />
          );
        });

    if (!loading && (!videos || videos.length == 0))
      videoListHTML = (
        <Typography variant="body1">Nothing to show here (yet)</Typography>
      );

    return (
      <div className={`${classes.container} content-container`}>
        <div className={`${classes.contentList} content-list`}>
          {videoListHTML}
          <br />
        </div>
        {!loading && hasMore && (
          <div>
            <CustomButton text="Load more" onClick={this.loadMore} />
          </div>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(VideoList);
