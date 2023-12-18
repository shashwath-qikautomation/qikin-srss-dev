import React, { useCallback } from "react";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { LOGOUT } from "../redux/action";
import { routes } from "../helper/routes";

function User() {
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state);
  const dispatch = useDispatch();

  const handleOpenUserMenu = useCallback((event) => {
    setAnchorElUser(event.currentTarget);
  }, []);

  const handleCloseUserMenu = useCallback((option) => {
    setAnchorElUser(null);
  }, []);

  const onLogout = useCallback(() => {
    handleCloseUserMenu();
    dispatch({ type: LOGOUT });
    navigate(routes.login);
    localStorage.removeItem("token");
  }, [dispatch, handleCloseUserMenu, navigate]);

  return (
    <div>
      <Tooltip title={"Account"}>
        <IconButton onClick={handleOpenUserMenu} sx={{ paddingLeft: "10px" }}>
          <Avatar
            style={{ background: "var(--themeBlue)", color: "white" }}
            alt={currentUser?.firstName}
            src="/static/images/avatar/2.jpg"
          />
        </IconButton>
      </Tooltip>

      {currentUser && (
        <Menu
          style={{ marginTop: "45px" }}
          id="menu-appbar"
          anchorEl={anchorElUser}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
        >
          <div className="d-flex p-2">
            <strong>{"Login Id:"}</strong>
            <div>&nbsp;</div>
            <div>{currentUser.firstName}</div>
          </div>

          <div className="d-flex p-2">
            <strong>{"Role:"}</strong>
            <div>&nbsp;</div>
            <div>{currentUser.role}</div>
          </div>

          <Divider />

          <MenuItem key={"Logout"} onClick={onLogout}>
            <Typography color="red">{"Logout"}</Typography>
          </MenuItem>
        </Menu>
      )}
    </div>
  );
}
export default User;
