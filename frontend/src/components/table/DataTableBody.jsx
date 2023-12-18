const DataTableBody = ({
  rows,
  columns,
  handleClick,
  getRowClassName,
  identification,
  hideBorders,
}) => {
  const renderRowCell = (row, column, rowIndex, colIndex) => {
    return (
      <td
        key={column.path || column.label || rowIndex + "dataTableRowCell"}
        onClick={() => {
          !column.nonClickable &&
            handleClick &&
            handleClick(row, rowIndex, colIndex);
        }}
        style={{
          border: hideBorders ? "none" : "1px solid #dddd",
          borderRadius: 0,
          cursor: !column.nonClickable && handleClick ? "pointer" : "",
          fontSize: "13px",
          padding: "5px",
          textAlign: "center",

          ...column.columnStyle,
        }}
      >
        {column.content
          ? column.content(row, rowIndex, column.getValue, identification)
          : row[column.path]}
      </td>
    );
  };
  return (
    <tbody>
      {rows.map((row, rowIndex) => (
        <tr
          key={"dataTableRow" + rowIndex}
          className={getRowClassName(row, rowIndex)}
        >
          {columns.map((col, colIndex) =>
            renderRowCell(row, col, rowIndex, colIndex)
          )}
        </tr>
      ))}
    </tbody>
  );
};

export default DataTableBody;
