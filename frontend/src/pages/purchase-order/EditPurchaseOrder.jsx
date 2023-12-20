import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Container, Card } from "@mui/material";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import DataTable from "../../components/table/DataTable";
import AutoComplete from "../../components/AutoComplete";
import Joi from "joi";
import validateServices from "../../helper/validateServices";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmBox from "../../components/ConfirmBox";
import purchaseServices from "../../services/purchaseServices";
import { routes } from "../../helper/routes";
import Status from "../work-order/enum";
import Breadcrumbs from "../../components/Breadcrumbs";

const EditPurchaseOrder = () => {
  let { id } = useParams();
  let navigate = useNavigate();

  const { purchaseList, inventory } = useSelector((state) => state);
  const [description, setDescription] = useState("");
  const [purchaseInput, setPurchaseInput] = useState({
    purchaseNumber: "",
    partNumber: "",
    quantity: "",
    status: "",
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [purchasedItems, setPurchasedItems] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [errors, setErrors] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const columns = [
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
    },
    { path: "quantity", label: "Quantity" },
    {
      path: "Edit",
      label: "Actions",
      nonExportable: true,
      columnStyle: { width: "5%" },
      content: useCallback(
        (role) => {
          return (
            <div>
              <IconButton
                onClick={() => {
                  setShowConfirm(true);
                  setSelectedId(role.partNumber);
                }}
              >
                <DeleteIcon color="error" />
              </IconButton>
            </div>
          );
        },
        [selectedId]
      ),
    },
  ];

  const product = useMemo(() => {
    let matchPurchase = purchaseList.find((purchase) => purchase._id === id);
    if (matchPurchase) {
      setPurchaseInput({
        ...matchPurchase,
      });
      setDescription(matchPurchase.description);
      let newPurchaseList = matchPurchase.items.map((index) => ({
        partNumber: index.partNumber,
        quantity: index.quantity,
      }));
      setPurchasedItems(newPurchaseList);
    }
    return matchPurchase;
  }, [id, purchaseList]);

  //schema

  const schema = () => ({
    partNumber: Joi.string().required().label("Part Number"),
    quantity: Joi.number().integer().min(1).required().label("Quantity"),
  });

  const handleChange = ({ target: { value, name } }, option) => {
    const newData = { ...purchaseInput };
    if (name === "partNumber") {
      newData.partNumber = option ? option.partNumber : "";
      //newData.partDescription = option ? option.partDescription : "";
    } else {
      newData[name] = value;
      setErrors("");
    }
    if (option || name === "partNumber") {
      setSelectedOption(option);
    }

    if (option) setSelectedOption(option);
    setPurchaseInput(newData);
  };

  const getCustomOption = (option) => {
    return {
      id: option?._id,
      label: option
        ? option?.partNumber +
          (option?.partDescription ? "-" + option?.partDescription : "")
        : "",
    };
  };

  const groupedProductData = useMemo(() => {
    let result = [];
    let obj = {};
    let filtered = [inventory];

    let flattenedFiltered = filtered.flat();

    flattenedFiltered.forEach((item) => {
      if (item) {
        const currentItem = item;
        if (!obj[currentItem.partNumber]) {
          obj[currentItem.partNumber] = {
            id: item.partNumber,
            partNumber: currentItem.partNumber ? currentItem.partNumber : null,
            quantity: 0,
            partDescription: currentItem.partDescription,
          };
          return result.push(obj[currentItem.partNumber]);
        }

        obj[currentItem.partNumber].quantity += Number(currentItem.quantity);
      }
    });

    return result;
  }, [inventory]);

  const handleAdd = () => {
    const newData = purchasedItems;

    let validateForm = validateServices.validateForm(purchaseInput, schema());
    if (validateForm) {
      setErrors(validateForm);
    } else if (purchaseInput.partNumber && purchaseInput.quantity) {
      let found = newData.find(
        (f) => f.partNumber === purchaseInput.partNumber
      );
      if (found) {
        found.quantity += Number(purchaseInput.quantity);
      } else {
        newData.push({
          partNumber: purchaseInput.partNumber,
          quantity: Number(purchaseInput.quantity),
        });
      }

      setPurchasedItems(newData);
      setSelectedOption(null);
      setPurchaseInput({
        purchaseNumber: purchaseInput.purchaseNumber,
        quantity: "",
        status: purchaseInput.status,
      });
      setDescription("");
    }
  };

  // cancel modal
  const onCancel = () => {
    setShowConfirm(false);
    setSelectedId("");
  };

  // To delete purchased items
  const onDeletePurchasedItems = () => {
    let filterItem = purchasedItems.filter(
      (items) => items.partNumber !== selectedId
    );

    setPurchasedItems(filterItem);

    onCancel();
  };

  // To Approve purchase order
  const approvePurchasedOrder = async () => {
    setIsLoading(true);
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
    setIsLoading(false);
  };

  // to save edit changes;
  const handleSave = async () => {
    const updateItem = await purchaseServices.updatePurchaseList({
      description,
      items: purchasedItems,
      _id: product._id,
    });
    if (updateItem) {
      navigate(routes.purchaseOrders);
    }
  };

  return (
    <div className="d-grid m-3 gap-3 mb-2">
      <div className="px-3 py-2 d-flex justify-content-between">
        <h3 className="breadCrumbsHeader boldFont">Edit Purchase Order</h3>
        <Breadcrumbs
          options={[
            {
              name: "Edit Purchase Order",
              pathName: routes.inventory,
            },
          ]}
          activePath={routes.inventory}
        />
      </div>
      <Container maxWidth="xxl">
        <Card className="p-2 shadow-sm">
          <ConfirmBox
            onCancel={onCancel}
            onAgree={onDeletePurchasedItems}
            showConfirm={showConfirm}
            content={"Are you sure want to delete"}
            title={"Delete"}
          />
          <div className="d-flex m-2 gap-2">
            <Input
              name="purchaseNumber"
              disabled={true}
              label="Purchase Order Number"
              value={purchaseInput?.purchaseNumber}
              required
            />
            <Input
              name="description"
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Input
              name="status"
              label="Status"
              disabled={true}
              value={Status.purchaseOrderStatus[purchaseInput.status]}
              required
            />
            <Button
              name="save"
              onClick={handleSave}
              isLoading={isLoading}
              disabled={
                purchaseInput.status === 1 || purchasedItems.length === 0
              }
            />
            <Button
              name={"Approve"}
              disabled={
                purchaseInput.status === 1 || purchasedItems.length === 0
                  ? true
                  : false
              }
              isLoading={isLoading}
              onClick={approvePurchasedOrder}
            />
          </div>
        </Card>
      </Container>
      <Container maxWidth="xxl">
        <Card className="shadow-sm d-grid gap-3 p-3">
          <div className="d-flex gap-2 align-items-start">
            <div className="d-grid gap-1">
              <AutoComplete
                options={groupedProductData}
                name="partNumber"
                label="Part Number"
                onChange={handleChange}
                getCustomOption={getCustomOption}
                value={selectedOption}
                error={errors.partNumber}
              />
            </div>
            <Input
              style={{ minWidth: 300 }}
              name="quantity"
              label="Quantity"
              onChange={handleChange}
              value={purchaseInput.quantity || ""}
              error={errors.quantity}
              required
            />
            <div className="d-flex gap-2 justify-content-end">
              <Button
                name="add"
                disabled={purchaseInput.status === 1}
                onClick={handleAdd}
              />
            </div>
          </div>
          <DataTable
            rows={purchasedItems}
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
        </Card>
      </Container>
    </div>
  );
};

export default EditPurchaseOrder;
