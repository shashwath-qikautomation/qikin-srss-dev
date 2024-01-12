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
import workOrderServices from "../../services/workOrderServices";
import Delete from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import { Container } from "@mui/system";

function ApproveWorkOrder({
  handleModalClose,
  workOrderItems,
  data,
  description,
  product,
  setShowWorkOrder,
  disabled,
  approveDisabled,
  setShowVenderField,
  vendorsItem,
}) {
  const dispatch = useDispatch();
  const { inventory } = useSelector((state) => state);
  const navigate = useNavigate();
  const [sortColumn, setSortColumn] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
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
      label: "Available Quantity",
      content: useCallback((workOrder, i) => {
        return (
          <div>
            {" "}
            <p>{workOrder.availableQuantity || 0}</p>
          </div>
        );
      }),
    },
  ];

  const vendorColumns = [
    {
      path: "#",
      label: "#",
      content: (item, index) => (
        <span>{currentPage * rowsPerPage + index + 1}</span>
      ),
      columnStyle: { width: "3%" },
    },

    {
      path: "partNumber",
      label: "Part Number",
      content: (item) => {
        return <div>{item.partNumber}</div>;
      },
    },
    { path: "vendorsQuantity", label: "Vendors Quantity" },
    {
      path: "delete",
      label: "Actions",
      content: (item) => (
        <IconButton
        // onClick={() => {
        //   onItemDelete(item);
        // }}
        >
          <Delete color="error" />
        </IconButton>
      ),
      columnStyle: { width: "5%" },
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
    return workOrderItems.map((item) => {
      const availableQuantity = calculateAvailableQuantity(item.partNumber);
      return {
        ...item,
        availableQuantity,
      };
    });
  }, [workOrderItems, calculateAvailableQuantity]);

  const handlePurchaseOrderClick = () => {
    let productQuantity = workOrderItems.map((items) => {
      return items.quantity;
    });

    let productPartnumber = workOrderItems.map((items) => items.partNumber);

    let inventoryPartnumber = inventory.filter((element) =>
      productPartnumber.some((item) => item === element.partNumber)
    );

    let availItem = workOrderItems.map((item) => {
      const availableQuantity = calculateAvailableQuantity(item.partNumber);
      return {
        ...item,
        availableQuantity,
      };
    });

    let availableItems = availItem.map(
      (getquantity) => getquantity.availableQuantity
    );

    let resultPartnumber = [];
    let resultQuantity = [];

    for (let i = 0; i < workOrderItems.length; i++) {
      if (workOrderItems[i].quantity > inventoryPartnumber[i].quantity) {
        resultPartnumber.push(workOrderItems[i].partNumber);
      }
    }
    let purchasePartnumbers = resultPartnumber;

    for (let i = 0; i < productQuantity.length; i++) {
      if (productQuantity[i] > availableItems[i]) {
        resultQuantity.push(productQuantity[i] - availableItems[i]);
      }
    }

    let shortageItems = resultQuantity;

    navigate(routes.addProducts, {
      state: {
        data: purchasePartnumbers,
        shortageQuantity: shortageItems,
      },
    });
  };

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
    navigate(routes.workOrders);
  };

  const onApprove = async () => {
    setShowVenderField(true);
    // let isInventorySufficient = true;

    // workOrderItems.forEach((item) => {
    //   const availableQuantity = getAvailableQuantity(item.partNumber);
    //   if (availableQuantity < item.quantity) {
    //     isInventorySufficient = false;
    //   }
    // });

    // if (product) {
    //   if (isInventorySufficient) {
    //     const updatePromises = [];
    //     const updatedWorkOrders = {
    //       description,
    //       items: product.items,
    //       _id: product._id,
    //     };
    //     updatedWorkOrders.status = 1;
    //     const workOrderUpdated = await workOrderServices.updateWorkOrder(
    //       updatedWorkOrders
    //     );
    //     updatePromises.push(workOrderUpdated);
    //     console.log(workOrderUpdated);
    //     if (updatePromises) {
    //       navigateToWorkOrder();
    //     } else {
    //     }
    //   } else {
    //     setShowWorkOrder(true);
    //   }
    // }
  };

  return (
    <Container maxWidth="lg">
      <div className="d-grid gap-2 p-2">
        <div className="d-flex gap-2 justify-content-end">
          <Button
            name="Approve"
            disabled={
              data.status === 1 ||
              workOrderItems.length === 0 ||
              approveDisabled
                ? true
                : false
            }
            onClick={onApprove}
          />
          <Button
            name={"Purchase Order"}
            disabled={disabled}
            onClick={handlePurchaseOrderClick}
          />
        </div>
        <div className="d-grid w-100 gap-2 p-2">
          <DataTable
            rows={vendorsItem}
            columns={vendorColumns}
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
    </Container>
  );
}

export default ApproveWorkOrder;
