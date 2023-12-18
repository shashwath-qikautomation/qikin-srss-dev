import React, { useEffect, useMemo, useState, useCallback } from "react";
import Delete from "@mui/icons-material/Delete";
import { Card, IconButton } from "@mui/material";
import { Container } from "@mui/system";
import Joi from "joi";
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import AutoComplete from "../../components/AutoComplete";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import DataTable from "../../components/table/DataTable";
import Input from "../../components/Input";
import ApproveWorkOrder from "./approveWorkOrder";
import inventoryServices from "../../services/inventoryServices";
import Status from "./enum";
import {
  updateInventory,
  updateBOMList,
  updateWorkOrder,
} from "../../redux/action/index";
import bomServices from "../../services/BOMservices";
import { routes } from "../../helper/routes";
import validateServices from "../../services/validateServices";
import workOrderServices from "../../services/workOrderServices";
import Breadcrumbs from "../../components/Breadcrumbs";

function EditWorkOrder() {
  const { id } = useParams();
  const { inventory, products, workOrders } = useSelector((state) => state);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isPageLoading, togglePageLoading] = useState();
  const [isLoading, toggleLoading] = useState(false);
  const [workList, setWorkList] = useState([]);
  const [filteredWorkOrder, setFilteredWorkOrder] = useState([]);
  const [description, setDescription] = useState("");
  const [data, setData] = useState({
    workOrderNumber: "",
    partNumber: "",
    quantity: "",
    status: "",
  });

  const [selectedOption, setSelectedOption] = useState(null);
  const [productItems, setProductItems] = useState([]);
  const [showAllPartNumbers, toggleShowAllPartNumbers] = useState(false);
  const [selectedInventoryForModal, setSelectedInventoryForModal] =
    useState(null);

  const [errors, setErrors] = useState("");
  const [sortColumn, setSortColumn] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showWorkOrder, setShowWorkOrder] = useState(false);
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
      content: (item) => {
        return <div>{item.partNumber}</div>;
      },
    },
    { path: "quantity", label: "Quantity" },
    {
      path: "delete",
      label: "Actions",
      content: (item) => (
        <IconButton
          onClick={() => {
            onItemDelete(item);
          }}
        >
          <Delete color="error" />
        </IconButton>
      ),
      columnStyle: { width: "5%" },
    },
  ];

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

  const product = useMemo(() => {
    const matchedOrder = workOrders.find((f) => f._id === id);
    console.log(matchedOrder);
    if (matchedOrder) {
      setData({
        ...matchedOrder,
      });
      setDescription(matchedOrder.description);
      let newWorkList = matchedOrder.items.map((m) => ({
        partNumber: m.partNumber,
        quantity: m.quantity,
      }));
      setProductItems(newWorkList);
      setFilteredWorkOrder(newWorkList);
    } else {
      console.error("No matched order found for ID:", id);
    }
    return matchedOrder;
  }, [id, workOrders]);

  const schema = () => ({
    partNumber: Joi.string().required().label("Part Number"),
    quantity: Joi.number().integer().min(1).required().label("Quantity"),
  });

  const onItemDelete = (item) => {
    let newProductItems = [...productItems];
    console.log(newProductItems);
    newProductItems = newProductItems.filter(
      (f) => f.partNumber !== item.partNumber
    );
    console.log(newProductItems);
    setProductItems(newProductItems);
  };

  const getData = useCallback(async () => {
    togglePageLoading(true);
    const [inventoryData, productData, workOrderData] = await Promise.all([
      inventoryServices.getInventory(),
      bomServices.getBOMList(),
      workOrderServices.getWorkOrders(),
    ]);

    dispatch(updateInventory(inventoryData));
    dispatch(updateWorkOrder(workOrderData));
    dispatch(updateBOMList(productData));

    togglePageLoading(false);
  }, [dispatch]);

  useEffect(() => {
    getData();
  }, [id]);

  const handleModalClose = useCallback(() => {
    setShowWorkOrder(false);
  }, []);

  const handleChange = (e, option) => {
    const { value, name } = e.target;
    const newData = { ...data };
    if (name === "partNumber") {
      newData.partNumber = option ? option.partNumber : "";
      newData.description = option ? option.description : "";
    } else {
      newData[name] = value;
      setErrors("");
    }
    if (option) {
      setSelectedOption(option);
    }
    setData(newData);
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

  const onApproveWorkOrder = async () => {
    let isInventorySufficient = true;

    productItems.forEach((item) => {
      const availableQuantity = getAvailableQuantity(item.partNumber);
      if (availableQuantity < item.quantity) {
        isInventorySufficient = false;
      }
    });

    if (product) {
      if (isInventorySufficient) {
        const updatePromises = [];
        const updatedWorkOrders = {
          description,
          items: product.items,
          _id: product._id,
        };
        updatedWorkOrders.status = 1;
        const workOrderUpdated = await workOrderServices.updateWorkOrder(
          updatedWorkOrders
        );
        updatePromises.push(workOrderUpdated);
        console.log(workOrderUpdated);
        if (updatePromises) {
          navigateToWorkOrder();
        } else {
        }
      } else {
        setShowWorkOrder(true);
      }
    }
  };

  const navigateToWorkOrder = () => {
    navigate(routes.workOrders);
  };

  const groupedProductData = useMemo(() => {
    let result = [];
    let obj = {};
    let filtered = [inventory];

    let flattenedFiltered = filtered.flat();
    if (showAllPartNumbers) {
      let groupedProductItems = {};
      if (products) {
        groupedProductItems = _.groupBy(products, "partNumber");
      }
    }
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
    let newData = [...productItems];
    let validateForm = validateServices.validateForm(data, schema());
    if (validateForm) {
      setErrors(validateForm);
    } else if (data.partNumber && data.quantity) {
      let found = newData.find((f) => f.partNumber === data.partNumber);

      if (found) {
        found.quantity += Number(data.quantity);
      } else {
        newData.push({
          partNumber: data.partNumber,
          quantity: Number(data.quantity),
        });
      }

      setProductItems(newData);
      setData({ ...data, quantity: "", partNumber: "", status: data.status });
      setDescription(description);
      console.log(productItems);
      setSelectedOption(null);
      setErrors("");
    }
  };

  // to save edit changes;
  const handleSave = async () => {
    const updateItem = await workOrderServices.updateWorkOrder({
      description,
      items: productItems,
      _id: product._id,
    });
    if (updateItem) {
      navigate(routes.workOrders);
    }
  };

  return (
    <div className="d-grid gap-2 m-2">
      <div className="px-3 py-2 d-flex justify-content-between">
        <h3 className="breadCrumbsHeader boldFont">Edit Work Order</h3>
        <Breadcrumbs
          options={[
            {
              name: "Edit Work Order",
              pathName: routes.inventory,
            },
          ]}
          activePath={routes.inventory}
        />
      </div>
      <div className=" px-2  d-flex justify-content-between"></div>
      <Container maxWidth="xxl">
        <Card className="shadow-sm d-grid gap-3 p-3">
          <div className="d-grid gap-3">
            <div className="d-flex gap-2 align-items-start">
              <Card>
                <div className="d-flex gap-2 m-2">
                  <Input
                    name="workOrderNumber"
                    label="Work Order Number"
                    value={data.workOrderNumber}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                  <Input
                    name="status"
                    label="Status"
                    value={Status.workOrderStatus[data.status] || ""}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                  <Input
                    name="description"
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </div>
              </Card>
              <div className="d-grid gap-2 mt-2">
                <Button
                  name="Approve"
                  disabled={data.status === 1 ? true : false}
                  onClick={() => onApproveWorkOrder(null)}
                />
              </div>
            </div>
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
              label="quantity"
              onChange={handleChange}
              value={data.quantity || ""}
              error={errors.quantity}
              required
            />
            <div className="d-flex gap-2 justify-content-end">
              <Button
                name="add"
                disabled={data.status === 1}
                onClick={handleAdd}
              />
            </div>
          </div>
          <DataTable
            rows={productItems}
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
          <div className="modal-btn d-flex justify-content-end">
            <Button
              name="save"
              onClick={handleSave}
              isLoading={isLoading}
              disabled={data.status === 1}
            />
          </div>
        </Card>
        {showWorkOrder && (
          <Modal onClose={handleModalClose} title="">
            <ApproveWorkOrder
              handleModalClose={handleModalClose}
              productItems={productItems}
            />
          </Modal>
        )}
      </Container>
    </div>
  );
}

export default EditWorkOrder;
