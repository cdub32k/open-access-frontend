import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

const AuthRedirect = ({ component: Component, loggedIn, ...rest }) => {
  if (loggedIn) return <Redirect to="/feed" />;
  else return <Component {...rest} />;
};

const mapStateToProps = (state) => ({
  loggedIn: state.user.loggedIn,
});

export default connect(mapStateToProps)(AuthRedirect);
