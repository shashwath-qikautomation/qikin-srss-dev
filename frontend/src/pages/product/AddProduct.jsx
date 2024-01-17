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
import DataTable from "../../components/table/DataTable";
import Input from "../../components/Input";
import Modal from "../../components/Modal";
import inventoryServices from "../../services/inventoryServices";
import { INVENTORY, updateBOMList } from "../../redux/action/index";
import bomServices from "../../services/BOMservices";
import { routes } from "../../helper/routes";
import validateServices from "../../services/validateServices";
import ConfirmBox from "../../components/ConfirmBox";
import Breadcrumbs from "../../components/Breadcrumbs";

function AddProduct() {
  const { id } = useParams();
  const { inventory, products } = useSelector((state) => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isPageLoading, togglePageLoading] = useState();
  const [isLoading, toggleLoading] = useState(false);
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [data, setData] = useState({
    partNumber: "",
    quantity: "",
  });

  const [selectedOption, setSelectedOption] = useState(null);
  const [productItems, setProductItems] = useState([]);
  const [showAllPartNumbers, toggleShowAllPartNumbers] = useState(false);
  const [errors, setErrors] = useState("");
  const [sortColumn, setSortColumn] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [batchItems, setShowBatchItems] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState("");

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
      content: (item) => (
        <div>
          {item
            ? item.partNumber + (item.description ? "-" + item.description : "")
            : ""}
        </div>
      ),
    },
    { path: "quantity", label: "Quantity" },
    {
      path: "delete",
      label: "Actions",
      content: useCallback(
        (item) => (
          <IconButton
            onClick={() => {
              setShowConfirm(true);
              setSelectedId(item.partNumber);
            }}
          >
            <Delete color="error" />
          </IconButton>
        ),
        [selectedId]
      ),
      columnStyle: { width: "5%" },
    },
  ];

  const schema = () => ({
    //productName: Joi.string().trim().required().label("Product"),
    //description: Joi.string().trim().required().label("Description"),
    partNumber: Joi.string().trim().required().label("Part Number"),
    quantity: Joi.number().integer().min(1).required().label("Quantity"),
  });

  const getData = useCallback(async () => {
    togglePageLoading(true);
    const [inventoryData, productData] = await Promise.all([
      inventoryServices.getInventory(),
      bomServices.getBOMList(),
    ]);

    dispatch({ type: INVENTORY, payload: inventoryData });
    dispatch(updateBOMList(productData));
    togglePageLoading(false);
  }, [dispatch]);

  useEffect(() => {
    getData();
  }, []);

  const product = useMemo(() => {
    if (id) {
      let product = products.find((f) => f._id === id);
      if (product) {
        setProductName(product.productName);
        setDescription(product.description);
        let newProductList = product.productItems.map((index) => ({
          partNumber: index.partNumber,
          quantity: index.quantity,
        }));
        setProductItems(newProductList);
        return product;
      }
    }
  }, [id, products]);

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

  const onDeleteProductItems = () => {
    let newProductItems = [...productItems];
    newProductItems = newProductItems.filter(
      (f) => f.partNumber !== selectedId
    );
    setProductItems(newProductItems);
    onCancel();
  };

  const handleChange = ({ target: { value, name } }, option) => {
    const newData = { ...data };
    if (name === "partName" && option) {
      newData.partName = option.partName;
      newData.partDescription = option.partDescription;
    } else {
      newData[name] = value;
      setErrors("");
    }
    if (option || name === "partName") {
      setSelectedOption(option);
    }

    if (option) setSelectedOption(option);
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

  // cancel modal
  const onCancel = () => {
    setShowConfirm(false);
    setSelectedId("");
  };

  const handleAdd = () => {
    const newData = [...productItems];
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
      setData({
        quantity: "",
        partNumber: "",
      });
      setSelectedOption(null);
      setProductItems(newData);
      setErrors("");
    }
  };

  const doSubmit = async () => {
    toggleLoading(true);

    if (product) {
      const updated = await bomServices.updateBOMList({
        productName,
        description,
        productItems,
        _id: product._id,
      });

      if (updated) {
        navigate(routes.products);
      }
    } else {
      const added = await bomServices.addBOMList({
        productName,
        description,
        productItems,
      });
      if (added) {
        navigate(routes.products);
      }
    }

    toggleLoading(false);
  };

  const handleCloseModal = () => {
    setShowBatchItems(false);
  };

  console.log(data);

  return (
    <div className="d-grid gap-2 mt-2">
      <div className="px-3 py-2 d-flex justify-content-between">
        <h3 className="breadCrumbsHeader boldFont">
          {product ? "Edit Product" : "Add Product"}
        </h3>
        <Breadcrumbs
          options={[
            {
              name: product ? "Edit Product" : "Add Product",
              pathName: routes.inventory,
            },
          ]}
          activePath={routes.inventory}
        />
      </div>
      <Container maxWidth="xxl">
        <Card className="shadow-sm d-grid gap-3 p-3">
          <div className="d-grid gap-3">
            <div className="d-flex gap-2 justify-content-end">
              <Button
                name="Save Product"
                onClick={doSubmit}
                disabled={productItems.length === 0 || !productName}
                isLoading={isLoading}
              />
            </div>

            <Input
              name="productName"
              label="Product"
              value={productName}
              onChange={({ target: { value } }) => {
                setProductName(value);
              }}
              required
            />
            <Input
              name="description"
              label="Description"
              value={description}
              onChange={({ target: { value } }) => {
                setDescription(value);
              }}
            />
            <div className="d-flex gap-2 align-items-start">
              <div className="d-grid gap-2">
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
                value={data.quantity}
                error={errors.quantity}
                required
              />

              <Button name="add" onClick={handleAdd} />
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
            {batchItems && (
              <Modal
                open={batchItems}
                onClose={() => handleCloseModal()}
                width={800}
                title="viewBatchItems"
              ></Modal>
            )}
          </div>
          <ConfirmBox
            onCancel={onCancel}
            onAgree={onDeleteProductItems}
            showConfirm={showConfirm}
            content={"Are you sure want to delete"}
            title={"Delete"}
          />
        </Card>
      </Container>
    </div>
  );
}

export default AddProduct;
