import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import { useSelector } from "react-redux";

const Modal = ({
  onClose = () => {},
  title,
  width,
  height,
  paddingBottom,
  children,
  keepOpen = true,
  showCloseButton = true,
  shortcut = true,
}) => {
  let modalRef = null;
  const { themeMode } = useSelector((state) => state);

  React.useEffect(() => {
    document.querySelector("html").classList.add("scroll-lock");
    return () => document.querySelector("html").classList.remove("scroll-lock");
  }, []);

  const onClickOutside = (event) => {
    if (modalRef === null || modalRef.contains(event.target) || keepOpen)
      return;
    onClose();
  };
  const [isHover, setIsHover] = useState(false);

  const handleMouseEnter = () => {
    setIsHover(true);
  };
  const handleMouseLeave = () => {
    setIsHover(false);
  };
  return (
    <aside
      tag="aside"
      role="dialog"
      tabIndex="-1"
      aria-modal="true"
      className="modal-cover"
      onClick={onClickOutside}
      onKeyDown={(e) => {
        if (e.keyCode === 27 && shortcut) onClose();
      }}
    >
      <div
        tabIndex="0"
        className={themeMode === "dark" ? "modal-areaDark" : "modal-area"}
        ref={(ref) => (modalRef = ref)}
        style={{ width: width, height: height, paddingBottom: paddingBottom }}
      >
        {showCloseButton && (
          <div
            style={{ backgroundColor: "#457AB1", height: "45px" }}
            className="d-flex justify-content-between text-center"
          >
            <div
              style={{
                color: "white",
                fontWeight: "400",
                paddingTop: "10px",
                fontSize: "14px",
              }}
            >
              <p className="mx-2 ">{title}</p>
            </div>
            <div />
            <div
              style={{
                margin: "5px",
                border: isHover ? "1px solid #457AB1" : null,
                backgroundColor: isHover ? "white" : null,
              }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <IconButton onClick={onClose} onMouseDown={onClose} size="small">
                <CloseIcon sx={{ color: isHover ? "black" : "white" }} />
              </IconButton>
            </div>
          </div>
        )}
        <div className="modal-body">{children}</div>
      </div>
    </aside>
  );
};

export default Modal;
