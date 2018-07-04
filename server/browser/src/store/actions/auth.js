import * as actionTypes from "./actionTypes";

const AUTH_EXPIRY_TIME = 2 * 3600;




export const authSuccess = (user, token) => {
  /*
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem(
    "loginTime",
    localStorage.getItem("loginTime") || Date.now()
  );
  axios.defaults.headers = {
    ...axios.defaults.headers,
    sessiontoken: localStorage.getItem("token")
  };
  */
  return { type: actionTypes.AUTH_SUCCESS, user, token };
};