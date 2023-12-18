import * as React from "react";
const Minus = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    stroke={props.stroke}
    strokeWidth={0.1}
    viewBox="0 0 20 20"
    {...props}
  >
    <path
      fill={props.stroke}
      fillRule="evenodd"
      d="M18 10a1 1 0 0 1-1 1H3a1 1 0 1 1 0-2h14a1 1 0 0 1 1 1z"
    />
  </svg>
);
export default Minus;
