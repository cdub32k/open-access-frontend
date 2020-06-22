import React, { useState, useEffect, memo } from "react";
import { Redirect } from "react-router-dom";

import SearchIcon from "@material-ui/icons/Search";
import { makeStyles } from "@material-ui/core/styles";

import CustomInput from "./CustomInput";
import CustomButton from "./CustomButton";

import { parseHashtags, removeHashtags } from "../utils/helpers";

const useStyles = makeStyles((theme) => ({
  container: {
    height: 40,
    display: "flex",
    justifyContent: "center",
    flexGrow: 1,
  },
  input: {
    width: "100%",
    "& div": { borderRadius: "4px 0 0 4px", borderRight: 0 },
    flexGrow: 1,
  },
  button: {
    padding: 0,
    borderRadius: 0,
    height: 40,
    width: 60,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.light.main,
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
      color: theme.palette.light.dark,
    },
  },
}));

const SearchBar = (props) => {
  useEffect(() => {
    setRedirect(false);
  });
  const classes = useStyles();
  const [redirect, setRedirect] = useState(false);

  const [query, setQuery] = useState("");

  if (redirect) {
    let link = "/search?";
    let tags = parseHashtags(query);
    let s = null;
    let h = null;
    if (tags.length) {
      h = tags.join(",");
    }
    let terms = removeHashtags(query);
    if (terms.length) {
      s = terms.join(",");
    }
    s && (link += `s=${s}`);
    h && (link += (s ? "&" : "") + `h=${h}`);

    return <Redirect to={link} />;
  }
  return (
    <form
      className={`${classes.container} search-bar`}
      onSubmit={() => setRedirect(true)}
    >
      <CustomInput
        value={query}
        name="query"
        onChange={(e) => setQuery(e.target.value)}
        className={classes.input}
      />
      <CustomButton
        Icon={SearchIcon}
        disabled={!query}
        onClick={() => setRedirect(true)}
        className={classes.button}
      />
    </form>
  );
};

export default memo(SearchBar);
