import React from 'react'

const AdvantageCard = ({ title, cardImg, cardAlt }) => {
    return (
        <div className="rounded-xl bg-light_gray_background shadow-light_gray_text shadow-md overflow-hidden relative w-[125px] lg:w-[190px] h-[125px] lg:h-[190px] p-4">
            <p className="font-bold text-sm md:text-[16px] lg:text-[18px]">{title}</p>
            <img src={cardImg} alt={cardAlt} className="text-default_black w-20 lg:w-24 h-20 lg:h-24 absolute -bottom-2 lg:-bottom-1 -right-3 lg:-right-1" />
        </div>
    )
}

export default AdvantageCard