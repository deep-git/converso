import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const RequireAuth = ({ children, redirectTo }) => {
    const { authStatus, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>; // or a spinner/loading indicator
    }

    if (authStatus === undefined) {
        return null; // Wait until authentication status is determined
    }

    return authStatus === "LoggedIn"
        ? children
        : <Navigate to={redirectTo} replace />;
};

export default RequireAuth;