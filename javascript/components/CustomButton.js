import React, { memo } from "react";
import FormHelperText from "@material-ui/core/FormHelperText";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  button: {
    padding: 8,
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
    margin: 12,
    maxWidth: 225,
    minWidth: 92,
    color: theme.palette.text.light,
  },
  disabled: {
    backgroundColor: theme.palette.dark.light,
  },
  icon: {
    display: "inline",
  },
}));

const CustomButton = ({ onClick, text, Icon, className, ...rest }) => {
  const classes = useStyles();
  if (Icon)
    return (
      <IconButton
        className={`${classes.icon} ${className}`}
        color="primary"
        onClick={onClick}
        disableRipple
        {...rest}
      >
        <Icon />
      </IconButton>
    );
  return (
    <Button
      classes={{
        root: `${classes.button} ${className}`,
        disabled: `${classes.disabled}`,
      }}
      onClick={onClick}
      variant="contained"
      color="primary"
      size="large"
      {...rest}
    >
      {text}
    </Button>
  );
};

export default memo(CustomButton);
