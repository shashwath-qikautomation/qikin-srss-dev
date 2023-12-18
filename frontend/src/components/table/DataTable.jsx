import * as React from "react";
import TablePagination from "@mui/material/TablePagination";
import { Menu, MenuItem } from "@mui/material";
import CheckBox from "../CheckBox";
import DataTableHeader from "./DataTableHeader";
import DataTableBody from "./DataTableBody";

export default function DataTable({
  columns = [],
  rows = [],
  onRowClick,
  getRowClassName = () => {},
  showPagination = true,
  hiddenColumns,
  manageColumns,
  sortColumn = "",
  sortOrder = "",
  currentPage = 0,
  rowsPerPage = 10,
  setSortColumn = () => {},
  setSortOrder = () => {},
  setCurrentPage = () => {},
  setRowsPerPage = () => {},
  hideBorders,
  identification,
  customHeader,
}) {
  const filteredColumns = React.useMemo(() => {
    let filtered = [...columns];
    if (hiddenColumns)
      filtered = filtered.filter((f) => !hiddenColumns[f.path]);
    return filtered;
  }, [columns, hiddenColumns]);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = sortColumn === property && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortColumn(property);
  };

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  const changeColVisibility = ({ target: { value, checked } }) => {
    manageColumns(value, !checked);
  };
  const emptyRows =
    currentPage > 0
      ? Math.max(0, (1 + currentPage) * rowsPerPage - rows.length)
      : 0;

  const filtered = showPagination
    ? rows.length >= currentPage * rowsPerPage
      ? rows.slice(
          currentPage * rowsPerPage,
          currentPage * rowsPerPage + rowsPerPage
        )
      : rows
    : rows;

  return (
    <div
      style={{
        width: "100%",
        overflowX: "auto",
        display: "block",
      }}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          overflowX: "auto",
        }}
      >
        <table style={{ flexGrow: 1, margin: 0, padding: 0 }}>
          {customHeader ? (
            customHeader()
          ) : (
            <DataTableHeader
              hideBorders={hideBorders}
              columns={filteredColumns}
              order={sortOrder}
              orderBy={sortColumn}
              onRequestSort={handleRequestSort}
              identification={identification}
            />
          )}
          <DataTableBody
            hideBorders={hideBorders}
            rows={filtered}
            handleClick={onRowClick}
            emptyRows={emptyRows}
            columns={filteredColumns}
            getRowClassName={getRowClassName}
            identification={identification}
          />
        </table>
        {manageColumns && (
          <div>
            <div id="tableColBtn" style={{ fontSize: "13px" }}>
              <span onClick={handleClick}>{"Columns"}</span>
            </div>

            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              {columns.map((option) => {
                const optionPath = option.path ? option.path : option.id;
                const optionLabel = option.label ? option.label : option.name;
                return (
                  !option.nonExportable && (
                    <MenuItem key={optionPath}>
                      <CheckBox
                        label={optionLabel}
                        isChecked={!Boolean(hiddenColumns[optionPath])}
                        value={optionPath}
                        onChange={changeColVisibility}
                      />
                    </MenuItem>
                  )
                );
              })}
            </Menu>
          </div>
        )}
      </div>

      {showPagination && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 20, 30, 40]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={currentPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </div>
  );
}
