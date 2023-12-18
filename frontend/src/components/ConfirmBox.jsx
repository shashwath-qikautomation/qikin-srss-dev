import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import * as React from "react";

function ConfirmBox({
  title,
  onAgree,
  onCancel,
  content,
  showConfirm,
  disabled,
  cancelName,
  acceptName,
}) {
  return (
    <div>
      <Dialog
        open={showConfirm}
        onClose={onCancel}
        aria-labelledby="draggable-dialog-title"
      >
        {title && (
          <DialogTitle
            component={"div"}
            style={{ cursor: "move" }}
            id="draggable-dialog-title"
          >
            {title}
          </DialogTitle>
        )}

        <DialogContent>
          <div>{content}</div>
        </DialogContent>
        <DialogActions>
          <Button
            //variant="contained"
            //color="error"
            autoFocus
            onClick={onCancel}
          >
            {cancelName ? cancelName : "cancel"}
          </Button>
          <Button
            //variant="contained"
            //color="success"
            onClick={onAgree}
            disabled={disabled}
          >
            {acceptName ? acceptName : "ok"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
export default ConfirmBox;
