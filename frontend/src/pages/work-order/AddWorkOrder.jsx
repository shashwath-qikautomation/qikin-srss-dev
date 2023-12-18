import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Card, Chip, Container } from "@mui/material";
import Joi from "joi";
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import DataTable from "../../components/table/DataTable";
import AutoComplete from "../../components/AutoComplete";
import validateServices from "../../services/validateServices";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { routes } from "../../helper/routes";
import { updateBOMList, updateWorkOrder } from "../../redux/action/index";
import bomServices from "../../services/BOMservices";
import workOrderServices from "../../services/workOrderServices";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmBox from "../../components/ConfirmBox";
import Breadcrumbs from "../../components/Breadcrumbs";

function AddWorkOrder() {
  const { products, workOrders } = useSelector((state) => state);
  const { id } = useParams();
  const [errors, setErrors] = useState("");
  const [selectedProductErrors, setSelectedProductErrors] = useState("");
  const navigate = useNavigate();
  const [description, setDescription] = useState("");
  const [inputData, setInputData] = useState({
    workOrderNumber: "",
    quantity: "",
    productName: "",
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [workOrderItems, setWorkOrderItems] = useState([]);
  const [isLoading, toggleLoading] = useState(false);
  const [productName, setProductName] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [workOrderId, setWorkOrderId] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const dispatch = useDispatch();

  const [workOrderName, setWorkOrderName] = useState(false);

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
      path: "productName",
      label: "Product",
      content: (item) => {
        return <div>{item.productName}</div>;
      },
    },

    { path: "quantity", label: "No of Product" },
    {
      path: "Edit",
      label: "Actions",
      nonExportable: true,
      columnStyle: { width: "1%" },
      content: useCallback(
        (item) => {
          return (
            <div className="d-flex">
              <IconButton
                onClick={() => {
                  setShowConfirm(true);
                  setWorkOrderId(item.partNumber);
                }}
              >
                <DeleteIcon color="error" />
              </IconButton>
            </div>
          );
        },
        [workOrderId]
      ),
    },
  ];

  const getData = useCallback(async () => {
    toggleLoading(true);
    const [productData, workOrderData] = await Promise.all([
      bomServices.getBOMList(),
      workOrderServices.getWorkOrders(),
    ]);

    dispatch(updateBOMList(productData));
    dispatch(updateWorkOrder(workOrderData));
    toggleLoading(false);
  }, [dispatch]);

  useEffect(() => {
    getData();
  }, []);

  const workOrder = useMemo(() => {
    if (id) {
      let product = products.find((f) => f.id === id);
      if (product) {
        setWorkOrderName(product.productName);
        setWorkOrderItems(product.productItems);
        setDescription(product.description);
        return product;
      }
    }
  }, [id, products]);

  const groupedWorkOrderData = useMemo(() => {
    let result = [];
    let seenProductNames = new Set();
    let filtered = [products];

    let flattenedFiltered = filtered.flat();

    flattenedFiltered.forEach((item) => {
      if (item && item.productName) {
        if (!seenProductNames.has(item.productName)) {
          result.push(item);

          seenProductNames.add(item.productName);
        }
      }
    });

    return result;
  }, [products]);

  const handleAdd = useCallback(() => {
    if (!selectedProduct?.productItems) return;

    const existingProduct = workOrderItems.find(
      (prod) => prod.productName === selectedProduct.productName
    );

    const quantityToProduce = inputData.quantity;

    if (existingProduct) {
      existingProduct.quantity += Number(quantityToProduce);
    } else {
      workOrderItems.push({
        productName: selectedProduct.productName,
        quantity: Number(quantityToProduce),
        productItems: selectedProduct.productItems,
      });
    }
    setInputData({
      quantity: "",
      productName: "",
    });
    setDescription(description);
    console.log(workOrderItems);
    setWorkOrderItems([...workOrderItems]);
  }, [inputData, workOrderItems]);

  const generateWorkOrderNumber = () => {
    return Date.now().toString();
  };

  const handleChange = ({ target: { value, name } }) => {
    let newInputData = { ...inputData };
    newInputData[name] = value;
    setInputData(newInputData);
  };

  const schema = () => ({
    workOrderNumber: Joi.string().required().label("WorkOrder Number"),
    quantity: Joi.number()
      .integer()
      .min(1)
      .required()
      .label("Number of Items to Produce"),

    productName: Joi.string().required().label("Select Product"),
  });

  const handleSubmit = useCallback(
    async (e) => {
      toggleLoading(true);

      let consolidatedItems = [];
      for (let product of workOrderItems) {
        console.log(workOrderItems);
        product.productItems.forEach((item) => {
          const effectiveQuantity = item.quantity * product.quantity;

          const existingItem = consolidatedItems.find(
            (consItem) => consItem.partNumber === item.partNumber
          );

          if (existingItem) {
            existingItem.quantity += effectiveQuantity;
          } else {
            consolidatedItems.push({
              workOrderNumber: item.workOrderNumber,
              partNumber: item.partNumber,
              productName: product.productName,
              quantity: effectiveQuantity,
            });
          }
        });
      }

      if (workOrder) {
        const updated = await workOrderServices.updateWorkOrder({
          id: workOrders._id,
          workOrderNumber: inputData.workOrderNumber,
          productName,
          items: consolidatedItems,
        });
        if (updated) {
          navigate(routes.workOrders);
        }
      } else {
        const added = await workOrderServices.addWorkOrder({
          workOrderNumber:
            inputData.workOrderNumber || generateWorkOrderNumber(),
          description,
          items: consolidatedItems,
        });
        console.log(added);
        if (added) {
          navigate(routes.editWorkOrder + "/" + added._id);
        }
      }

      toggleLoading(false);
    },
    [inputData]
  );

  // };
  const getCustomOptionForProduct = (option) => {
    return {
      id: option?._id,
      label: option?.productName || "",
    };
  };

  // cancel modal
  const onCancel = () => {
    setShowConfirm(false);
    setWorkOrderId("");
  };

  // To delete purchase part numbers
  const onDeletePartNumber = () => {
    let filterItem = workOrderItems.filter(
      (items) => items.partNumber !== workOrderId
    );

    setWorkOrderItems(filterItem);

    onCancel();
  };

  const onProductChange = (e, option) => {
    setSelectedProduct(option);

    setErrors("");
    setSelectedProductErrors("");
  };

  return (
    <div className="d-grid gap-2 mt-2 px-2">
      <div className="px-3 py-2 d-flex justify-content-between">
        <h3 className="breadCrumbsHeader boldFont">Add Work Order</h3>
        <Breadcrumbs
          options={[
            {
              name: "Add Work Order",
              pathName: routes.inventory,
            },
          ]}
          activePath={routes.inventory}
        />
      </div>
      <Container maxWidth="xxl">
        <Card className="shadow-sm p-2 mb-2">
          <div className="d-grid gap-3">
            <div className="d-flex gap-2 align-items-start">
              <Input
                name="workOrderNumber"
                label="Work Order Number"
                value={inputData.workOrderNumber}
                key={inputData.workOrderNumber}
                onChange={handleChange}
                error={errors.workOrderNumber}
                className="flex-grow-1"
                required
              />

              <Button
                name="Generate"
                onClick={() => {
                  let generatedNumber = generateWorkOrderNumber();
                  if (generatedNumber) {
                    setInputData({
                      ...inputData,
                      workOrderNumber: generatedNumber,
                    });
                  }
                }}
              />
            </div>
            <Input
              name="description"
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <div className="d-flex align-items-start gap-2 pb-4">
              <AutoComplete
                options={groupedWorkOrderData}
                name="selectedProduct"
                label="Select Product"
                onChange={onProductChange}
                value={selectedProduct || []}
                getCustomOption={getCustomOptionForProduct}
                error={selectedProductErrors.selectedProduct}
                required
              />

              <Input
                style={{ minWidth: 300 }}
                name="quantity"
                label="No of Product"
                onChange={handleChange}
                value={inputData.quantity}
                error={errors.quantity}
                required
              />

              <Button name="add" onClick={handleAdd} />
            </div>
          </div>

          <DataTable
            columns={columns}
            rows={workOrderItems}
            setCurrentPage={setCurrentPage}
            setRowsPerPage={setRowsPerPage}
          />
          <div className="modal-btn d-flex justify-content-end">
            <Button
              name="submit"
              disabled={workOrderItems.length === 0}
              onClick={handleSubmit}
              isLoading={isLoading}
            />
          </div>
        </Card>
      </Container>
      <ConfirmBox
        onCancel={onCancel}
        onAgree={onDeletePartNumber}
        showConfirm={showConfirm}
        content={"Are you sure want to delete"}
        title={"Delete"}
      />
    </div>
  );
}

export default AddWorkOrder;
