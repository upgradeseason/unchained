import React from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, makeStyles } from "@material-ui/core";
import logo from "../images/logo.png";

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
  icon: {
    padding: 5,
  },
  title: {
    flexGrow: 1,
  },
}));

export const Topbar = () => {
  const classes = useStyles();
  return (
    <AppBar position="static">
      <Toolbar>
        <a href="/">
          <img src={logo} className={classes.icon} alt="Unchained Logo" />
        </a>
        <Typography variant="h6" className={classes.title}>
          Bitcoin Address Lists
        </Typography>

        <Button component={Link} color="inherit" to="/">
          Lists
        </Button>
        <Button component={Link} color="inherit" to="/addresses">
          Addresses
        </Button>
      </Toolbar>
    </AppBar>
  );
};
