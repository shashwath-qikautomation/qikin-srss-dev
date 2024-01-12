import React, { useState } from "react";
import AutoComplete from "../../components/AutoComplete";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { Card } from "@mui/material";
import { Container } from "@mui/system";

const VendorModal = ({
  groupedProductData,
  getCustomOption,
  venderData,
  setVenderData,
  handleAddVendor,
}) => {
  const [errors, setErrors] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);

  const handleChange = (e, option) => {
    const { value, name } = e.target;
    const newData = { ...venderData };
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
    setVenderData(newData);
  };

  return (
    <Container maxWidth="sm">
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
            value={venderData.quantity || ""}
            error={errors.quantity}
            required
          />
        </div>
        <div className="d-flex gap-2 justify-content-end">
          <Button name="Submit" onClick={handleAddVendor} />
        </div>
      </Card>
    </Container>
  );
};

export default VendorModal;
