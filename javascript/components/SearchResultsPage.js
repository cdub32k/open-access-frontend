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
import { getSearchQuery, getHashtag } from "../utils/helpers";

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
  hasMoreVideos,
  hasMoreNotes,
  hasMoreImages,
  location,
}) => {
  let s = getSearchQuery(location.search);
  let h = getHashtag(location.search);
  const [tab, setTab] = useState(0);
  const changeTab = (e, newValue) => {
    if (newValue == 1 && images.length == 0) loadImageSearchResults(s, h);
    if (newValue == 2 && notes.length == 0) loadNoteSearchResults(s, h);

    setTab(newValue);
  };

  const classes = useStyles();
  useEffect(() => {
    if (videos.length == 0) loadVideoSearchResults(s, h);
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
  }, []);

  return (
    <Grid container className={classes.container}>
      <Grid item xs={12}>
        <Typography className={classes.header} variant="h4">
          Search Results {s ? s : null}{" "}
          {h ? h.split(",").map((tag) => "#" + tag + " ") : null}
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
          {hasMoreVideos && (
            <CustomButton
              text="Load more"
              onClick={() => loadVideoSearchResults(s, h)}
            />
          )}
        </TabPanel>
        <TabPanel selectedTab={tab} index={1}>
          <NewsFeedItems items={images} type="image" loading={loading} />
          {hasMoreImages && (
            <CustomButton
              text="Load more"
              onClick={() => loadImageSearchResults(s, h)}
            />
          )}
        </TabPanel>
        <TabPanel selectedTab={tab} index={2}>
          <NewsFeedItems items={notes} type="note" loading={loading} />
          {hasMoreNotes && (
            <CustomButton
              text="Load more"
              onClick={() => loadNoteSearchResults(s, h)}
            />
          )}
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
  newsfeedVideoSubscriptions: state.feed.videoSubscriptions,
  newsfeedImageSubscriptions: state.feed.imageSubscriptions,
  newsfeedNoteSubscriptions: state.feed.noteSubscriptions,
  hasMoreVideos: state.feed.hasMoreVideos,
  hasMoreImages: state.feed.hasMoreImages,
  hasMoreNotes: state.feed.hasMoreNotes,
});

const mapDispatchToProps = (dispatch) => ({
  loadVideoSearchResults: (query, hashtag) =>
    dispatch(ActionCreators.loadVideoSearchResultsStart(query, hashtag)),
  loadImageSearchResults: (query, hashtag) =>
    dispatch(ActionCreators.loadImageSearchResultsStart(query, hashtag)),
  loadNoteSearchResults: (query, hashtag) =>
    dispatch(ActionCreators.loadNoteSearchResultsStart(query, hashtag)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchResultsPage);
