import React from 'react';
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="flex w-full py-3 px-5 justify-between items-center lg-normal:w-[1220px]">
            <Link to="/" className="logo_container flex justify-center items-center gap-2 cursor-pointer">
                <img src="./logo.svg" alt="Logo" className="w-10 h-10 sm:w-14 sm:h-14" />
                <h2 className="font-bold font-lexend text-lg hidden sm:flex lg:text-[20px]">Converso</h2>
            </Link>

            <div className="nav_button_container flex gap-3 sm:gap-5 justify-center items-center">
                <Link to="/sign-in" className="text-sm sm:text-[16px] font-lexend py-2 px-3 hover:bg-light_gray_border rounded-md transition duration-75">Log In</Link>
                <Link to="/sign-up" className="text-sm sm:text-[16px] font-lexend py-2 px-3 rounded-md bg-black text-white hover:shadow-light_gray_text hover:shadow-md transition duration-75">Sign Up</Link>
            </div>
        </nav>
    )
}

export default Navbar