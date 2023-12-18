import React, { useState } from "react";
import SideNav from "./SideNav";
import Menu from "@mui/icons-material/Menu";
import "./setting.css";
import { Outlet } from "react-router-dom";

const Settings = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <div className="d-flex">
      <div className="hamburger" onClick={() => setIsNavOpen(!isNavOpen)}>
        <Menu sx={{ color: "blue" }} />
      </div>
      <div style={{ width: "300px" }} className="sideNav">
        <SideNav />
      </div>
      {isNavOpen === true ? (
        <div
          style={{ width: "300px" }}
          className={isNavOpen === true ? "actives" : isNavOpen}
        >
          <SideNav />
        </div>
      ) : (
        isNavOpen
      )}
      <Outlet />
    </div>
  );
};

export default Settings;
