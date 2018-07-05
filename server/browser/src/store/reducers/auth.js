import * as actionTypes from "../actions/actionTypes";

const initialState = {
  token: null,
  pictureURL: null,
  error: null,
  loading: false,
  userId: null,
  firstName: null,
  lastName: null,
  email: null,
  tosAccepted: false,
  rdAccepted: false,
  deactivatedAt: null,
  api_auth: '',
  api_key: '',
  eth_contrib: 0.0001,
  user_key_address:'',
  isAuthenticated: false,
  
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_SUCCESS:
      var isAuthenticated=false;
      if (action.api_auth && action.api_key) {
        isAuthenticated=true;
      }
      return {
        ...state,
        loading: false,
        api_auth:action.api_auth,
        api_key:action.api_key,
        user_key_address:action.user_key_address,
        isAuthenticated
      };
    case actionTypes.AUTH_ETH_CONTRIB:
      return {
        ...state,
        loading: false,
        eth_contrib:action.eth_contrib,
      };

    default:
      return state;
  }
};

export default reducer;
