import React, { useState } from 'react';
import { Link, Outlet, useLocation } from "react-router-dom";
import UserProfile from '../../components/user-profile/UserProfile';
import ThemeMode from '../../components/theme-mode/ThemeMode';
import ChatList from '../../components/chatlist/ChatList';

const DashboardLayout = () => {

    const [openNav, setOpenNav] = useState(false);

    const handleOpenNav = () => {
        setOpenNav(prev => !prev);
    }

    const [isChatListVisible, setChatListVisible] = useState(true);
    const path = useLocation().pathname;

    const handleToggleChatList = () => {
        setChatListVisible(prev => !prev);
    };

    return (
        <div className="dashboardLayout flex flex-col lg:flex-row h-screen">
            <div className="menu text-default_white flex flex-col relative">
                <div className="flex bg-default_black justify-between items-center w-full h-[90px] flex-wrap py-5 px-5 lg:h-auto lg:w-[300px] lg:items-start">
                    <Link to="/" className="logo_container flex justify-center items-center gap-2 cursor-pointer">
                        <img src="/chat_icons/logo.svg" alt="Logo" className="w-10 h-10" />
                        <h2 className="font-bold font-lexend text-[16px] sm:flex lg:text-[20px] text-default_white">Converso</h2>
                    </Link>

                    <img src={openNav === false ? `/chat_icons/burger.svg` : `/chat_icons/close.svg`} alt="burger" onClick={() => handleOpenNav()} className="lg:hidden" />

                    <div className={`hidden lg:flex flex-col w-full py-5 px-5 font-open_sans justify-between h-[calc(100vh-80px)]`}>
                        <div className="mt-5">
                            <div className="flex flex-col gap-3">
                                <div className="flex gap-2 items-center flex-wrap">
                                    <img src="/chat_icons/dashboard_icon.svg" alt="dashboard" className="text-purplish_blue w-7 h-7" />
                                    <p className="text-2xl">Dashboard</p>
                                </div>

                                <div className="flex flex-col ml-7 gap-3">
                                    <Link to="/dashboard" className={`${path === "/dashboard" ? "bg-light_gray_text/40 p-2" : ""} flex gap-2 text-base rounded-lg items-center flex-wrap`}>
                                        <img src="/chat_icons/new_chat_icon.svg" alt="new chat" className="w-6 h-6 text-primary-blue" />
                                        <p className="">Create a new Chat</p>
                                    </Link>

                                    {/* 
                                    <div className="flex gap-2 items-center flex-wrap">
                                        <img src="/chat_icons/compass.svg" alt="compass" className="w-6 h-6 text-primary-red" />
                                        <p className="">Explore Converso</p>
                                    </div>

                                    <div className="flex gap-2 items-center flex-wrap">
                                        <img src="/chat_icons/contact.svg" alt="contact" className="w-6 h-6 text-primary_orange" />
                                        <p className="">Contact</p>
                                    </div>
                                    */}
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 mt-10">
                                <div className="flex gap-2 items-center flex-wrap">
                                    <img src="/chevron_down.svg" alt="toggle chat list" className={`w-6 h-6 cursor-pointer ${isChatListVisible ? "" : "-rotate-90"} transition duration-150`} onClick={handleToggleChatList} />
                                    <p className="text-2xl text-light_gray_text">Chat list</p>
                                </div>

                                {isChatListVisible && (
                                    <div className="flex flex-col ml-7 gap-3 overflow-y-auto h-[350px] scrollbar-hidden">
                                        <ChatList />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col gap-4 items-center">
                            <UserProfile />
                            <ThemeMode />
                        </div>
                    </div>
                </div>

                <div className={openNav === false ? `hidden` : `absolute top-[90px] flex flex-col justify-between w-full bg-medium_gray min-h-[calc(100vh-90px)] py-5 px-5 font-open_sans lg:hidden z-30`}>
                    <div className="mt-5">
                        <div className="flex flex-col gap-3">
                            <div className="flex gap-2 items-center flex-wrap">
                                <img src="/chat_icons/dashboard_icon.svg" alt="dashboard" className="text-purplish_blue w-7 h-7" />
                                <p className="text-2xl">Dashboard</p>
                            </div>

                            <div className="flex flex-col ml-7 gap-3">
                                <Link to="/dashboard" className={`${path === "/dashboard" ? "bg-light_gray_text/40 p-2" : ""} flex gap-2 items-center flex-wrap text-base rounded-lg`}>
                                    <img src="/chat_icons/new_chat_icon.svg" alt="new chat" className="w-6 h-6 text-primary-blue" />
                                    <p className="">Create a new Chat</p>
                                </Link>

                                {/*
                                <div className="flex gap-2 items-center flex-wrap">
                                    <img src="/chat_icons/compass.svg" alt="compass" className="w-6 h-6 text-primary-red" />
                                    <p className="text-lg">Explore Converso</p>
                                </div>

                                <div className="flex gap-2 items-center flex-wrap">
                                    <img src="/chat_icons/contact.svg" alt="contact" className="w-6 h-6 text-primary_orange" />
                                    <p className="text-lg">Contact</p>
                                </div>
                                */}
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 mt-10">
                            <div className="flex gap-2 items-center flex-wrap">
                                <img src="/chevron_down.svg" alt="dashboard" className={`w-7 h-7 cursor-pointer ${isChatListVisible ? "" : "-rotate-90"} transition duration-150`} onClick={handleToggleChatList} />
                                <p className="text-2xl text-light_gray_text">Chat list</p>
                            </div>

                            {isChatListVisible && (
                                <div className="flex flex-col ml-7 gap-3">
                                    <ChatList />
                                </div>
                            )}
                        </div>

                    </div>
                    <div className="flex flex-col gap-4 mb-10 mt-5 items-center">
                        <UserProfile />
                        <ThemeMode />
                    </div>
                </div>

            </div>
            <div className="content w-full">
                <Outlet />
            </div>
        </div>
    )
}

export default DashboardLayout