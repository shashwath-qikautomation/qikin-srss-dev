import * as React from "react";
const Minimize = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    stroke={props.stroke}
    strokeWidth={0.1}
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      fill={props.stroke}
      d="M3.293 3.293A1 1 0 0 1 4 3h9a1 1 0 0 1 1 1v1a1 1 0 1 0 2 0V4a3 3 0 0 0-3-3H4a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h1a1 1 0 1 0 0-2H4a1 1 0 0 1-1-1V4a1 1 0 0 1 .293-.707Z"
    />
    <path
      fill={props.stroke}
      fillRule="evenodd"
      d="M11 8a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h9a3 3 0 0 0 3-3v-9a3 3 0 0 0-3-3h-9Zm-1 3a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-9a1 1 0 0 1-1-1v-9Z"
      clipRule="evenodd"
    />
  </svg>
);
export default Minimize;
