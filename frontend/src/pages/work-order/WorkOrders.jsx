import React, { useCallback, useState, useEffect, useMemo } from "react";
import { Card, Container, InputAdornment, Menu, MenuItem } from "@mui/material";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { useNavigate, Link } from "react-router-dom";
import DataTable from "../../components/table/DataTable";
import CloseIcon from "@mui/icons-material/Close";
import Button from "../../components/Button";
import _ from "lodash";
import Modal from "../../components/Modal";
import DeleteIcon from "@mui/icons-material/Delete";
import EditWorkOrder from "./editWorkOrder";
import workOrderServices from "../../services/workOrderServices";
import Status from "./enum";
import Input from "../../components/Input";
import { routes } from "../../helper/routes";
import { updateWorkOrder } from "../../redux/action";
import { IconButton } from "@mui/material";
import ConfirmBox from "../../components/ConfirmBox";
import Breadcrumbs from "../../components/Breadcrumbs";
import ExportTableData from "../../components/ExportTableData";

function WorkOrders() {
  const [sortColumn, setSortColumn] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showDetails, setShowDetails] = useState(null);
  const [search, setSearch] = useState("");
  const [workorderData, setWorkorderData] = useState([]);
  const navigate = useNavigate();
  const [showEditWorkOrder, setShowWorkOrder] = useState(false);
  const [selectedWorkId, setSelectedWorkId] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const dispatch = useDispatch();
  const { workOrders } = useSelector((state) => state);
  const [hiddenColumns, setHiddenColumns] = useState({});
  const [approvedDetails, setApproveDetails] = useState({
    approvedName: "",
    approvedDate: "",
  });

  const columns = [
    {
      path: "#",
      label: "#",
      content: useCallback(
        (wo, index) => <span>{currentPage * rowsPerPage + index + 1}</span>,
        [currentPage, rowsPerPage]
      ),
    },
    {
      path: "workOrderNumber",
      label: "Work Order Number",
      content: useCallback((workOrder) => {
        return (
          <div style={{ cursor: "pointer" }}>
            <Link to={`${routes.editWorkOrder}` + "/" + workOrder._id}>
              {workOrder.workOrderNumber}
            </Link>
          </div>
        );
      }, []),
      sortable: true,
    },

    {
      path: "description",
      label: "Description",
      sortable: true,
      // content: (workOrders) => {
      //   console.log(workOrders.AddWorkOrder);
      //   return (
      //     <div>
      //       <p>{workOrders.workOrderNumber || "-"}</p>
      //     </div>
      //   );
      // },
    },
    {
      path: "vendorName",
      label: "Vendor Name",
      getValue: (vendor) => {
        return vendor?.vendorId?.name ? vendor.vendorId?.name : "";
      },
      content: useCallback((vendor) => {
        return <div>{vendor?.vendorId?.name}</div>;
      }, []),
      sortable: true,
    },
    {
      path: "createdAt",
      label: "Created At",
      sortable: true,
      content: (workOrders) => {
        return (
          <div>
            {moment(workOrders.createdAt).format("DD/MM/YYYY") +
              moment(workOrders.createdAt).format(" hh:mm a ")}
          </div>
        );
      },
    },
    {
      path: "status",
      label: "Status",
      content: (workOrders) => {
        return (
          <div>
            <Stack spacing={1} alignItems="center">
              <Stack direction="row" spacing={1}>
                <Chip
                  label={Status.workOrderStatus[workOrders.status]}
                  color={"primary"}
                  variant="outlined"
                  onClick={(e) => {
                    if (
                      workOrders.status === 0 ||
                      workOrders.status === 1 ||
                      workOrders.status === 2
                    ) {
                      setShowDetails(e.currentTarget);
                    }
                  }}
                  style={{ width: "10rem" }}
                ></Chip>
              </Stack>
            </Stack>
            <Menu
              anchorEl={showDetails}
              id="account-menu"
              open={Boolean(showDetails)}
              onClose={() => {
                setShowDetails(null);
              }}
              onClick={() => {
                setShowDetails(null);
              }}
              PaperProps={{
                elevation: 0,
                sx: {
                  minWidth: "20%",
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  "& .MuiAvatar-root": {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  "&:before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    zIndex: 0,
                  },
                },
              }}
              className="p-2"
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem>
                <div className="d-grid gap-3 mb-3">
                  {approvedDetails.approvedName && (
                    <div>
                      <div>
                        {"workOrder.submittedBy"}:{" "}
                        {approvedDetails.approvedName}
                      </div>
                      <div>
                        {"workOrder.SubmittedDate"}:
                        {moment(approvedDetails.approvedDate).format(
                          "DD/MM/YYYY"
                        )}
                      </div>
                    </div>
                  )}

                  {approvedDetails.pickUpName && (
                    <div>
                      <div>
                        {"workOrder.pickupBy"}:{approvedDetails.pickUpName}
                      </div>
                      <div>
                        {"workOrder.pickupDate"}:
                        {approvedDetails.pickUpDate
                          ? moment(approvedDetails.pickUpDate).format(
                              "DD/MM/YYYY"
                            )
                          : ""}
                      </div>
                    </div>
                  )}
                </div>
              </MenuItem>
            </Menu>
          </div>
        );
      },
    },
    {
      path: "Delete",
      label: "Actions",
      nonExportable: true,
      columnStyle: { width: "5%" },
      content: useCallback(
        (workorders) => {
          return (
            <div>
              <IconButton
                disabled={workorders.status === 1 ? true : false}
                onClick={() => {
                  setShowConfirm(true);
                  setSelectedWorkId(workorders._id);
                }}
              >
                <DeleteIcon color="error" />
              </IconButton>
            </div>
          );
        },
        [selectedWorkId]
      ),
    },
  ];

  const getData = useCallback(async () => {
    const workOrderData = await workOrderServices.getWorkOrders();

    dispatch(updateWorkOrder(workOrderData));
  }, [dispatch]);

  useEffect(() => {
    getData();
  }, []);
  // const onAddWorkOrder = useCallback(() => {
  //   setShowWorkOrder(true);
  // }, []);

  const dataTableSearch = (dataToFilter) => {
    let filtered = dataToFilter.filter(
      (f) =>
        f?.workOrderNumber
          ?.toString()
          .toLowerCase()
          .includes(search.trim().toLowerCase()) ||
        f?.description
          ?.toString()
          .toLowerCase()
          .includes(search.trim().toLowerCase())
    );
    return filtered;
  };

  useMemo(() => {
    let filtered = workOrders;

    if (search) {
      filtered = dataTableSearch(filtered);
    }
    setWorkorderData(filtered);
  }, [workOrders, search]);

  const handleModalClose = useCallback(() => {
    setShowWorkOrder(false);
  }, []);

  const sortedWorkOrderData = useMemo(() => {
    let sorted = [];
    if (sortColumn === "workOrderNumber") {
      sorted = _.orderBy(workorderData, ["workOrderNumber"], [sortOrder]);
    } else if (sortColumn === "description") {
      sorted = _.orderBy(workorderData, ["description"], [sortOrder]);
    } else if (sortColumn === "vendorName") {
      sorted = _.orderBy(workorderData, ["vendorName"], [sortOrder]);
    } else {
      sorted = _.orderBy(workorderData, [sortColumn], [sortOrder]);
    }
    return sorted;
  }, [workorderData, sortColumn, sortOrder]);

  const onCancel = () => {
    setShowConfirm(false);
    setSelectedWorkId("");
  };

  const deletePurchaseOrder = async () => {
    await workOrderServices.deleteWorkOrder(selectedWorkId);
    onCancel();
  };

  return (
    <div className="d-grid gap-2 m-2">
      <div className="px-3 py-2 d-flex justify-content-between">
        <h6 style={{ fontSize: "18px" }}>Work Orders</h6>
        <Breadcrumbs
          options={[
            {
              name: "Work Orders",
              pathName: routes.inventory,
            },
          ]}
          activePath={routes.inventory}
        />
      </div>
      <Container maxWidth="xxl">
        <Card className="p-2 shadow-sm">
          <div className="d-grid gap-2">
            <div className="d-flex justify-content-between">
              <div>
                <Input
                  label="search"
                  name="Search"
                  value={search}
                  onChange={async (e) => {
                    setSearch(e.target.value);
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment
                        type="hidden"
                        position="end"
                        style={{ cursor: "pointer" }}
                      >
                        {search && <CloseIcon onClick={() => setSearch("")} />}
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
              <div className="d-flex">
                <div className="px-2">
                  <Button
                    name={"Add Work Order"}
                    onClick={() => {
                      navigate(routes.addWorkOrder);
                    }}
                  />
                </div>
                <ExportTableData
                  columns={columns}
                  tableData={sortedWorkOrderData}
                  hiddenColumns={hiddenColumns}
                  fileName={"Work Order Details"}
                  tableHeader={"Work Order Details"}
                />
              </div>
            </div>
            <DataTable
              rows={sortedWorkOrderData}
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
          </div>
        </Card>
        {showEditWorkOrder && (
          <Modal onClose={handleModalClose} title={"Add Work Order"}>
            <EditWorkOrder />
          </Modal>
        )}
      </Container>
      <ConfirmBox
        onCancel={onCancel}
        onAgree={deletePurchaseOrder}
        showConfirm={showConfirm}
        content={"Are you sure want to delete"}
        title={"Delete"}
      />
    </div>
  );
}

export default WorkOrders;
