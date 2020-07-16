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
import PeopleIcon from "@material-ui/icons/People";
import NewReleasesIcon from "@material-ui/icons/NewReleases";
import MoreIcon from "@material-ui/icons/MoreVert";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import AccountCircle from "@material-ui/icons/AccountCircle";

import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";

import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { ActionCreators } from "../actions";

import MainLogo from "./MainLogo";
import LogoIcon from "./LogoIcon";
import SearchBar from "./SearchBar";
import NotifsBadge from "./NotifsBadge";
import NotifsList from "./NotifsList";

const useStyles = makeStyles((theme) => {
  return {
    container: {
      backgroundColor: "#f5f5f5",
      height: 64,
      alignItems: "center",
      justifyContent: "flex-start",
      margin: "auto",
      [theme.breakpoints.down("xs")]: {
        padding: "2px 0",
        height: "auto",
      },
      top: 0,
      zIndex: 10,
      borderBottom: `1px solid lightgray`,
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
          marginTop: 0,
          marginLeft: 0,
          "& > a:first-child": {
            paddingLeft: 0,
          },
        },
      },
    },
    menuItem: {
      fontSize: 16,
      fontWeight: "bold",
    },
    notifsMenu: {
      maxWidth: 420,
    },

    ...theme.globalClasses,
  };
});

const SiteNav = ({
  loggedIn,
  username,
  notifications,
  unreadNotifsCount,
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
          <NotifsBadge unreadCount={unreadNotifsCount} />
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

  return (
    <AppBar elevation={0} className={classes.container}>
      <Toolbar
        style={{ width: "100%", maxWidth: 1450 }}
        className={!loggedIn ? classes.toolbar : ""}
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
        <NotifsList
          markNotificationsRead={markNotificationsRead}
          isNotifsMenuOpen={isNotifsMenuOpen}
          notifsAnchorEl={notifsAnchorEl}
          isNotifsMenuOpen={isNotifsMenuOpen}
          unreadCount={unreadNotifsCount}
          notifications={notifications}
          handleNotifsMenuClose={handleNotifsMenuClose}
        />
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
                <NotifsBadge unreadCount={unreadNotifsCount} />
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
  unreadNotifsCount: state.user.unreadNotifsCount,
});
const mapDispatchToProps = (dispatch) => ({
  markNotificationsRead: (all) =>
    dispatch(ActionCreators.markNotificationsReadStart(all)),
});
export default connect(mapStateToProps, mapDispatchToProps)(memo(SiteNav));
