import React, { useState, useEffect } from "react";

import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";

export default function CircularProgressWithLabel({ progress, style }) {
  return (
    <Box style={{ ...style, position: "relative" }}>
      <CircularProgress
        style={{ width: 50, height: 50 }}
        variant="static"
        value={progress * 0.9}
      />
      <Box
        style={{ width: 50, height: 50 }}
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="caption" component="div">{`${Math.round(
          progress * 0.9
        )}%`}</Typography>
      </Box>
    </Box>
  );
}
