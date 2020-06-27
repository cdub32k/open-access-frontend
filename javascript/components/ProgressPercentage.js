import React, { useState, useEffect } from "react";

import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";

export default function CircularProgressWithLabel({
  progress,
  completeMessage,
  style,
}) {
  let variant = progress < 100 ? "static" : "indeterminate";
  return (
    <Box
      style={{
        ...style,
        position: "relative",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        marginTop: 24,
      }}
    >
      <CircularProgress
        style={{
          width: progress == 100 ? 40 : 50,
          height: progress == 100 ? 40 : 50,
        }}
        value={progress}
        variant={variant}
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
        {progress < 100 && (
          <Typography variant="caption" component="div">{`${Math.round(
            progress
          )}%`}</Typography>
        )}
      </Box>
      {progress == 100 && (
        <Typography variant="caption" style={{ marginLeft: 12 }}>
          {completeMessage}
        </Typography>
      )}
    </Box>
  );
}
