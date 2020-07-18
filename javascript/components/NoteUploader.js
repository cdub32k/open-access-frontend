import React, { useState } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import axios from "axios";

import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { makeStyles, useTheme } from "@material-ui/core/styles";

import CustomInput from "./CustomInput";
import CustomButton from "./CustomButton";

const useStyles = makeStyles((theme) => ({
  container: {
    width: "100%",
    padding: 12,
  },
  form: {
    display: "flex",
    maxWidth: 888,
    justifyContent: "space-between",
    margin: "auto",
  },
  input: {
    marginBottom: 24,
  },
  counter: {
    display: "inline-block",
    textAlign: "right",
    width: "100%",
    maxWidth: 600,
  },
}));

const POST_NOTE_QUERY = `
  mutation PostNote($caption: String!) {
    postNote(caption: $caption) {
      _id
    }
  }
`;

const NoteUploader = ({ username, history }) => {
  const classes = useStyles();
  const theme = useTheme();

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
        query: POST_NOTE_QUERY,
        variables: { caption },
      })
      .then((res) => {
        if (res.data.data.postNote) {
          setNoteId(res.data.data.postNote._id);
          setGoToProfile(true);
        }
      })
      .catch((err) => {
        alert("There was an error! Please try again");
        window.location.reload();
      });
  };

  if (goToProfile) return <Redirect to={`/note/${noteId}`} />;

  return (
    <div className={classes.container}>
      <div className={classes.form}>
        <Grid container>
          <Grid item xs={12}>
            <Typography
              color="primary"
              variant="h3"
              style={{ marginBottom: 32 }}
            >
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
                maxLength={800}
              />
              {loading && (
                <CircularProgress
                  style={{ margin: "28px 0", display: "block" }}
                />
              )}
              <CustomButton
                disabled={!caption || loading}
                text="Post"
                onClick={onSubmitHandler}
              />
              {!loading && (
                <CustomButton
                  onClick={() => history.push(`/profile/${username}`)}
                  style={{
                    backgroundColor: theme.palette.secondary.main,
                    color: theme.palette.light.main,
                  }}
                  text="cancel"
                />
              )}
            </form>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  username: state.user.username,
});

export default connect(mapStateToProps)(NoteUploader);
