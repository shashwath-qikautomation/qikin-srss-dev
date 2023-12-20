const ManufacturingIcon = ({ width, height, theme = "light" }) => {
  let fill = theme === "light" ? "#000" : "#fff";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlSpace="preserve"
      style={{
        width: width ? width : "var(--iconWidth)",
        height: height ? height : "var(--iconHeight)",
      }}
      viewBox="0 0 24 24"
    >
      <path
        style={{ fill: fill }}
        d="M4 18v2h4v-2H4m0-4v2h10v-2H4m6 4v2h4v-2h-4m6-4v2h4v-2h-4m0 4v2h4v-2h-4M2 22V8l5 4V8l5 4V8l5 4 1-10h3l1 10v10H2z"
      />
      <path fill="none" d="M0 0h24v24H0z" />
    </svg>
  );
};

export default ManufacturingIcon;
