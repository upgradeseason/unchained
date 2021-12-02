export const SET_NOTIFICATION = "/NOTIFICATION/SET";
export const CLEAR_NOTIFICATION = "/NOTIFICATION/CLEAR";

export const clearNotificationAction = () => ({
  type: CLEAR_NOTIFICATION,
});

export const setNotificationAction = (message, duration) => async dispatch => {
  dispatch({
    type: SET_NOTIFICATION,
    message,
  });
  if (duration) {
    setTimeout(() => {
      dispatch(clearNotificationAction());
    }, duration);
  }
};
