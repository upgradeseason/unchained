export const SET_ADDRESS = "/ADDRESS/SET";
export const ADD_LIST_TO_ADDRESS = "/ADDRESS/LISTS/ADD";
export const REMOVE_LIST_FROM_ADDRESS = "/ADDRESS/LISTS/REMOVE";
export const CLEAR_ADDRESS = "/ADDRESS/CLEAR";

export const setAddressAction = address => ({
  type: SET_ADDRESS,
  address,
});

export const addListToAddressAction = list => ({
  type: ADD_LIST_TO_ADDRESS,
  list,
});

export const removeListFromAddressAction = list => ({
  type: REMOVE_LIST_FROM_ADDRESS,
  list,
});

export const clearAddressAction = () => ({
  type: CLEAR_ADDRESS,
});
