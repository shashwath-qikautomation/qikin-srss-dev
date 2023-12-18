import React, { useState } from "react";
import Button from "../../components/Button";
import WorkOrderImport from "../workOrderImport";
import { useSelector } from "react-redux";
import { readBOMFile } from "../readBOM";
import { Divider } from "@mui/material";
const ImportBOM = ({
  BOMData,
  BOMImportColumns,
  onMissMatchFieldChange,
  setBOMFileData,
  getRowClassName,
  BOMDataErrors,
}) => {
  const [showMapFields, toggleShowMapFields] = useState(false);
  const workOrderRef = React.createRef();
  const { workOrderFields } = useSelector((state) => state);

  const handleCloseModal = () => {
    toggleShowMapFields(false);
  };

  const onImportWorkOrderImport = async ({ target: { files } }) => {
    const dataFromFile = await readBOMFile(files, workOrderFields);

    if (dataFromFile) {
      setBOMFileData(dataFromFile.BOMData, dataFromFile.BOMImportColumns);
      // setBOMData(dataFromFile.BOMData);
      // setBomImportColumns(dataFromFile.BOMImportColumns);
    }
  };

  return (
    <div>
      <input
        type={"file"}
        style={{ display: "none" }}
        ref={workOrderRef}
        accept={".csv,.xls,.xlsx,"}
        onChange={onImportWorkOrderImport}
      />

      <div>
        <div className="d-flex gap-2 mb-2">
          <Button
            name="import BOM"
            onClick={() => {
              workOrderRef.current.value = "";
              workOrderRef.current.click();
            }}
          />
          <Button
            name="clear"
            onClick={() => {
              workOrderRef.current.value = "";
              setBOMFileData([], []);
            }}
            disabled={!BOMData.length > 0}
          />
          <Button
            name="map Fields"
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
          getRowClassName={getRowClassName}
          BOMDataErrors={BOMDataErrors}
        />
      )}
    </div>
  );
};

export default ImportBOM;
