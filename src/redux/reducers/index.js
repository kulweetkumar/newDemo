import { combineReducers } from 'redux';
import authReducer from '../reducers/authReducer';
import { reducer as formReducer } from 'redux-form';

const RootReducer = combineReducers({
  Auth: authReducer,
  form: formReducer,
});

export default RootReducer;