import React, { useEffect, useState } from 'react';
import { IoSunny, IoSunnyOutline } from "react-icons/io5";
import { FaMoon, FaRegMoon } from "react-icons/fa";

const ThemeMode = () => {
    const [theme, setTheme] = useState('light'); // Initial theme state

    // Load the theme from local storage on component mount
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'light'; // Default to 'light'
        setTheme(savedTheme);
        document.body.className = savedTheme; // Set initial body class
    }, []);

    // Function to toggle theme and save it to local storage
    const toggleTheme = (selectedTheme) => {
        setTheme(selectedTheme);
        localStorage.setItem('theme', selectedTheme); // Save theme to local storage
        document.body.className = selectedTheme; // Set body class to the selected theme
    };

    return (
        <div className="relative flex bg-medium_gray rounded-lg p-1 w-[250px] justify-start items-center">
            {/* Sliding effect container */}
            <div
                className={`absolute transition-transform duration-300 ease-in-out rounded-lg ${theme === 'dark' ? 'translate-x-full' : 'translate-x-0'} 
                    bg-default_black w-[calc(50%-4px)] h-[85%]`}
            />
            <div
                className={`flex justify-center items-center gap-2 flex-1 rounded-lg py-2 cursor-pointer z-10`}
                onClick={() => toggleTheme('light')}
                role="button"
                aria-label="Switch to light mode"
                aria-pressed={theme === 'light'}
            >

                <IoSunny className={`${theme === "light" ? "flex" : "hidden"} w-5 h-5 text-default_white`} />
                <IoSunnyOutline className={`${theme === "dark" ? "flex" : "hidden"} w-5 h-5 text-light_gray_text`} />
                <span className={`text-lg ${theme === 'light' ? 'text-default_white' : 'text-light_gray_text'}`}>
                    Light
                </span>
            </div>
            <div
                className={`flex justify-center items-center gap-2 flex-1 rounded-lg py-2 cursor-pointer z-10`}
                onClick={() => toggleTheme('dark')}
                role="button"
                aria-label="Switch to dark mode"
                aria-pressed={theme === 'dark'}
            >

                <FaMoon className={`${theme === "dark" ? "flex" : "hidden"} w-4 h-4 text-default_white`} />
                <FaRegMoon className={`${theme === "light" ? "flex" : "hidden"} w-4 h-4 text-light_gray_text`} />
                <span className={`text-lg ${theme === 'dark' ? 'text-default_white' : 'text-light_gray_text'}`}>
                    Dark
                </span>
            </div>
        </div>
    );
}

export default ThemeMode;
