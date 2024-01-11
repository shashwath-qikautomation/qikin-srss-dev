import React, { useCallback, useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Container, InputAdornment, IconButton } from "@mui/material";
import _ from "lodash";

import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import Input from "../../components/Input";
import DataTable from "../../components/table/DataTable";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import AddInventory from "./AddInventory";
import inventoryServices from "../../services/inventoryServices";
import { updateInventory } from "../../redux/action";
import { workOrder } from "../../redux/action";
import { routes } from "../../helper/routes";
import Breadcrumbs from "../../components/Breadcrumbs";
import ExportTableData from "../../components/ExportTableData";
import Delete from "@mui/icons-material/Delete";
import ConfirmBox from "../../components/ConfirmBox";

function Inventory() {
  const dispatch = useDispatch();
  const [selectedInventory, setSelectedInventory] = useState(null);

  const [sortColumn, setSortColumn] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [showDescription, setShowDescription] = useState(false);
  const [index, setIndex] = useState();
  const [descriptionData, setDescriptionData] = useState("");
  const [partNumberData, setPartNumberData] = useState("");
  const [manufactureData, setManufactureData] = useState("");
  const [inventoryId, setInventoryId] = useState("");
  const [inventoryData, setInventoryData] = useState([]);
  const [hiddenColumns, setHiddenColumns] = useState({});
  const [showConfirmBox, toggleConfirmBox] = useState(false);

  const [showAddInventory, setShowInventoryOrder] = useState(false);

  const { inventory } = useSelector((state) => state);

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
      content: useCallback((inventory, i) => {
        return (
          <div>
            {" "}
            <p>{inventory.partNumber || "-"}</p>
          </div>
        );
      }),
      sortable: true,
    },

    {
      path: "partDescription",
      label: "Part Description",
      content: useCallback((inventory, i) => {
        return (
          <div>
            {" "}
            <p>{inventory.partDescription || "-"}</p>
          </div>
        );
      }),
      sortable: true,
    },
    {
      path: "manufacture",
      label: "Manufacture",
      content: useCallback((inventory, i) => {
        return (
          <div>
            {" "}
            <p>{inventory.manufacture || "-"}</p>
          </div>
        );
      }),
      sortable: true,
    },
    {
      path: "quantity",
      label: "Quantity",
      content: useCallback((inventory) => {
        return <div>{inventory?.quantity}</div>;
      }, []),
      sortable: true,
    },
    {
      path: "boxNumber",
      label: "Box Number",
      content: useCallback((inventory) => {
        return <div>{inventory?.boxNumber}</div>;
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
              <EditIcon color="primary" onClick={() => onAddInventory(e)}>
                <IconButton />
              </EditIcon>
            ) : (
              <>
                <div className="d-flex gap-3">
                  <CheckIcon onClick={doSubmit} color="success" />
                  <CloseIcon
                    onClick={() => {
                      setShowDescription(false);
                    }}
                    color="error"
                  />
                </div>
              </>
            )}
            <IconButton onClick={() => confirmDelete(e)}>
              <Delete color="error" />
            </IconButton>
          </div>
        );
      },
    },
  ];

  const getData = useCallback(async () => {
    const inventoryData = await inventoryServices.getInventory();

    dispatch(updateInventory(inventoryData));
  }, [dispatch]);

  useEffect(() => {
    getData();
  }, [getData]);

  const onAddInventory = useCallback((selectedInventory) => {
    setSelectedInventory(selectedInventory);
    setShowInventoryOrder(true);
  }, []);

  const dataTableSearch = (dataToFilter) => {
    let filtered = dataToFilter.filter(
      (f) =>
        f?.part
          ?.toString()
          .toLowerCase()
          .includes(search.trim().toLowerCase()) ||
        f?.partNumber
          ?.toString()
          .toLowerCase()
          .includes(search.trim().toLowerCase()) ||
        f?.partDescription
          ?.toString()
          .toLowerCase()
          .includes(search.trim().toLowerCase()) ||
        f?.manufacture
          ?.toString()
          .toLowerCase()
          .includes(search.trim().toLowerCase()) ||
        f?.quantity
          ?.toString()
          .toLowerCase()
          .includes(search.trim().toLowerCase()) ||
        f?.boxNumber
          ?.toString()
          .toLowerCase()
          .includes(search.trim().toLowerCase())
    );
    return filtered;
  };

  const confirmDelete = (selectedInventory) => {
    setSelectedInventory(selectedInventory);
    toggleConfirmBox(true);
  };

  const sortedInventoryList = useMemo(() => {
    let sorted = [];
    if (sortColumn === "part") {
      sorted = _.orderBy(inventoryData, "part", sortOrder);
    } else if (sortColumn === "partNumber") {
      sorted = _.orderBy(inventoryData, "partNumber", sortOrder);
    } else if (sortColumn === "partDescription") {
      sorted = _.orderBy(inventoryData, "partDescription", sortOrder);
    } else if (sortColumn === "manufacture") {
      sorted = _.orderBy(inventoryData, "manufacture", sortOrder);
    } else if (sortColumn === "quantity") {
      sorted = _.orderBy(inventoryData, "quantity", sortOrder);
    } else if (sortColumn === "boxNumber") {
      sorted = _.orderBy(inventoryData, "boxNumber", sortOrder);
    } else {
      sorted = _.orderBy(inventoryData, sortColumn, sortOrder);
    }
    return sorted;
  }, [inventoryData, sortColumn, sortOrder]);

  useMemo(() => {
    let filtered = inventory;

    if (search) {
      filtered = dataTableSearch(filtered);
    }
    setInventoryData(filtered);
  }, [inventory, search]);

  const doSubmit = useCallback(async () => {
    const data = {
      partNumber: partNumberData,
      description: descriptionData,
      manufacture: manufactureData,
      id: inventoryId,
    };
    let description = await inventoryServices.updateInventory(data);
    if (description) {
      setShowDescription(false);
      setPartNumberData(false);
      setManufactureData(false);
    }
  }, [showDescription, descriptionData, partNumberData, manufactureData]);

  const handleModalClose = useCallback(() => {
    setShowInventoryOrder(false);
    setSelectedInventory(null);
  }, []);

  const manageColumns = useCallback(
    (column, checked) => {
      const updated = { ...hiddenColumns };
      updated[column] = checked;
      setHiddenColumns(updated);
    },
    [hiddenColumns]
  );

  // to delete inventory items
  const deleteInventory = async () => {
    const deleted = await inventoryServices.deleteInventory(selectedInventory);
    console.log(deleted);
    if (deleted) {
      toggleConfirmBox(false);
    }
  };

  return (
    <div className="d-grid gap-2 mt-2 px-2">
      <div className="px-3 py-2 d-flex justify-content-between">
        <h6 style={{ fontSize: "18px" }} className="breadCrumbsHeader boldFont">
          Inventory
        </h6>
        <Breadcrumbs
          options={[
            {
              name: "Inventory",
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
            <div className="d-flex justify-content-end">
              <div className="px-2">
                <Button
                  name={"Add Component"}
                  onClick={() => onAddInventory(null)}
                />
              </div>
              <ExportTableData
                columns={columns}
                tableData={sortedInventoryList}
                hiddenColumns={hiddenColumns}
                fileName={"Inventory Details"}
                tableHeader={"Inventory List Details"}
              />
            </div>
            <DataTable
              rows={sortedInventoryList}
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
        {showAddInventory && (
          <Modal
            onClose={handleModalClose}
            title={selectedInventory ? "Edit Component" : "Add Component"}
          >
            <AddInventory
              handleModalClose={handleModalClose}
              selectedInventory={selectedInventory}
            />
          </Modal>
        )}
      </Container>
      <ConfirmBox
        showConfirm={showConfirmBox}
        content="Are you sure want to delete"
        title="Delete"
        onAgree={deleteInventory}
        onCancel={() => {
          toggleConfirmBox(false);
        }}
      />
    </div>
  );
}

export default Inventory;
