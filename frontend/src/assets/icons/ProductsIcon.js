const ProductsIcon = ({ width, height, theme = "light" }) => {
  let fill = theme === "light" ? "#000" : "#fff";

  return (
    <svg
      xmlSpace="preserve"
      style={{
        width: width ? width : "var(--iconWidth)",
        height: height ? height : "var(--iconHeight)",
      }}
      viewBox="0 0 18 18"
    >
      <path
        style={{ fill: fill }}
        d="M0 2a2 2 0 012-2h8a2 2 0 012 2v2h2a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2v-2H2a2 2 0 01-2-2V2zm2-1a1 1 0 00-1 1v8a1 1 0 001 1h8a1 1 0 001-1V2a1 1 0 00-1-1H2z"
      />
      <path fill="none" d="M0 0h24v24H0z" />
    </svg>
  );
};

export default ProductsIcon;
