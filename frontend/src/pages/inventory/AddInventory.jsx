import React, { useCallback, useState, useEffect, useMemo } from "react";
import Joi from "joi";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Input from "../../components/Input";
import inventoryServices from "../../services/inventoryServices";
import Button from "../../components/Button";
import validateServices from "../../helper/validateServices";
import { updateInventory } from "../../redux/action/index";

function AddInventory({ handleModalClose, selectedInventory }) {
  const dispatch = useDispatch();
  const { inventory } = useSelector((state) => state);
  const defaultValues = selectedInventory || {
    part: "",
    partNumber: "",
    quantity: "",
    partDescription: "",
    manufacture: "",
    boxNumber: "",
  };
  const [inventoryDetails, setInventoryDetails] = useState(defaultValues);
  const [errors, setErrors] = useState({});
  const [isLoading, toggleLoading] = useState(false);

  const schema = () => ({
    part: Joi.number().integer().min(1).required().label("Part"),
    partNumber: Joi.string().trim().required().label("Part Number"),
    quantity: Joi.number().integer().min(1).required().label("Quantity"),
    partDescription: Joi.string().trim().required().label("Part Description"),
    manufacture: Joi.string().trim().required().label("Manufacture"),
    boxNumber: Joi.number().integer().min(1).required().label("Box Number"),
  });

  const getData = useCallback(async () => {
    toggleLoading(true);
    const inventoryData = await inventoryServices.getInventory();
    dispatch(updateInventory(inventoryData));
    toggleLoading(false);
  }, [dispatch]);

  useEffect(() => {
    getData();
    setInventoryDetails(selectedInventory || defaultValues);
  }, [selectedInventory]);

  const onInventoryDetailsChange = useCallback(
    ({ target: { name, value } }) => {
      const updated = { ...inventoryDetails };
      updated[name] = value;
      setInventoryDetails(updated);
      setErrors("");
    },
    [inventoryDetails]
  );

  const doSubmit = useCallback(async () => {
    const validated = validateServices.validateForm(inventoryDetails, schema());
    if (!validated) {
      if (selectedInventory && selectedInventory) {
        const updated = await inventoryServices.updateInventory({
          ...inventoryDetails,
          _id: inventoryDetails._id,
        });
        if (updated) {
          handleModalClose();
        }
      } else {
        const added = await inventoryServices.upsertInventoryData(
          inventoryDetails
        );
        if (added) {
          handleModalClose();
        }
      }
    } else setErrors(validated);
  }, [inventoryDetails, handleModalClose, inventory]);

  return (
    <div className="d-grid gap-2 p-2">
      <Input
        name="part"
        label="Part"
        value={inventoryDetails.part}
        onChange={onInventoryDetailsChange}
        error={errors.part}
        required
      />
      <Input
        name="partNumber"
        label="Part Number"
        value={inventoryDetails.partNumber}
        onChange={onInventoryDetailsChange}
        error={errors.partNumber}
        required
      />
      <Input
        name="quantity"
        label="Quantity"
        value={inventoryDetails.quantity}
        onChange={onInventoryDetailsChange}
        error={errors.quantity}
        required
      />
      <Input
        name="partDescription"
        label="Part Description"
        value={inventoryDetails.partDescription}
        onChange={onInventoryDetailsChange}
        error={errors.partDescription}
      />
      <Input
        name="manufacture"
        label="Manufacture"
        value={inventoryDetails.manufacture}
        onChange={onInventoryDetailsChange}
        error={errors.manufacture}
        required
      />
      <Input
        name="boxNumber"
        label="Box Number"
        value={inventoryDetails.boxNumber}
        onChange={onInventoryDetailsChange}
        error={errors.boxNumber}
      />
      <div className="d-flex justify-content-end">
        <Button name={"Submit"} onClick={doSubmit} />
      </div>
    </div>
  );
}

export default AddInventory;
