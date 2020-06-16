import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { ActionCreators } from "../actions";

import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import IconButton from "@material-ui/core/IconButton";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import AddCommentIcon from "@material-ui/icons/AddComment";
import { withStyles } from "@material-ui/core/styles";

import ContentActions from "./ContentActions";

import { num2str, date2rel, convertHashtagsToLinks } from "../utils/helpers";

const styles = (theme) => ({
  container: {
    position: "relative",
    width: "calc(100% - 48px);",
    margin: 24,
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
  noteContainer: {
    paddingBottom: "56.25%",
    position: "relative",
  },
  note: {
    left: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
  },
  metric: {
    fontSize: 14,
    marginRight: 12,
  },
});

class Note extends PureComponent {
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
      caption,
      likeCount,
      dislikeCount,
      commentCount,
      uploadedAt,
      likeNote,
      dislikeNote,
      liked,
      disliked,
      subscribeToUpdates,
    } = this.props;
    return (
      <Card className={classes.container}>
        <CardContent className={classes.noteContainer}>
          <div className={classes.note}>
            <div
              style={{ whiteSpace: "pre-wrap", width: "90%" }}
              dangerouslySetInnerHTML={{
                __html: convertHashtagsToLinks(caption),
              }}
            ></div>
          </div>
        </CardContent>
        <CardHeader
          avatar={<Avatar src={user.profilePic} />}
          title={
            <span style={{ fontSize: 12 }}>
              by {user.username}
              <br />
              {date2rel(uploadedAt)}
            </span>
          }
        />
        <ContentActions
          contentType="note"
          id={_id}
          likeCount={likeCount}
          dislikeCount={dislikeCount}
          commentCount={commentCount}
          like={() => likeNote(_id)}
          dislike={() => dislikeNote(_id)}
          liked={liked}
          disliked={disliked}
        />
      </Card>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  likeNote: (noteId) => dispatch(ActionCreators.likeNoteStart(noteId)),
  dislikeNote: (noteId) => dispatch(ActionCreators.dislikeNoteStart(noteId)),
  subscribeToUpdates: (noteId) =>
    dispatch(ActionCreators.subscribeToNoteItemUpdates(noteId)),
});

const mapStateToProps = (state) => ({
  subscription: state.video.subscription,
});

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(Note)
);
