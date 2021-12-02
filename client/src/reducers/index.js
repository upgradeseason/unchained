import { combineReducers } from "redux";

import notification from "./notification";
import list from "./list";
import address from "./address";

const rootReducer = combineReducers({
  notification,
  list,
  address,
});

export default rootReducer;
