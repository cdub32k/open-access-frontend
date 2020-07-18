import React, { useEffect, memo } from "react";
import { ActionCreators } from "../actions";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  container: {
    width: "100%",
    maxWidth: 888,
    minHeight: 1200,
    padding: 12,
    paddingTop: 0,
  },
  link: {
    display: "flex",
    alignItems: "center",
  },
  header: {
    margin: 12,
    marginBottom: 36,
  },
  userContainer: {
    margin: 12,
  },
  avatar: {
    width: 98,
    height: 98,
    marginRight: 16,
  },
  previewText: {
    height: 32,
    width: 200,
    animation: "pulse-dark 1.5s infinite",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
}));

const UserList = ({ getAllUsernames, users, loading }) => {
  const classes = useStyles();

  useEffect(() => {
    getAllUsernames();
  }, []);

  return (
    <div className={classes.container}>
      <Typography className={classes.header} variant="h4">
        Members
      </Typography>
      {loading &&
        Array.from({ length: 12 }).map((preview, i) => {
          return (
            <div className={classes.userContainer} key={i}>
              <span className={classes.link}>
                <Avatar src={null} className={classes.avatar} />
                <Typography
                  variant="subtitle1"
                  className={classes.previewText}
                ></Typography>
              </span>
            </div>
          );
        })}
      {users.map((user) => {
        return (
          <div className={classes.userContainer} key={user.username}>
            <Link className={classes.link} to={`/profile/${user.username}`}>
              <Avatar src={user.smallPic} className={classes.avatar} />
              <Typography variant="subtitle1">@{user.username}</Typography>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

const mapStateToProps = (state) => ({
  loading: state.user.loading,
  users: state.user.all,
});

const mapDispatchToProps = (dispatch) => ({
  getAllUsernames: () => dispatch(ActionCreators.getAllUsernames()),
});

export default connect(mapStateToProps, mapDispatchToProps)(memo(UserList));
