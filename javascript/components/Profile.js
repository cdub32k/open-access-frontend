import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { ActionCreators } from "../actions";
import { Link } from "react-router-dom";

import Typography from "@material-ui/core/Typography";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { makeStyles } from "@material-ui/core/styles";

import ProfileHeader from "./ProfileHeader";
import VideoList from "./VideoList";
import ImageList from "./ImageList";
import NoteList from "./NoteList";
import UserCommentList from "./UserCommentList";
import UserLikeList from "./UserLikeList";
import CustomButton from "./CustomButton";
import TabPanel from "./TabPanel";
import Error from "./Error";

import { num2str } from "../utils/helpers";

const Profile = ({
  match,
  getUserInfo,
  viewedUserLoading,
  clearUserData,
  initialLoad,
  loading,
  error,
  videos,
  images,
  notes,
  loadUserVideoPage,
  videoCount,
  loadUserImagePage,
  imageCount,
  loadUserNotePage,
  noteCount,
  loadUserCommentsPage,
  comments,
  commentCount,
  loadUserLikesPage,
  likes,
  likeCount,
  loadUserDislikesPage,
  dislikes,
  dislikeCount,
  mineUsername,
  viewedUserDoneLoading,
}) => {
  const classes = useStyles();
  const [selectedTab, setSelectedTab] = useState(0);
  const { username } = match.params;

  useEffect(() => {
    getUserInfo(username);
    return () => clearUserData();
  }, []);

  const changeTab = (e, newValue) => {
    viewedUserLoading();
    setSelectedTab(newValue);
  };
  if (error) return <Error />;

  return (
    <div className={`${classes.container} profile-container`}>
      <ProfileHeader loading={initialLoad} />
      <Tabs
        value={selectedTab}
        onChange={changeTab}
        indicatorColor="primary"
        textColor="inherit"
        className={`${classes.tabHeaders} content-list`}
        variant="scrollable"
        scrollButtons="on"
      >
        <Tab
          className={classes.tabHeader}
          label={`Videos (${num2str(videoCount)})`}
          wrapped={true}
        />
        <Tab
          className={classes.tabHeader}
          label={`Images (${num2str(imageCount)})`}
          wrapped={true}
        />
        <Tab
          className={classes.tabHeader}
          label={`Notes (${num2str(noteCount)})`}
          wrapped={true}
        />
        <Tab
          className={classes.tabHeader}
          label={`Comments (${num2str(commentCount)})`}
          wrapped={true}
        />
        <Tab
          className={classes.tabHeader}
          label={`Likes (${num2str(likeCount)})`}
          wrapped={true}
        />
        <Tab
          className={classes.tabHeader}
          label={`Dislikes (${num2str(dislikeCount)})`}
          wrapped={true}
        />
      </Tabs>
      <TabPanel selectedTab={selectedTab} index={0}>
        {mineUsername == username && (
          <Link to="/video-upload">
            <CustomButton text="+New Video" />
          </Link>
        )}
        <VideoList
          hasMore={videoCount > videos.length}
          loadMore={(page) => loadUserVideoPage(username, page)}
          videos={videos}
          loading={loading}
          doneLoading={viewedUserDoneLoading}
        />
      </TabPanel>
      <TabPanel selectedTab={selectedTab} index={1}>
        {mineUsername == username && (
          <Link to="/image-upload">
            <CustomButton text="+New Image" />
          </Link>
        )}
        <ImageList
          hasMore={imageCount > images.length}
          loadMore={(page) => loadUserImagePage(username, page)}
          images={images}
          loading={loading}
          doneLoading={viewedUserDoneLoading}
        />
      </TabPanel>
      <TabPanel selectedTab={selectedTab} index={2}>
        {mineUsername == username && (
          <Link to="/note-upload">
            <CustomButton text="+New Note" />
          </Link>
        )}
        <NoteList
          hasMore={noteCount > notes.length}
          loadMore={(page) => loadUserNotePage(username, page)}
          notes={notes}
          loading={loading}
          doneLoading={viewedUserDoneLoading}
        />
      </TabPanel>
      <TabPanel selectedTab={selectedTab} index={3}>
        <UserCommentList
          username={username}
          hasMore={commentCount > comments.length}
          loadMore={(page) => loadUserCommentsPage(username, page)}
          comments={comments}
          loading={loading}
          doneLoading={viewedUserDoneLoading}
        />
      </TabPanel>
      <TabPanel selectedTab={selectedTab} index={4}>
        <UserLikeList
          username={username}
          hasMore={likeCount > likes.length}
          loadMore={(page) => loadUserLikesPage(username, page)}
          likes={likes}
          loading={loading}
          doneLoading={viewedUserDoneLoading}
        />
      </TabPanel>
      <TabPanel selectedTab={selectedTab} index={5}>
        <UserLikeList
          username={username}
          hasMore={dislikeCount > dislikes.length}
          loadMore={(page) => loadUserDislikesPage(username, page)}
          likes={dislikes}
          negative={true}
          loading={loading}
          doneLoading={viewedUserDoneLoading}
        />
      </TabPanel>
    </div>
  );
};

const mapStateToProps = (state) => ({
  mineUsername: state.user.username,
  initialLoad: state.user.loading,
  loading: state.user.viewed.loading,
  error: state.user.viewed.error,
  username: state.user.viewed.username,
  videos: state.user.viewed.videos,
  images: state.user.viewed.images,
  notes: state.user.viewed.notes,
  videoCount: state.user.viewed.videoCount,
  imageCount: state.user.viewed.imageCount,
  noteCount: state.user.viewed.noteCount,
  commentCount: state.user.viewed.commentCount,
  comments: state.user.viewed.comments,
  likeCount: state.user.viewed.likeCount,
  likes: state.user.viewed.likes,
  dislikeCount: state.user.viewed.dislikeCount,
  dislikes: state.user.viewed.dislikes,
});

const mapDispatchToProps = (dispatch) => ({
  getUserInfo: (username) =>
    dispatch(ActionCreators.getUserInfoStart(username)),
  clearUserData: () => {
    dispatch(ActionCreators.clearUserData());
  },
  viewedUserLoading: () => dispatch(ActionCreators.viewedUserLoading()),
  viewedUserDoneLoading: () => dispatch(ActionCreators.viewedUserDoneLoading()),
  loadUserVideoPage: (username, page) =>
    dispatch(ActionCreators.loadUserVideoPageStart(username, page)),
  loadUserImagePage: (username, page) =>
    dispatch(ActionCreators.loadUserImagePageStart(username, page)),
  loadUserNotePage: (username, page) =>
    dispatch(ActionCreators.loadUserNotePageStart(username, page)),
  loadUserCommentsPage: (username, page) =>
    dispatch(ActionCreators.loadUserCommentsPageStart(username, page)),
  loadUserLikesPage: (username, page) =>
    dispatch(ActionCreators.loadUserLikesPageStart(username, page)),
  loadUserDislikesPage: (username, page) =>
    dispatch(ActionCreators.loadUserDislikesPageStart(username, page)),
});

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  tabHeaders: {
    marginBottom: 24,
  },
  tabHeader: {
    fontSize: 16,
  },
}));

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
