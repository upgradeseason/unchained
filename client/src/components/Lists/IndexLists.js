import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { get } from "lodash";
import {
  Typography,
  Grid,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  CardActionArea,
  Button,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import API from "../../api";
import history from "../../history";

import { setNotificationAction } from "../../actions/notification";

import { Loading } from "../Loading";
import { listPropTypes } from "./propTypes";

const ListSummary = ({ list }) => (
  <Card>
    <CardActionArea onClick={() => history.push(`/lists/${list.id}`)}>
      <CardContent>
        <Typography variant="h5">{list.name}</Typography>
        <Typography color="textSecondary">
          {list.address_count} address{list.address_count !== 1 && "es"}
        </Typography>
      </CardContent>
    </CardActionArea>
  </Card>
);

ListSummary.propTypes = listPropTypes;

const ListSummaryGrid = ({ lists }) => (
  <Grid container spacing={2}>
    {lists.map(list => (
      <Grid key={list.id} item md={4}>
        <ListSummary list={list} />
      </Grid>
    ))}
  </Grid>
);

ListSummaryGrid.propTypes = {
  lists: PropTypes.arrayOf(listPropTypes).isRequired,
};

export const IndexLists = () => {
  const [requestStatus, setRequestStatus] = useState("pending");
  const [lists, setLists] = useState([]);

  const dispatch = useDispatch();

  const setNotification = useCallback(
    message => dispatch(setNotificationAction(message)),
    [dispatch]
  );

  useEffect(() => {
    const getLists = async () => {
      try {
        const response = await API.Get("/lists");
        const { lists: responseLists } = response.data;
        setLists(responseLists);
        setRequestStatus("success");
      } catch (e) {
        console.error(e);
        const message = get(e, "response.data.error", "Error loading lists.");
        setNotification(message);
        setRequestStatus("error");
      }
    };
    getLists();
  }, [setNotification]);

  return (
    <Grid container direction="column" spacing={2}>
      <Grid item>
        <Card>
          <CardHeader title="Lists" />
          <CardContent />
          <CardActions>
            <Button component={Link} to="/lists/new">
              New List
            </Button>
          </CardActions>
        </Card>
      </Grid>

      <Grid item>
        {requestStatus === "pending" && <Loading />}
        {requestStatus === "success" && Boolean(lists) && lists.length > 0 && (
          <ListSummaryGrid lists={lists} />
        )}
      </Grid>
    </Grid>
  );
};
