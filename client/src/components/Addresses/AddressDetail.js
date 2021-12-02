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
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@material-ui/core";
import { Delete as DeleteIcon } from "@material-ui/icons";
import API from "../../api";
import history from "../../history";

import { setNotificationAction } from "../../actions/notification";

import { ListForAddress } from "./ListForAddress";

const ListsForAddress = ({ lists }) => (
  <TableContainer component={Paper}>
    <Table>
      <colgroup>
        <col width="80%" />
        <col width="20%" />
      </colgroup>
      <TableHead>
        <TableRow>
          <TableCell>List</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {lists.map(list => (
          <ListForAddress key={list.id} list={list} />
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

ListsForAddress.propTypes = {
  lists: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      lists: PropTypes.arrayOf(PropTypes.shape({ value: PropTypes.string })),
    })
  ).isRequired,
};

export const AddressDetail = () => {
  const [requestStatus, setRequestStatus] = useState("none");
  const { value, lists } = useSelector(state => state.address);
  const dispatch = useDispatch();
  const setNotification = message => dispatch(setNotificationAction(message));

  const submitDeleteRequest = async () => {
    try {
      setRequestStatus("pending");
      await API.Delete(`/addresses/${value}`);
      setRequestStatus("none");
      history.push("/addresses");
    } catch (e) {
      console.error(e);
      const message = get(e, "response.data.error", "Error deleting address.");
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
            <Typography variant="h5">{value}</Typography>
          </CardContent>
          <CardActions>
            <Button
              color="secondary"
              onClick={submitDeleteRequest}
              disabled={submitDisabled()}
              startIcon={<DeleteIcon />}
            >
              Delete Address
            </Button>
          </CardActions>
        </Card>
      </Grid>

      <Grid item>
        <ListsForAddress lists={lists} />
      </Grid>
    </Grid>
  );
};
