import React, { Fragment, memo } from "react";

import { Link } from "react-router-dom";

import Badge from "@material-ui/core/Badge";
import NotificationsIcon from "@material-ui/icons/Notifications";
import { makeStyles } from "@material-ui/core/styles";

import { date2rel } from "../utils/helpers";

const useStyles = makeStyles((theme) => {
  return {
    ...theme.globalClasses,
  };
});

const NotifsBadge = ({
  notifications,
  notifsAnchorEl,
  isNotifsMenuOpen,
  handleNotifsMenuClose,
}) => {
  const classes = useStyles();
  return (
    <Badge
      badgeContent={notifications.filter((notif) => !notif.read).length}
      classes={{ badge: classes.badge }}
      max={99}
    >
      <NotificationsIcon className={classes.icon} />
    </Badge>
  );
};

export default memo(
  NotifsBadge,
  (prev, next) => prev.notifications == next.notifications
);
