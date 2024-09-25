import React from 'react';

const LogoutModal = ({ isOpen, onClose, onLogout }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-default_white dark:bg-default_black rounded-lg p-6 shadow-lg max-w-sm w-full text-default_black dark:text-default_white border-light_gray_border dark:border-medium_gray border-2">
                <h2 className="text-lg font-semibold mb-4">Confirm Logout</h2>
                <p className="mb-6">Are you sure you want to log out?</p>
                <div className="flex justify-end gap-2">
                    <button
                        className="mr-2 text-gray-600 hover:text-gray-800 hover:bg-light_gray_background dark:hover:bg-medium_gray/70 dark:hover:text-default_white px-4 py-2 rounded-lg"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="bg-red-500 text-white rounded-lg px-4 py-2 hover:bg-red-600"
                        onClick={onLogout}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LogoutModal;