import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { ActionCreators } from "../actions";

import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import IconButton from "@material-ui/core/IconButton";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import AddCommentIcon from "@material-ui/icons/AddComment";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";

import ContentActions from "./ContentActions";

import { num2str, date2rel } from "../utils/helpers";

const styles = (theme) => ({
  container: {
    position: "relative",
    width: "calc(100% - 24px);",
    margin: 12,
    marginTop: 0,
    marginBottom: 80,
    display: "inline-block",
    [theme.breakpoints.down("sm")]: {
      margin: "24px 12px",
      width: "calc(100% - 24px);",
      marginTop: 0,
      marginBottom: 80,
    },
  },
  summary: {
    display: "flex",
    justifyContent: "space-between",
  },
  imageContainer: {
    paddingBottom: "100%",
    position: "relative",
  },
  img: {
    position: "absolute",
    width: "100% !important",
    height: "100% !important",
    left: 0,
    bottom: 0,
  },
  header: {
    paddingBottom: 0,
  },
  caption: {
    padding: 12,
    fontSize: 15,
    fontWeight: 400,
    whiteSpace: "pre-wrap",
  },
  metric: {
    fontSize: 14,
    marginRight: 12,
  },
});

class Image_C extends PureComponent {
  componentDidMount() {
    this.props.subscribeToUpdates(this.props._id);
  }

  componentWillUnmount() {
    this.props.subscription && this.props.subscription.unsubscribe();
  }

  render() {
    const {
      classes,
      _id,
      user,
      url,
      title,
      caption,
      likeCount,
      dislikeCount,
      commentCount,
      createdAt,
      likeImage,
      dislikeImage,
      liked,
      disliked,
      subscribeToUpdates,
    } = this.props;

    return (
      <Card className={classes.container} elevation={4}>
        <CardMedia className={classes.imageContainer}>
          <img className={classes.img} src={url} />
        </CardMedia>
        <CardHeader
          avatar={<Avatar src={user.profilePic} />}
          title={
            <span style={{ fontSize: 12 }}>
              <span style={{ fontSize: 18 }}>{title}</span>
              <br />
              <Typography variant="body2">by @{user.username}</Typography>
              <Typography variant="body2">
                <i>{date2rel(createdAt)}</i>
              </Typography>
            </span>
          }
          className={classes.header}
        />
        <CardContent
          className={classes.caption}
          dangerouslySetInnerHTML={{
            __html: caption,
          }}
        ></CardContent>
        <ContentActions
          contentType="image"
          id={_id}
          likeCount={likeCount}
          dislikeCount={dislikeCount}
          commentCount={commentCount}
          like={() => likeImage(_id)}
          dislike={() => dislikeImage(_id)}
          liked={liked}
          disliked={disliked}
        />
      </Card>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  likeImage: (imageId) => dispatch(ActionCreators.likeImageStart(imageId)),
  dislikeImage: (imageId) =>
    dispatch(ActionCreators.dislikeImageStart(imageId)),
  subscribeToUpdates: (imageId) =>
    dispatch(ActionCreators.subscribeToImageItemUpdates(imageId)),
});

const mapStateToProps = (state) => ({
  subscription: state.image.subscription,
});

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(Image_C)
);
