import React, { Fragment, memo, useState, useEffect } from "react";
import { connect } from "react-redux";
import { ActionCreators } from "../actions";

import { TransitionGroup, CSSTransition } from "react-transition-group";

import { Link } from "react-router-dom";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";

import Typography from "@material-ui/core/Typography";
import Popover from "@material-ui/core/Popover";
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
    moreSection: {
      display: "flex",
      justifyContent: "space-evenly",
      margin: 12,
    },
  };
});

const NotifsList = ({
  unreadCount,
  markNotificationsRead,
  notifications,
  loadAll,
  loadUnread,
  loadMore,
  notifsAnchorEl,
  isNotifsMenuOpen,
  handleNotifsMenuClose,
}) => {
  const classes = useStyles();
  const [page, setPage] = useState(1);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const popoverActions = React.useRef();

  useEffect(() => {
    if (popoverActions.current) {
      popoverActions.current.updatePosition();

      let win = document.querySelector(".notifs-container");
      let list = document.querySelector("section.notifs-list");
      win.scrollTop = list.clientHeight + 150 - 320;
    }
  }, [notifications]);

  const toggleUnread = () => {
    if (unreadOnly) {
      markNotificationsRead();
      loadAll();
    } else loadUnread();
    setPage(1);
    setUnreadOnly(!unreadOnly);
  };

  return (
    <Popover
      action={popoverActions}
      anchorEl={notifsAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isNotifsMenuOpen}
      onClose={handleNotifsMenuClose}
      PaperProps={{
        className: "notifs-container",
        style: {
          maxHeight: 470,
        },
      }}
    >
      {notifications.length == 0 && !unreadOnly && (
        <MenuItem style={{ pointerEvents: "none" }}>
          No notifications at this time
        </MenuItem>
      )}
      {notifications.length && unreadCount > 0 && (
        <div className={classes.notif}>
          <FormControlLabel
            control={
              <Checkbox
                checked={unreadOnly}
                onChange={toggleUnread}
                color="primary"
              />
            }
            label="unread only"
          />
        </div>
      )}
      <TransitionGroup component="section" className="notifs-list">
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
            <CSSTransition
              timeout={500}
              classNames="notif"
              unmountOnExit
              appear
              enter
              key={notif._id}
            >
              <Link to={contentUrl}>
                <MenuItem
                  className={classes.notif}
                  onClick={handleNotifsMenuClose}
                >
                  <span>
                    <span className={classes.notifUsername}>
                      @{notif.sender}
                    </span>
                    {` ${msg}`}
                    {`${target} ${date2rel(notif.createdAt)}`}
                  </span>
                </MenuItem>
              </Link>
            </CSSTransition>
          );
        })}
      </TransitionGroup>
      <Typography variant="body1" className={classes.moreSection}>
        <Button
          color="primary"
          onClick={() => {
            loadMore(page);
            setPage(page + 1);
          }}
        >
          Load More
        </Button>
        {unreadCount > 0 && (
          <Button
            color="secondary"
            onClick={() => {
              markNotificationsRead(true);
              loadAll();
              setUnreadOnly(false);
            }}
          >
            Mark All Read
          </Button>
        )}
      </Typography>
    </Popover>
  );
};

const mapDispatchToProps = (dispatch) => ({
  loadMore: (page) => dispatch(ActionCreators.loadMoreNotifs(page)),
  loadAll: () => dispatch(ActionCreators.loadAllNotifs()),
  loadUnread: () => dispatch(ActionCreators.loadUnreadNotifs()),
});

export default memo(
  connect(null, mapDispatchToProps)(NotifsList),
  (prev, next) =>
    prev.isNotifsMenuOpen == next.isNotifsMenuOpen &&
    prev.unreadCount == next.unreadCount &&
    prev.notifications == next.notifications
);
