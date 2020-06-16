import React, { Component } from "react";
import { connect } from "react-redux";

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

class ImageList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imagePage: 0,
    };
    this.loadMore = this.loadMore.bind(this);
  }

  componentDidMount() {
    let { hasMore, images } = this.props;
    if (hasMore && images.length == 0) this.props.loadMore(0);
  }

  loadMore = () => {
    this.props.loadMore(this.state.imagePage + 1);
    this.setState({
      imagePage: this.state.imagePage + 1,
    });
  };

  render() {
    const { classes, loading, images, hasMore } = this.props;

    let imageListHTML = loading
      ? images
          .map((image) => {
            return (
              <ContentPreview
                contentType="image"
                user={image.user}
                id={image._id}
                title={image.title}
                thumbUrl={image.url}
                likeCount={image.likeCount}
                uploadedAt={image.uploadedAt}
                key={image._id}
              />
            );
          })
          .concat(
            Array.from({ length: 4 }).map((preview, i) => {
              return <PreviewPlaceholder key={i} />;
            })
          )
      : images.map((image, i) => {
          return (
            <ContentPreview
              contentType="image"
              user={image.user}
              id={image._id}
              title={image.title}
              thumbUrl={image.url}
              likeCount={image.likeCount}
              uploadedAt={image.uploadedAt}
              key={i}
            />
          );
        });

    if (!loading && (!images || images.length == 0))
      imageListHTML = (
        <Typography variant="body1">Nothing to show here (yet)</Typography>
      );

    return (
      <div className={`${classes.container} content-container`}>
        <div className={`${classes.contentList} content-list`}>
          {imageListHTML}
        </div>
        {hasMore && (
          <div>
            <CustomButton text="Load more" onClick={this.loadMore} />
          </div>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(ImageList);
