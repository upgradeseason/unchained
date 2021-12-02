import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { get } from "lodash";
import { Card, CardHeader, CardContent, CardActions, Button, TextField } from "@material-ui/core";
import API from "../../api";
import history from "../../history";
import { validateString } from "../../validation";

import { setNotificationAction } from "../../actions/notification";

export const NewList = () => {
  const [requestStatus, setRequestStatus] = useState("none");
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");

  const dispatch = useDispatch();
  const setNotification = message => dispatch(setNotificationAction(message));

  const submitRequest = async () => {
    try {
      setRequestStatus("pending");
      const response = await API.Post("/lists", { name });
      setRequestStatus("none");
      const { id } = response.data;
      history.push(`/lists/${id}`);
    } catch (e) {
      console.error(e);
      const message = get(e, "response.data.error", "Error creating list.");
      setNotification(message);
      setRequestStatus("none");
    }
  };

  const handleNameChange = event => {
    const newName = event.target.value;
    const stringError = validateString(newName, 50);
    setName(newName);
    setNameError(stringError ? `Name ${stringError}` : "");
  };

  const submitDisabled = () => name === "" || nameError !== "" || requestStatus === "pending";

  return (
    <form>
      <Card>
        <CardHeader title="Create List" />
        <CardContent>
          <TextField
            id="name"
            label="Name"
            required
            value={name}
            helperText={nameError}
            error={Boolean(nameError)}
            onChange={handleNameChange}
          />
        </CardContent>
        <CardActions>
          <Button type="button" disabled={submitDisabled()} onClick={submitRequest}>
            Create
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};
