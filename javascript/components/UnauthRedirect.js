import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

const AuthRedirect = ({
  component: Component,
  loggedIn,
  loading,
  active,
  match,
  ...rest
}) => {
  if (!loggedIn) return <Redirect to="/sign-in" />;
  else if (!loading && !active && match.path !== "/pinfo")
    return <Redirect to="/pinfo" />;
  else return <Component match={match} {...rest} />;
};

const mapStateToProps = (state) => ({
  loggedIn: state.user.loggedIn,
  loading: state.user.loading,
  active: state.user.active,
});

export default connect(mapStateToProps)(AuthRedirect);
