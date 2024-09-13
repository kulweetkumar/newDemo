import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './redux/store'; // Adjust the path as needed
import { BrowserRouter } from 'react-router-dom';
import './index.css'; // Adjust the path as needed
import "../src/adminAssets/css/light-bootstrap-dashboard-react.min.css";
import "../src/adminAssets/css/animate.min.css";
import "../src/adminAssets/css/demo.css";
import '@fortawesome/fontawesome-free/css/all.min.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
