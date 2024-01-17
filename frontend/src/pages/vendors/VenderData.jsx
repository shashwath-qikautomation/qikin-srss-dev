import React, { useCallback, useState, useMemo, useEffect } from "react";
import { Card, Container, InputAdornment, IconButton } from "@mui/material";
import DataTable from "../../components/table/DataTable";

const VendorData = ({ vendorsInventory, id }) => {
  const [sortColumn, setSortColumn] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [vendorQuantityItems, setVendorQuantityItems] = useState([]);

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
        console.log(vendorInventory);
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

  const vendorDetails = useMemo(() => {
    const matchedDetail = vendorsInventory.find((f) => f.vendorId._id === id);

    console.log(matchedDetail);
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

  return (
    <Container maxWidth="xxl">
      <Card className="shadow-sm p-3 ">
        <div className="d-flex flex-wrap justify-content-between gap-2">
          <DataTable
            rows={vendorQuantityItems}
            columns={columns}
            sortColumn={sortColumn}
            sortOrder={sortOrder}
            currentPage={currentPage}
            rowsPerPage={rowsPerPage}
            setSortColumn={setSortColumn}
            setSortOrder={setSortOrder}
            setCurrentPage={setCurrentPage}
            setRowsPerPage={setRowsPerPage}
            showPagination={false}
          />
        </div>
      </Card>
    </Container>
  );
};

export default VendorData;
