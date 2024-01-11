import React, { useCallback, useState, useEffect, useMemo } from "react";
import Joi from "joi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Input";
import inventoryServices from "../../services/inventoryServices";
import Button from "../../components/Button";
import validateServices from "../../helper/validateServices";
import { updateInventory } from "../../redux/action/index";
import DataTable from "../../components/table/DataTable";
import { routes } from "../../helper/routes";
import purchaseServices from "../../services/purchaseServices";

function ApprovePurchaseOrder({
  handleModalClose,
  purchasedItems,
  purchaseInput,
  description,
  product,
  setShowWorkOrder,
  disabled,
  approveDisabled,
  id,
}) {
  console.log(purchasedItems);

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
      label: "Part Number",
      content: useCallback((workOrder, i) => {
        return (
          <div>
            <p>{workOrder.partNumber}</p>
          </div>
        );
      }),
    },

    {
      path: "quantity",
      label: "Purchased Quantity",
      content: useCallback((purchase, i) => {
        return (
          <div>
            {" "}
            <p>{purchase.quantity}</p>
          </div>
        );
      }),
    },
    {
      path: "Available Quantity",
      label: "Available Quantity",
      content: useCallback((inventory, i) => {
        return (
          <div>
            {" "}
            <p>{inventory.availableQuantity || 0}</p>
          </div>
        );
      }),
    },
  ];

  const calculateAvailableQuantity = useCallback(
    (partNumber) => {
      const inventoryItem = inventory.find(
        (item) => item.partNumber === partNumber
      );
      if (inventoryItem) {
        return inventoryItem.quantity;
      }
      return 0;
    },
    [inventory]
  );

  const productData = useMemo(() => {
    return purchasedItems.map((item) => {
      const availableQuantity = calculateAvailableQuantity(item.partNumber);
      return {
        ...item,
        availableQuantity,
      };
    });
  }, [purchasedItems]);

  const getAvailableQuantity = (partNumber) => {
    console.log(partNumber);

    const inventoryItem = inventory.find(
      (item) => item.partNumber === partNumber
    );
    console.log(inventoryItem);
    if (inventoryItem) {
      return inventoryItem.quantity;
    }

    return 0;
  };

  const navigateToWorkOrder = () => {
    navigate(routes.purchaseOrders);
  };

  const onApprove = async () => {
    if (id) {
      let targetItem = purchaseInput;
      targetItem.status = 1;

      let updated = await purchaseServices.updatePurchaseList({
        ...targetItem,
        _id: targetItem._id,
      });

      if (updated) {
        navigate(routes.purchaseOrders);
      }
    }
  };

  return (
    <div className="d-grid gap-2 p-2">
      <div className="d-flex gap-2 justify-content-end">
        <Button
          name="Approve"
          disabled={
            purchaseInput.status === 1 || purchasedItems.length === 0
              ? true
              : false
          }
          onClick={onApprove}
        />
      </div>
      <div className="d-grid gap-2 p-2">
        <DataTable
          rows={productData}
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

export default ApprovePurchaseOrder;
