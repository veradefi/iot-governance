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
  deactivatedAt: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_SUCCESS:
      return {
        ...state,
        loading: false,
        token: action.token,
        userId: action.user.id,
        firstName: action.user.firstName,
        lastName: action.user.lastName,
        email: action.user.email,
        pictureURL: action.user.pictureURL,
        rdAccepted: action.user.rdAccepted,
        tosAccepted: action.user.tosAccepted,
        deactivatedAt: action.user.deactivatedAt,
        error: null
      };

    default:
      return state;
  }
};

export default reducer;
