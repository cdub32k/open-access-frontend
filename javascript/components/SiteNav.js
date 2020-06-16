import React, { Fragment, useState, memo } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import MailIcon from "@material-ui/icons/Mail";
import NotificationsIcon from "@material-ui/icons/Notifications";
import MoreIcon from "@material-ui/icons/MoreVert";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Badge from "@material-ui/core/Badge";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";

import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { ActionCreators } from "../actions";
import { date2rel } from "../utils/helpers";

import MainLogo from "./MainLogo";
import SearchBar from "./SearchBar";

const useStyles = makeStyles((theme) => {
  return {
    container: {
      backgroundColor: "transparent",
      maxWidth: 1450,
      height: 116,
      justifyContent: "center",
      margin: "auto",
    },
    menuButton: {
      marginRight: theme.spacing(2),
      color: theme.palette.secondary.main,
    },
    sectionDesktop: {
      display: "none",
      [theme.breakpoints.up("md")]: {
        display: "flex",
      },
    },
    sectionMobile: {
      display: "flex",
      [theme.breakpoints.up("md")]: {
        display: "none",
      },
    },
    ...theme.globalClasses,
  };
});

const SiteNav = ({
  loggedIn,
  username,
  notifications,
  markNotificationsRead,
}) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifsAnchorEl, setNotifsAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isNotifsMenuOpen = Boolean(notifsAnchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleNotifsMenuOpen = (event) => {
    setNotifsAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleNotifsMenuClose = () => {
    setNotifsAnchorEl(null);
    markNotificationsRead();
  };
  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem
        onClick={handleMenuClose}
        component={Link}
        to={`/profile/${username}`}
      >
        My Profile
      </MenuItem>
      <MenuItem onClick={handleMenuClose} component={Link} to="/my-account">
        My Account
      </MenuItem>
      <MenuItem onClick={handleMenuClose} component={Link} to="/logout">
        Logout
      </MenuItem>
    </Menu>
  );

  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleNotifsMenuOpen}>
        <IconButton color="inherit">
          <Badge
            badgeContent={notifications.filter((notif) => !notif.read).length}
            classes={{ badge: classes.badge }}
            max={99}
          >
            <NotificationsIcon className={classes.icon} />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton color="inherit">
          <AccountCircle className={classes.icon} />
        </IconButton>
        <p>Account</p>
      </MenuItem>
    </Menu>
  );

  const renderNotifsMenu = (
    <Menu
      anchorEl={notifsAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isNotifsMenuOpen}
      onClose={handleNotifsMenuClose}
    >
      {notifications.length == 0 && (
        <MenuItem style={{ pointerEvents: "none" }}>
          No notifications at this time
        </MenuItem>
      )}
      {notifications.map((notif, i) => {
        let contentUrl = "";
        let msg = `${notif.sender} `;
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
            <MenuItem onClick={handleNotifsMenuClose}>
              {`${msg} `}
              {`${notif.target} ${date2rel(notif.createdAt)}`}
            </MenuItem>
          </Link>
        );
      })}
    </Menu>
  );
  return (
    <AppBar position="static" elevation={0} className={classes.container}>
      <Toolbar>
        {loggedIn && (
          <Box display={{ xs: "none", md: "block" }}>
            <MainLogo />
          </Box>
        )}
        {!loggedIn && <MainLogo />}
        {renderMobileMenu}
        {renderMenu}
        {renderNotifsMenu}
        {!loggedIn && (
          <span style={{ marginLeft: "auto" }}>
            <Button color="primary" component={Link} to="/login">
              Sign in
            </Button>
            <Button color="primary" component={Link} to="/sign-up">
              Register
            </Button>
          </span>
        )}
        {loggedIn && (
          <Fragment>
            <SearchBar />
            <div className={classes.sectionDesktop}>
              <IconButton onClick={handleNotifsMenuOpen} color="inherit">
                <Badge
                  badgeContent={
                    notifications.filter((notif) => !notif.read).length
                  }
                  classes={{ badge: classes.badge }}
                  max={99}
                >
                  <NotificationsIcon className={classes.icon} />
                </Badge>
              </IconButton>
              <IconButton
                edge="end"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle className={classes.icon} />
              </IconButton>
            </div>
            <div className={classes.sectionMobile}>
              <IconButton onClick={handleMobileMenuOpen} color="inherit">
                <MoreIcon className={classes.icon} />
              </IconButton>
            </div>
          </Fragment>
        )}
      </Toolbar>
    </AppBar>
  );
};

const mapStateToProps = (state) => ({
  loggedIn: state.user.loggedIn,
  username: state.user.username,
  notifications: state.user.notifications,
});
const mapDispatchToProps = (dispatch) => ({
  markNotificationsRead: () =>
    dispatch(ActionCreators.markNotificationsReadStart()),
});
export default connect(mapStateToProps, mapDispatchToProps)(memo(SiteNav));
