import React, { useState } from "react";
import { useDispatch } from "react-redux";

import { get } from "lodash";
import { MAINNET, TESTNET, validateAddress } from "unchained-bitcoin";
import { Grid, Switch, TableRow, TableCell, TextField, Button } from "@material-ui/core";
import { Add as AddIcon } from "@material-ui/icons";
import API from "../../api";

import { setNotificationAction } from "../../actions/notification";
import { addAddressToListAction } from "../../actions/list";
import { listPropTypes } from "./propTypes";

export const NewAddressForList = ({ id }) => {
  const [requestStatus, setRequestStatus] = useState("none");
  const [testnet, setTestnet] = useState(false);
  const [address, setAddress] = useState("");
  const [addressError, setAddressError] = useState("");

  const dispatch = useDispatch();

  const setNotification = message => dispatch(setNotificationAction(message));
  const addAddressToList = value => dispatch(addAddressToListAction({ value, testnet }));

  const resetState = () => {
    setRequestStatus("none");
    setAddress("");
    setAddressError("");
  };

  const submitRequest = async () => {
    try {
      setRequestStatus("pending");
      await API.Post(`/lists/${id}/addresses/${address}`, { testnet });
      addAddressToList(address);
      resetState();
    } catch (e) {
      console.error(e);
      const message = get(e, "response.data.error", "Error adding address to list.");
      setNotification(message);
      setRequestStatus("none");
    }
  };

  const handleNetworkChange = () => {
    setTestnet(!testnet);
    setAddressError(validateAddress(address, !testnet ? TESTNET : MAINNET));
  };

  const handleAddressChange = event => {
    const newAddress = event.target.value;
    setAddress(newAddress);
    setAddressError(validateAddress(newAddress, testnet ? TESTNET : MAINNET));
  };

  const submitDisabled = () => address === "" || addressError !== "" || requestStatus === "pending";

  return (
    <TableRow>
      <TableCell>
        <Grid component="label" container alignItems="center" spacing={1}>
          <Grid item>
            <Switch id="network" checked={!testnet} onChange={handleNetworkChange} name="network" />
          </Grid>
          <Grid item>{testnet ? "Testnet" : "Mainnet"}</Grid>
        </Grid>
      </TableCell>
      <TableCell>
        <TextField
          id="address"
          fullWidth
          placeholder={`${testnet ? "2" : "1"}abc...`}
          required
          value={address}
          helperText={addressError}
          error={Boolean(addressError)}
          onChange={handleAddressChange}
          label="Address"
        />
      </TableCell>
      <TableCell>
        <Button
          variant="contained"
          color="primary"
          onClick={submitRequest}
          disabled={submitDisabled()}
          startIcon={<AddIcon />}
        >
          Add
        </Button>
      </TableCell>
    </TableRow>
  );
};

NewAddressForList.propTypes = listPropTypes;
