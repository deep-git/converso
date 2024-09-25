import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { useAuth } from '../../contexts/AuthContext';
import LogoutModal from "./LogoutModal";

const UserProfile = () => {
    const { userData, isAuthenticated, logout } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        setIsModalOpen(false); // Close modal after logout
    }

    const profilePicUrl = userData?.profilePic || "/chat_icons/user.svg";

    return (
        <div className="bg-default_black lg:bg-medium_gray rounded-lg py-4 px-5 font-open_sans w-[250px]">
            <div className="flex gap-4 justify-start items-center">
                {/* 
                <div className="w-9 h-9 bg-default_white rounded-full flex justify-center items-center">
                    <img src={profilePicUrl} alt="User" className="w-9 h-9" />
                </div>
                */}

                <div className="avatar w-10 h-10 rounded-full bg-primary_blue flex items-center justify-center text-white">
                    {userData?.first_name.slice(0, 1).toUpperCase()}{userData?.last_name.slice(0, 1).toUpperCase()}
                </div>
                <div className="flex flex-col gap-0 overflow-hidden">
                    {userData ? (
                        <>
                            {userData.first_name.length < 12
                                ? (
                                    <p className="text-default_white text-lg">{userData.first_name.substring(0, 12)} {userData.last_name.substring(0, 1)}.</p>
                                ) : (
                                    <p className="text-default_white text-lg">{userData.first_name.substring(0, 10)}... {userData.last_name.substring(0, 1)}.</p>
                                )}

                            <p className="email_scroll text-[12px] text-light_gray_text overflow-x-scroll">{userData.email}</p>
                        </>
                    ) : (
                        <p className="text-default_white text-lg">Guest</p>
                    )}
                </div>
            </div>

            <Link
                to="/sign-in"
                className={!isAuthenticated ? "flex justify-center items-center border-medium_gray lg:border-light_gray_text border-2 rounded-lg w-full mt-5 py-3 px-5" : "hidden"}>
                <p className="text-[16px]">Log In</p>
            </Link>

            <button
                onClick={() => setIsModalOpen(true)}
                className={isAuthenticated ? "flex justify-center items-center hover:border-primary_red/50 border-medium_gray lg:border-light_gray_text border-2 rounded-lg w-full mt-5 py-3 px-5 transition duration-75" : "hidden"}>
                <p className="text-[16px] text-primary_red">Log out</p>
            </button>

            <LogoutModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onLogout={handleLogout}
            />
        </div>
    );
}

export default UserProfile;