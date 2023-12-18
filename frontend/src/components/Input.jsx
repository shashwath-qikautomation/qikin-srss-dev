import React from "react";
import TextField from "@mui/material/TextField";

const Input = React.forwardRef((props, ref) => {
  const {
    name,
    label,
    error,
    type = "text",
    hintText,
    onKeyPress = () => {},
    required,
    fullWidth,
    onBlur = () => {},
    disabled,
    inputAdornment,
    ...rest
  } = props;

  return (
    <TextField
      {...rest}
      style={{ minWidth: "200px" }}
      label={label}
      size="small"
      name={name}
      InputProps={{
        style: { fontSize: 13 },
        endAdornment: inputAdornment, // Use the inputAdornment prop here
      }}
      fullWidth={fullWidth}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.currentTarget.blur();
          onKeyPress(e);
        }
      }}
      disabled={Boolean(disabled)}
      onBlur={onBlur}
      type={type}
      error={Boolean(error)}
      required={required}
      InputLabelProps={{
        style: { fontSize: 13 },
      }}
      helperText={error}
      inputRef={ref}
      autoComplete="off"
    />
  );
});

export default Input;
