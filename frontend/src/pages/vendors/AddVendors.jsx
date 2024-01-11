import React, { useCallback, useState, useEffect, useMemo } from "react";
import Joi from "joi";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Input from "../../components/Input";
import Button from "../../components/Button";
import { updateInventory, updateVendors } from "../../redux/action/index";
import validateServices from "../../services/validateServices";
import vendorsServices from "../../services/vendorsInventoryServices";

function AddVendors({ handleModalClose, selectedVendor }) {
  const dispatch = useDispatch();
  const { vendorsList } = useSelector((state) => state);
  const defaultValues = selectedVendor || {
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
  };
  const [vendorsInventoryDetails, setVendorsInventoryDetails] =
    useState(defaultValues);
  const [errors, setErrors] = useState({});
  const [isLoading, toggleLoading] = useState(false);

  const schema = () => ({
    name: Joi.string().trim().required().label("Name"),
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .label("email"),
    phoneNumber: Joi.number()
      .integer()
      .min(10 ** 9)
      .max(10 ** 10 - 1)
      .required()
      .label("Phone Number")
      .messages({
        "number.min": "Phone number should be 10 digit.",
        "number.max": "Phone number should be 10 digit",
      }),
    address: Joi.string().trim().required().label("Address"),
  });

  const onVendorsInventoryChange = useCallback(
    ({ target: { name, value } }) => {
      const updated = { ...vendorsInventoryDetails };
      updated[name] = value;
      setVendorsInventoryDetails(updated);
      setErrors("");
    },
    [vendorsInventoryDetails]
  );

  const doSubmit = useCallback(async () => {
    const validated = validateServices.validateForm(
      vendorsInventoryDetails,
      schema()
    );
    if (validated) {
      setErrors(validated);
    } else {
      let checkMail = vendorsList.filter(
        (vendor) => vendor.email === vendorsInventoryDetails.email
      );
      if (checkMail.length > 0) {
        setErrors({ email: "EmailId already exists" });
      } else {
        if (selectedVendor && selectedVendor) {
          const updated = await vendorsServices.updateVendors({
            ...vendorsInventoryDetails,
            _id: vendorsInventoryDetails._id,
          });
          if (updated) {
            handleModalClose();
          }
        } else {
          const added = await vendorsServices.addVendors(
            vendorsInventoryDetails
          );
          if (added) {
            handleModalClose();
          }
        }
      }
    }
  }, [vendorsInventoryDetails, handleModalClose]);

  return (
    <div className="d-grid gap-2 p-2">
      <Input
        name="name"
        label="Name"
        value={vendorsInventoryDetails.name}
        onChange={onVendorsInventoryChange}
        error={errors.name}
        required
      />
      <Input
        name="email"
        label="Email"
        value={vendorsInventoryDetails.email}
        onChange={onVendorsInventoryChange}
        error={errors.email}
        required
      />
      <Input
        name="phoneNumber"
        label="Phone Number"
        value={vendorsInventoryDetails.phoneNumber}
        onChange={onVendorsInventoryChange}
        error={errors.phoneNumber}
        required
      />
      <Input
        name="address"
        label="Address"
        value={vendorsInventoryDetails.address}
        onChange={onVendorsInventoryChange}
        error={errors.address}
        required
      />
      <div className="d-flex justify-content-end">
        <Button name={"Submit"} onClick={doSubmit} />
      </div>
    </div>
  );
}

export default AddVendors;
