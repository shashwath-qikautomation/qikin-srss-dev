import { Card as BasicCard, styled } from "@mui/material";

import "../styles/card.css";
import { useCallback } from "react";
export default function DashboardCard({ children, onClick, path }) {
  const CardHover = styled(BasicCard)({
    transition: "transform 0.5s",
    "&:hover": {
      transform: "scale(1.04)",
    },
  });

  const onCardClick = useCallback(() => {
    onClick(path);
  }, [path, onClick]);

  return (
    <CardHover
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        cursor: "pointer",
        fontSize: 18,
        fontWeight: 600,
      }}
      className="shadow-sm homeCard swashIn"
      onClick={onCardClick}
    >
      {children}
    </CardHover>
  );
}
