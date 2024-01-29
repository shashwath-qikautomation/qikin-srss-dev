import React, { useCallback, useState, useMemo, useEffect } from "react";
import { Card, Container, InputAdornment, IconButton } from "@mui/material";
import DataTable from "../../components/table/DataTable";
import Input from "../../components/Input";
import CloseIcon from "@mui/icons-material/Close";
import _ from "lodash";

const VendorData = ({ vendorsInventory, id }) => {
  const [sortColumn, setSortColumn] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [vendorQuantityItems, setVendorQuantityItems] = useState([]);
  const [filterVendor, setFilterVendor] = useState([]);
  const [search, setSearch] = useState("");

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
      content: useCallback((vendorInventory, i) => {
        return (
          <div>
            {" "}
            <p>{vendorInventory.part || "-"}</p>
          </div>
        );
      }),
      sortable: true,
    },
    {
      path: "partNumber",
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
      path: "vendorQuantity",
      label: "Vendor Quantity",
      content: useCallback((vendorInventory) => {
        return <div>{vendorInventory?.quantity}</div>;
      }, []),
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
  ];

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
        f?.vendorQuantity
          ?.toString()
          .toLowerCase()
          .includes(search.trim().toLowerCase()) ||
        f?.manufacture
          ?.toString()
          .toLowerCase()
          .includes(search.trim().toLowerCase())
    );
    return filtered;
  };

  useMemo(() => {
    let filtered = vendorQuantityItems;

    if (search) {
      filtered = dataTableSearch(filtered);
    }
    setFilterVendor(filtered);
  }, [search, vendorQuantityItems]);

  const sortedVendorList = useMemo(() => {
    let sorted = [];
    if (sortColumn === "part") {
      sorted = _.orderBy(filterVendor, "part", sortOrder);
    } else if (sortColumn === "partNumber") {
      sorted = _.orderBy(filterVendor, "partNumber", sortOrder);
    } else if (sortColumn === "manufacture") {
      sorted = _.orderBy(filterVendor, "manufacture", sortOrder);
    } else if (sortColumn === "vendorQuantity") {
      sorted = _.orderBy(filterVendor, "vendorQuantity", sortOrder);
    } else {
      sorted = _.orderBy(filterVendor, sortColumn, sortOrder);
    }
    return sorted;
  }, [filterVendor, sortColumn, sortOrder]);

  const vendorDetails = useMemo(() => {
    const matchedDetail = vendorsInventory.find((f) => f.vendorId._id === id);

    if (matchedDetail) {
      let newVendorList = matchedDetail.vendorQuantity.map((m) => ({
        part: m.part,
        partNumber: m.partNumber,
        quantity: m.quantity,
        manufacture: m.manufacture,
      }));
      setVendorQuantityItems(newVendorList);
      // setFilteredWorkOrder(newVendorList);
    } else {
      console.error("No matched order found for ID:", id);
    }
    return matchedDetail;
  }, [id, vendorsInventory]);

  const handleChange = useCallback(
    (event) => {
      setSearch(event.target.value);
    },
    [search, vendorQuantityItems]
  );

  return (
    <Container maxWidth="xxl">
      <Card className="shadow-sm p-3 ">
        <div className="d-flex flex-wrap justify-content-between gap-2">
          <div>
            <Input
              label="search"
              name="Search"
              value={search}
              onChange={handleChange}
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
          <DataTable
            rows={sortedVendorList}
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
  );
};

export default VendorData;
