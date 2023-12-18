import React, { useState } from "react";
import ImportBOM from "./importBOM";
import { Divider } from "@mui/material";
import AutoComplete from "../../components/AutoComplete";
import { useSelector } from "react-redux";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { onFieldChange } from "../readBOM";
import Joi from "joi";
import validateServices from "../../services/validateServices";
import { toast } from "react-toastify";
import bomServices from "../../services/BOMservices";
const UploadBOM = ({ handleCloseModal }) => {
  const [BOMData, setBOMData] = useState([]);
  const [BOMImportColumns, setBomImportColumns] = useState([]);
  const [productName, setProductName] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [errors, setErrors] = useState({});
  const { customersList } = useSelector((state) => state);
  const [BOMDataErrors, setBOMDataErrors] = useState({});

  const schema = () => ({
    productName: Joi.string().label("Part Number"),

    customerId: Joi.string().allow("").label("Customer"),
  });

  const onCustomerSelect = (e, option) => {
    setSelectedCustomer(option);
  };

  const onMissMatchFieldChange = (index, newValue, prevCol) => {
    const updatedData = onFieldChange(
      BOMImportColumns,
      BOMData,
      index,
      newValue,
      prevCol
    );
    if (updatedData) {
      setBOMData(updatedData.newBOMData);
      setBomImportColumns(updatedData.newBOMImportedColumn);
    }
  };

  const setBOMFileData = (data, col) => {
    setBOMData(data);
    setBomImportColumns(col);
    setBOMDataErrors({});
  };

  const getCustomerCustomOption = (option) => {
    return { id: option.id, label: option.customerName };
  };

  const validateBOMData = () => {
    if (!BOMData || BOMData.length === 0) {
      toast.error("Please select BOM");
      return;
    } else {
      let dataError = {};
      BOMData.forEach((m, index) => {
        if (!m.partNumber) {
          dataError[index] = "Part Number Missing";
        } else if (!m.quantity || isNaN(parseInt(m.quantity))) {
          dataError[index] = "Quantity Missing";
        } else {
          delete dataError[index];
        }
      });
      setBOMDataErrors(dataError);
      if (Object.entries(dataError).length > 0) {
        return false;
      } else {
        return true;
      }
    }
  };

  const processBOM = () => {
    let result = Array.from(
      BOMData.reduce(
        (m, { partNumber, quantity }) =>
          m.set(partNumber, (m.get(partNumber) || 0) + Number(quantity)),
        new Map()
      ),
      ([partNumber, quantity]) => ({ partNumber, quantity })
    );
    return result;
  };

  const doSubmit = async () => {
    let newProduct = { productName };

    const foundError = validateServices.validateForm(newProduct, schema());
    setErrors(foundError ? foundError : {});
    if (!foundError) {
      let noErrorFound = validateBOMData();
      if (noErrorFound) {
        const added = await bomServices.addBOMList({
          ...newProduct,
          productItems: processBOM(),
        });
        if (added) {
          handleCloseModal();
        }
      }
    }
  };

  const getRowClassName = (row, rowIndex) => {
    return BOMDataErrors[rowIndex] ? "bgRed" : "";
  };
  return (
    <div className="d-grid gap-3 m-3">
      <Input
        name="productName"
        label="product"
        value={productName}
        onChange={({ target: { value } }) => {
          setProductName(value);
        }}
        required
        error={errors.productName}
      />
      {/* <AutoComplete
        options={customersList}
        value={selectedCustomer}
        label="selectCustomer"
        name="selectCustomer"
        onChange={onCustomerSelect}
        getCustomOption={getCustomerCustomOption}
        error={errors.customerId}
      /> */}
      <Divider sx={{ backgroundColor: "grey" }} />
      <ImportBOM
        BOMData={BOMData}
        BOMImportColumns={BOMImportColumns}
        onMissMatchFieldChange={onMissMatchFieldChange}
        setBOMFileData={setBOMFileData}
        getRowClassName={getRowClassName}
        BOMDataErrors={BOMDataErrors}
      />
      <div className="d-flex justify-content-end">
        <Button name="submit" onClick={doSubmit} />
      </div>
    </div>
  );
};

export default UploadBOM;
