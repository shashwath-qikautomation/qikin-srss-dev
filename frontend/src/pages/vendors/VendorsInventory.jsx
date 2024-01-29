import React, { useCallback, useState, useMemo, useEffect } from "react";
import { routes } from "../../helper/routes";
import Breadcrumbs from "../../components/Breadcrumbs";
import { Card, Container, InputAdornment, IconButton } from "@mui/material";
import Input from "../../components/Input";
import Delete from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DataTable from "../../components/table/DataTable";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateVendorsInventory } from "../../redux/action/index";
import vendorsServices from "../../services/vendorsInventoryServices";
import VendorData from "./VenderData";

const VendorsInventory = () => {
  const { id } = useParams();

  const [vendorInventoryItems, setVendorInventoryItems] = useState([]);

  const { vendorsInventory } = useSelector((state) => state);
  const dispatch = useDispatch();

  const getData = useCallback(async () => {
    const [vendorInventoryData] = await Promise.all([
      vendorsServices.getVendorInventory(),
    ]);

    dispatch(updateVendorsInventory(vendorInventoryData));
  }, [dispatch]);

  useEffect(() => {
    getData();
  }, [id]);

  const vendorDetails = useMemo(() => {
    const matchedDetail = vendorsInventory.find((f) => f.vendorId._id === id);

    console.log(matchedDetail);
    if (matchedDetail) {
      let newVendorList = matchedDetail.requiredQuantity.map((m) => ({
        partNumber: m.partNumber,
        quantity: m.quantity,
      }));
      setVendorInventoryItems(newVendorList);
      // setFilteredWorkOrder(newVendorList);
    } else {
      console.error("No matched order found for ID:", id);
    }
    return matchedDetail;
  }, [id, vendorsInventory]);

  return (
    <div className="d-grid gap-2 mt-2 px-2">
      <div className="px-3 py-2 d-flex justify-content-between">
        <h6 style={{ fontSize: "18px" }} className="breadCrumbsHeader boldFont">
          Vendors Inventory
        </h6>
        <Breadcrumbs
          options={[
            {
              name: "Vendors Inventory",
              pathName: routes.inventory,
            },
          ]}
          activePath={routes.inventory}
        />
      </div>
      <VendorData vendorsInventory={vendorsInventory} id={id} />
    </div>
  );
};

export default VendorsInventory;
