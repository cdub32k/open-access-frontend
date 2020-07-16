import React, { Fragment, memo, useState, useEffect } from "react";
import { connect } from "react-redux";
import { ActionCreators } from "../actions";

import { TransitionGroup, CSSTransition } from "react-transition-group";

import { Link } from "react-router-dom";

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
  notifications,
  loadMore,
  notifsAnchorEl,
  isNotifsMenuOpen,
  handleNotifsMenuClose,
}) => {
  const classes = useStyles();
  const [page, setPage] = useState(1);
  const popoverActions = React.useRef();

  useEffect(() => {
    if (popoverActions.current) {
      popoverActions.current.updatePosition();

      let win = document.querySelector(".notifs-container");
      let list = document.querySelector("section.notifs-list");
      win.scrollTop = list.clientHeight + 60 - 320;
    }
  }, [notifications]);

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
          maxHeight: 320,
        },
      }}
    >
      {notifications.length == 0 && (
        <MenuItem style={{ pointerEvents: "none" }}>
          No notifications at this time
        </MenuItem>
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
        <Button color="secondary">See All</Button>
      </Typography>
    </Popover>
  );
};

const mapDispatchToProps = (dispatch) => ({
  loadMore: (page) => dispatch(ActionCreators.loadMoreNotifs(page)),
});

export default memo(
  connect(null, mapDispatchToProps)(NotifsList),
  (prev, next) =>
    prev.isNotifsMenuOpen == next.isNotifsMenuOpen &&
    prev.notifications == next.notifications
);
