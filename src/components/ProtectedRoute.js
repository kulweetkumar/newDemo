import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
const ProtectedRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem('token');

    const location = useLocation();
    useEffect(() => {
        if (!isAuthenticated) {
            toast.error('You need to log in to access this page.');
        }
    }, [isAuthenticated]);

    if (!isAuthenticated) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }
    return children;
};
export default ProtectedRoute;
