import React, { useCallback, useState } from "react";
import { routes } from "../../helper/routes";
import Breadcrumbs from "../../components/Breadcrumbs";
import { Card, Container, InputAdornment, IconButton } from "@mui/material";
import Input from "../../components/Input";
import Delete from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DataTable from "../../components/table/DataTable";
import Button from "../../components/Button";
import Modal from "../../components/Modal";

const VendorsInventory = () => {
  const [sortColumn, setSortColumn] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [showDescription, setShowDescription] = useState(false);
  const [index, setIndex] = useState();
  const [showModal, setShowModal] = useState(false);

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
      path: "part",
      label: "Part",
      sortable: true,
    },
    {
      path: "partName",
      label: "Part Number",
      content: useCallback((vendorInventory, i) => {
        return (
          <div>
            {" "}
            <p>{vendorInventory.partNumber || "-"}</p>
          </div>
        );
      }),
      sortable: true,
    },

    {
      path: "partDescription",
      label: "Part Description",
      content: useCallback((vendorInventory, i) => {
        return (
          <div>
            {" "}
            <p>{vendorInventory.partDescription || "-"}</p>
          </div>
        );
      }),
      sortable: true,
    },
    {
      path: "manufacture",
      label: "Manufacture",
      content: useCallback((vendorInventory, i) => {
        return (
          <div>
            {" "}
            <p>{vendorInventory.manufacture || "-"}</p>
          </div>
        );
      }),
      sortable: true,
    },
    {
      path: "vendorQuantity",
      label: "Vendor Quantity",
      content: useCallback((vendorInventory) => {
        return <div>{vendorInventory?.quantity}</div>;
      }, []),
      sortable: true,
    },
    {
      path: "Edit",
      label: "Actions",
      nonExportable: true,
      columnStyle: { width: "5%" },
      content: (e, i) => {
        return (
          <div className="d-flex align-items-center">
            {!(showDescription && index === i) ? (
              <EditIcon color="primary">
                <IconButton />
              </EditIcon>
            ) : (
              <>
                <div className="d-flex gap-3">
                  <CheckIcon color="success" />
                  <CloseIcon color="error" />
                </div>
              </>
            )}
            <IconButton>
              <Delete color="error" />
            </IconButton>
          </div>
        );
      },
    },
  ];

  const onAddVendorInventory = useCallback((selectedInventory) => {
    setShowModal(true);
  }, []);

  return (
    <div className="d-grid gap-2 mt-2 px-2">
      <div className="px-3 py-2 d-flex justify-content-between">
        <h6 style={{ fontSize: "18px" }} className="breadCrumbsHeader boldFont">
          Vendors Inventory
        </h6>
        <Breadcrumbs
          options={[
            {
              name: "Vendors Inventory",
              pathName: routes.inventory,
            },
          ]}
          activePath={routes.inventory}
        />
      </div>
      <Container maxWidth="xxl">
        <Card className="shadow-sm p-3 ">
          <div className="d-flex flex-wrap justify-content-between gap-2">
            <div>
              <Input
                label="search"
                name="Search"
                //   value={search}
                //   onChange={async (e) => {
                //     setSearch(e.target.value);
                //   }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment
                      type="hidden"
                      position="end"
                      style={{ cursor: "pointer" }}
                    >
                      {/* {search && <CloseIcon onClick={() => setSearch("")} />} */}
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            <div className="d-flex justify-content-end">
              <div className="px-2">
                <Button
                  name={"Add Component"}
                  onClick={() => onAddVendorInventory(null)}
                />
              </div>
            </div>
            <DataTable
              //rows={sortedInventoryList}
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
      </Container>
      {showModal && (
        <Modal
        // onClose={handleModalClose}
        // title={selectedInventory ? "Edit Component" : "Add Component"}
        >
          {/* <AddInventory
          //handleModalClose={handleModalClose}
          //selectedInventory={selectedInventory}
          /> */}
        </Modal>
      )}
    </div>
  );
};

export default VendorsInventory;
