import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AdminNavbar from './components/Admin/AdminLayout/Admin';
import Login from './components/pages/UserAuth/login';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';

const App = () => {
  const { isAuthenticated } = useSelector(state => state.Auth);
  return (
    <div className="App">
      <ToastContainer />
      {isAuthenticated && <AdminNavbar />}
      <Routes>
        <Route path="/" element={<Login />} />
      </Routes>
    </div>
  );
};

export default App;
