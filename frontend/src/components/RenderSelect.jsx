import * as React from "react";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { FormControl, FormHelperText, InputLabel } from "@mui/material";
const RenderSelect = ({
  name,
  value,
  label,
  onChange,
  options = [],
  error,
  required,
  onBlur = () => {},
  emptyOption,
  fullWidth,
  emptyOptionName = "None",
  onClick = () => {},
  checkForDisable = () => {},
  getCustomOption,
  disabled,
  ...rest
}) => {
  const onKeyPress = (e) => {
    if (e.key === "Enter") e.currentTarget.click();
  };

  return (
    <FormControl
      {...rest}
      disabled={Boolean(disabled)}
      sx={{ minWidth: 120 }}
      error={Boolean(error)}
      fullWidth={fullWidth}
      size="small"
    >
      <InputLabel
        id="select-label"
        required={Boolean(required)}
        style={{ fontSize: "13px" }}
      >
        {label}
      </InputLabel>
      <Select
        {...rest}
        labelId="select-label"
        value={value || ""}
        onChange={onChange}
        onBlur={onBlur}
        name={name}
        label={label}
        style={{ fontSize: "13px" }}
        fullWidth={fullWidth}
      >
        {emptyOption && options?.length > 0 && (
          <MenuItem key={0} value={""} onKeyDown={onKeyPress}>
            {emptyOptionName}
          </MenuItem>
        )}
        {options.map((option) => {
          option = getCustomOption ? getCustomOption(option) : option;

          return (
            <MenuItem
              onClick={() => {
                onClick(option);
              }}
              disabled={
                option.disabled ||
                checkForDisable(option.id || option.path || option._id)
              }
              selected={
                value === option.id || value === option.path || option._id
              }
              key={option.id || option.path || option._id}
              value={option.id || option.path || option._id}
              onKeyDown={onKeyPress}
            >
              {option.name || option.label}
            </MenuItem>
          );
        })}
      </Select>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};
export default RenderSelect;
