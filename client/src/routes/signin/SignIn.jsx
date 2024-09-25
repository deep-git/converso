import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import useLogin from '../../hooks/useLogin';
import { useAuth } from '../../contexts/AuthContext';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const SignIn = () => {
    const { loading, error, loginUser } = useLogin();
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const { token, user } = await loginUser(formData);
            login(token, user); // Call login with the token
            navigate("/dashboard");
        } catch (error) {
            console.log(error);
            //setError(error.message)
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value // Update specific field based on input name
        }));
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <div className="flex flex-col lg-normal:flex-row h-screen">
            <div className="w-full bg-default_black p-4 lg-normal:w-[610px] lg-normal:relative">
                <Link to="/">
                    <img src="./back_arrow.svg" alt="Back arrow" className="w-7 h-7" />
                </Link>
                <img src="/login_image.png" alt="Signin Image" className="hidden lg-normal:flex lg-normal:absolute lg-normal:-right-28 lg-normal:top-32" />
            </div>

            <div className="lg-normal:ml-0 lg-normal:flex-1 lg-normal:flex lg-normal:flex-col lg-normal:relative">
                <Link to="/" className="logo_container flex justify-center lg-normal:justify-start items-center mt-5 gap-2 lg-normal:ml-7 lg-normal:absolute">
                    <img src="./logo.svg" alt="Logo" className="w-10 h-10 sm:w-14 sm:h-14" />
                    <h2 className="font-bold font-lexend text-lg sm:flex lg:text-[20px]">Converso</h2>
                </Link>

                <div className="flex flex-col w-full justify-center mt-10 px-7 items-center lg-normal:w-full lg-normal:flex-1">
                    <h1 className="text-4xl font-bold font-lexend text-center">Log In</h1>

                    <form onSubmit={handleLogin} className="flex flex-col mt-10 gap-5 w-full md:max-w-screen-md lg-normal:max-w-screen-sm">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="email" className="font-semibold">Email</label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                className="bg-light_gray_background rounded-lg py-3 px-5"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="password" className="font-semibold">Password</label>
                            <div className="relative flex w-full">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"} // Toggle input type based on state
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="bg-light_gray_background rounded-lg py-3 px-5 pr-9 sm:pr-16 flex-1"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-4 top-4 text-light_gray_text"
                                >
                                    {showPassword
                                        ? <FaRegEyeSlash className="w-5 h-5" />
                                        : <FaRegEye className="w-5 h-5" />
                                    }
                                </button>
                            </div>
                        </div>

                        {error && <p className="text-red-500">{error}</p>}

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 px-5 text-default_white font-bold text-lg rounded-lg font-lexend mt-10 ${loading ? 'bg-gray-400' : 'bg-purplish_blue hover:shadow-purplish_blue hover:shadow-md'}`}
                        >
                            {loading ? 'Logging In...' : 'Log In'}
                        </button>
                    </form>

                    <div className="w-full h-[1px] bg-default_black mt-10 md:max-w-screen-md lg-normal:max-w-screen-sm" />

                    <p className="text-center mt-5 font-semibold text-wrap px-5">
                        Don't have an account?
                        <Link to="/sign-up" className="text-primary_blue font-bold"> Sign Up.</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SignIn;