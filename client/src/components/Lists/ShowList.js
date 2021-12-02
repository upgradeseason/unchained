import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { get } from "lodash";
import { Grid } from "@material-ui/core";
import API from "../../api";

import { setNotificationAction } from "../../actions/notification";
import { setListAction, clearListAction } from "../../actions/list";

import { Loading } from "../Loading";
import { ListDetail } from "./ListDetail";

export const ShowList = ({ match }) => {
  const [requestStatus, setRequestStatus] = useState("pending");
  const dispatch = useDispatch();

  const setList = list => dispatch(setListAction(list));
  const clearList = () => dispatch(clearListAction());
  const setNotification = message => dispatch(setNotificationAction(message));

  useEffect(() => {
    const getList = async () => {
      try {
        const response = await API.Get(`/lists/${match.params.list_id}`);
        const { list } = response.data;
        setList(list);
        setRequestStatus("success");
      } catch (e) {
        console.error(e);
        const message = get(e, "response.data.error", "Error loading list.");
        setNotification(message);
        setRequestStatus("error");
      }
    };

    getList();
    return clearList;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match]);

  return (
    <Grid container direction="column">
      <Grid item>
        {requestStatus === "pending" && <Loading />}
        {requestStatus === "success" && <ListDetail />}
      </Grid>
    </Grid>
  );
};

ShowList.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      list_id: PropTypes.string,
    }),
  }).isRequired,
};
