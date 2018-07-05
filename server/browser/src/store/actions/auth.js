import * as actionTypes from "./actionTypes";

const AUTH_EXPIRY_TIME = 2 * 3600;



export const authSuccess = (api_auth, api_key, user_key_address) => {
  return { type: actionTypes.AUTH_SUCCESS, api_auth, api_key, user_key_address };
};

export const authEthContrib = (eth_contrib) => {
  return { type: actionTypes.AUTH_ETH_CONTRIB, eth_contrib };
};