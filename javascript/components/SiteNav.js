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
import PeopleIcon from "@material-ui/icons/People";
import NewReleasesIcon from "@material-ui/icons/NewReleases";
import MoreIcon from "@material-ui/icons/MoreVert";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Badge from "@material-ui/core/Badge";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";

import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { ActionCreators } from "../actions";
import { date2rel } from "../utils/helpers";

import MainLogo from "./MainLogo";
import LogoIcon from "./LogoIcon";
import SearchBar from "./SearchBar";

const useStyles = makeStyles((theme) => {
  return {
    container: {
      backgroundColor: "transparent",
      maxWidth: 1450,
      height: 116,
      justifyContent: "center",
      margin: "auto",
      [theme.breakpoints.down("xs")]: {
        height: "auto",
      },
    },
    menuButton: {
      marginRight: theme.spacing(2),
      color: theme.palette.secondary.main,
    },
    sectionDesktop: {
      display: "none",
      marginLeft: 24,
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
    toolbar: {
      "& > .auth-actions": {
        marginLeft: "auto",
      },
      [theme.breakpoints.down("xs")]: {
        flexDirection: "column",
        alignItems: "flex-start",
        "& > .auth-actions": {
          marginTop: 12,
          marginLeft: 0,
          "& > a:first-child": {
            paddingLeft: 0,
          },
        },
      },
    },
    menuItem: {
      fontSize: 16,
    },
    notifsMenu: {
      maxWidth: 420,
    },
    notif: {
      whiteSpace: "break-spaces",
      lineHeight: 1.3,
      padding: "12px 16px",
    },
    notifUsername: {
      color: theme.palette.primary.main,
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
    setAnchorEl(null);
    setMobileMoreAnchorEl(null);
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
        className={classes.menuItem}
      >
        My Profile
      </MenuItem>
      <MenuItem
        onClick={handleMenuClose}
        component={Link}
        to="/my-account"
        className={classes.menuItem}
      >
        My Account
      </MenuItem>
      <MenuItem
        onClick={handleMenuClose}
        component={Link}
        to="/logout"
        className={classes.menuItem}
      >
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
        <Typography variant="body1" style={{ fontSize: 16 }}>
          Notifications
        </Typography>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton color="inherit">
          <AccountCircle className={classes.icon} />
        </IconButton>
        <Typography variant="body1" style={{ fontSize: 16 }}>
          Account
        </Typography>
      </MenuItem>
      <MenuItem onClick={handleMobileMenuClose} component={Link} to="/users">
        <IconButton color="inherit">
          <PeopleIcon className={classes.icon} />
        </IconButton>
        <Typography variant="body1" style={{ fontSize: 16 }}>
          Users
        </Typography>
      </MenuItem>
      <MenuItem onClick={handleMobileMenuClose} component={Link} to="/feed">
        <IconButton color="inherit">
          <NewReleasesIcon className={classes.icon} />
        </IconButton>
        <Typography variant="body1" style={{ fontSize: 16 }}>
          Newsfeed
        </Typography>
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
  return (
    <AppBar position="static" elevation={0} className={classes.container}>
      <Toolbar
        className={!loggedIn ? classes.toolbar : ""}
        style={{ paddingTop: 12 }}
      >
        {loggedIn && (
          <Fragment>
            <Box display={{ xs: "none", md: "block" }}>
              <MainLogo />
            </Box>
            <Box
              display={{ xs: "block", md: "none" }}
              style={{ marginRight: 24 }}
            >
              <LogoIcon />
            </Box>
          </Fragment>
        )}
        {!loggedIn && <MainLogo />}
        {renderMobileMenu}
        {renderMenu}
        {renderNotifsMenu}
        {!loggedIn && (
          <span className="auth-actions">
            <Button color="primary" component={Link} to="/sign-in">
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
              <IconButton
                edge="start"
                onClick={handleNotifsMenuOpen}
                color="inherit"
              >
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
              <IconButton component={Link} to="/feed" color="inherit">
                <NewReleasesIcon className={classes.icon} />
              </IconButton>
              <IconButton onClick={handleProfileMenuOpen} color="inherit">
                <AccountCircle className={classes.icon} />
              </IconButton>
              <IconButton
                edge="end"
                component={Link}
                to="/users"
                color="inherit"
              >
                <PeopleIcon className={classes.icon} />
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
