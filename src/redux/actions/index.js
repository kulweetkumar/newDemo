import Axios from 'axios';
import * as ActionTypes from '../actionTypes';

const apiPath = 'http://localhost:3000/';

// Action creators
export const authLogin = (credentials) => async (dispatch) => {
  try {
    const response = await Axios.post(`${apiPath}/api/login`, credentials);
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user)); // Save user to localStorage
    dispatch({
      type: ActionTypes.AUTH_LOGIN,
      payload: user,
    });
    return Promise.resolve(user);
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
    const token = localStorage.getItem('token');
    if (token) {
      await Axios.post(`${apiPath}/api/logout`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
const initialState = {
  isAuthenticated: false,
  user: null,
  loader: false,
  error: null,
};

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
        loader: false,
      };
    default:
      return state;
  }
};

export default Auth;
