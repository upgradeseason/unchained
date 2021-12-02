import React from "react";
import { Box, CircularProgress } from "@material-ui/core";

export const Loading = () => (
  <Box data-testid="loading-spinner" display="flex" alignItems="center" justifyContent="center">
    <CircularProgress />
  </Box>
);
