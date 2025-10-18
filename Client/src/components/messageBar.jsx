import React, { useEffect } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const MessageBar = ({ message, severity = "info", open, setOpen, duration = 3000 }) => {
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        setOpen(false);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [open, duration, setOpen]);

  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert severity={severity} variant="filled" onClose={() => setOpen(false)}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default MessageBar;
