import React, { useEffect, memo } from "react";
import { ActionCreators } from "../actions";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
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
}));

const UserList = ({ getAllUsernames, users, loading }) => {
  const classes = useStyles();

  useEffect(() => {
    getAllUsernames();
  }, []);

  return (
    <div>
      <Typography className={classes.header} variant="h4">
        Users
      </Typography>
      {loading && <CircularProgress style={{ margin: "28px 0" }} />}
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
