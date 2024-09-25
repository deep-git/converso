import React from 'react';

const Spinner = () => {
    return (
        <div className="spinner">
            <style jsx>{`
                .spinner {
                    border: 8px solid rgba(255, 255, 255, 0.3);
                    border-left-color: #007bff; /* Change to your desired color */
                    border-radius: 50%;
                    width: 40px; /* Adjust size as needed */
                    height: 40px; /* Adjust size as needed */
                    animation: spin 1s linear infinite;
                    margin: auto; /* Center the spinner */
                }

                @keyframes spin {
                    0% {
                        transform: rotate(0deg);
                    }
                    100% {
                        transform: rotate(360deg);
                    }
                }
            `}</style>
        </div>
    );
};

export default Spinner;