import * as XLSX from "xlsx";
import PaperParse from "papaparse";
import { toast } from "react-toastify";

export const readBOMFile = async (files, workOrderFields) => {
  if (!workOrderFields) {
    throw new Error("workOrderFields is undefined or null");
  }

  if (files && files[0]) {
    let file = files[0];
    try {
      let result = [];
      let fileName = file.name;
      if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
        result = await readExcelFile(file);
      } else if (fileName.endsWith(".csv")) {
        result = await readDataFromCSV(file);
      }

      const rowData = [];
      let headerRow = [];
      if (result && result.length > 1) {
        headerRow = result[0];
        result.slice(1).forEach((m) => {
          if (m && m.length >= 1 && m[0]) {
            let row = {};
            m.forEach((fm, colIndex) => {
              let found = workOrderFields.find(
                (f) => headerRow[colIndex] === f.label
              );
              if (found) {
                row[found.path] = fm;
              } else {
                row[headerRow[colIndex]] = fm;
              }
            });
            rowData.push(row);
          }
        });
        let impCol = [];
        headerRow.forEach((f) => {
          let found = workOrderFields.find((wf) => f === wf.label);
          console.log("found", found);
          if (found) {
            impCol.push(found);
          } else {
            impCol.push({ path: f, label: f });
          }
        });
        return { BOMData: rowData, BOMImportColumns: impCol };
      } else {
        toast.error("File does not contain any values");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error while reading file");
    }
  }
};

export const readExcelFile = async (file) => {
  const result = await new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.onload = function (e) {
      let data = e.target.result;
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

export const readDataFromCSV = async (file) => {
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

export const onFieldChange = (
  BOMImportColumns,
  BOMData,
  index,
  newValue,
  prevCol
) => {
  const newBOMImportedColumn = [...BOMImportColumns];
  const newPathValue = newValue.path
    ? newValue.path
    : newBOMImportedColumn[index].label;

  if (newPathValue !== prevCol) {
    newBOMImportedColumn[index] = {
      label: newBOMImportedColumn[index].label,
      path: newPathValue,
    };
    let newBOMData = [...BOMData];
    newBOMData = newBOMData.map((m) => {
      let value = { ...m };
      m[newPathValue] = value[prevCol];
      delete m[prevCol];
      return m;
    });
    return { newBOMImportedColumn, newBOMData };
  }
};
