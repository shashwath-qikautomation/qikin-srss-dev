import React, { useEffect } from "react";
import { useCallback, useMemo, useState } from "react";
import { Container, Card, InputAdornment } from "@mui/material";
import Button from "../../components/Button";
import DataTable from "../../components/table/DataTable";
import { Link, useNavigate } from "react-router-dom";
import _ from "lodash";
import { routes } from "../../helper/routes";
import { useSelector } from "react-redux";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmBox from "../../components/ConfirmBox";
import CloseIcon from "@mui/icons-material/Close";
import Input from "../../components/Input";
import { useDispatch } from "react-redux";
import { updatePurchase } from "../../redux/action";
import purchaseServices from "../../services/purchaseServices";
import moment from "moment";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Status from "../work-order/enum";
import Breadcrumbs from "../../components/Breadcrumbs";
import ExportTableData from "../../components/ExportTableData";

const PurchaseOrders = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { purchaseList } = useSelector((state) => state);

  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedPurchaseId, setSelectedPurchaseId] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [showDetails, setShowDetails] = useState(null);
  const [search, setSearch] = useState("");
  const [purchaseOrderData, setPurchaseOrderData] = useState([]);
  const [hiddenColumns, setHiddenColumns] = useState({});

  useEffect(() => {
    getData();
  }, []);

  const getData = useCallback(async () => {
    const data = await purchaseServices.getPurchaseList();
    dispatch(updatePurchase(data));
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
    {
      path: "purchaseNumber",
      label: "Purchase Order Number",
      content: useCallback((purchaseorder) => {
        return (
          <div style={{ cursor: "pointer" }}>
            <Link to={`${routes.editPurchaseOrder}` + "/" + purchaseorder._id}>
              {purchaseorder?.purchaseNumber}
            </Link>
          </div>
        );
      }, []),
      sortable: true,
    },
    {
      path: "description",
      label: "Description",
      content: useCallback((purchaseorder) => {
        return <div>{purchaseorder?.description}</div>;
      }, []),
      sortable: true,
    },
    {
      path: "status",
      label: "Status",
      sortable: true,
      content: (purchaseOrderData) => {
        return (
          <div>
            <Stack spacing={1} alignItems="center">
              <Stack direction="row" spacing={1}>
                <Chip
                  label={Status.purchaseOrderStatus[purchaseOrderData.status]}
                  color={"primary"}
                  variant="outlined"
                  style={{ width: "10rem" }}
                ></Chip>
              </Stack>
            </Stack>
          </div>
        );
      },
    },
    {
      path: "createdAt",
      label: "Created Time",
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
      path: "Edit",
      label: "Actions",
      nonExportable: true,
      columnStyle: { width: "5%" },
      content: useCallback(
        (purchase) => {
          return (
            <div>
              <IconButton
                disabled={purchase.status === 1 ? true : false}
                color="error"
                onClick={() => {
                  setShowConfirm(true);
                  setSelectedPurchaseId(purchase._id);
                }}
              >
                <DeleteIcon color="error" />
              </IconButton>
            </div>
          );
        },
        [selectedPurchaseId]
      ),
    },
  ];

  const dataTableSearch = (dataToFilter) => {
    let filtered = dataToFilter.filter(
      (f) =>
        f?.purchaseNumber
          ?.toString()
          .toLowerCase()
          .includes(search.trim().toLowerCase()) ||
        f?.description
          ?.toString()
          .toLowerCase()
          .includes(search.trim().toLowerCase()) ||
        f?.status
          ?.toString()
          .toLowerCase()
          .includes(search.trim().toLowerCase()) ||
        f?.createdAt
          ?.toString()
          .toLowerCase()
          .includes(search.trim().toLowerCase())
    );
    return filtered;
  };

  useMemo(() => {
    let filtered = purchaseList;

    if (search) {
      filtered = dataTableSearch(filtered);
    }
    setPurchaseOrderData(filtered);
  }, [purchaseList, search]);

  const sortedPurchaseList = useMemo(() => {
    let sorted = [];
    if (sortColumn === "purchaseNumber") {
      sorted = _.orderBy(purchaseOrderData, "purchaseNumber", sortOrder);
    } else if (sortColumn === "description") {
      sorted = _.orderBy(purchaseOrderData, "description", sortOrder);
    } else if (sortColumn === "status") {
      sorted = _.orderBy(purchaseOrderData, "status", sortOrder);
    } else if (sortColumn === "createdAt") {
      sorted = _.orderBy(purchaseOrderData, "createdAt", sortOrder);
    } else {
      sorted = _.orderBy(purchaseOrderData, sortColumn, sortOrder);
    }
    return sorted;
  }, [purchaseOrderData, sortColumn, sortOrder]);

  const addPurchaseOrder = () => {
    navigate(routes.addProducts);
  };

  const onCancel = () => {
    setShowConfirm(false);
    setSelectedPurchaseId("");
  };

  const deletePurchaseOrder = async () => {
    await purchaseServices.deletePurchaseList(selectedPurchaseId);
    onCancel();
  };

  const manageColumns = useCallback(
    (column, checked) => {
      const updated = { ...hiddenColumns };
      updated[column] = checked;
      setHiddenColumns(updated);
    },
    [hiddenColumns]
  );

  return (
    <div className="d-grid m-2 gap-3 mb-3">
      <div className="px-3 py-2 d-flex justify-content-between">
        <h6 style={{ fontSize: "18px" }} className="breadCrumbsHeader boldFont">
          Purchase Orders
        </h6>
        <Breadcrumbs
          options={[
            {
              name: "Purchase Orders",
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
                    name={"Add Purchase Order"}
                    onClick={addPurchaseOrder}
                  />
                </div>
                <ExportTableData
                  columns={columns}
                  tableData={sortedPurchaseList}
                  hiddenColumns={hiddenColumns}
                  fileName={"Purchase Order Details"}
                  tableHeader={"Purchase Order Details"}
                />
              </div>
            </div>
            <DataTable
              columns={columns}
              rows={sortedPurchaseList}
              sortColumn={sortColumn}
              sortOrder={sortOrder}
              setSortColumn={setSortColumn}
              setSortOrder={setSortOrder}
              currentPage={currentPage}
              rowsPerPage={rowsPerPage}
              setCurrentPage={setCurrentPage}
              setRowsPerPage={setRowsPerPage}
            />
          </div>
        </Card>
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
};

export default PurchaseOrders;
