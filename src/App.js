import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AdminNavbar from './components/Admin/AdminLayout/Admin';
import Login from './components/pages/UserAuth/login';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Dashboard from './components/Admin/Dashboard/Dashboard';
import { useSelector } from 'react-redux';
const App = () => {
  const { isAuthenticated } = useSelector(state => state.Auth);

  return (
    <div className="App">
      {isAuthenticated && <AdminNavbar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        {/* Other routes */}
      </Routes>
    </div>
  );
};

export default App;
