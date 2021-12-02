import React, { useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { get } from "lodash";
import {
  Paper,
  Grid,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  TableContainer,
  TableHead,
  TableRow,
  Table,
  TableCell,
  TableBody,
} from "@material-ui/core";
import { Delete as DeleteIcon } from "@material-ui/icons";
import API from "../../api";
import history from "../../history";

import { setNotificationAction } from "../../actions/notification";

import { NewAddressForList } from "./NewAddressForList";
import { AddressForList } from "./AddressForList";
import { addressPropType } from "../Addresses/propTypes";

const AddressesForList = ({ addresses, id }) => (
  <TableContainer component={Paper}>
    <Table>
      <colgroup>
        <col width="20%" />
        <col width="60%" />
        <col width="20%" />
      </colgroup>
      <TableHead>
        <TableRow>
          <TableCell>Network</TableCell>
          <TableCell>Address</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {addresses.map(address => (
          <AddressForList key={address.value} address={address} />
        ))}
        <NewAddressForList id={id} />
      </TableBody>
    </Table>
  </TableContainer>
);

AddressesForList.propTypes = {
  addresses: PropTypes.arrayOf(addressPropType).isRequired,
  id: PropTypes.number.isRequired,
};

export const ListDetail = () => {
  const [requestStatus, setRequestStatus] = useState("none");
  const { name, addresses, id } = useSelector(state => state.list);
  const dispatch = useDispatch();
  const setNotification = message => dispatch(setNotificationAction(message));

  const submitDeleteRequest = async () => {
    try {
      setRequestStatus("pending");
      await API.Delete(`/lists/${id}`);
      setRequestStatus("none");
      history.push("/");
    } catch (e) {
      console.error(e);
      const message = get(e, "response.data.error", "Error deleting list.");
      setNotification(message);
      setRequestStatus("none");
    }
  };

  const submitDisabled = () => requestStatus === "pending";

  return (
    <Grid container direction="column" spacing={2}>
      <Grid item>
        <Card>
          <CardContent>
            <Typography variant="h5">{name}</Typography>
          </CardContent>
          <CardActions>
            <Button
              color="secondary"
              onClick={submitDeleteRequest}
              disabled={submitDisabled()}
              startIcon={<DeleteIcon />}
            >
              Delete List
            </Button>
          </CardActions>
        </Card>
      </Grid>

      <Grid item>
        <AddressesForList addresses={addresses} id={id} />
      </Grid>
    </Grid>
  );
};
