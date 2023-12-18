import React, { useCallback, useState, useMemo, useEffect } from "react";
import { Card, Container } from "@mui/material";
import Button from "../../../components/Button";
import DataTable from "../../../components/table/DataTable";
import { useSelector } from "react-redux";
import Breadcrumbs from "../../../components/Breadcrumbs";
import _ from "lodash";
import Joi from "joi";
import moment from "moment";
import ConfirmBox from "../../../components/ConfirmBox";
import Modal from "../../../components/Modal";
import Input from "../../../components/Input";
import validateServices from "../../../helper/validateServices";
import userServices from "../../../services/userServices";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useDispatch } from "react-redux";
import { updateRole } from "../../../redux/action";
import { routes } from "../../../helper/routes";

const CreateNewRole = () => {
  const dispatch = useDispatch();

  const [sortColumn, setSortColumn] = useState("CreatedAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showRole, setShowRole] = useState(false); //add modal
  const [showEditRole, setShowEditRole] = useState(false); //modal for edit
  const [inputData, setInputData] = useState({
    //Input Data
    name: "",
    description: "",
    designation: "",
  });

  const [selectedRole, setSelectedRole] = useState({
    //Selected Role
    id: "",
    name: "",
    description: "",
    designation: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState("");
  const [roleId, setRoleId] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [hiddenColumns, setHiddenColumns] = useState({});

  const { roleData } = useSelector((state) => state);

  const getData = useCallback(async () => {
    const data = await userServices.getRoleData();
    dispatch(updateRole(data));
  }, [dispatch]);

  useEffect(() => {
    getData();
  }, []);

  const columns = [
    {
      path: "#",
      label: "#",
      content: useCallback((roleData, i) => {
        return <div>{i + 1}</div>;
      }, []),
    },
    { path: "name", label: "Role Name", sortable: true },
    { path: "description", label: "Description", sortable: true },

    { path: "designation", label: "Designation", sortable: true },
    {
      path: "createdAt",
      label: "Time",
      content: (product) => {
        return (
          <div>
            {moment(product.createdAt).format("DD/MM/YYYY") +
              moment(product.createdAt).format(" hh:mm a ")}
          </div>
        );
      },
      sortable: true,
    },
    {
      path: "Edit",
      label: "Actions",
      nonExportable: true,
      columnStyle: { width: "1%" },
      content: useCallback(
        (role) => {
          return (
            <div className="d-flex">
              {role.name !== "Admin" && role.name !== "Production" ? (
                <IconButton
                  onClick={() => {
                    setShowEditRole(true);
                    setSelectedRole(role);
                  }}
                >
                  <EditIcon color="primary" />
                </IconButton>
              ) : null}
              {role.name !== "Admin" && role.name !== "Production" ? (
                <IconButton
                  onClick={() => {
                    setRoleId(role._id);
                    setShowConfirm(true);
                  }}
                >
                  <DeleteIcon color="error" />
                </IconButton>
              ) : null}
            </div>
          );
        },
        [roleId, selectedRole]
      ),
    },
  ];

  const sortedRoleData = useMemo(() => {
    let sorted = [];
    if (sortColumn === "name") {
      sorted = _.orderBy(roleData, "name", sortOrder);
    } else if (sortColumn === "description") {
      sorted = _.orderBy(roleData, "description", sortOrder);
    } else if (sortColumn === "designation") {
      sorted = _.orderBy(roleData, "designation", sortOrder);
    } else if (sortColumn === "createdAt") {
      sorted = _.orderBy(roleData, "createdAt", sortOrder);
    } else {
      sorted = _.orderBy(roleData, sortColumn, sortOrder);
    }
    return sorted;
  }, [roleData, sortColumn, sortOrder]);

  const handleModalClose = () => {
    setShowRole(false);
    setShowEditRole(false);
    setInputData("");
  };

  //handlechange for Add;
  const handleChange = ({ target: { value, name } }) => {
    let newInputData = { ...inputData };
    newInputData[name] = value;
    setInputData(newInputData);
  };

  //Schema for Add Users
  const schema = () => ({
    name: Joi.string()
      .trim()
      .required()
      .label("Role Name")
      .messages({ "string.empty": "RoleName is Required" }),
    description: Joi.string()
      .trim()
      .required()
      .label("Description")
      .messages({ "string.empty": "Description is Required" }),
    designation: Joi.string()
      .trim()
      .required()
      .label("Designation")
      .messages({ "string.empty": "Designation is Required" }),
  });

  //Submit for Add;
  const handleSubmit = async () => {
    setIsLoading(true);

    let validateForm = validateServices.validateForm(inputData, schema());
    if (validateForm) {
      setErrors(validateForm);
    } else {
      let roleData = inputData;
      let roleAdded = await userServices.addRoleData(roleData);

      if (roleAdded) {
        handleModalClose();
      }
    }
    setIsLoading(false);
  };

  const manageColumns = useCallback(
    (column, checked) => {
      const updated = { ...hiddenColumns };
      updated[column] = checked;
      setHiddenColumns(updated);
    },
    [hiddenColumns]
  );

  const onCancel = () => {
    setShowConfirm(false);
    setRoleId("");
  };

  const handleDeleteRole = async () => {
    await userServices.deleteRole(roleId);
    onCancel();
  };

  //Submit for Edit;
  const handleEditSubmit = async () => {
    setIsLoading(true);
    let editedData = await userServices.editRole(selectedRole);
    if (editedData) {
      handleModalClose();
    }
    setIsLoading(false);
  };

  //handleEditchange for Add;
  const handleEditChange = ({ target: { value, name } }) => {
    let newInputData = { ...selectedRole };
    newInputData[name] = value;
    setSelectedRole(newInputData);
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          margin: "15px",
        }}
      >
        <div
          className="m-1 d-flex justify-content-between"
          style={{ paddingLeft: "15px" }}
        >
          <h3
            style={{ fontSize: "18px" }}
            className="breadCrumbsHeader boldFont"
          >
            Roles
          </h3>
          <Breadcrumbs
            options={[
              {
                name: "Roles",
                pathName: routes.inventory,
              },
            ]}
            activePath={routes.inventory}
          />
        </div>
        <Container className="d-flex flex-column  gap-2" maxWidth="xxl">
          <Card className="shadow-sm p-3">
            <div className="d-grid px-2 gap-3 bg-white">
              <ConfirmBox
                onCancel={onCancel}
                onAgree={handleDeleteRole}
                showConfirm={showConfirm}
                content={"Are you sure want to delete"}
                title={"Delete"}
              />
              <div className="d-flex gap-2 justify-content-end">
                <div className="d-flex gap-2">
                  <Button onClick={() => setShowRole(true)} name={"Add"} />
                </div>
              </div>

              {showRole && (
                <Modal
                  open={showRole}
                  title={"Add"}
                  onClose={() => handleModalClose()}
                  width={300}
                >
                  <div className="d-grid m-3 mb-3 gap-3">
                    <Input
                      name="name"
                      value={inputData.name}
                      label="Role Name"
                      onChange={handleChange}
                      error={errors.name}
                      required
                    />
                    <Input
                      name="description"
                      value={inputData.description}
                      label="Description"
                      onChange={handleChange}
                      error={errors.description}
                      required
                    />
                    <Input
                      name="designation"
                      value={inputData.designation}
                      label="Designation"
                      onChange={handleChange}
                      error={errors.designation}
                      required
                    />
                    <Button
                      name={"Submit"}
                      isLoading={isLoading}
                      onClick={handleSubmit}
                    />
                  </div>
                </Modal>
              )}
              {showEditRole && (
                <Modal
                  open={showEditRole}
                  title={"Edit"}
                  onClose={() => handleModalClose()}
                  width={300}
                >
                  <div className="d-grid m-3 mb-3 gap-3">
                    <Input
                      name="name"
                      value={selectedRole.name}
                      label="Role Name"
                      onChange={handleEditChange}
                      error={errors.name}
                      required
                    />
                    <Input
                      name="description"
                      value={selectedRole.description}
                      label="Description"
                      onChange={handleEditChange}
                      error={errors.description}
                      required
                    />
                    <Input
                      name="designation"
                      value={selectedRole.designation}
                      label="Designation"
                      onChange={handleEditChange}
                      error={errors.designation}
                      required
                    />
                    <Button
                      name={"Submit"}
                      isLoading={isLoading}
                      onClick={handleEditSubmit}
                    />
                  </div>
                </Modal>
              )}
              <DataTable
                columns={columns}
                rows={sortedRoleData}
                sortColumn={sortColumn}
                sortOrder={sortOrder}
                setSortColumn={setSortColumn}
                setSortOrder={setSortOrder}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                rowsPerPage={rowsPerPage}
                setRowsPerPage={setRowsPerPage}
                hiddenColumns={hiddenColumns}
                manageColumns={manageColumns}
              />
            </div>
          </Card>
        </Container>
      </div>
    </>
  );
};

export default CreateNewRole;
