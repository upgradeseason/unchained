import {
  SET_LIST,
  ADD_ADDRESS_TO_LIST,
  REMOVE_ADDRESS_FROM_LIST,
  CLEAR_LIST,
} from "../actions/list";

const initialState = {
  id: "",
  name: "",
  addresses: [],
};

const listReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case SET_LIST:
      return {
        ...state,
        ...action.list,
      };

    case ADD_ADDRESS_TO_LIST:
      return {
        ...state,
        ...{
          addresses: [...state.addresses, action.address],
        },
      };

    case REMOVE_ADDRESS_FROM_LIST:
      return {
        ...state,
        ...{
          addresses: state.addresses.filter(address => address.value !== action.address.value),
        },
      };

    case CLEAR_LIST:
      return initialState;

    default:
      return state;
  }
};

export default listReducer;
