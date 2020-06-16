import React, { useState, useEffect } from "react";

import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import ContentPreview from "./ContentPreview";
import PreviewPlaceholder from "./PreviewPlaceholder";
import CustomButton from "./CustomButton";

const useStyles = makeStyles((theme) => ({
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
}));

const NoteList = ({ loading, notes, hasMore, loadMore }) => {
  const classes = useStyles();
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (hasMore && notes.length == 0) loadMore(0);
  }, []);

  const _loadMore = () => {
    loadMore(page + 1);
    setPage(page + 1);
  };

  let noteListHTML = loading
    ? notes
        .map((note) => {
          return (
            <ContentPreview
              contentType="note"
              id={note._id}
              user={note.user}
              caption={note.caption}
              commentCount={note.commentCount}
              uploadedAt={note.uploadedAt}
              key={note._id}
            />
          );
        })
        .concat(
          Array.from({ length: 4 }).map((preview, i) => {
            return <PreviewPlaceholder key={i} />;
          })
        )
    : notes.map((note, i) => {
        return (
          <ContentPreview
            contentType="note"
            id={note._id}
            user={note.user}
            caption={note.caption}
            commentCount={note.commentCount}
            uploadedAt={note.uploadedAt}
            key={i}
          />
        );
      });

  if (!loading && (!notes || notes.length == 0))
    noteListHTML = (
      <Typography variant="body1">Nothing to show here (yet)</Typography>
    );

  return (
    <div className={`${classes.container} content-container`}>
      <div className={`${classes.contentList} content-list`}>
        {noteListHTML}
      </div>
      {hasMore && (
        <div>
          <CustomButton text="Load more" onClick={_loadMore} />
        </div>
      )}
    </div>
  );
};

export default NoteList;
