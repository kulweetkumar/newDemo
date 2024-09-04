import Axios from 'axios';
import * as ActionTypes from '../actionTypes';
let apiPath = 'http://localhost:3000/';

// Action creators
export const login = (credentials) => async (dispatch) => {
  try {
    const response = await Axios.post(`${apiPath}/api/login`, credentials);
    dispatch({
      type: ActionTypes.AUTH_LOGIN,
      payload: response.data,
    });
  } catch (error) {
    // Handle error here
    console.error(error);
  }
};

export const logout = () => (dispatch) => {
  dispatch({
    type: ActionTypes.AUTH_LOGOUT,
  });
};

export const checkAuth = () => (dispatch) => {
  dispatch({
    type: ActionTypes.AUTH_CHECK,
  });
};
