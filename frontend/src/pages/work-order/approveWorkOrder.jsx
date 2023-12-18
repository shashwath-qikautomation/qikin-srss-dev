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
function ApproveWorkOrder({ handleModalClose, productItems }) {
  console.log(productItems);

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
    return productItems.map((item) => {
      const availableQuantity = calculateAvailableQuantity(item.partNumber);
      return {
        ...item,
        availableQuantity,
      };
    });
  }, [productItems, calculateAvailableQuantity]);

  /* const getData = useCallback(async () => {
    toggleLoading(true);
    const inventoryData = await inventoryServices.getInventory();
    console.log(inventoryData);
    dispatch(updateInventory(inventoryData));
    toggleLoading(false);
  }, [dispatch]);

  useEffect(() => {
    getData();
  }, []);
  const generatePurchaseOrderNumber = () => {
    const uniqueId = Date.now();
    return uniqueId;
  };*/

  /*const getInventoryData = useCallback(async (inventory) => {
    const inventoryItem = inventory.find((item) => item.partNumber);
    console.log(inventoryItem);
    if (inventoryItem) {
      return inventoryItem.quantity;
    }
    return 0;
  });*/

  const handlePurchaseOrderClick = () => {
    //const newPurchaseOrderNumber = generatePurchaseOrderNumber();
    let loopProduct = productItems.map((items) => {
      return items.quantity;
    });

    let loopPartnumber = productItems.map((items) => items.partNumber);

    let loopInventory = inventory.filter((element) =>
      loopPartnumber.some((item) => item === element.partNumber)
    );

    let availableItems = loopInventory.map(
      (getquantity) => getquantity.quantity
    );

    let resltPartnumber = [];
    let resultQuantity = [];

    for (let i = 0; i < productItems.length; i++) {
      if (productItems[i].quantity > loopInventory[i].quantity) {
        resltPartnumber.push(productItems[i].partNumber);
      }
    }
    let purchasePartnumbers = resltPartnumber;

    for (let i = 0; i < loopProduct.length; i++) {
      if (loopProduct[i] > availableItems[i]) {
        resultQuantity.push(loopProduct[i] - availableItems[i]);
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

  return (
    <div className="d-grid gap-2 p-2">
      <div className="d-flex justify-content-end">
        <Button name={"Purchase Order"} onClick={handlePurchaseOrderClick} />
      </div>
      <div className="d-grid gap-2 p-2">
        <DataTable
          rows={productData.filter(
            (item) => item.quantity > item.availableQuantity
          )}
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

export default ApproveWorkOrder;
