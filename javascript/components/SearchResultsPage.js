import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { ActionCreators } from "../actions";

import Grid from "@material-ui/core/Grid";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles } from "@material-ui/core/styles";

import NewsFeedItems from "./NewsFeedItems";
import TabPanel from "./TabPanel";
import CustomButton from "./CustomButton";
import { getSearchQuery, getHashtag } from "../utils/helpers";

import throttle from "lodash.throttle";

const useStyles = makeStyles((theme) => ({
  container: {
    maxWidth: 888,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  header: {
    margin: 12,
  },
  tabHeaders: {
    marginTop: 18,
    marginBottom: 24,
    justifyContent: "center",
  },
  sortRoot: {
    marginLeft: 12,
    padding: "6px 32px 6px 6px",
  },
  sortSelect: {
    marginLeft: 6,
  },
  sortOption: {
    padding: "4px 8px",
  },
}));

const SearchResultsPage = ({
  loading,
  loadVideoSearchResults,
  loadImageSearchResults,
  loadNoteSearchResults,
  newsfeedVideoSubscriptions,
  newsfeedImageSubscriptions,
  newsfeedNoteSubscriptions,
  videos,
  images,
  notes,
  videoCount,
  imageCount,
  noteCount,
  hasMoreVideos,
  hasMoreNotes,
  hasMoreImages,
  location,
  clearFeedData,
}) => {
  let s = getSearchQuery(location.search);
  let h = getHashtag(location.search);
  const [tab, setTab] = useState(0);
  const [sort, setSort] = useState(0);

  const changeSort = (e) => {
    clearFeedData();
    setSort(e.target.value);
    setTab(0);
    loadVideoSearchResults(s, h, e.target.value);
  };

  const changeTab = (e, newValue) => {
    if (newValue == 1 && images.length == 0) loadImageSearchResults(s, h, sort);
    if (newValue == 2 && notes.length == 0) loadNoteSearchResults(s, h, sort);

    setTab(newValue);
  };

  const classes = useStyles();
  useEffect(() => {
    if (videos.length == 0) loadVideoSearchResults(s, h, sort);
    return () => {
      clearFeedData();
    };
  }, []);

  useEffect(() => {
    Object.values(newsfeedVideoSubscriptions).forEach((sub) =>
      sub.unsubscribe()
    );
    Object.values(newsfeedImageSubscriptions).forEach((sub) =>
      sub.unsubscribe()
    );
    Object.values(newsfeedNoteSubscriptions).forEach((sub) =>
      sub.unsubscribe()
    );
  }, [
    newsfeedVideoSubscriptions,
    newsfeedImageSubscriptions,
    newsfeedNoteSubscriptions,
  ]);

  useEffect(() => {
    if (hasMoreVideos) {
      document.addEventListener("scroll", scrollVideosLoader);
      return () => {
        scrollVideosLoader.cancel();
        document.removeEventListener("scroll", scrollVideosLoader);
      };
    }
  }, [videos, tab, sort]);

  const scrollVideosLoader = throttle(
    (e) => {
      if (tab == 0) {
        let pos =
          (document.documentElement.scrollTop || document.body.scrollTop) +
          document.documentElement.offsetHeight;
        let max = document.documentElement.scrollHeight - 25;
        if (pos > max) {
          loadVideoSearchResults(s, h, sort);
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
  }, [images, tab, sort]);

  const scrollImagesLoader = throttle(
    (e) => {
      if (tab == 1) {
        let pos =
          (document.documentElement.scrollTop || document.body.scrollTop) +
          document.documentElement.offsetHeight;
        let max = document.documentElement.scrollHeight - 25;
        if (pos > max) {
          loadImageSearchResults(s, h, sort);
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
  }, [notes, tab, sort]);

  const scrollNotesLoader = throttle(
    (e) => {
      if (tab == 2) {
        let pos =
          (document.documentElement.scrollTop || document.body.scrollTop) +
          document.documentElement.offsetHeight;
        let max = document.documentElement.scrollHeight - 25;
        if (pos > max) {
          loadNoteSearchResults(s, h, sort);
        }
      }
    },
    500,
    { leading: false }
  );

  return (
    <Grid container className={classes.container}>
      <Grid item xs={12}>
        <Typography className={classes.header} variant="h4">
          Search Results: {s ? s : null}{" "}
          {h ? h.split(",").map((tag) => "#" + tag + " ") : null}
        </Typography>
        <Select
          style={{ marginLeft: 12, height: 36 }}
          classes={{ root: classes.sortRoot, select: classes.sortSelect }}
          value={sort}
          defaultValue={0}
          onChange={changeSort}
          variant="outlined"
        >
          <MenuItem className={classes.sortOption} value={0}>
            Newest
          </MenuItem>
          <MenuItem className={classes.sortOption} value={1}>
            Most Liked (trending)
          </MenuItem>
          <MenuItem className={classes.sortOption} value={2}>
            Most Disliked (trending)
          </MenuItem>
          <MenuItem className={classes.sortOption} value={3}>
            Most Liked (all time)
          </MenuItem>
          <MenuItem className={classes.sortOption} value={4}>
            Most Disliked (all time)
          </MenuItem>
        </Select>
        <Tabs
          value={tab}
          onChange={changeTab}
          indicatorColor="primary"
          textColor="inherit"
          centered={true}
          className={classes.tabHeaders}
        >
          <Tab label={`Videos (${videoCount >= 100 ? "99+" : videoCount})`} />
          <Tab label={`Images (${imageCount >= 100 ? "99+" : imageCount})`} />
          <Tab label={`Notes (${noteCount >= 100 ? "99+" : noteCount})`} />
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
  videoCount: state.feed.videoCount,
  imageCount: state.feed.imageCount,
  noteCount: state.feed.noteCount,
  newsfeedVideoSubscriptions: state.feed.videoSubscriptions,
  newsfeedImageSubscriptions: state.feed.imageSubscriptions,
  newsfeedNoteSubscriptions: state.feed.noteSubscriptions,
  hasMoreVideos: state.feed.hasMoreVideos,
  hasMoreImages: state.feed.hasMoreImages,
  hasMoreNotes: state.feed.hasMoreNotes,
});

const mapDispatchToProps = (dispatch) => ({
  loadVideoSearchResults: (query, hashtag, sort) =>
    dispatch(ActionCreators.loadVideoSearchResultsStart(query, hashtag, sort)),
  loadImageSearchResults: (query, hashtag, sort) =>
    dispatch(ActionCreators.loadImageSearchResultsStart(query, hashtag, sort)),
  loadNoteSearchResults: (query, hashtag, sort) =>
    dispatch(ActionCreators.loadNoteSearchResultsStart(query, hashtag, sort)),
  clearFeedData: () => dispatch(ActionCreators.clearFeedData()),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchResultsPage);
