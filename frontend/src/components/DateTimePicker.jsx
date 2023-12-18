import React from "react";
import { TextField } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";

const RenderDateTimePicker = ({
  name,
  label,
  value,
  onChange,
  required,
  onBlur = () => {},
  error,
  fullWidth,
  minDate,
  maxDate,
  readOnly,
  ...rest
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MobileDateTimePicker
        label={label}
        {...rest}
        value={value}
        minDate={minDate}
        maxDate={maxDate}
        onChange={(newValue) => {
          if (
            minDate &&
            new Date(minDate).setHours(0, 0, 0, 0) <=
              new Date(newValue).setHours(0, 0, 0, 0)
          ) {
            onChange({
              target: {
                name,
                value: new Date(newValue),
              },
            });
          } else {
            onChange({
              target: {
                name,
                value: newValue === null ? null : new Date(newValue),
              },
            });
          }
        }}
        inputFormat="DD-MM-YYYY hh:mm:ss a"
        onAccept={(newValue) => {
          onBlur({
            target: { name, value: new Date(newValue) },
          });
        }}
        readOnly={readOnly}
        renderInput={(params) => (
          <TextField
            {...params}
            style={{ minWidth: "200px" }}
            name={name}
            required={required}
            size="small"
            InputProps={{ style: { fontSize: 13 } }}
            fullWidth={fullWidth}
            InputLabelProps={{ style: { fontSize: 13 } }}
            error={Boolean(error)}
            helperText={error}
          />
        )}
      />
    </LocalizationProvider>
  );
};

export default RenderDateTimePicker;
