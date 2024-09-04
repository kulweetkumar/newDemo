import * as ActionTypes from '../actionTypes';
import Axios from 'axios';

const initialState = {
    isAuthenticated: false,
    user: null,
    loader: false,
    error: null,
};

// Common function to set authentication state
const setAuthState = (state, payload) => {
  const { body } = payload;
  localStorage.setItem('access_token', body.token);
  localStorage.setItem('user', JSON.stringify(body));
  Axios.defaults.headers.common.Authorization = `Bearer ${body.token}`;
  return {
    ...state,
    isAuthenticated: true,
    user: body,
  };
};

// login 
const authLogin = (state, payload) => {
  return setAuthState(state, payload);
};

// check auth
const checkAuth = (state) => {
    const token = localStorage.getItem('access_token');
    const user = JSON.parse(localStorage.getItem('user'));
    if (token) {
      Axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      return {
        ...state,
        isAuthenticated: true,
        user,
      };
    }
    return {
      ...state,
      isAuthenticated: false,
      user: null,
    };
};

// logout
const authLogout = (state) => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('user');
  return {
    ...state,
    isAuthenticated: false,
    user: null,
  };
};

// get profile
const getProfile = (state, payload) => {
  return setAuthState(state, payload);
};

const Auth = (state = initialState, { type, payload = null }) => {
    switch (type) {
        case ActionTypes.AUTH_LOGIN:
          return authLogin(state, payload);
        case ActionTypes.AUTH_CHECK:
          return checkAuth(state);
        case ActionTypes.AUTH_LOGOUT:
          return authLogout(state);
        case ActionTypes.PROFILE:
          return getProfile(state, payload);
        default:
          return state;
    }
}

export default Auth;
