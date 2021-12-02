import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Snackbar, IconButton } from "@material-ui/core";
import { Close as CloseIcon } from "@material-ui/icons";
import { clearNotificationAction } from "../actions/notification";

export const Notification = () => {
  const { isOpen, message } = useSelector(state => state.notification);
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(clearNotificationAction());
  };

  return (
    <Snackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={isOpen}
      onClose={handleClose}
      message={message}
      action={
        <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      }
    />
  );
};
