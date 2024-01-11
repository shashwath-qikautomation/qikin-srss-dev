import React, { useState, useCallback } from "react";
import { Container } from "@mui/material";
import DashboardCard from "../components/card";
import InventoryIcon from "../assets/icons/inventoryIcon";
import ManufacturingIcon from "../assets/icons/ManufacturingIcon";
import SettingIcon from "../assets/icons/SettingIcon";
import ProductsIcon from "../assets/icons/ProductsIcon";
import PurchaseIcon from "../assets/icons/PurchaseIcon";
import { routes } from "../helper/routes";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  const onCardClick = useCallback(
    (path) => {
      if (path === "startMyWork") {
        setShow(true);
      } else {
        navigate(path);
      }
    },
    [navigate]
  );

  return (
    <div>
      <Container maxWidth="xxl">
        <div className=" my-4 homeCards">
          <DashboardCard path={routes.inventory} onClick={onCardClick}>
            <InventoryIcon />
            <br />
            <div className="w-75 text-break">Inventory</div>
          </DashboardCard>
          <DashboardCard path={routes.vendors} onClick={onCardClick}>
            <InventoryIcon />
            <br />
            <div className="w-75 text-break">Vendors</div>
          </DashboardCard>
          <DashboardCard path={routes.products} onClick={onCardClick}>
            <ProductsIcon />
            <br />
            Products
          </DashboardCard>
          <DashboardCard path={routes.workOrders} onClick={onCardClick}>
            <ManufacturingIcon />
            <br />
            Work Orders
          </DashboardCard>
          <DashboardCard path={routes.purchaseOrders} onClick={onCardClick}>
            <PurchaseIcon />
            <br />
            Purchase Orders
          </DashboardCard>
          <DashboardCard path={routes.settings} onClick={onCardClick}>
            <SettingIcon />
            <br />
            <div className="w-75 text-break">Settings</div>
          </DashboardCard>
        </div>
      </Container>
    </div>
  );
};

export default HomePage;
