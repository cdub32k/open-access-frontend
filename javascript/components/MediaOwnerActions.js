import React, { useState, memo } from "react";
import { connect } from "react-redux";
import { ActionCreators } from "../actions";
import { Redirect } from "react-router-dom";
import axios from "axios";

import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import MoreIcon from "@material-ui/icons/MoreVert";

import CustomButton from "./CustomButton";

const useStyles = makeStyles((theme) => ({
  btn: {
    width: "50%",
  },
  menu: {},
  dialog: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    maxWidth: 716,
    margin: "auto",
  },
  dialogActions: {
    display: "flex",
    justifyContent: "space-evenly",
    padding: 10,
  },
  editFormContent: {
    [theme.breakpoints.down("sm")]: {
      padding: 8,
    },
  },
  editFormTitle: {
    [theme.breakpoints.down("sm")]: {
      padding: 8,
    },
  },
  returnBtn: theme.globalClasses.returnBtn,
  deleteBtn: theme.globalClasses.deleteBtn,
}));

const OwnerActions = ({
  _id,
  type,
  username,
  deleteComment,
  editTitle,
  editForm,
  onEditOpen,
  editCallback,
  ...rest
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [goToProfile, setGoToProfile] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const deleteMedia = () => {
    setLoading(true);

    let path;
    let redirect = false;
    switch (type) {
      case "video":
        path = `/videos/${_id}`;
        redirect = true;
        break;
      case "image":
        path = `/images/${_id}`;
        redirect = true;
        break;
      case "note":
        path = `/notes/${_id}`;
        redirect = true;
        break;
      case "videoComment":
        path = `/videos/comments/${_id}`;
        break;
      case "imageComment":
        path = `/images/comments/${_id}`;
        break;
      case "noteComment":
        path = `/notes/comments/${_id}`;
        break;
    }
    axios
      .delete(path)
      .then((res) => {
        if (redirect) setGoToProfile(true);
        else {
          deleteComment(type, _id, res.data.commentCount);
          setConfirmOpen(false);
          handleClose();
        }
      })
      .catch((error) => {
        setConfirmOpen(false);
        handleClose();
      });
  };

  const editMedia = () => {
    setLoading(true);
    editCallback()
      .then((res) => {
        setLoading(false);
        setEditOpen(false);
        handleClose();
      })
      .catch((error) => {
        setLoading(false);
        setEditOpen(false);
        handleClose();
      });
  };

  const confirmClose = () => {
    setConfirmOpen(false);
    setEditOpen(false);
    handleClose();
  };

  if (goToProfile) return <Redirect to={`/profile/${username}`} />;

  return (
    <div {...rest}>
      <IconButton onClick={handleClick} color="inherit">
        <MoreIcon className={classes.icon} />
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {type != "note" && (
          <MenuItem
            onClick={() => {
              if (onEditOpen) onEditOpen();
              setEditOpen(true);
            }}
          >
            edit
          </MenuItem>
        )}
        <MenuItem onClick={() => setConfirmOpen(true)}>delete</MenuItem>
      </Menu>

      <Dialog
        className={classes.dialog}
        onClose={confirmClose}
        open={confirmOpen}
      >
        <DialogTitle>Confirm delete media</DialogTitle>
        {loading && (
          <CircularProgress style={{ margin: "auto", display: "block" }} />
        )}
        <div className={classes.dialogActions}>
          <CustomButton
            className={classes.deleteBtn}
            text="DELETE"
            onClick={deleteMedia}
            disabled={loading}
          />
          <CustomButton
            className={classes.returnBtn}
            text="cancel"
            onClick={confirmClose}
          />
        </div>
      </Dialog>
      <Dialog
        classes={{ scrollPaper: classes.dialog }}
        onClose={confirmClose}
        open={editOpen}
        fullWidth={true}
        maxWidth={"md"}
      >
        <DialogTitle
          className={classes.editFormTitle}
          style={{ paddingBottom: 0 }}
        >
          {editTitle}
        </DialogTitle>
        <DialogContent
          style={{ paddingTop: 0 }}
          className={classes.editFormContent}
        >
          {editForm}
        </DialogContent>
        {loading && (
          <CircularProgress style={{ margin: "12px auto", display: "block" }} />
        )}
        <div className={classes.dialogActions}>
          <CustomButton text="SAVE" onClick={editMedia} disabled={loading} />
          <CustomButton
            className={classes.returnBtn}
            text="cancel"
            onClick={confirmClose}
          />
        </div>
      </Dialog>
    </div>
  );
};

const mapStateToProps = (state) => ({
  username: state.user.username,
});

const mapDispatchToProps = (dispatch) => ({
  deleteComment: (type, _id, commentCount) =>
    dispatch(ActionCreators.deleteComment(type, _id, commentCount)),
});

export default connect(mapStateToProps, mapDispatchToProps)(memo(OwnerActions));
