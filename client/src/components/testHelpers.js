import React from "react";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { Provider } from "react-redux";
import { render as rtlRender } from "@testing-library/react";

import reducer from "../reducers";

export const middleware = applyMiddleware(thunk);
function getMockStore(state) {
  return createStore(reducer, state, middleware);
}

export const renderWithStore = (
  ui,
  { initialState, store = getMockStore(initialState), ...renderOptions } = {}
) => {
  function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>;
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
};

export class ErrorResponse extends Error {
  constructor(error, status) {
    super();
    this.response = { data: { error }, status };
  }
}
