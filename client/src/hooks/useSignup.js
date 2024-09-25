import React, { useState } from 'react';

const useSignup = () => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const registerUser = async (values) => {
        console.log(values);
        try {
            setError(null);
            setLoading(true);
            const res = await fetch("http://localhost:3000/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });

            const data = await res.json();
            console.log(data);

            if (!res.ok) {
                // Use the error message from the server response
                throw new Error(data.message || 'Signup failed');
            }

            console.log("Signup response:", data);
            //login(data.token, data.user); // Call login with both token and user
            localStorage.setItem('token', data.token); // Store the token
            return { token: data.token, user: data.user };
        } catch (error) {
            setError(error.message || "An unexpected error occurred."); // Capture the error message
            return { token: null, user: null }; // Return nulls if there's an error
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, registerUser };
}

export default useSignup;