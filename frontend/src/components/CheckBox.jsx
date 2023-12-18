import * as React from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

export default function CheckBox({
  label,
  value,
  name,
  isChecked,
  onChange,
  ...rest
}) {
  return (
    <span>
      {label ? (
        <FormControlLabel
          control={
            <Checkbox
              {...rest}
              checked={!!isChecked}
              value={value}
              name={name}
              onChange={onChange}
            />
          }
          label={label}
        />
      ) : (
        <Checkbox
          {...rest}
          style={{ padding: "0px", width: "20px" }}
          checked={!!isChecked}
          value={value}
          name={name}
          onChange={onChange}
        />
      )}
    </span>
  );
}
