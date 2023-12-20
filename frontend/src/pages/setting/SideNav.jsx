import React, { useState } from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { NavLink } from "react-router-dom";
import { routes } from "../../helper/routes";

const SideNav = () => {
  const [user, setUserOpen] = useState(false);

  return (
    <div
      className="fixed z-1"
      style={{
        //height: "calc(100vh - 80px)",
        height: "90vh",
        width: "480px",
        overflowY: "scroll",
        backgroundColor: "white",
        fontSize: "14px",
      }}
    >
      <List
        sx={{
          width: "100%",
          maxWidth: 560,
          bgcolor: "background.paper",
          paddingBottom: 5,
          paddingTop: 2,
        }}
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            {"Settings"}
          </ListSubheader>
        }
      >
        <ListItemButton sx={{ pl: 4 }} onClick={() => setUserOpen(!user)}>
          <ListItemText primary={"User Management"} />
          {user ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={user} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <NavLink
              to={routes.users}
              style={{
                color: "black",
                fontWeight: "700",
                marginTop: "10px",
                marginBottom: "10px",
                fontSize: "14px",
                textDecoration: "none",
              }}
            >
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemText primary={"User"} />
              </ListItemButton>
            </NavLink>
            <NavLink
              to={routes.CreateNewRole}
              style={{
                color: "black",
                fontWeight: "700",
                marginTop: "10px",
                marginBottom: "10px",
                fontSize: "14px",
                textDecoration: "none",
              }}
            >
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemText primary={"Roles"} />
              </ListItemButton>
            </NavLink>
          </List>
        </Collapse>
      </List>
    </div>
  );
};

export default SideNav;
