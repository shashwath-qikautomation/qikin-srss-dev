const PurchaseIcon = ({ width, height, theme = "light" }) => {
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
      <path d="M0 1.5A.5.5 0 01.5 1H2a.5.5 0 01.485.379L2.89 3H14.5a.5.5 0 01.491.592l-1.5 8A.5.5 0 0113 12H4a.5.5 0 01-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 01-.5-.5zM5 12a2 2 0 100 4 2 2 0 000-4zm7 0a2 2 0 100 4 2 2 0 000-4zm-7 1a1 1 0 110 2 1 1 0 010-2zm7 0a1 1 0 110 2 1 1 0 010-2z" />
      <path fill="none" d="M0 0h24v24H0z" />
    </svg>
  );
};

export default PurchaseIcon;