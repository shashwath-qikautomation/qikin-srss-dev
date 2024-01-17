import React, { useCallback, useState, useMemo, useEffect } from "react";
import { routes } from "../../helper/routes";
import Breadcrumbs from "../../components/Breadcrumbs";
import { Card, Container, InputAdornment, IconButton } from "@mui/material";
import Input from "../../components/Input";
import Delete from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DataTable from "../../components/table/DataTable";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateVendorsInventory } from "../../redux/action/index";
import vendorsServices from "../../services/vendorsInventoryServices";
import VendorData from "./VenderData";

const VendorsInventory = () => {
  const { id } = useParams();
  const [sortColumn, setSortColumn] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [showDescription, setShowDescription] = useState(false);
  const [index, setIndex] = useState();
  const [vendorInventoryItems, setVendorInventoryItems] = useState([]);

  const { vendorsInventory } = useSelector((state) => state);
  const dispatch = useDispatch();

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
      path: "requiredQuantity",
      label: "Required Quantity",
      content: useCallback((vendorInventory) => {
        return <div>{vendorInventory?.quantity}</div>;
      }, []),
      sortable: true,
    },
  ];

  console.log(vendorsInventory);

  const getData = useCallback(async () => {
    const [vendorInventoryData] = await Promise.all([
      vendorsServices.getVendorInventory(),
    ]);

    dispatch(updateVendorsInventory(vendorInventoryData));
  }, [dispatch]);

  useEffect(() => {
    getData();
  }, [id]);

  const vendorDetails = useMemo(() => {
    const matchedDetail = vendorsInventory.find((f) => f.vendorId._id === id);

    console.log(matchedDetail);
    if (matchedDetail) {
      let newVendorList = matchedDetail.requiredQuantity.map((m) => ({
        partNumber: m.partNumber,
        quantity: m.quantity,
      }));
      setVendorInventoryItems(newVendorList);
      // setFilteredWorkOrder(newVendorList);
    } else {
      console.error("No matched order found for ID:", id);
    }
    return matchedDetail;
  }, [id, vendorsInventory]);

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
      <VendorData vendorsInventory={vendorsInventory} id={id} />
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
            <DataTable
              rows={vendorInventoryItems}
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
    </div>
  );
};

export default VendorsInventory;
