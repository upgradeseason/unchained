import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { get } from "lodash";
import { Link } from "react-router-dom";
import { Grid, TableRow, TableCell, Button } from "@material-ui/core";
import { Delete as DeleteIcon } from "@material-ui/icons";
import API from "../../api";

import { setNotificationAction } from "../../actions/notification";
import { removeAddressFromListAction } from "../../actions/list";
import { addressPropType } from "../Addresses/propTypes";

export const AddressForList = ({ address }) => {
  const [requestStatus, setRequestStatus] = useState("none");
  const { id } = useSelector(state => state.list);
  const dispatch = useDispatch();
  const setNotification = message => dispatch(setNotificationAction(message));
  const removeAddressFromList = () => dispatch(removeAddressFromListAction(address));

  const submitDeleteRequest = async () => {
    try {
      setRequestStatus("pending");
      await API.Delete(`/lists/${id}/addresses/${address.value}`);
      removeAddressFromList();
      setRequestStatus("none");
    } catch (e) {
      console.error(e);
      const message = get(e, "response.data.error", "Error deleting address from list.");
      setNotification(message);
      setRequestStatus("none");
    }
  };

  const submitDisabled = () => requestStatus === "pending";

  const { testnet, value } = address;

  return (
    <TableRow>
      <TableCell>{testnet ? "Testnet" : "Mainnet"}</TableCell>
      <TableCell>{value}</TableCell>
      <TableCell>
        <Grid container spacing={2}>
          <Grid item>
            <Button
              role="button"
              variant="contained"
              color="primary"
              component={Link}
              to={`/addresses/${value}`}
            >
              View
            </Button>
          </Grid>

          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              onClick={submitDeleteRequest}
              disabled={submitDisabled()}
              startIcon={<DeleteIcon />}
            >
              Delete
            </Button>
          </Grid>
        </Grid>
      </TableCell>
    </TableRow>
  );
};

AddressForList.propTypes = {
  address: addressPropType.isRequired,
};
