import React, { useCallback, useEffect, useMemo, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import { Card, IconButton, InputAdornment } from "@mui/material";
import { Container } from "@mui/system";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import Button from "../../components/Button";
import ConfirmBox from "../../components/ConfirmBox";
import DataTable from "../../components/table/DataTable";
import Input from "../../components/Input";
import Modal from "../../components/Modal";
import { routes } from "../../helper/routes";
import _ from "lodash";
import moment from "moment";
import Breadcrumbs from "../../components/Breadcrumbs";
import AddVendors from "./AddVendors";
import { updateVendors } from "../../redux/action";
import vendorsServices from "../../services/vendorsInventoryServices";

function Vendors() {
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [isPageLoading, togglePageLoading] = useState(false);
  const [showConfirmBox, toggleConfirmBox] = useState(false);
  const { vendorsList } = useSelector((state) => state);
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [ProductData, setProductData] = useState([]);
  const [sortColumn, setSortColumn] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [hiddenColumns, setHiddenColumns] = useState({});
  const [showAddVendorsInventory, setShowAddVendorsInventory] = useState(false);

  const columns = [
    {
      path: "#",
      label: "#",
      content: (item, index) => (
        <span>{currentPage * rowsPerPage + index + 1}</span>
      ),
      columnStyle: { width: "3%" },
    },
    {
      path: "name",
      label: "Name",
      sortable: true,
      content: (vendor) => {
        return (
          <div>
            <Link to={`${routes.vendorsInventory}` + "/" + vendor._id}>
              {vendor.name || "-"}
            </Link>
          </div>
        );
      },
    },
    {
      path: "email",
      label: "Email",
      content: useCallback((vendor) => {
        return <div>{vendor?.email}</div>;
      }, []),
      sortable: true,
    },
    {
      path: "phoneNumber",
      label: "Phone Number",
      content: useCallback((vendor) => {
        return <div>{vendor?.phoneNumber}</div>;
      }, []),
      sortable: true,
    },
    {
      path: "address",
      label: "Address",
      content: useCallback((vendor) => {
        return <div>{vendor?.address}</div>;
      }, []),
      sortable: true,
    },
    {
      path: "createdAt",
      label: "Created At",
      sortable: true,
      content: (product) => {
        return (
          <div>
            {moment(product.createdAt).format("DD/MM/YYYY") +
              moment(product.createdAt).format(" hh:mm a ")}
          </div>
        );
      },
    },
    {
      path: "edit",
      label: "Actions",
      nonExportable: true,
      content: (vendor) => (
        <div className="d-flex">
          <IconButton onClick={() => onAddInventory(vendor)}>
            <Edit color="primary" />
          </IconButton>
          <IconButton onClick={() => confirmDelete(vendor._id)}>
            <Delete color="error" />
          </IconButton>
        </div>
      ),

      columnStyle: { width: "5%" },
    },
  ];

  const getData = useCallback(async () => {
    togglePageLoading(true);
    const vendorPayload = await vendorsServices.getVendors();
    dispatch(updateVendors(vendorPayload));
    togglePageLoading(false);
  }, [dispatch]);

  useEffect(() => {
    getData();
  }, []);

  const dataTableSearch = (dataToFilter) => {
    let filtered = dataToFilter.filter(
      (f) =>
        f?.description
          ?.toString()
          .toLowerCase()
          .includes(search.trim().toLowerCase()) ||
        f?.productName
          ?.toString()
          .toLowerCase()
          .includes(search.trim().toLowerCase())
    );
    return filtered;
  };

  useMemo(() => {
    let filtered = vendorsList;

    if (search) {
      filtered = dataTableSearch(filtered);
    }
    setProductData(filtered);
  }, [vendorsList, search]);

  const confirmDelete = (vendor) => {
    console.log(vendor);
    setSelectedVendor(vendor);
    toggleConfirmBox(true);
  };

  const sortedProductData = useMemo(() => {
    let sorted = [];
    if (sortColumn === "productName") {
      sorted = _.orderBy(ProductData, ["productName"], [sortOrder]);
    } else if (sortColumn === "description") {
      sorted = _.orderBy(ProductData, ["description"], [sortOrder]);
    } else {
      sorted = _.orderBy(ProductData, [sortColumn], [sortOrder]);
    }
    return sorted;
  }, [ProductData, sortColumn, sortOrder]);

  const onAddInventory = useCallback((selectedVendor) => {
    setSelectedVendor(selectedVendor);
    setShowAddVendorsInventory(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setShowAddVendorsInventory(false);
    setSelectedVendor(null);
  }, []);

  // to delete vendors
  const deleteVendors = async () => {
    const deleted = await vendorsServices.deleteVendors(selectedVendor);
    if (deleted) {
      toggleConfirmBox(false);
    }
  };

  return (
    <div className="d-grid gap-2 mt-2 px-2">
      <div className="px-3 py-2 d-flex justify-content-between">
        <h6 style={{ fontSize: "18px" }} className="breadCrumbsHeader boldFont">
          Vendors
        </h6>
        <Breadcrumbs
          options={[
            {
              name: "Vendors",
              pathName: routes.inventory,
            },
          ]}
          activePath={routes.inventory}
        />
      </div>

      <Container maxWidth="xxl">
        <Card className="shadow-sm p-3 ">
          <div className="d-grid gap-3">
            <div className="d-flex flex-wrap justify-content-between gap-2">
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
              <div className="d-flex gap-2">
                <div>
                  <Button
                    name="Add Vendor"
                    onClick={() => {
                      onAddInventory(null);
                    }}
                  />
                </div>
              </div>
            </div>

            <DataTable
              columns={columns}
              rows={sortedProductData}
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
        {showAddVendorsInventory && (
          <Modal
            onClose={handleModalClose}
            title={selectedVendor ? "Edit Vendor" : "Add Vendor"}
          >
            <AddVendors
              handleModalClose={handleModalClose}
              selectedVendor={selectedVendor}
            />
          </Modal>
        )}
      </Container>
      <ConfirmBox
        showConfirm={showConfirmBox}
        onAgree={deleteVendors}
        content="Are you sure want to delete"
        title="Delete"
        onCancel={() => {
          toggleConfirmBox(false);
        }}
      />
    </div>
  );
}

export default Vendors;
