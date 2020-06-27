import React from "react";

import Box from "@material-ui/core/Box";
import { withStyles } from "@material-ui/core/styles";

const TabPanel = withStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
  },
  hide: {
    display: "none",
  },
}))(({ classes, children, index, selectedTab }) => {
  return (
    <Box
      className={`${classes.container} ${
        index != selectedTab ? classes.hide : ""
      }`}
    >
      {selectedTab == index && children}
    </Box>
  );
});

export default TabPanel;
