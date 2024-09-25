import React, { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userData, setUserData] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (token) {
            const parts = token.split('.');
            if (parts.length !== 3) {
                console.error("Invalid token format");
                localStorage.removeItem('token');
                localStorage.removeItem('user'); // Clear user as well
                return;
            }
            try {
                const decodedToken = jwtDecode(token);
                const currentTime = Date.now() / 1000;

                if (decodedToken.exp > currentTime) {
                    setUserData(storedUser ? JSON.parse(storedUser) : decodedToken); // Use stored user or decoded
                    setIsAuthenticated(true);
                } else {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user'); // Clear user on token expiration
                }
            } catch (error) {
                console.error("Failed to decode token", error);
                localStorage.removeItem('token');
                localStorage.removeItem('user'); // Clear user on decode failure
                setError("Failed to authenticate");
            } finally {
                setLoading(false);
            }
        }
    }, []);

    /*
    const login = (token, user) => {
        try {
            const decodedToken = jwtDecode(token);
            const fullUserData = { ...decodedToken, ...user }; // Combine decoded token and user info
            setUserData(fullUserData);
            setIsAuthenticated(true);
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(fullUserData)); // Persist user data
            setError(null); // Reset error on successful login
        } catch (error) {
            console.error("Login failed", error);
            setError("Invalid token");
        }
    };

    const logout = () => {
        setUserData(null);
        setIsAuthenticated(false);
        localStorage.removeItem('token');
    };
    */

    const login = (token, user) => {
        try {
            const decodedToken = jwtDecode(token);
            const fullUserData = { ...decodedToken, ...user };
            setUserData(fullUserData);
            setIsAuthenticated(true);
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(fullUserData));
            setError(null);
        } catch (error) {
            console.error("Login failed", error);
            setError("Invalid token");
        }
    };

    // Ensure proper logout function
    const logout = () => {
        setUserData(null);
        setIsAuthenticated(false);
        localStorage.removeItem('token');
        localStorage.removeItem('user'); // Clear user data on logout
    };

    return (
        <AuthContext.Provider value={{ userData, isAuthenticated, login, logout, error, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
