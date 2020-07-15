import React, { Fragment, memo } from "react";

import { Link } from "react-router-dom";

import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles } from "@material-ui/core/styles";

import { date2rel } from "../utils/helpers";

const useStyles = makeStyles((theme) => {
  return {
    notif: {
      whiteSpace: "break-spaces",
      lineHeight: 1.3,
      padding: "12px 16px",
    },
    notifUsername: {
      color: theme.palette.primary.main,
    },
  };
});

const NotifsList = ({
  notifications,
  notifsAnchorEl,
  isNotifsMenuOpen,
  handleNotifsMenuClose,
}) => {
  const classes = useStyles();
  return (
    <Menu
      anchorEl={notifsAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isNotifsMenuOpen}
      onClose={handleNotifsMenuClose}
      classes={{ paper: classes.notifsMenu }}
    >
      {notifications.length == 0 && (
        <MenuItem style={{ pointerEvents: "none" }}>
          No notifications at this time
        </MenuItem>
      )}
      {notifications.map((notif, i) => {
        let contentUrl = "";
        let msg = "";
        let target = `${notif.target}`;
        switch (notif.type) {
          case "like":
            msg += "liked your ";
            break;
          case "dislike":
            msg += "disliked your ";
            break;
          case "comment":
            msg += "commented on your ";
            break;
          case "reply":
            msg += "replied to your comment on a ";
            break;
          case "mention":
            msg += "mentioned you in a ";
            if (notif.commentId) target = "comment on a " + target;
            break;
          default:
            break;
        }
        switch (notif.target) {
          case "note":
            contentUrl = "/note/" + notif.targetId;
            if (notif.commentId) contentUrl += "?c=" + notif.commentId;
            break;
          case "image":
            contentUrl = "/image/" + notif.targetId;
            if (notif.commentId) contentUrl += "?c=" + notif.commentId;
            break;
          case "video":
            contentUrl = "/video-player/" + notif.targetId;
            if (notif.commentId) contentUrl += "?c=" + notif.commentId;
            break;
          default:
            break;
        }

        return (
          <Link key={notif._id} to={contentUrl}>
            <MenuItem className={classes.notif} onClick={handleNotifsMenuClose}>
              <span>
                <span className={classes.notifUsername}>@{notif.sender}</span>
                {` ${msg}`}
                {`${target} ${date2rel(notif.createdAt)}`}
              </span>
            </MenuItem>
          </Link>
        );
      })}
    </Menu>
  );
};

export default memo(
  NotifsList,
  (prev, next) =>
    prev.isNotifsMenuOpen == next.isNotifsMenuOpen &&
    prev.notifications == next.notifications
);
