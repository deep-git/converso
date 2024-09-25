import React, { useState } from 'react';

const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loginUser = async (credentials) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            return data;
        } catch (error) {
            setError(error.message);
            throw error; // Rethrow the error for handling in the SignIn component
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, loginUser };
};

export default useLogin;