import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import Auth from './Auth';
const RootReducer = combineReducers({
		Auth,
		form: formReducer,
	});
export default RootReducer;
