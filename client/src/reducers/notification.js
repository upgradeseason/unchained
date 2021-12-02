import { SET_NOTIFICATION, CLEAR_NOTIFICATION } from "../actions/notification";

const initialState = {
  message: "",
  isOpen: false,
};

const notificationReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case SET_NOTIFICATION:
      return {
        ...state,
        ...{
          isOpen: true,
          message: action.message,
        },
      };

    case CLEAR_NOTIFICATION:
      return initialState;

    default:
      return state;
  }
};

export default notificationReducer;
