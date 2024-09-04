import { createStore, applyMiddleware, compose } from 'redux';
import { thunk as ReduxThunk } from 'redux-thunk';
import { persistStore } from 'redux-persist';
import RootReducer from './reducers'; // Adjust the path as needed

const store = createStore(
  RootReducer,
  compose(applyMiddleware(ReduxThunk)) // Apply redux-thunk middleware
);

const persistor = persistStore(store);

export { store, persistor };