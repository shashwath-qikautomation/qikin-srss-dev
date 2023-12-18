import * as React from "react";
import { emphasize, styled } from "@mui/material/styles";
import { Breadcrumbs as BreadCrumbs } from "@mui/material";
import Chip from "@mui/material/Chip";
import HomeIcon from "@mui/icons-material/Home";
import { useLocation, useNavigate } from "react-router-dom";

//import { useTranslation } from "react-i18next";
const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  const backgroundColor =
    theme.palette.mode === "light"
      ? theme.palette.grey[100]
      : theme.palette.grey[800];
  return {
    backgroundColor,
    height: theme.spacing(4),
    cursor: "pointer",
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    "&:hover, &:focus": {
      backgroundColor: emphasize(backgroundColor, 0.06),
    },
    "&:active": {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(backgroundColor, 0.12),
    },
  };
});

export default function Breadcrumbs({ options, activePath }) {
  const navigate = useNavigate();
  const location = useLocation();
  //const { t } = useTranslation();
  return (
    <BreadCrumbs aria-label="breadcrumb" separator=">">
      <StyledBreadcrumb
        key={"home"}
        onClick={() => {
          navigate("/");
        }}
        sx={{
          fontSize: "14px",
        }}
        label={"Home"}
        icon={<HomeIcon fontSize="small" />}
      />
      {options.map((option) => (
        <StyledBreadcrumb
          key={option.pathName}
          label={option.name}
          style={{ color: option.pathName === activePath ? "primary" : "" }}
          onClick={() => {
            option.pathName !== activePath &&
              navigate(option.pathName, { replace: true });
          }}
          sx={{
            fontWeight: location.pathname === option.pathName ? "bold" : "",
            fontSize: "14px",
          }}
        />
      ))}
    </BreadCrumbs>
  );
}
