import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {  checkAuth, authLogin, authLogout } from '../../redux/actions'; // Adjust path as necessary
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '' }); // State for validation errors
  const dispatch = useDispatch();
  const { isAuthenticated, user, loader, error } = useSelector(state => state.Auth);

  const validate = () => {
    let isValid = true;
    const newErrors = { email: '', password: '' };

    if (!credentials.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    }
    
    if (!credentials.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async () => {
    if (!validate()) {
      return;
    }
    
    try {
      const user = await dispatch(authLogin(credentials));
      if (user.statusCode === 200) {
        toast.success('Login successful!');
      }else{
        toast.error(user);
      }
    } catch (err) {
      toast.error(err);
    }
  };

  const handleLogout = () => {
    dispatch(authLogout());
  };

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card login-card shadow-lg p-4">
        {!isAuthenticated ? (
          <div className="card-body">
            <h2 className="card-title text-center mb-4">Login</h2>
            <form>
              <div className="form-group mb-3">
                <input
                  type="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  placeholder="Email"
                  value={credentials.email}
                  onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                />
                {errors.email && <div className="invalid-feedback" style={{ color: 'red' }}>{errors.email}</div>}
              </div>
              <div className="form-group mb-4">
                <input
                  type="password"
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  placeholder="Password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                />
                {errors.password && <div className="invalid-feedback" style={{ color: 'red' }}>{errors.password}</div>}
              </div>
              <button 
                type="button" 
                onClick={handleLogin} 
                className="btn btn-primary btn-block"
              >
                Login
              </button>
            </form>
          </div>
        ) : (
          <div className="card-body text-center">
            <p className="mb-3">Welcome, {user.name}</p>
            <button 
              onClick={handleLogout} 
              className="btn btn-secondary"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;