import React, { useCallback, useState } from "react";
import RenderSelect from "./RenderSelect";
//import { useTranslation } from "react-i18next";
import { PdfGenerator } from "./PdfGenerator";
import * as XLSX from "xlsx";
import { useSelector } from "react-redux";

const ExportTableData = ({
  columns,
  tableData,
  hiddenColumns,
  fileName,
  tableHeader,
}) => {
  //const { t } = useTranslation();
  const { companyData } = useSelector((state) => state);
  const [selected, setSelected] = useState("download");
  const exportOptions = [
    { id: "download", name: "Download" },
    { id: "pdf", name: "Pdf" },
    { id: "excel", name: "Excel" },
  ];

  const getExportColumns = useCallback(() => {
    return columns.filter((f) => !hiddenColumns[f.path] && !f.nonExportable);
  }, [columns, hiddenColumns]);

  const downloadExcel = useCallback(
    (data) => {
      const workSheet = XLSX.utils.json_to_sheet(data);
      const workBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workBook, workSheet, "data");
      XLSX.write(workBook, { bookType: "xlsx", type: "binary" });
      XLSX.writeFile(workBook, fileName + ".xlsx");
    },
    [fileName]
  );

  const onExportData = useCallback(
    ({ target: { value } }) => {
      setSelected(value);
      let filteredColumns = getExportColumns();
      let exportData = tableData.map((reel, index) => {
        let obj = {};
        filteredColumns.forEach((col) => {
          let key = value === "excel" ? col.label : col.path;
          if (col.path === "#") obj[[key]] = index + 1;
          else obj[[key]] = col.getValue ? col.getValue(reel) : reel[col.path];
        });
        return obj;
      });
      if (value === "excel") {
        downloadExcel(exportData);
      } else if (value === "pdf") {
        const companyDetails =
          companyData && companyData.data && companyData.data[0]
            ? companyData.data[0]
            : {};
        PdfGenerator(
          filteredColumns,
          companyDetails,
          exportData,
          fileName,
          tableHeader
        );
      }
    },
    [
      companyData,
      downloadExcel,
      fileName,
      getExportColumns,
      tableData,
      tableHeader,
    ]
  );

  return (
    <RenderSelect
      value={selected}
      options={exportOptions}
      onChange={onExportData}
    />
  );
};

export default ExportTableData;
