import { Container, Card } from "@mui/material";
import React, { useCallback, useState, useMemo, useEffect } from "react";
import Button from "../../components/Button";
import DataTable from "../../components/table/DataTable";
import Input from "../../components/Input";
import Joi from "joi";
import _ from "lodash";
import validateServices from "../../helper/validateServices";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { routes } from "../../helper/routes";
import AutoComplete from "../../components/AutoComplete";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmBox from "../../components/ConfirmBox";
import purchaseServices from "../../services/purchaseServices";
import Breadcrumbs from "../../components/Breadcrumbs";
import inventoryServices from "../../services/inventoryServices";
import { updateInventory, updatePurchase } from "../../redux/action";

const AddPurchase = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const { inventory } = useSelector((state) => state);

  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [purchaseInput, setPurchaseInput] = useState({
    purchaseNumber: "",
    description: "",
    partNumber: "",
    quantity: "",
  });

  const [errors, setErrors] = useState("");
  const [sortColumn, setSortColumn] = useState("CreatedAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedOption, setSelectedOption] = useState(null);
  const [purchaseId, setPurchaseId] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [purchaseList, setPurchaseList] = useState([]);

  useEffect(() => {
    handleGenerate();
    getData();
  }, []);

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
      path: "partNumber",
      label: "Part Number",
    },
    {
      path: "quantity",
      label: "Quantity",
    },
    {
      path: "Edit",
      label: "Actions",
      nonExportable: true,
      columnStyle: { width: "5%" },
      content: useCallback(
        (role) => {
          return (
            <div>
              <IconButton
                onClick={() => {
                  setShowConfirm(true);
                  setPurchaseId(role.partNumber);
                }}
              >
                <DeleteIcon color="error" />
              </IconButton>
            </div>
          );
        },
        [purchaseId]
      ),
    },
  ];

  const getData = useCallback(async () => {
    // toggleLoading(true);
    const [inventoryData, purchaseData] = await Promise.all([
      inventoryServices.getInventory(),
      purchaseServices.getPurchaseList(),
    ]);

    dispatch(updateInventory(inventoryData));
    dispatch(updatePurchase(purchaseData));
    //toggleLoading(false);
  }, [dispatch]);

  useMemo(() => {
    //if () {
    const purchasableData = purchaseList;
    if (purchasableData) {
      location?.state?.data?.forEach((partNumber, quantity) => {
        let shortageQuantity = location.state.shortageQuantity[quantity];
        purchasableData.push({
          partNumber: partNumber,
          quantity: shortageQuantity,
        });
      });

      setPurchaseList(purchasableData);
    }
    // }
  }, [purchaseList]);

  const sortedPurchaseData = useMemo(() => {
    let sorted = [];
    if (sortColumn === "partNumber") {
      sorted = _.orderBy(purchaseInput, "partNumber", sortOrder);
    } else if (sortColumn === "quantity") {
      sorted = _.orderBy(purchaseInput, "quantity", sortOrder);
    } else {
      sorted = _.orderBy(purchaseList, sortColumn, sortOrder);
    }
    return sorted;
  }, [purchaseInput, sortColumn, sortOrder]);

  // schema validation for add purchase order
  const schema = () => ({
    description: Joi.string()
      .allow("")
      .trim()
      .required()
      .label("Description")
      .messages({ "string.empty": "Description is Required" }),
    partNumber: Joi.string().trim().required().label("Part Number"),
    quantity: Joi.number().integer().min(1).required().label("Quantity"),
  });

  // to generate purchase order number
  const handleGenerate = () => {
    setPurchaseInput({ ...purchaseInput, purchaseNumber: Date.now() });
  };

  // handle change event for purchase order

  const handleChange = ({ target: { value, name } }, option) => {
    const newData = { ...purchaseInput };
    console.log(value);
    if (name === "partNumber") {
      newData.partNumber = option ? option.partNumber : "";
      //newData.partDescription = option ? option.partDescription : "";
    } else {
      newData[name] = value;
      setErrors("");
    }
    if (option || name === "partNumber") {
      setSelectedOption(option);
    }
    if (option) setSelectedOption(option);
    setPurchaseInput(newData);
  };

  const getCustomOption = (option) => {
    return {
      id: option?._id,
      label: option
        ? option?.partNumber +
          (option?.partDescription ? "-" + option?.partDescription : "")
        : "",
    };
  };

  const groupedProductData = useMemo(() => {
    let result = [];
    let obj = {};
    let filtered = [inventory];

    let flattenedFiltered = filtered.flat();

    flattenedFiltered.forEach((item) => {
      if (item) {
        const currentItem = item;
        if (!obj[currentItem.partNumber]) {
          obj[currentItem.partNumber] = {
            id: item.partNumber,
            partNumber: currentItem.partNumber ? currentItem.partNumber : null,
            quantity: 0,
            partDescription: currentItem.partDescription,
          };
          return result.push(obj[currentItem.partNumber]);
        }

        obj[currentItem.partNumber].quantity += Number(currentItem.quantity);
      }
    });

    return result;
  }, [inventory]);

  // To delete purchase part numbers
  const onDeletePartNumber = () => {
    let filterItem = purchaseList.filter(
      (items) => items.partNumber !== purchaseId
    );

    setPurchaseList(filterItem);

    onCancel();
  };

  // cancel modal
  const onCancel = () => {
    setShowConfirm(false);
    setPurchaseId("");
  };

  //handleAdd for submit purchase order
  const handleAdd = useCallback(() => {
    const newData = purchaseList;

    let validateForm = validateServices.validateForm(purchaseInput, schema());
    if (validateForm) {
      setErrors(validateForm);
    } else if (purchaseInput.partNumber && purchaseInput.quantity) {
      let found = newData.find(
        (f) => f.partNumber === purchaseInput.partNumber
      );
      if (found) {
        found.quantity += Number(purchaseInput.quantity);
      } else {
        newData.push({
          partNumber: purchaseInput.partNumber,
          quantity: Number(purchaseInput.quantity),
        });
      }

      setPurchaseList(newData);
      setSelectedOption(null);
      setPurchaseInput({
        purchaseNumber: purchaseInput.purchaseNumber,
        quantity: "",
        description: purchaseInput.description,
      });
    }
  }, [purchaseInput, purchaseList]);

  // on submit to save for purchase order list
  const onSubmit = async () => {
    setIsLoading(true);
    let added = await purchaseServices.addPurchaseList({
      purchaseNumber: purchaseInput.purchaseNumber,
      description: purchaseInput.description,
      items: purchaseList,
    });
    if (added) {
      navigate(routes.purchaseOrders);
      setIsLoading(false);
    }
  };

  return (
    <div className="d-grid gap-2 m-2">
      <div className="px-3 py-2 d-flex justify-content-between">
        <h3 className="breadCrumbsHeader boldFont">Add Purchase Order</h3>
        <Breadcrumbs
          options={[
            {
              name: "Add Purchase Order",
              pathName: routes.inventory,
            },
          ]}
          activePath={routes.inventory}
        />
      </div>
      <Container maxWidth="xxl">
        <Card className="p-2 shadow-sm">
          <div className="d-flex justify-content-end mb-2">
            <Button
              name="Submit"
              disabled={purchaseList.length === 0}
              onClick={onSubmit}
            />
          </div>
          <div className="d-grid gap-2">
            <div className="d-grid gap-3 mb-3">
              <Input
                name="purchaseNumber"
                disabled={true}
                label="Purchase Order Number"
                value={purchaseInput.purchaseNumber}
                error={errors.purchaseNumber}
                required
              />

              <Input
                name="description"
                label="Description"
                value={purchaseInput.description}
                onChange={handleChange}
              />
              <div style={{ height: "35px" }} className="d-flex gap-2">
                <AutoComplete
                  options={groupedProductData}
                  name="partNumber"
                  label="Part Number"
                  onChange={handleChange}
                  getCustomOption={getCustomOption}
                  value={selectedOption}
                  error={errors.partNumber}
                />
                <Input
                  name="quantity"
                  label="Quantity"
                  value={purchaseInput.quantity}
                  onChange={handleChange}
                  error={errors.quantity}
                  required
                />
                <div className="d-flex">
                  <Button
                    name={"Add"}
                    onClick={handleAdd}
                    isLoading={isLoading}
                  />
                </div>
              </div>
            </div>
            <DataTable
              columns={columns}
              rows={sortedPurchaseData}
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
        onAgree={onDeletePartNumber}
        showConfirm={showConfirm}
        content={"Are you sure want to delete"}
        title={"Delete"}
      />
    </div>
  );
};

export default AddPurchase;
