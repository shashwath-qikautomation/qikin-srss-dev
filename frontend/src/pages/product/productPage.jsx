import React, { useCallback, useEffect, useMemo, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import { Card, IconButton, InputAdornment } from "@mui/material";
import { Container } from "@mui/system";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import ConfirmBox from "../../components/ConfirmBox";
import DataTable from "../../components/table/DataTable";
import Input from "../../components/Input";
import Modal from "../../components/Modal";
import UploadBOM from "./productBom";
import { routes } from "../../helper/routes";
import bomServices from "../../services/BOMservices";
import _ from "lodash";
import moment from "moment";
import { updateBOMList } from "../../redux/action";
import Breadcrumbs from "../../components/Breadcrumbs";

function ProductPage() {
  const [showBOMUpload, toggleBOMUpload] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isPageLoading, togglePageLoading] = useState(false);
  const [showConfirmBox, toggleConfirmBox] = useState(false);
  const { products } = useSelector((state) => state);

  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [ProductData, setProductData] = useState([]);
  const [sortColumn, setSortColumn] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [hiddenColumns, setHiddenColumns] = useState({});

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
      path: "productName",
      label: "Product",
      sortable: true,
      content: (product) => {
        return (
          <div>
            <p>{product.productName || "-"}</p>
          </div>
        );
      },
    },
    {
      path: "description",
      label: "Description",
      content: useCallback((product) => {
        return <div>{product?.description}</div>;
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
      content: (product) => (
        <div className="d-flex">
          <IconButton
            onClick={() => {
              navigate(routes.editProduct + "/" + product._id);
            }}
          >
            <Edit color="primary" />
          </IconButton>
          <IconButton onClick={() => confirmDelete(product)}>
            <Delete color="error" />
          </IconButton>
        </div>
      ),

      columnStyle: { width: "5%" },
    },
  ];

  const getData = useCallback(async () => {
    togglePageLoading(true);
    const productPayload = await bomServices.getBOMList();
    dispatch(updateBOMList(productPayload));
    togglePageLoading(false);
  }, [dispatch]);

  useEffect(() => {
    getData();
  }, []);

  // const manageColumns = (column, checked) => {
  //   const updated = { ...hiddenColumns };
  //   updated[column] = checked;

  //   setHiddenColumns(updated);
  // };

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
    let filtered = products;

    if (search) {
      filtered = dataTableSearch(filtered);
    }
    setProductData(filtered);
  }, [products, search]);

  const confirmDelete = (product) => {
    console.log(product);
    setSelectedProduct(product);
    toggleConfirmBox(true);
  };

  const deleteProd = async () => {
    const deleted = await bomServices.deleteBOMList(selectedProduct);
    console.log(deleted);
    if (deleted) {
      toggleConfirmBox(false);
    }
  };

  const handleCloseModal = () => {
    toggleBOMUpload(false);
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

  return (
    <div className="d-grid gap-2 mt-2 px-2">
      <div className="px-3 py-2 d-flex justify-content-between">
        <h6 style={{ fontSize: "18px" }} className="breadCrumbsHeader boldFont">
          Products
        </h6>
        <Breadcrumbs
          options={[
            {
              name: "Products",
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
                    name="Add Product"
                    onClick={() => {
                      navigate(routes.addProduct);
                    }}
                  />
                </div>
                <div>
                  <Button
                    name="upload BOM"
                    onClick={() => {
                      toggleBOMUpload(true);
                    }}
                  />
                </div>
                <div></div>
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
      </Container>
      <ConfirmBox
        showConfirm={showConfirmBox}
        content="Are You Sure Want To Delete"
        title="Delete"
        onAgree={deleteProd}
        onCancel={() => {
          toggleConfirmBox(false);
        }}
      />

      {showBOMUpload && (
        <Modal onClose={handleCloseModal} width={"80%"} title="Upload BOM">
          <UploadBOM handleCloseModal={handleCloseModal} />
        </Modal>
      )}
    </div>
  );
}

export default ProductPage;
