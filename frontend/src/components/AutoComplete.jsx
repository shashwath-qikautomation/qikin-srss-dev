import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { FormControl, FormHelperText } from "@mui/material";

export default function AutoComplete({
  name,
  value,
  label,
  onChange,
  options = [],
  error,
  required,
  onBlur = () => {},
  fullWidth,
  getCustomOption,
  disabled,
  size = "small",
  renderOption,
  ...rest
}) {
  const searchOption = () => {
    let found = options.find((f) => f.id === value);
    return found ? found : value;
  };

  return (
    <div>
      <FormControl
        sx={{ minWidth: 300 }}
        error={Boolean(error)}
        fullWidth
        size={size}
      >
        <Autocomplete
          {...rest}
          size={size}
          options={options}
          value={value && typeof value === "string" ? searchOption() : value}
          onChange={(e, option) => {
            onChange(
              {
                target: { name, value: option?.id ? option.id : "" },
              },
              option
            );
          }}
          getOptionLabel={(option) =>
            getCustomOption ? getCustomOption(option).label : option.label
          }
          onBlur={onBlur}
          name={name}
          autoComplete
          includeInputInList
          required={required}
          fullWidth={Boolean(fullWidth)}
          disabled={disabled}
          renderInput={(params) => (
            <TextField
              value={value}
              label={label}
              InputLabelProps={{ style: { fontSize: 13 } }}
              variant="outlined"
              {...params}
            />
          )}
        />
        {error && <FormHelperText>{error}</FormHelperText>}
      </FormControl>
    </div>
  );
}
