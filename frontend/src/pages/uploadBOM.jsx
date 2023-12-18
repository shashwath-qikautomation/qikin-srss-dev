import UploadFileIcon from "@mui/icons-material/UploadFile";
import { Card, Chip, Container, Divider } from "@mui/material";
import Joi from "joi";
import _ from "lodash";
import PaperParse from "papaparse";
import React, {
  createRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";

import { useNavigate } from "react-router-dom";
import PDFViewer from "../../components/PDFViewer/PDFViewer";
import BigCalender from "../../components/bigCalender";
import Breadcrumbs from "../../components/breadcrumbs";
import Button from "../../components/button";
import DataTable from "../../components/dataTable";
import RenderDateTimePicker from "../../components/dateTimePicker";
import Input from "../../components/input";
import Modal from "../../components/modal";
import RenderSelect from "../../components/renderSelect";
import ShowLoading from "../../components/showLoading";
import { constructWorkOrderNumber } from "../../helper/BOM/workorderNumber";
import routes from "../../helper/routes";
import {
  THRESHOLD_LIMIT,
  updateProductionLine,
  updateProducts,
  updateUsers,
  updateWorkOrder,
} from "../../redux/action";
import productService from "../../services/productService";
import productionLine from "../../services/productionlineServices";
import userServices from "../../services/userServices";
import validateServices from "../../services/validateServices";
import workOrderServices from "../../services/workOrderServices";
import WorkOrderImport from "./workOrderImport";
import thresholdServices from "../../services/thresholdServices";

const UploadBOM = () => {
  const [BOMData, setBOMData] = useState([]);
  const [BOMImportColumns, setBomImportColumns] = useState([]);
  const [showMapFields, toggleShowMapFields] = useState(false);
  const [isLoading, toggleLoading] = useState(false);
  const [quantityMissingPN, setQuantityMissingPN] = useState(null);
  const [showPdf, toggleShowPdf] = useState(false);
  const [errors, setErrors] = useState({});
  const [partNumbersNotFound, setPartNumbersNotFound] = useState(null);
  const [workOrderDetails, setInputData] = useState({
    workOrderNumber: "",
    description: "",
    inCharge: "",
    planDate: "",
    endDate: "",
    productionLine: "",
    productName: "",
    numberOfItemsToProduce: "",
  });
  const [BOMDataErrors, setBOMDataErrors] = useState({});
  const [SOPFile, setSOPFile] = useState("");
  const [isPageLoading, togglePageLoading] = useState(false);

  const {
    userList,
    inventoryData,
    workOrderFields,
    companyData,
    productionLineData,
    workOrderData,
    threshold,
  } = useSelector((state) => state);
  const workOrderRef = React.createRef();
  const sopDocRef = createRef();

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [modalCalender, setModalCalender] = useState(false);

  const handleClick = () => {
    setModalCalender(true);
  };

  const handleClose = () => {
    setModalCalender(false);
  };
  const filteredInventory = useMemo(() => {
    let filteredThreshold = threshold.filter((value) => value?.reserved == 1);
    let groupedThreshold = _.groupBy(filteredThreshold, "partNo");

    return inventoryData.filter((reel) => {
      let date = reel?.reelStock?.expireDate;
      let expiryDate = date ? new Date(date).setHours(0, 0, 0, 0) : "";
      return (
        reel.reserved !== 1 &&
        expiryDate >= new Date().getTime() &&
        !groupedThreshold[reel.reelStock?.pnNumber]
      );
    });
  }, [inventoryData, threshold]);

  const calenderData = useMemo(() => {
    let data = workOrderData?.map((e) => ({
      end: new Date(e.endDate),
      id: e.id,
      start: new Date(e.planDate),
      title: e.workOrderNumber,
      status: e.status,
    }));
    return data;
  }, [workOrderData]);

  const schema = () => ({
    workOrderNumber: Joi.string().required().label("Work Order Number"),
    description: Joi.string().allow("").label("Description"),
    inCharge: Joi.string()
      .required()
      .label("Incharge")
      .messages({
        "string.base": t("workOrderValidate.incharge"),
        "string.empty": t("workOrderValidate.incharge"),
      }),
    planDate: Joi.date()
      .required()
      .label("Plan Date")
      .messages({
        "date.base": t("workOrderValidate.planDate"),
      }),
    endDate: Joi.date()
      .required()
      .label("End Date")
      .messages({
        "date.base": t("workOrderValidate.endDate"),
      }),
    productionLine: Joi.string()
      .label("Production Line")
      .messages({
        "string.base": t("workOrderValidate.productionLine"),
        "string.empty": t("workOrderValidate.productionLine"),
      }),
    numberOfItemsToProduce: Joi.number()
      .integer()
      .min(1)
      .label("Number of Items to Produce")
      .messages({
        "number.base": t("workOrderValidate.numberOfItemsToProduce"),
        "number.integer": t("workOrderValidate.numberOfItemsToProduce"),
      }),
    productName: Joi.string()
      .required()
      .label("Product Name")
      .messages({
        "string.base": t("workOrderValidate.productName"),
        "string.empty": t("workOrderValidate.productName"),
      }),
  });

  const BOMSchema = useCallback(
    () => ({
      partNumber: Joi.string().required(),
      quantity: Joi.number().integer().greater(0).required(),
    }),
    []
  );

  const missingQuantityColumns = [
    { path: "partNumber", label: "inventory.partNumber" },
    {
      path: "quantity",
      label: t("inventory.quantity"),
    },
    {
      path: "totalQty",
      label: t("workOrder.availableQuantity"),
    },
  ];

  const partNumberNotFoundColumns = [
    {
      path: "partNumber",
      label: t("inventory.partNumber"),
    },
    {
      path: "quantity",
      label: t("inventory.quantity"),
    },
  ];

  const getData = useCallback(async () => {
    togglePageLoading(true);
    const workOrderPayload = await workOrderServices.getWorkOrderData();
    const productionLinePayload = await productionLine.getProductionLineData();
    const userPayload = await userServices.getUsers();
    const productPayload = await productService.getProducts();
    const threshold = await thresholdServices.getThreshold();

    dispatch(updateWorkOrder(workOrderPayload));
    dispatch(updateProductionLine(productionLinePayload));
    dispatch(updateUsers(userPayload));
    dispatch(updateProducts(productPayload));
    dispatch({ type: THRESHOLD_LIMIT, payload: threshold });
    togglePageLoading(false);
  }, [dispatch]);

  useEffect(() => {
    getData();
  }, [getData]);

  const filteredUserList = useMemo(() => {
    return userList.filter((f) => f?.role?.name === "Production");
  }, [userList]);

  const handleCloseModal = useCallback(() => {
    toggleShowMapFields(false);
    setQuantityMissingPN(null);
    setPartNumbersNotFound(null);
  }, []);

  const onShowPdf = useCallback(() => {
    toggleShowPdf(true);
  }, []);

  const onUploadAreaClick = useCallback(() => {
    sopDocRef.current.value = "";
    sopDocRef.current.click();
  }, [sopDocRef]);

  const onSOPFileSelect = useCallback(({ target: { files } }) => {
    if (files && files[0]) {
      setSOPFile(files[0]);
    }
  }, []);

  const clearSelectedSOPFile = useCallback(() => {
    sopDocRef.current.value = "";
    setSOPFile("");
  }, [sopDocRef]);

  const generateWorkOrderNumber = useCallback(() => {
    let generatedNumber = constructWorkOrderNumber(
      companyData,
      workOrderDetails.workOrderNumber
    );
    if (generatedNumber) {
      setInputData({
        ...workOrderDetails,
        workOrderNumber: generatedNumber,
      });
    } else {
      toast.warning("Something went wrong");
    }
  }, [workOrderDetails, companyData]);

  //
  const onMissMatchFieldChange = (index, newValue, prevCol) => {
    const newColumns = [...BOMImportColumns];
    const newPathValue = newValue.path
      ? newValue.path
      : newColumns[index].label;

    if (newPathValue !== prevCol) {
      newColumns[index] = {
        label: newColumns[index].label,
        path: newPathValue,
      };
      let newImportedData = [...BOMData];
      newImportedData = newImportedData.map((m) => {
        let value = { ...m };
        m[newPathValue] = value[prevCol];
        delete m[prevCol];
        return m;
      });
      setBOMData(newImportedData);
      setBomImportColumns(newColumns);
    }
  };

  const readExcelFile = async (file) => {
    const result = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = function (e) {
        const data = e.target.result;
        let readData = XLSX.read(data, { type: "binary" });
        const wsName = readData.SheetNames[0];
        const ws = readData.Sheets[wsName];

        const dataParse = XLSX.utils.sheet_to_json(ws, { header: 1 });
        resolve(dataParse);
      };
      reader.readAsBinaryString(file);
    });

    return result;
  };

  const readDataFromCSV = async (file) => {
    const result = await new Promise((resolve, reject) => {
      PaperParse.parse(file, {
        complete: function (results) {
          resolve(results.data);
        },
        error: () => {
          reject([]);
        },
      });
    });
    return result;
  };

  const onImportWorkOrderImport = async ({ target: { files } }) => {
    let file = files ? files[0] : null;
    if (file) {
      try {
        let result = [];
        if (file.name.includes("xlsx") || file.name.includes("xls")) {
          result = await readExcelFile(file);
        } else if (file.name.includes("csv")) {
          result = await readDataFromCSV(file);
        }

        const rowData = [];
        let headers = [];
        if (result && result.length > 1) {
          headers = result[0];
          result.slice(1).forEach((m) => {
            if (m && m.length >= 1) {
              let row = {};
              m.forEach((fm, colIndex) => {
                let found = workOrderFields.find(
                  (f) => headers[colIndex] === f.label
                );
                if (found) {
                  row[found.path] = fm;
                } else {
                  row[headers[colIndex]] = fm;
                }
              });
              rowData.push(row);
            }
          });
          let impCol = [];
          headers.forEach((f) => {
            let found = workOrderFields.find((wf) => f === wf.label);
            if (found) {
              impCol.push(found);
            } else {
              impCol.push({ path: f, label: f });
            }
          });
          setBOMData(rowData);
          setBomImportColumns(impCol);
          setBOMDataErrors({});
        } else {
          toast.error("File does not contain any values");
        }
      } catch (error) {
        toast.error("Error while reading file");
      }
    }
  };

  const handleChange = useCallback(
    ({ target: { value, name } }) => {
      let newInputData = { ...workOrderDetails };
      newInputData[name] = value;
      setInputData(newInputData);
      setErrors({});
    },
    [workOrderDetails]
  );

  const processBOMData = useCallback(() => {
    let groupedOnSamePN = Array.from(
      BOMData.reduce((prev, { partNumber, quantity }) => {
        let pn = partNumber.toString().trim();
        return prev.set(
          pn,
          (prev.get(pn) || 0) +
            Number(quantity) * workOrderDetails.numberOfItemsToProduce
        );
      }, new Map()),
      ([partNumber, quantity]) => ({ partNumber, quantity })
    );

    return groupedOnSamePN;
  }, [BOMData, workOrderDetails]);

  const validateBOMDates = useCallback(
    (newWorkOrderDetails) => {
      let workOrderErrors = {};
      if (newWorkOrderDetails.planDate >= newWorkOrderDetails.endDate) {
        workOrderErrors["endDate"] =
          "End date should be greater than plan date";
      } else {
        let workOrderFound = workOrderData.find((f) => {
          if (f.status != 6 && f.delete != 1) {
            return (
              f.productionLine._id === workOrderDetails.productionLine &&
              ((workOrderDetails.planDate.getTime() >=
                new Date(f.planDate).getTime() &&
                workOrderDetails.planDate.getTime() <=
                  new Date(f.endDate).getTime()) ||
                (workOrderDetails.endDate.getTime() >=
                  new Date(f.planDate).getTime() &&
                  workOrderDetails.endDate.getTime() <=
                    new Date(f.endDate).getTime()))
            );
          }
        });
        if (workOrderFound) {
          workOrderErrors["scheduleError"] =
            "There is already a work order in same time period";
        }
      }
      return Object.entries(workOrderErrors).length > 0
        ? workOrderErrors
        : null;
    },
    [
      workOrderData,
      workOrderDetails?.endDate,
      workOrderDetails?.planDate,
      workOrderDetails?.productionLine,
    ]
  );

  const validateBOMData = useCallback(() => {
    const validateError = {};
    BOMData.forEach((f, index) => {
      if (!f.partNumber) {
        validateError[index] = "Part Number Missing";
      } else if (
        validateServices.validateField(Number(f.quantity), BOMSchema().quantity)
      ) {
        validateError[index] = "Quantity should be positive integer";
      }
    });
    return Object.entries(validateError).length > 0 ? validateError : null;
  }, [BOMData, BOMSchema]);

  const submitData = useCallback(
    async (newWorkOrderDetails) => {
      if (BOMData?.length === 0) {
        toast.error("Please select BOM");
        return;
      }

      const workOrderDetailsError = validateServices.validateForm(
        newWorkOrderDetails,
        schema()
      );
      if (workOrderDetailsError) {
        setErrors(workOrderDetailsError);
        return;
      }

      const dateErrors = validateBOMDates(newWorkOrderDetails);
      if (dateErrors) {
        setErrors(dateErrors);
        return;
      }

      const validatedBOMError = validateBOMData();
      if (validatedBOMError) {
        setBOMDataErrors(validatedBOMError);
        return;
      }

      let processData = processBOMData();
      if (processData) {
        let newWorkOrder = new FormData();
        Object.entries(newWorkOrderDetails).forEach(([key, value]) => {
          newWorkOrder.append(key, value);
        });
        newWorkOrder.append("sopDoc", SOPFile);
        const added = await workOrderServices.addBOMData({
          workOrderData: newWorkOrder,
          workOrderItems: processData,
        });
        if (added) {
          navigate(routes.editWorkOrder + "/" + added.id);
          toast.success("Work order added");
        }
      }
    },
    [
      BOMData,
      validateBOMData,
      validateBOMDates,
      processBOMData,
      SOPFile,
      navigate,
    ]
  );

  const doSubmit = useCallback(async () => {
    try {
      toggleLoading(true);
      let updatedWorkOrderData = { ...workOrderDetails };
      let generatedNumber = constructWorkOrderNumber(
        companyData,
        workOrderDetails.workOrderNumber
      );
      if (generatedNumber) {
        updatedWorkOrderData.workOrderNumber = generatedNumber;
        await submitData(updatedWorkOrderData);
      } else {
        toast.error("Please enter work order number");
      }
      toggleLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Error while uploading BOM");
      toggleLoading(false);
    }
  }, [workOrderDetails, companyData, submitData]);

  const getCustomOption = useCallback((option) => {
    return {
      id: option.id,
      name: option ? option.firstName + option.lastName : "",
    };
  }, []);

  const handleModalClose = useCallback(() => {
    toggleShowPdf(false);
  }, []);

  return (
    <div className="d-grid gap-2 mt-2">
      <div className="px-2 d-flex justify-content-between">
        <h3 className="breadCrumbsHeader boldFont">upload BOM</h3>
        <Breadcrumbs
          options={[
            {
              name: t("dashboard.workOrders"),
              pathName: routes.workOrders,
            },
            {
              name: "upload BOM",
              pathName: routes.uploadWorkOrderBOM,
            },
          ]}
          activePath={routes.uploadWorkOrderBOM}
        />
      </div>
      <Container maxWidth="xxl">
        <Card className="shadow-sm ">
          {!isPageLoading ? (
            <div className="d-grid gap-2 p-2">
              <input
                type={"file"}
                style={{ display: "none" }}
                ref={workOrderRef}
                accept={".csv ,.xls,.xlsx,"}
                onChange={onImportWorkOrderImport}
              />
              <div className="addWorkOrder">
                <div className="workOrderDetailsArea ">
                  <div className="d-flex gap-2 align-items-start">
                    <Input
                      name="workOrderNumber"
                      label={t("workOrder.workOrderNumber")}
                      className="flex-grow-1"
                      value={workOrderDetails.workOrderNumber}
                      onChange={handleChange}
                      error={errors.workOrderNumber}
                    />
                    <Button
                      name={t("workOrder.generate")}
                      onClick={generateWorkOrderNumber}
                    />
                  </div>
                  <div className="d-flex  gap-2">
                    <RenderSelect
                      fullWidth
                      name="inCharge"
                      label={t("workOrder.inCharge")}
                      options={filteredUserList}
                      getCustomOption={getCustomOption}
                      value={workOrderDetails.inCharge}
                      onChange={handleChange}
                      error={errors.inCharge}
                      required
                    />
                    <RenderSelect
                      fullWidth
                      options={productionLineData}
                      name="productionLine"
                      label={t("workOrder.productionLine")}
                      onChange={handleChange}
                      value={workOrderDetails.productionLine}
                      error={errors.productionLine}
                      required
                    />
                  </div>
                  <div className="card p-2 gap-2">
                    <div className="d-flex gap-2">
                      <RenderDateTimePicker
                        fullWidth={true}
                        maxDate={workOrderDetails.endDate}
                        minDate={new Date()}
                        name="planDate"
                        label={t("workOrder.planDate")}
                        onChange={handleChange}
                        value={workOrderDetails.planDate}
                        error={errors.planDate}
                        required
                      />
                      <RenderDateTimePicker
                        fullWidth={true}
                        name="endDate"
                        label={t("workOrder.endDate")}
                        onChange={handleChange}
                        value={workOrderDetails.endDate}
                        error={errors.endDate}
                        minDate={
                          workOrderDetails.planDate
                            ? new Date(workOrderDetails.planDate)
                            : new Date()
                        }
                        required
                      />
                    </div>
                    <div className="d-flex">
                      <span className="flex-grow-1">
                        {errors.scheduleError && (
                          <span style={{ fontSize: "12px", color: "red" }}>
                            {errors.scheduleError}
                          </span>
                        )}
                      </span>
                      <Chip
                        sx={{ fontSize: "10px" }}
                        label={"Check availability"}
                        onClick={handleClick}
                      ></Chip>
                    </div>
                  </div>
                  <Input
                    name="productName"
                    label={t("workOrder.productName")}
                    value={workOrderDetails.productName}
                    onChange={handleChange}
                    error={errors.productName}
                    required
                  />
                  <Input
                    name="numberOfItemsToProduce"
                    label={t("workOrder.numberOfItemsToProduce")}
                    onChange={handleChange}
                    value={workOrderDetails.numberOfItemsToProduce}
                    error={errors.numberOfItemsToProduce}
                    required
                  />
                  <Input
                    name="description"
                    label={t("workOrder.description")}
                    value={workOrderDetails.description}
                    onChange={handleChange}
                    error={errors.description}
                  />
                </div>
                <div className="sopArea ">
                  <div className="d-grid gap-2 justify-content-center">
                    <span className=" normalFont">Upload SOP </span>
                    <input
                      style={{ display: "none" }}
                      className="form-control"
                      type="file"
                      accept="application/pdf"
                      ref={sopDocRef}
                      onChange={onSOPFileSelect}
                    />
                    {SOPFile ? (
                      <PDFViewer
                        filePath={SOPFile}
                        onClick={onShowPdf}
                        clearFile={clearSelectedSOPFile}
                      />
                    ) : (
                      <div className="d-flex flex-column justify-content-center">
                        <div className="chooseFile" onClick={onUploadAreaClick}>
                          <UploadFileIcon fontSize="large" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <Divider sx={{ backgroundColor: "grey" }} />
              <div>
                <div className="d-flex gap-2">
                  <Button
                    name={t("workOrder.importBOM")}
                    onClick={() => {
                      workOrderRef.current.value = "";
                      workOrderRef.current.click();
                    }}
                  />
                  <Button
                    name={t("buttons.clear")}
                    onClick={() => {
                      workOrderRef.current.value = "";
                      setBomImportColumns([]);
                      setBOMData([]);
                      setBOMDataErrors({});
                    }}
                    disabled={!BOMData.length > 0}
                  />
                  <Button
                    name={t("workOrder.mapFields")}
                    onClick={() => toggleShowMapFields(true)}
                    disabled={!BOMData.length > 0}
                  />
                </div>
              </div>
              {BOMImportColumns.length > 0 && (
                <WorkOrderImport
                  workOrderColumns={BOMImportColumns}
                  data={BOMData}
                  onMissMatchFieldChange={onMissMatchFieldChange}
                  showMapFields={showMapFields}
                  handleCloseModal={handleCloseModal}
                  BOMDataErrors={BOMDataErrors}
                />
              )}
              {quantityMissingPN && (
                <Modal onClose={handleCloseModal} width="80%">
                  <div className="d-grid gap-3 m-3">
                    <div className="text-center " style={{ color: "red" }}>
                      For the following part numbers we currently do not have
                      required quantity
                    </div>
                    <DataTable
                      columns={missingQuantityColumns}
                      rows={quantityMissingPN}
                    />
                  </div>
                </Modal>
              )}
              {partNumbersNotFound && (
                <Modal onClose={handleCloseModal} width="100%" height="100%">
                  <div className="d-grid gap-3 m-3">
                    <div className="text-center " style={{ color: "red" }}>
                      For the following part numbers are not in inventory
                    </div>
                    <DataTable
                      columns={partNumberNotFoundColumns}
                      rows={partNumbersNotFound}
                    />
                  </div>
                </Modal>
              )}
              <div className="d-flex justify-content-end modal-btn">
                <Button
                  name={t("buttons.submit")}
                  onClick={doSubmit}
                  isLoading={isLoading}
                />
              </div>
            </div>
          ) : (
            <ShowLoading />
          )}
        </Card>
        {showPdf && (
          <Modal onClose={handleModalClose} width={"60%"} height={"95%"}>
            <PDFViewer filePath={SOPFile} width={600} />
          </Modal>
        )}
        {modalCalender && (
          <Modal
            open={modalCalender}
            onClose={() => handleClose()}
            width={1000}
            title="Calender"
          >
            <div>
              <BigCalender event={calenderData} />
            </div>
          </Modal>
        )}
      </Container>
    </div>
  );
};

export default UploadBOM;
