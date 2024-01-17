import React, { useState, useMemo } from "react";
import AutoComplete from "../../components/AutoComplete";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { Card } from "@mui/material";
import { Container } from "@mui/system";
import _ from "lodash";

const VendorModal = ({
  getCustomOption,
  venderData,
  setVenderData,
  handleAddVendor,
  workOrderItems,
  vendorErrors,
  setVendorErrors,
}) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleChange = (e, option) => {
    const { value, name } = e.target;
    const newData = { ...venderData };
    if (name === "partNumber") {
      newData.partNumber = option ? option.partNumber : "";
      newData.description = option ? option.description : "";
    } else {
      newData[name] = value;
      setVendorErrors("");
    }
    if (option) {
      setSelectedOption(option);
      setVendorErrors("");
    }
    setVenderData(newData);
  };

  const groupedWorkOrderData = useMemo(() => {
    let result = [];
    let obj = {};
    let filtered = [workOrderItems];

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
  }, [workOrderItems]);

  return (
    <Container maxWidth="sm">
      <Card className="shadow-sm d-grid gap-3 p-3">
        <div className="d-flex gap-2 align-items-start">
          <div className="d-grid gap-1">
            <AutoComplete
              options={groupedWorkOrderData}
              name="partNumber"
              label="Part Number"
              onChange={handleChange}
              getCustomOption={getCustomOption}
              value={selectedOption}
              error={vendorErrors.partNumber}
            />
          </div>
          <Input
            style={{ minWidth: 300 }}
            name="quantity"
            label="quantity"
            onChange={handleChange}
            value={venderData.quantity || ""}
            error={vendorErrors.quantity}
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
