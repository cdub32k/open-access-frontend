import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { ActionCreators } from "../actions";

const Logout = ({ logout }) => {
  useEffect(() => {
    logout();
  }, []);

  return <Redirect to="/" />;
};

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(ActionCreators.logout()),
});

export default connect(null, mapDispatchToProps)(Logout);
