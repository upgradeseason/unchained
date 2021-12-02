export const SET_LIST = "/LIST/SET";
export const ADD_ADDRESS_TO_LIST = "/LIST/ADDRESSES/ADD";
export const REMOVE_ADDRESS_FROM_LIST = "/LIST/ADDRESSES/REMOVE";
export const CLEAR_LIST = "/LIST/CLEAR";

export const setListAction = list => ({
  type: SET_LIST,
  list,
});

export const addAddressToListAction = address => ({
  type: ADD_ADDRESS_TO_LIST,
  address,
});

export const removeAddressFromListAction = address => ({
  type: REMOVE_ADDRESS_FROM_LIST,
  address,
});

export const clearListAction = () => ({
  type: CLEAR_LIST,
});
