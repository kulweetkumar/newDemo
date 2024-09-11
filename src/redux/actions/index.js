import Axios from 'axios';
import * as ActionTypes from '../actionTypes';

const apiPath = 'http://localhost:2020';
const secretKey = 'U2FsdGVkX1/RJbPyYVG6OMCBGjA6IPdWJYYlHNS7ido4t8fWoLkw1qNEuAfd2AaY';
const publishKey = 'U2FsdGVkX1+aakRuXf1/qelNETehvEIooh61AYeIhqKnPx+XG5YuQqS7iTtCUXMZ';
const token = localStorage.getItem('token');
const initialState = {
  isAuthenticated: !!localStorage.getItem('token'),
  user: JSON.parse(localStorage.getItem('user')) || null,
  loader: false,
  error: null,
};

const headers = {
  Authorization: `Bearer ${token ? token : ""}`,
  'secret_key': secretKey,
  'publish_key': publishKey
}

export const authLogin = (credentials) => async (dispatch) => {
  try {
    const response = await Axios.post(`${apiPath}/api/login`, credentials, { headers });
    const body = response.data.body;
    localStorage.setItem('token', body.token);
    localStorage.setItem('user', JSON.stringify(body)); // Save user to localStorage
    dispatch({
      type: ActionTypes.AUTH_LOGIN,
      payload: body,
    });
    return Promise.resolve(body);
  } catch (error) {
    let errorMessage = 'Login failed. Please try again.';
    if (error.response) {
      errorMessage = error.response.data.message || errorMessage;
    } else if (error.request) {
      errorMessage = 'No response from server. Please check your network connection.';
    } else {
      errorMessage = error.message || errorMessage;
    }
    return Promise.reject(errorMessage);
  }
};

export const authLogout = () => async (dispatch) => {
  try {
    if (token) {
      await Axios.post(`${apiPath}/api/logout`, {}, {
        headers
      });
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      dispatch({
        type: ActionTypes.AUTH_LOGOUT,
      });
    }
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

export const checkAuth = () => (dispatch) => {
  dispatch({
    type: ActionTypes.AUTH_CHECK,
  });
};

// Initial State


// Reducer
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
          isAuthenticated: false,
          user: null,
          loader: false,
        };
    default:
      return state;
  }
};
export default Auth;
