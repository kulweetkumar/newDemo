// src/actions/authActions.js

import Axios from 'axios';
import * as ActionTypes from '../actionTypes';
const apiPath = 'http://localhost:2020';
const secretKey = 'U2FsdGVkX1/RJbPyYVG6OMCBGjA6IPdWJYYlHNS7ido4t8fWoLkw1qNEuAfd2AaY';
const publishKey = 'U2FsdGVkX1+aakRuXf1/qelNETehvEIooh61AYeIhqKnPx+XG5YuQqS7iTtCUXMZ';
const token = localStorage.getItem('token');
const headers = {
  Authorization: `Bearer ${token ? token : ""}`,
  'secret_key': secretKey,
  'publish_key': publishKey
};
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
    return Promise.resolve(response.data);
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
  return new Promise(async (resolve, reject) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await Axios.post(`${apiPath}/api/logout`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
            secret_key: secretKey,
            publish_key: publishKey
          }
        });
        if (response.status === 200) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          dispatch({
            type: ActionTypes.AUTH_LOGOUT,
          });
          resolve('Logout successful');
        } else {
          reject('Logout failed: No response from server. Please check your network connection.');
        }
      } else {
        reject('No token found');
      }
    } catch (error) {
      console.error('Logout failed:', error);
      reject('Logout failed: An error occurred.');
    }
  });
};
export const addUser = (credentials) => async (dispatch) => {
  try {
    const response = await Axios.post(`${apiPath}/api/register`, credentials, { headers });
    console.log(response);
    if (response.data.code === 200) {
      const body = response.data.body;
      dispatch({
        type: ActionTypes.ADD_USER,
        payload: body,
      });
      return Promise.resolve(response.data);
    } else {
      let errorMessage = 'Something went wrong.';
      return Promise.reject(errorMessage);
    }

  } catch (error) {
    let errorMessage = 'Please try again.';
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

export const getUser = (credentials) => async (dispatch) => {
  try {
    const response = await Axios.get(`${apiPath}/api/get-user-list`, {
      headers,
      params: credentials,
    });
    if (response.data.code === 200) {
      const body = response.data.body;
      dispatch({
        type: ActionTypes.GET_USER,
        payload: body.users,
      });
      return Promise.resolve({
        data: body.data,
        totalUsers: body.totalUsers,
        totalPages: body.totalPages,
        currentPage: body.currentPage,
      });
    } else {
      let errorMessage = 'Something went wrong.';
      return Promise.reject(errorMessage);
    }
  } catch (error) {
    let errorMessage = 'Please try again.';
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
export const changeStatus = (credentials) => async (dispatch) => {
  try {
    const response = await Axios.get(`${apiPath}/api/changes-status`, {
      headers,
      params: credentials,
    });
    if (response.data.code === 200) {
      const body = response.data.body;
      dispatch({
        type: ActionTypes.GET_USER,
        payload: body.users,
      });
      return Promise.resolve({
        data: body.data,
        totalUsers: body.totalUsers,
        totalPages: body.totalPages,
        currentPage: body.currentPage,
      });
    } else {
      let errorMessage = 'Something went wrong.';
      return Promise.reject(errorMessage);
    }
  } catch (error) {
    let errorMessage = 'Please try again.';
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
export const checkAuth = () => (dispatch) => {
  dispatch({
    type: ActionTypes.AUTH_CHECK,
  });
};
