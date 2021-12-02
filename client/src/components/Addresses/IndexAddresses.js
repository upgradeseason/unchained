import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { get } from "lodash";
import { Typography, Grid, Card, CardHeader, CardContent, CardActionArea } from "@material-ui/core";

import API from "../../api";
import history from "../../history";

import { setNotificationAction } from "../../actions/notification";

import { Loading } from "../Loading";
import { addressPropType } from "./propTypes";

const AddressSummary = ({ address }) => (
  <Card>
    <CardActionArea onClick={() => history.push(`/addresses/${address.value}`)}>
      <CardContent>
        <Typography variant="h6">{address.value}</Typography>
        <Typography color="textSecondary">
          {address.list_count} list{address.list_count !== 1 && "s"}
        </Typography>
      </CardContent>
    </CardActionArea>
  </Card>
);

AddressSummary.propTypes = {
  address: addressPropType.isRequired,
};

const AddressGrid = ({ addresses }) => (
  <Grid container spacing={2}>
    {addresses.map(address => (
      <Grid item key={address.value} md={4}>
        <AddressSummary address={address} />
      </Grid>
    ))}
  </Grid>
);

AddressGrid.propTypes = {
  addresses: PropTypes.arrayOf(addressPropType).isRequired,
};

export const IndexAddresses = () => {
  const [requestStatus, setRequestStatus] = useState("pending");
  const [addresses, setAddresses] = useState([]);
  const dispatch = useDispatch();
  const setNotification = message => dispatch(setNotificationAction(message));

  useEffect(() => {
    const getAddresses = async () => {
      try {
        const response = await API.Get("/addresses");
        const { addresses: addressList } = response.data;
        setAddresses(addressList);
        setRequestStatus("success");
      } catch (e) {
        console.error(e);
        const message = get(e, "response.data.error", "Error loading addresses.");
        setNotification(message);
        setRequestStatus("error");
      }
    };

    getAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Grid container direction="column" spacing={2}>
      <Grid item>
        <Card>
          <CardHeader title="Addresses" />
          <CardContent />
        </Card>
      </Grid>

      <Grid item>
        {requestStatus === "pending" && <Loading />}
        {requestStatus === "success" && Boolean(addresses) && addresses.length > 0 && (
          <AddressGrid addresses={addresses} />
        )}
      </Grid>
    </Grid>
  );
};
