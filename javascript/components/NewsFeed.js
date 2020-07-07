import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { ActionCreators } from "../actions";

import Grid from "@material-ui/core/Grid";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import NewsFeedItems from "./NewsFeedItems";
import TabPanel from "./TabPanel";
import CustomButton from "./CustomButton";

import throttle from "lodash.throttle";

const useStyles = makeStyles((theme) => ({
  container: {
    maxWidth: 820,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  header: {
    margin: 12,
  },
  tabHeaders: {
    marginBottom: 24,
    justifyContent: "center",
  },
}));

const NewsFeed = ({
  loading,
  loadNewsfeedVideos,
  loadNewsfeedImages,
  loadNewsfeedNotes,
  newsfeedVideoSubscriptions,
  newsfeedImageSubscriptions,
  newsfeedNoteSubscriptions,
  videos,
  images,
  notes,
  hasMoreVideos,
  hasMoreImages,
  hasMoreNotes,
  clearFeedData,
}) => {
  const [tab, setTab] = useState(0);
  const changeTab = (e, newValue) => {
    if (newValue == 1 && images.length == 0) loadNewsfeedImages();
    if (newValue == 2 && notes.length == 0) loadNewsfeedNotes();

    setTab(newValue);
  };

  const classes = useStyles();
  useEffect(() => {
    if (videos.length == 0) loadNewsfeedVideos();

    return () => clearFeedData();
  }, []);

  useEffect(() => {
    if (hasMoreVideos) {
      document.addEventListener("scroll", scrollVideosLoader);
      return () => {
        scrollVideosLoader.cancel();
        document.removeEventListener("scroll", scrollVideosLoader);
      };
    }
  }, [videos, tab]);

  const scrollVideosLoader = throttle(
    (e) => {
      if (tab == 0) {
        let pos =
          (document.documentElement.scrollTop || document.body.scrollTop) +
          document.documentElement.offsetHeight;
        let max = document.documentElement.scrollHeight - 100;
        if (pos > max) {
          loadNewsfeedVideos();
        }
      }
    },
    500,
    { leading: false }
  );
  useEffect(() => {
    if (hasMoreImages) {
      document.addEventListener("scroll", scrollImagesLoader);
      return () => {
        scrollImagesLoader.cancel();
        document.removeEventListener("scroll", scrollImagesLoader);
      };
    }
  }, [images, tab]);

  const scrollImagesLoader = throttle(
    (e) => {
      if (tab == 1) {
        let pos =
          (document.documentElement.scrollTop || document.body.scrollTop) +
          document.documentElement.offsetHeight;
        let max = document.documentElement.scrollHeight - 100;
        if (pos > max) {
          loadNewsfeedImages();
        }
      }
    },
    500,
    { leading: false }
  );
  useEffect(() => {
    if (hasMoreNotes) {
      document.addEventListener("scroll", scrollNotesLoader);
      return () => {
        scrollNotesLoader.cancel();
        document.removeEventListener("scroll", scrollNotesLoader);
      };
    }
  }, [notes, tab]);

  const scrollNotesLoader = throttle(
    (e) => {
      if (tab == 2) {
        let pos =
          (document.documentElement.scrollTop || document.body.scrollTop) +
          document.documentElement.offsetHeight;
        let max = document.documentElement.scrollHeight - 100;
        if (pos > max) {
          loadNewsfeedNotes();
        }
      }
    },
    500,
    { leading: false }
  );

  useEffect(() => {
    return () => {
      Object.values(newsfeedVideoSubscriptions).forEach((sub) =>
        sub.unsubscribe()
      );
      Object.values(newsfeedImageSubscriptions).forEach((sub) =>
        sub.unsubscribe()
      );
      Object.values(newsfeedNoteSubscriptions).forEach((sub) =>
        sub.unsubscribe()
      );
    };
  }, [
    newsfeedVideoSubscriptions,
    newsfeedImageSubscriptions,
    newsfeedNoteSubscriptions,
  ]);

  return (
    <Grid container className={classes.container}>
      <Grid item xs={12}>
        <Typography className={classes.header} variant="h4">
          NewsFeed
        </Typography>
        <Tabs
          value={tab}
          onChange={changeTab}
          indicatorColor="primary"
          textColor="inherit"
          centered={true}
          className={classes.tabHeaders}
        >
          <Tab label="Videos" />
          <Tab label="Images" />
          <Tab label="Notes" />
        </Tabs>
        <TabPanel selectedTab={tab} index={0}>
          <NewsFeedItems items={videos} type="video" loading={loading} />
        </TabPanel>
        <TabPanel selectedTab={tab} index={1}>
          <NewsFeedItems items={images} type="image" loading={loading} />
        </TabPanel>
        <TabPanel selectedTab={tab} index={2}>
          <NewsFeedItems items={notes} type="note" loading={loading} />
        </TabPanel>
      </Grid>
    </Grid>
  );
};

const mapStateToProps = (state) => ({
  loading: state.feed.loading,
  videos: state.feed.videos,
  images: state.feed.images,
  notes: state.feed.notes,
  hasMoreVideos: state.feed.hasMoreVideos,
  hasMoreImages: state.feed.hasMoreImages,
  hasMoreNotes: state.feed.hasMoreNotes,
  newsfeedVideoSubscriptions: state.feed.videoSubscriptions,
  newsfeedImageSubscriptions: state.feed.imageSubscriptions,
  newsfeedNoteSubscriptions: state.feed.noteSubscriptions,
});

const mapDispatchToProps = (dispatch) => ({
  loadNewsfeedVideos: () => dispatch(ActionCreators.loadNewsfeedVideoStart()),
  loadNewsfeedImages: () => dispatch(ActionCreators.loadNewsfeedImagesStart()),
  loadNewsfeedNotes: () => dispatch(ActionCreators.loadNewsfeedNotesStart()),
  clearFeedData: () => dispatch(ActionCreators.clearFeedData()),
});

export default connect(mapStateToProps, mapDispatchToProps)(NewsFeed);
