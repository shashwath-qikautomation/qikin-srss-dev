import React, { useCallback, useState, useEffect, useMemo } from "react";
import Joi from "joi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import Input from "../../components/Input";
import inventoryServices from "../../services/inventoryServices";
import Button from "../../components/Button";
import validateServices from "../../helper/validateServices";
import { updateInventory } from "../../redux/action/index";
import ApproveWorkOrder from "./approveWorkOrder";
import DataTable from "../../components/table/DataTable";
import { routes } from "../../helper/routes";

function PurchaseOrder({ handleModalClose, productItems }) {
  const { state } = useLocation();
  const { purchaseOrderNumber, data } = state;
  console.log(purchaseOrderNumber);
  const dispatch = useDispatch();
  const { inventory } = useSelector((state) => state);
  console.log(inventory);
  const navigate = useNavigate();
  const [sortColumn, setSortColumn] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [inventoryDetails, setInventoryDetails] = useState();
  const [errors, setErrors] = useState({});
  const [isLoading, toggleLoading] = useState(false);

  const columns = [
    {
      path: "#",
      label: "#",
      content: useCallback(
        (wo, index) => <span>{currentPage * rowsPerPage + index + 1}</span>,
        [currentPage, rowsPerPage]
      ),
    },
    {
      path: "partNumber",
      label: "Purchase WorkOrder Number",
      content: useCallback((row, i) => {
        console.log(row.purchaseOrderNumber);

        return (
          <div>
            <p>{row.purchaseOrderNumber}</p>
          </div>
        );
      }),
    },

    {
      path: "quantity",
      label: "Required Quantity",
      content: useCallback((inventory, i) => {
        return (
          <div>
            {" "}
            <p>{inventory.quantity}</p>
          </div>
        );
      }),
    },
    {
      path: "Available Quantity",
      label: "Status",
      content: useCallback((workOrder, i) => {
        return (
          <div>
            {" "}
            <p>{workOrder.availableQuantity || "-"}</p>
          </div>
        );
      }),
    },
  ];

  //   const calculateAvailableQuantity = useCallback(
  //     (partNumber) => {
  //       const inventoryItem = inventory.find(
  //         (item) => item.partNumber === partNumber
  //       );
  //       if (inventoryItem) {
  //         return inventoryItem.quantity;
  //       }
  //       return 0;
  //     },
  //     [inventory]
  //   );

  //   const productData = useMemo(() => {
  //     return productItems.map((item) => {
  //       const availableQuantity = calculateAvailableQuantity(item.partNumber);
  //       return {
  //         ...item,
  //         availableQuantity,
  //       };
  //     });
  //   }, [productItems, calculateAvailableQuantity]);
  const getData = useCallback(async () => {
    toggleLoading(true);
    const inventoryData = await inventoryServices.getInventory();
    console.log(inventoryData);
    dispatch(updateInventory(inventoryData));
    toggleLoading(false);
  }, [dispatch]);

  useEffect(() => {
    getData();
  }, []);

  const getInventoryData = useCallback(async (inventory) => {
    const inventoryItem = inventory.find((item) => item.partNumber);
    console.log(inventoryItem);
    if (inventoryItem) {
      return inventoryItem.quantity;
    }
    return 0;
  });

  return (
    <div className="d-grid gap-2 p-2">
      <div className="d-flex justify-content-end">
        {/* <Button
          name={"Purchase Order"}
          onClick={() => navigate(routes.purchaseOrder)}
        /> */}
      </div>
      <div className="d-grid gap-2 p-2">
        <DataTable
          //   rows={productData.filter(
          //     (item) => item.quantity > item.availableQuantity
          //   )
          rows={[{ purchaseOrderNumber, ...data }]}
          columns={columns}
          sortColumn={sortColumn}
          sortOrder={sortOrder}
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          setSortColumn={setSortColumn}
          setSortOrder={setSortOrder}
          setCurrentPage={setCurrentPage}
          setRowsPerPage={setRowsPerPage}
        />
      </div>
    </div>
  );
}

export default PurchaseOrder;
