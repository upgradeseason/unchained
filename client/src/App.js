import React from "react";
import { Router } from "react-router-dom";
import { Container, makeStyles } from "@material-ui/core";
import history from "./history";

import { Topbar } from "./components/Topbar";
import { Notification } from "./components/Notification";

import { Routes } from "./Routes";

const useStyles = makeStyles(() => ({
  root: {
    marginTop: 10,
  },
}));

function App() {
  const classes = useStyles();
  return (
    <div className="App">
      <Container fixed>
        <Router history={history}>
          <Topbar />
          <Notification />
          <div className={classes.root}>{Routes}</div>
        </Router>
      </Container>
    </div>
  );
}

export default App;
