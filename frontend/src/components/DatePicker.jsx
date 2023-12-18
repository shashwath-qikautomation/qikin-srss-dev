import * as React from "react";

import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers";

export default function RenderDatePicker({
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
}) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MobileDatePicker
        label={label}
        value={value}
        inputFormat="DD-MM-YYYY"
        minDate={minDate}
        maxDate={maxDate}
        onChange={(newValue) => {
          if (minDate && new Date(minDate) <= new Date(newValue)) {
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
        onAccept={(newValue) => {
          onBlur({
            target: { name, value: new Date(newValue) },
          });
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            style={{ minWidth: "200px" }}
            name={name}
            required={required}
            size="small"
            InputProps={{ style: { fontSize: 13 } }}
            InputLabelProps={{ style: { fontSize: 13 } }}
            fullWidth={fullWidth}
            error={Boolean(error)}
            helperText={error}
          />
        )}
      />
    </LocalizationProvider>
  );
}
