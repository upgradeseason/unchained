import {
  SET_ADDRESS,
  ADD_LIST_TO_ADDRESS,
  REMOVE_LIST_FROM_ADDRESS,
  CLEAR_ADDRESS,
} from "../actions/address";

const initialState = {
  value: "",
  lists: [],
};

const addressReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case SET_ADDRESS:
      return {
        ...state,
        ...action.address,
      };

    case ADD_LIST_TO_ADDRESS:
      return {
        ...state,
        ...{
          lists: [...state.lists, action.list],
        },
      };

    case REMOVE_LIST_FROM_ADDRESS:
      return {
        ...state,
        ...{
          lists: state.lists.filter(list => list.id !== action.list.id),
        },
      };

    case CLEAR_ADDRESS:
      return initialState;

    default:
      return state;
  }
};

export default addressReducer;
