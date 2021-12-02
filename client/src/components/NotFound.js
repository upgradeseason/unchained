import React from "react";
import { Card, CardHeader, CardContent, CardActions, Button } from "@material-ui/core";
import { Link } from "react-router-dom";

export const NotFound = () => (
  <Card>
    <CardHeader title="Not Found" />
    <CardContent>
      <p>The resource you requested was not found.</p>
    </CardContent>
    <CardActions>
      <Button component={Link} to="/">
        Return Home
      </Button>
    </CardActions>
  </Card>
);
