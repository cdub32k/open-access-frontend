import React, { useState } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import axios from "axios";

import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import CustomInput from "./CustomInput";
import CustomButton from "./CustomButton";

const useStyles = makeStyles((theme) => ({
  container: {
    width: 320,
  },
  form: {
    display: "flex",
    maxWidth: 1450,
    justifyContent: "space-between",
    margin: "auto",
  },
  input: {
    marginBottom: 24,
  },
  counter: {
    marginTop: 24,
    display: "inline-block",
  },
  btn: {
    margin: `${theme.spacing(2)}px 0`,
  },
}));

const NoteUploader = ({ username }) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [caption, setCaption] = useState("");
  const [goToProfile, setGoToProfile] = useState(false);
  const [noteId, setNoteId] = useState(null);

  const updateCaption = (event) => {
    setCaption(event.target.value);
  };

  const onSubmitHandler = () => {
    setLoading(true);
    axios
      .post("/api", {
        query: `
      mutation {
        postNote(caption:"${caption}") {
          _id
        }
      }
    `,
      })
      .then((res) => {
        if (res.data.data.postNote) {
          setNoteId(res.data.data.postNote._id);
          setGoToProfile(true);
        }
      });
  };

  if (goToProfile) return <Redirect to={`/note/${noteId}`} />;

  return (
    <div className={classes.container}>
      <Typography color="primary" variant="h3">
        Post Note
      </Typography>
      <Typography className={classes.counter} variant="caption">
        {caption.length} / 800 chars
      </Typography>
      <form onSubmit={onSubmitHandler}>
        <CustomInput
          className={classes.input}
          value={caption}
          onChange={updateCaption}
          multiline={true}
          rows={3}
          maxLength={800}
        />
        {loading && (
          <CircularProgress
            style={{ margin: "28px 0", display: "block" }}
            disableShrink
          />
        )}
        <CustomButton
          disabled={!caption || loading}
          className={classes.btn}
          text="Post"
          onClick={onSubmitHandler}
        />
      </form>
    </div>
  );
};

const mapStateToProps = (state) => ({
  username: state.user.username,
});

export default connect(mapStateToProps)(NoteUploader);
