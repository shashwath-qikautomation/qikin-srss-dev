import { TableSortLabel } from "@mui/material";
import { Box } from "@mui/system";
import { visuallyHidden } from "@mui/utils";

function DataTableHeader({
  columns,
  order,
  orderBy,
  onRequestSort,
  hideBorders,
}) {
  const createSortHandler = (property, isCustomSort) => (event) => {
    onRequestSort(event, property, isCustomSort);
  };

  const renderHeaderCell = (column) => {
    return column.header ? column.header(column) : column.label;
  };

  return (
    <thead
    // className="sticky"
    // style={{
    //   position: "sticky",
    //   position: "-webkit-sticky",
    // }}
    >
      <tr>
        {columns.map((column, index) => (
          <td
            key={column.path || column.label || index + "dataTableHeader"}
            style={{
              // position: "sticky",
              border: hideBorders ? "none" : "1px solid #ddd",
              fontWeight: "bold",
              textAlign: "center",
              ...column.columnStyle,
              fontSize: "14px",
              padding: "10px",
            }}
          >
            {column.sortable ? (
              <TableSortLabel
                active={orderBy === column.path}
                direction={orderBy === column.path ? order : "asc"}
                onClick={createSortHandler(column.path, column.isCustomSort)}
              >
                {renderHeaderCell(column)}
                {orderBy === column.path ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            ) : (
              renderHeaderCell(column)
            )}
          </td>
        ))}
      </tr>
    </thead>
  );
}

export default DataTableHeader;
