import * as ActionTypes from '../actionTypes';
const initialState = {
    isAuthenticated: false,
    user: null,
    loader: false,
    error: null,
};
const Auth = (state = initialState, { type, payload = null }) => {
  switch (type) {
    case ActionTypes.AUTH_LOGIN:
      return {
        ...state,
        isAuthenticated: true,
        user: payload,
        loader: false,
        error: null,
      };
    case ActionTypes.AUTH_CHECK:
      return {
        ...state,
        loader: true,
      };
    case ActionTypes.AUTH_LOGOUT:
      return {
        ...initialState,
        loader: false,
      };
    default:
      return state;
  }
};

export default Auth;