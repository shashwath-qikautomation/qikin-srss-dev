import React, { useState, useCallback, useEffect, useMemo } from "react";
import DataTable from "../../../components/table/DataTable";
import { IconButton, Container, Card, InputAdornment } from "@mui/material";
import Breadcrumbs from "../../../components/Breadcrumbs";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import _ from "lodash";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import userServices from "../../../services/userServices";
import { useDispatch, useSelector } from "react-redux";
import { updateUsers } from "../../../redux/action";
import { routes } from "../../../helper/routes";
import ConfirmBox from "../../../components/ConfirmBox";
import ExportTableData from "../../../components/ExportTableData";

const UserList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [search, setSearch] = useState("");

  const [userListData, setUserListData] = useState("");
  const [sortColumn, setSortColumn] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [hiddenColumns, setHiddenColumns] = useState({});

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

  const { userList } = useSelector((state) => state);

  console.log(userList);

  useEffect(() => {
    getData();
  }, []);

  const getData = useCallback(async () => {
    const users = await userServices.getUsers();
    dispatch(updateUsers(users));
  }, [dispatch]);

  const columns = [
    {
      path: "#",
      label: "#",
      content: useCallback(
        (item, index) => {
          return <span>{currentPage * rowsPerPage + index + 1}</span>;
        },
        [currentPage, rowsPerPage]
      ),
      columnStyle: { width: "3%" },
    },
    { path: "firstName", label: "First Name", sortable: true },
    { path: "lastName", label: "Last Name", sortable: true },
    { path: "phoneNumber", label: "Phone Number", sortable: true },
    { path: "emailId", label: "Email Id", sortable: true },

    {
      path: "role",
      label: "Role",
      getValue: (role) => {
        return role?.role?.name ? role.role?.name : "";
      },
      content: useCallback((role) => {
        return <div>{role?.role?.name}</div>;
      }, []),
      isCustomSort: true,
      sortable: true,
    },
    {
      path: "edit",
      label: "Actions",
      nonExportable: true,
      columnStyle: { width: "1%" },
      content: useCallback(
        (userData) => {
          return (
            <div className="d-flex">
              <IconButton
                onClick={() => {
                  navigate(routes.editUser + "/" + userData._id);
                }}
              >
                <EditIcon color="primary" />
              </IconButton>
              <IconButton
                onClick={() => {
                  setSelectedUserId(userData._id);
                  setShowConfirm(true);
                }}
              >
                <DeleteIcon color="error" />
              </IconButton>
            </div>
          );
        },
        [selectedUser, selectedUserId]
      ),
    },
  ];

  const deleteUser = async () => {
    await userServices.deleteUsers(selectedUserId);
    onCancel();
  };

  const onCancel = () => {
    setShowConfirm(false);
    setSelectedUserId("");
  };

  const dataTableSearch = (dataToFilter) => {
    let filtered = dataToFilter.filter(
      (f) =>
        (!hiddenColumns["firstName"] &&
          f?.firstName
            ?.toString()
            .toLowerCase()
            .includes(search.trim().toLowerCase())) ||
        (!hiddenColumns["lastName"] &&
          f?.lastName
            ?.toString()
            .toLowerCase()
            .includes(search.trim().toLowerCase())) ||
        (!hiddenColumns["phoneNumber"] &&
          f?.phoneNumber
            ?.toString()
            .toLowerCase()
            .includes(search.trim().toLowerCase())) ||
        (!hiddenColumns["emailId"] &&
          f?.emailId
            ?.toString()
            .toLowerCase()
            .includes(search.trim().toLowerCase())) ||
        (!hiddenColumns["role?.name"] &&
          f?.role?.name
            ?.toString()
            .toLowerCase()
            .includes(search.trim().toLowerCase()))
    );
    return filtered;
  };

  useMemo(() => {
    let filtered = userList;

    if (search) {
      filtered = dataTableSearch(filtered);
    }
    setUserListData(filtered);
  }, [userList, search, hiddenColumns]);

  const sortedUserListData = useMemo(() => {
    let sorted = [];

    if (sortColumn === "createdBy") {
      sorted = _.orderBy(userListData, "createdBy.firstName", sortOrder);
    } else {
      sorted = _.orderBy(userListData, sortColumn, sortOrder);
    }

    return sorted;
  }, [userListData, sortColumn, sortOrder]);

  const manageColumns = useCallback(
    (column, checked) => {
      const updated = { ...hiddenColumns };
      updated[column] = checked;
      setHiddenColumns(updated);
    },
    [hiddenColumns]
  );

  const addNewUser = useCallback(() => {
    navigate(routes.AddNewUser);
  }, []);

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
            {"Users"}
          </h3>
          <Breadcrumbs
            options={[
              {
                name: "Users",
                pathName: routes.inventory,
              },
            ]}
            activePath={routes.inventory}
          />
        </div>
        <Container className="d-flex flex-column gap-2">
          <Card className="shadow-sm p-3">
            <div className="bg-white px-3 mb-5">
              <ConfirmBox
                onCancel={onCancel}
                onAgree={deleteUser}
                showConfirm={showConfirm}
                content={"Are you sure want to delete"}
                title={"Delete"}
              />
              <div className="d-flex justify-content-between mb-2">
                <Input
                  label={"Search"}
                  name="search"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment
                        position="end"
                        style={{ cursor: "pointer" }}
                      >
                        {search && <CloseIcon onClick={() => setSearch("")} />}
                      </InputAdornment>
                    ),
                  }}
                ></Input>
                <div className="d-flex">
                  <div className="px-2">
                    <Button name={"Add"} onClick={addNewUser} />
                  </div>
                  <ExportTableData
                    columns={columns}
                    tableData={sortedUserListData}
                    hiddenColumns={hiddenColumns}
                    fileName={"User List Details"}
                    tableHeader={"User List Details"}
                  />
                </div>
              </div>
              <DataTable
                columns={columns}
                rows={sortedUserListData}
                sortColumn={sortColumn}
                sortOrder={sortOrder}
                currentPage={currentPage}
                rowsPerPage={rowsPerPage}
                setSortColumn={setSortColumn}
                setSortOrder={setSortOrder}
                setCurrentPage={setCurrentPage}
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

export default UserList;
