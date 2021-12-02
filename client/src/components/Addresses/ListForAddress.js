import React, { useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { get } from "lodash";
import { Link } from "react-router-dom";
import { Grid, TableRow, TableCell, Button } from "@material-ui/core";
import { Delete as DeleteIcon } from "@material-ui/icons";
import { listPropTypes } from "../Lists/propTypes";
import API from "../../api";
import history from "../../history";

import { setNotificationAction } from "../../actions/notification";
import { removeListFromAddressAction } from "../../actions/address";

export const ListForAddress = ({ list }) => {
  const [requestStatus, setRequestStatus] = useState("none");
  const { value, lists } = useSelector(state => state.address);

  const dispatch = useDispatch();
  const setNotification = message => dispatch(setNotificationAction(message));
  const removeListFromAddress = listToRemove => dispatch(removeListFromAddressAction(listToRemove));

  const submitDeleteRequest = async () => {
    try {
      setRequestStatus("pending");
      await API.Delete(`/lists/${list.id}/addresses/${value}`);
      setRequestStatus("none");
      removeListFromAddress(list);
      if (lists.length === 1) {
        history.push("/addresses");
      }
    } catch (e) {
      console.error(e);
      const message = get(e, "response.data.error", "Error removing list from address.");
      setNotification(message);
      setRequestStatus("none");
    }
  };

  const submitDisabled = () => requestStatus === "pending";

  return (
    <TableRow>
      <TableCell>{list.name}</TableCell>
      <TableCell>
        <Grid container spacing={2}>
          <Grid item>
            <Button variant="contained" color="primary" component={Link} to={`/lists/${list.id}`}>
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

ListForAddress.propTypes = {
  list: PropTypes.shape(listPropTypes).isRequired,
};
