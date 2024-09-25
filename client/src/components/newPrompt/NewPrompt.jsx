import React from 'react'
import Markdown from "react-markdown";

const NewPrompt = ({ question, answer }) => {

    return (
        <div className="flex flex-col">
            {question && (
                <div className="message user w-max flex-end">
                    {question}
                </div>
            )}

            {answer && (
                <div className="message w-max">
                    <Markdown>
                        {answer}
                    </Markdown>
                </div>
            )}
        </div>
    )
}

export default NewPrompt