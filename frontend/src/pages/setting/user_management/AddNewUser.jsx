import React, { useState, useCallback, useEffect, useMemo } from "react";
import { Container, Card } from "@mui/material";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import Joi from "joi";
import RenderSelect from "../../../components/RenderSelect";
import userServices from "../../../services/userServices";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { routes } from "../../../helper/routes";
import validateServices from "../../../helper/validateServices";
import { updateRole, updateUsers } from "../../../redux/action";

const AddNewUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let { id } = useParams();

  const { userList, roleData } = useSelector((state) => state);

  useEffect(() => {
    getData();
    if (!id) {
      handleGenerate();
    }
  }, []);

  const getData = async () => {
    const data = await userServices.getRoleData();
    dispatch(updateRole(data));
  };

  const [errors, setErrors] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState({
    // Edit
    firstName: "", //roleName
    lastName: "",
    emailId: "",
    phoneNumber: "",
    role: "",
    pin: "",
    userId: " ",
  });

  let userID = 100000;
  /*const ipList = [
    { id: 1, name: "All" },
    { id: 2, name: "Selected Ip address" },
    { id: 3, name: "Range Ip address" },
  ];*/

  useMemo(() => {
    if (id) {
      let user = userList.find((user) => user._id === id);
      if (user) {
        setSelectedUser({ ...user, role: user.role._id });
      }
    }
  }, [id, userList]);

  const handleInputChange = useCallback(
    ({ target: { value, name } }) => {
      let data = { ...selectedUser };
      data[name] = value;
      setSelectedUser(data);
    },
    [selectedUser]
  );

  //Schema for Add Users
  const schema = () => ({
    firstName: Joi.string().trim().required().label("First Name"),
    lastName: Joi.string().trim().required().label("Last Name"),
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
    emailId: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .label("email Id"),
    pin: Joi.number().required().label("Pin"),
    role: Joi.string()
      .required()
      .label("Role")
      .messages({ "string.empty": "Role is required" }),
  });

  const handleSubmit = async () => {
    setIsLoading(true);

    let validateForm = validateServices.validateForm(selectedUser, schema()); //inputData

    if (validateForm) {
      setErrors(validateForm);
    } else if (
      userList.some(
        (user) => user.phoneNumber === Number(selectedUser.phoneNumber)
      ) &&
      !Boolean(id)
    ) {
      setErrors({ phoneNumber: "Phone Number already exists" });
    } else if (
      userList.some((user) => user.pin === selectedUser.pin) &&
      !Boolean(id)
    ) {
      setErrors({ pin: "Pin already exists" });
    } else if (
      userList.some((user) => user.emailId === selectedUser.emailId) &&
      !Boolean(id)
    ) {
      setErrors({ emailId: "Email Id already exists" });
    } else if (id) {
      let user = selectedUser;
      console.log(user);
      let update = await userServices.updateUsers({ ...user, id: user._id });
      if (update) {
        navigate(routes.users);
      }
    } else {
      let user = selectedUser;
      let added = await userServices.addUsers(user);
      if (added) {
        navigate(routes.users);
      }
    }
    setIsLoading(false);
  };

  // handleSubmit for Edit

  const handleGenerate = useCallback(() => {
    let userListLen = userList.length;
    let useID = Number(userListLen) + Number(userID);
    let newInputData = { ...selectedUser };
    newInputData["userId"] = useID;

    setSelectedUser(newInputData);
  }, [selectedUser]);

  return (
    <>
      <Container maxWidth="xxl m-3">
        <h3 className="breadCrumbsHeader boldFont">
          {id ? "Edit User" : "Add User"}
        </h3>
        {
          <div className="mb-5">
            <Card className="shadow-sm p-3">
              <div>
                <div className="d-flex d-grid gap-3 mb-3 m-2">
                  <Input
                    fullWidth={true}
                    disabled={true}
                    name="userID"
                    label={"User ID"}
                    value={selectedUser?.userId}
                    error={errors.userID}
                  />
                  <Input
                    fullWidth={true}
                    name="firstName"
                    label={"First Name"}
                    value={selectedUser?.firstName}
                    onChange={handleInputChange}
                    error={errors.firstName}
                    required
                  />
                  <Input
                    fullWidth={true}
                    name="lastName"
                    label={"Last Name"}
                    value={selectedUser?.lastName}
                    onChange={handleInputChange}
                    error={errors.lastName}
                    required
                  />
                </div>
                <div className=" d-flex d-grid gap-3 mb-3 m-2">
                  <Input
                    fullWidth={true}
                    name="phoneNumber"
                    label={"Phone Number"}
                    value={selectedUser?.phoneNumber}
                    onChange={handleInputChange}
                    error={errors.phoneNumber}
                    required
                  />
                  <Input
                    fullWidth={true}
                    name="emailId"
                    label={"Email Id"}
                    value={selectedUser?.emailId}
                    onChange={handleInputChange}
                    error={errors.emailId}
                    required
                  />
                </div>
                <div className="d-flex d-grid gap-3 mb-3  m-2">
                  <Input
                    fullWidth={true}
                    name="pin"
                    label={"Pin"}
                    value={selectedUser?.pin}
                    error={errors.pin}
                    onChange={handleInputChange}
                    required
                  />
                  <RenderSelect
                    fullWidth={true}
                    name="role"
                    label="Role"
                    value={selectedUser?.role}
                    options={roleData}
                    onChange={handleInputChange}
                    error={errors.role}
                    required
                  />
                </div>
                <div className="mb-2 d-grid gap-2 m-2 justify-content-md-end">
                  <Button
                    name={"Submit"}
                    onClick={handleSubmit}
                    isLoading={isLoading}
                  ></Button>
                </div>
              </div>
            </Card>
          </div>
        }
      </Container>
    </>
  );
};

export default AddNewUser;
