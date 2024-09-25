import React from 'react';
import Navbar from '../../components/navbar/Navbar';
import AdvantageCard from '../../components/card/advantage-card/AdvantageCard';
import { Link } from "react-router-dom";

const Homepage = () => {
    return (
        <div className="w-full flex justify-center">
            <div className="flex flex-col w-full justify-center items-center">
                <Navbar />

                <div className="flex flex-col gap-5 mt-12 px-5 justify-center items-center">
                    <h1 className="font-lexend font-bold text-2xl text-center sm:w-[400px] md:text-3xl md:w-[500px] lg:text-4xl lg:w-[600px]">Unlocking Human Potential with AI Chat-Driven Solutions</h1>
                    <div className="h-[1px] w-full bg-black sm:hidden" />
                    <p className="text-center text-sm font-open_sans px-4 sm:w-[400px] md:text-[16px] md:w-[450px] lg:text-[18px] lg:w-[500px] lg:leading-6">Unlock instant, expert-level answers with Converso. Our AI delivers precise solutions to your questions, making information clear and accessible.</p>
                </div>

                <div className="flex flex-col justify-center items-center bg-light_gray_background rounded-xl mt-12 gap-4 py-2 px-5 mx-5 lg:flex-row-reverse lg:px-10 lg-normal:w-[1220px] lg-normal:px-16 lg:mt-20">
                    <img src="./landingpage.png" alt="Hero image" className="" />
                    <div className="flex flex-col justify-center items-center gap-4 lg-normal:items-start">
                        <h2 className="font-semibold text-lg text-center md:text-xl lg:text-2xl lg-normal:text-left">Superior Contextual Understanding and Response Quality</h2>
                        <p className="text-center text-sm md:w-[90%] md:text-[16px] lg:text-[18px] lg-normal:text-left lg-normal:w-full lg:leading-6">Our most advanced implemented model of Gemini AI excels in understanding and generating human-like text with high contextual awareness, enabling engaging and coherent interactions across various topics and conversation styles.</p>
                        <Link to="/dashboard" className="bg-default_black text-default_white w-max py-2 px-4 rounded-lg mt-2 mb-5 hover:shadow-light_gray_text hover:shadow-md transition duration-75">Get Started Now</Link>
                    </div>
                </div>

                <section className="flex flex-col mt-20 w-full px-5 lg:mt-32 lg-normal:w-[1220px] lg-normal:px-0">
                    <div className="md:border-l-8 md:border-default_black md:pl-7 md:py-5 lg:w-[60%]">
                        <h2 className="font-bold text-lg font-lexend text-center md:text-2xl md:text-start">Why Choose Converso?</h2>
                        <p className="text-sm mt-5 lg:text-[18px] md:leading-6">Our products & services offers some of the best functionalities and features through the integration of Gemini AI’s API. With our free onboard services, make the most out of your chat bot experiences on a day-to-day basis to find the solutions and answers you’re looking for!</p>
                    </div>


                    <div className="mt-10 px-3 grid grid-cols-2 place-items-center gap-7 mb-20 md:grid-cols-3 lg:place-items-end lg:gap-5 lg:w-max lg:ml-auto lg-normal:mt-32 lg:pr-0">
                        <AdvantageCard title="24/7 Availability" cardImg="./landing_page_icons/availability.svg" cardAlt="Availability" />
                        <AdvantageCard title="Personalized Interactions" cardImg="./landing_page_icons/personalized.svg" cardAlt="Personalized" />
                        <AdvantageCard title="High Efficiency" cardImg="./landing_page_icons/efficiency.svg" cardAlt="Efficiency" />
                        <AdvantageCard title="Seamless Integration" cardImg="./landing_page_icons/integration.svg" cardAlt="Integration" />
                        <AdvantageCard title="Continuous Learning" cardImg="./landing_page_icons/continuous.svg" cardAlt="Continuous" />
                        <AdvantageCard title="Adv. Natural Language Processing" cardImg="./landing_page_icons/natural_language.svg" cardAlt="Natural Language" />
                    </div>
                </section>

                <footer className="flex flex-col justify-between items-center bg-default_black text-default_white mt-10 gap-7 p-9 text-center text-sm w-full">
                    <p>© 2024 Converso. All rights reserved.</p>
                    <div>
                        <p className="font-bold">Powered by Gemini AI</p>
                        <p>Delivering cutting-edge AI solutions to transform your business.</p>
                    </div>
                </footer>

            </div>
        </div>
    )
}

export default Homepage