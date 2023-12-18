import React from "react";
import "../styles/navBar.css";
import { NavLink } from "react-router-dom";
import logoW from "../assets/images/logoW.png";

import User from "./User";
import { routes } from "../helper/routes";

function NavBar() {
  return (
    <div
      className="shadow-sm sticky-top px-2"
      style={{
        backgroundColor: "#FAFAFA",
        zIndex: "98",
      }}
    >
      <div className="d-flex">
        <div className="d-flex flex-grow-1">
          <a
            href="/"
            style={{
              width: "fit-content",
            }}
            className="d-flex align-items-center"
          >
            <img src={logoW} alt="logo" height={"50"} />
          </a>
          <div className="navLinkContainer">
            <NavLink
              to={routes.inventory}
              className={({ isActive }) => {
                return `navLink ${isActive ? " activeNav " : ""}`;
              }}
            >
              {"Inventory"}
            </NavLink>
            <NavLink
              to={routes.products}
              className={({ isActive }) => {
                return `navLink ${isActive ? " activeNav " : ""}`;
              }}
            >
              {"Products"}
            </NavLink>
            <NavLink
              to={routes.workOrders}
              className={({ isActive }) => {
                return `navLink ${isActive ? " activeNav " : ""}`;
              }}
            >
              {"Work Orders"}
            </NavLink>
            <NavLink
              to={routes.purchaseOrders}
              className={({ isActive }) => {
                return `navLink ${isActive ? " activeNav " : ""}`;
              }}
            >
              {"Purchase Orders"}
            </NavLink>
            <NavLink
              to={routes.settings}
              className={({ isActive }) => {
                return `navLink ${isActive ? " activeNav " : ""}`;
              }}
            >
              {"Settings"}
            </NavLink>
          </div>
        </div>

        <div className="d-flex align-items-center">
          <User />
        </div>
      </div>
    </div>
  );
}
export default NavBar;
