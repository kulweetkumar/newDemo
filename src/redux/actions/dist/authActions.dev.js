"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkAuth = exports.authLogout = exports.authLogin = void 0;

var _axios = _interopRequireDefault(require("axios"));

var ActionTypes = _interopRequireWildcard(require("../actionTypes"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// src/actions/authActions.js
var apiPath = 'http://localhost:2020';
var secretKey = 'U2FsdGVkX1/RJbPyYVG6OMCBGjA6IPdWJYYlHNS7ido4t8fWoLkw1qNEuAfd2AaY';
var publishKey = 'U2FsdGVkX1+aakRuXf1/qelNETehvEIooh61AYeIhqKnPx+XG5YuQqS7iTtCUXMZ';
var token = localStorage.getItem('token');
var headers = {
  Authorization: "Bearer ".concat(token ? token : ""),
  'secret_key': secretKey,
  'publish_key': publishKey
};

var authLogin = function authLogin(credentials) {
  return function _callee(dispatch) {
    var response, body, errorMessage;
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return regeneratorRuntime.awrap(_axios["default"].post("".concat(apiPath, "/api/login"), credentials, {
              headers: headers
            }));

          case 3:
            response = _context.sent;
            body = response.data.body;
            localStorage.setItem('token', body.token);
            localStorage.setItem('user', JSON.stringify(body)); // Save user to localStorage

            dispatch({
              type: ActionTypes.AUTH_LOGIN,
              payload: body
            });
            return _context.abrupt("return", Promise.resolve(body));

          case 11:
            _context.prev = 11;
            _context.t0 = _context["catch"](0);
            errorMessage = 'Login failed. Please try again.';

            if (_context.t0.response) {
              errorMessage = _context.t0.response.data.message || errorMessage;
            } else if (_context.t0.request) {
              errorMessage = 'No response from server. Please check your network connection.';
            } else {
              errorMessage = _context.t0.message || errorMessage;
            }

            return _context.abrupt("return", Promise.reject(errorMessage));

          case 16:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[0, 11]]);
  };
};

exports.authLogin = authLogin;

var authLogout = function authLogout() {
  return function _callee3(dispatch) {
    return regeneratorRuntime.async(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            return _context3.abrupt("return", new Promise(function _callee2(resolve, reject) {
              var _token, response;

              return regeneratorRuntime.async(function _callee2$(_context2) {
                while (1) {
                  switch (_context2.prev = _context2.next) {
                    case 0:
                      _context2.prev = 0;
                      _token = localStorage.getItem('token');

                      if (!_token) {
                        _context2.next = 9;
                        break;
                      }

                      _context2.next = 5;
                      return regeneratorRuntime.awrap(_axios["default"].post("".concat(apiPath, "/api/logout"), {}, {
                        headers: {
                          Authorization: "Bearer ".concat(_token),
                          secret_key: secretKey,
                          publish_key: publishKey
                        }
                      }));

                    case 5:
                      response = _context2.sent;

                      if (response.status === 200) {
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        dispatch({
                          type: ActionTypes.AUTH_LOGOUT
                        });
                        resolve('Logout successful');
                      } else {
                        reject('Logout failed: No response from server. Please check your network connection.');
                      }

                      _context2.next = 10;
                      break;

                    case 9:
                      reject('No token found');

                    case 10:
                      _context2.next = 16;
                      break;

                    case 12:
                      _context2.prev = 12;
                      _context2.t0 = _context2["catch"](0);
                      console.error('Logout failed:', _context2.t0);
                      reject('Logout failed: An error occurred.');

                    case 16:
                    case "end":
                      return _context2.stop();
                  }
                }
              }, null, null, [[0, 12]]);
            }));

          case 1:
          case "end":
            return _context3.stop();
        }
      }
    });
  };
};

exports.authLogout = authLogout;

var checkAuth = function checkAuth() {
  return function (dispatch) {
    dispatch({
      type: ActionTypes.AUTH_CHECK
    });
  };
};

exports.checkAuth = checkAuth;