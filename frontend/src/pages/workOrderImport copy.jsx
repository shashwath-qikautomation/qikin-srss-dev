import { Badge, Tooltip } from "@mui/material";
import { Box } from "@mui/system";
import { useSelector } from "react-redux";
import DataTable from "../../components/dataTable";
import Modal from "../../components/modal";
import MapFields from "./mapFields";
import { useTranslation } from "react-i18next";
import { useCallback, useState } from "react";
const WorkOrderImport = ({
  data,
  workOrderColumns,
  onMissMatchFieldChange,
  showMapFields,
  handleCloseModal,
  BOMDataErrors,
}) => {
  // console.log(BOMDataErrors);
  const { workOrderFields } = useSelector((state) => state);
  const [sortColumn, setSortColumn] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showDetails, setShowDetails] = useState(null);
  const { t } = useTranslation();
  const getRowClassName = useCallback(
    (row, rowIndex) => {
      return BOMDataErrors[currentPage * rowsPerPage + rowIndex] ? "bgRed" : "";
    },
    [BOMDataErrors, currentPage, rowsPerPage]
  );
  const getColumns = () => {
    const columns = workOrderColumns.map((m) => {
      let found = workOrderFields.find((f) => f.path === m.path);
      return {
        header: () => {
          return (
            <div className="d-flex gap-2 align-items-center">
              <Badge>
                <Box
                  component="span"
                  sx={{
                    backgroundColor: found ? "green" : "red",
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                  }}
                />
              </Badge>
              {found ? (
                <Tooltip title={found.path} arrow>
                  <span>{m.label}</span>
                </Tooltip>
              ) : (
                <span>{m.label}</span>
              )}
            </div>
          );
        },
        path: found ? found.path : m.label,
        label: m.label,
      };
    });
    columns.push({
      path: "error",
      content: (e, i) => {
        return <div>{BOMDataErrors[currentPage * rowsPerPage + i]}</div>;
      },
    });

    return columns;
  };
  const columns = getColumns();

  return (
    <div style={{ overflow: "auto" }}>
      {showMapFields && (
        <Modal
          title={t("workOrder.mapFields")}
          onClose={handleCloseModal}
          width={"70%"}
        >
          <MapFields
            columns={columns}
            onMissMatchFieldChange={onMissMatchFieldChange}
            data={data}
            handleCloseModal={handleCloseModal}
          />
        </Modal>
      )}

      <DataTable
        columns={columns}
        rows={data}
        getRowClassName={getRowClassName}
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
  );
};

export default WorkOrderImport;
