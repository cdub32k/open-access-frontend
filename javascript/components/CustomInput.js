import React, { memo } from "react";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  textarea: {
    flexGrow: 1,
    maxWidth: 600,
    width: "100%",
  },
  control: {
    flexGrow: 1,
    maxWidth: 600,
    width: "100%",
    height: 40,
  },
  textField: {
    width: "100%",
    height: 40,
  },
  multiline: {
    width: "100%",
  },
  textarea: {
    fontSize: 16,
    color: theme.palette.dark.main,
    maxWidth: 600,
  },
  input: {
    fontSize: 16,
    color: theme.palette.dark.main,
    height: 40,
    width: "100%",
    "& input": {
      padding: 14,
    },
  },
  inputLabel: {
    height: 40,
    fontSize: 16,
    color: theme.palette.dark.light,
    transform: "translate(14px, 14px) scale(1)",
  },
}));

const CustomInput = ({
  value,
  name,
  label,
  onChange,
  multiline,
  maxLength,
  ...rest
}) => {
  const classes = useStyles();
  return (
    <FormControl
      className={multiline ? classes.textareaContainer : classes.control}
      fullWidth={true}
    >
      <TextField
        autoComplete="off"
        className={multiline ? classes.multiline : classes.textField}
        InputProps={{
          className: multiline ? classes.textarea : classes.input,
        }}
        inputProps={{ maxLength }}
        InputLabelProps={{ className: classes.inputLabel }}
        variant="outlined"
        name={name}
        label={label}
        value={value}
        onChange={onChange}
        multiline={multiline}
        {...rest}
      />
    </FormControl>
  );
};

export default memo(CustomInput);
