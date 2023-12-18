import * as React from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import { styled } from "@mui/material/styles";

export default function Button({
  isLoading,
  onClick,
  name,
  disabled,
  fullWidth = false,
  data,
  icon,
  color = "primary",
  type = "button",
  size = "medium",
  variant = "contained",
}) {
  const ColorButton = styled(LoadingButton)(({ theme }) => ({}));
  const handleClick = React.useCallback(
    (e) => {
      onClick && onClick(e, data);
    },
    [data, onClick]
  );
  return (
    <ColorButton
      style={{ fontSize: "13px" }}
      fullWidth={fullWidth}
      onClick={handleClick}
      loading={Boolean(isLoading)}
      color={color}
      startIcon={icon}
      size={size}
      variant={variant} //inherit
      type={type}
      name={name}
      disabled={Boolean(isLoading || disabled)}
    >
      {name}
    </ColorButton>
  );
}
