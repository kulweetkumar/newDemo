import { combineReducers } from 'redux';
import authReducer from '../actions/index';
import { reducer as formReducer } from 'redux-form';

const RootReducer = combineReducers({
  Auth: authReducer,
  form: formReducer,
});

export default RootReducer;