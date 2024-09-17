import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authLogin } from '../../../redux/actions/authActions'; // Adjust path as necessary
import { toast } from 'react-toastify';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '', role: 2, device_token: "token", device_type: 3 });
  const [errors, setErrors] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.Auth);
  const navigate = useNavigate();
  const validate = () => {
    let isValid = true;
    const newErrors = { email: '', password: '' };
    if (!credentials.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      newErrors.email = 'Email is invalid';
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
      const response = await dispatch(authLogin(credentials));
      if (response.code === 200) {
        toast.dismiss(); // some we have toast show and another function hit with the time to we use this 
        toast.success('Login successful!');
        navigate('/admin/dashboard');
      } else {
        toast.error(response.message || 'Login failed.');
      }
    } catch (err) {
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <div className="login-background">
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
              <p className="mb-3">Welcome to Admin Panel</p>
            
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
