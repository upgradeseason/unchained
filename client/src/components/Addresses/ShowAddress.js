import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { get } from "lodash";
import { Grid } from "@material-ui/core";
import API from "../../api";

import { setNotificationAction } from "../../actions/notification";
import { setAddressAction, clearAddressAction } from "../../actions/address";

import { Loading } from "../Loading";
import { AddressDetail } from "./AddressDetail";

export const ShowAddress = ({ match }) => {
  const [requestStatus, setRequestStatus] = useState("pending");

  const dispatch = useDispatch();
  const setAddress = address => dispatch(setAddressAction(address));
  const clearAddress = () => dispatch(clearAddressAction());
  const setNotification = message => dispatch(setNotificationAction(message));

  useEffect(() => {
    const getAddresses = async () => {
      try {
        const response = await API.Get(`/addresses/${match.params.value}`);
        const { address } = response.data;
        setAddress(address);

        setRequestStatus("success");
      } catch (e) {
        console.error(e);
        const message = get(e, "response.data.error", "Error loading address.");
        setNotification(message);
        setRequestStatus("error");
      }
    };
    getAddresses();
    return clearAddress;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Grid container direction="column">
      <Grid item>
        {requestStatus === "pending" && <Loading />}
        {requestStatus === "success" && <AddressDetail />}
      </Grid>
    </Grid>
  );
};

ShowAddress.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      list_id: PropTypes.string,
    }),
  }).isRequired,
};
