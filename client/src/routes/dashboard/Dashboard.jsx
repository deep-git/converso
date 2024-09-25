import React, { useState } from 'react';
import Upload from '../../components/upload/Upload';
import { useAuth } from '../../contexts/AuthContext';
import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import Spinner from '../../components/spinner/Spinner';
import { ArrowUp, X } from 'lucide-react';
import model from '../../lib/gemini';

const Dashboard = () => {
    const [chatText, setChatText] = useState("");
    const { userData } = useAuth();
    const [img, setImg] = useState(null);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: async (data) => {
            const response = await fetch(`http://localhost:3000/api/chats`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userData,
                    text: data.text || "",
                    img: data.img || null,
                    aiResponse: data.aiResponse
                })
            });
            if (!response.ok) {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

            }

            return response.json();
        },
        onSuccess: async (id) => {
            queryClient.invalidateQueries({ queryKey: ["userChats"] });
            //await generateAIResponse(chatText); // Call AI response generation
            navigate(`/dashboard/chats/${id}`);
        },
        onError: (error) => {
            alert(error.message); // Notify user of the error
        },
    });

    const handleUpdateText = (content) => {
        setChatText(content);
    };

    const chat = model.startChat({
        history: [
            {
                role: "user",
                parts: [{ text: "Hello, I have 2 dogs in my house." }],
            },
            {
                role: "model",
                parts: [{ text: "Great to meet you. What would you like to know?" }],
            },
        ],
        generationConfig: {},
    });

    const generateAIResponse = async (initialQuestion) => {
        try {
            // Call your AI generation logic
            const aiResponse = await chat.sendMessageStream(initialQuestion);
            let accumulatedText = "";

            for await (const chunk of aiResponse.stream) {
                accumulatedText += chunk.text();
            }

            return accumulatedText;
        } catch (error) {
            console.error("Error generating AI response:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const text = chatText.trim();
        const imgUrl = img?.imgUrl;

        if (!text && !imgUrl) return;

        try {
            const aiResponse = await generateAIResponse(text); // Wait for AI response
            const data = { userData, text, img: imgUrl || null, aiResponse }; // Prepare the data

            const id = await mutation.mutateAsync(data); // Wait for the mutation to complete
            navigate(`/dashboard/chats/${id}`, { state: { initialQuestion: text, imgUrl } });
        } catch (error) {
            console.error("Error during submission:", error);
            alert("Failed to generate AI response or save the chat.");
        }
    };

    const handleRemoveImage = () => {
        setImg(null); // Clear the image state
    };

    const isLoading = mutation.isLoading;

    return (
        <div className="flex flex-col h-[calc(100vh-90px)] lg:w-full lg:h-screen lg:bg-default_black lg:p-5">
            <div className="h-full flex flex-col bg-white dark:bg-medium_gray lg:rounded-xl lg-normal:items-center lg:w-full">
                <div className="h-full flex flex-col max-w-auto lg-normal:w-[900px]">
                    <div className="flex flex-col px-5 py-5 gap-4">
                        <h2 className="text-[18px] font-semibold text-black dark:text-white">New chat</h2>
                        <div className="w-full h-[1px] bg-light_gray_border dark:bg-lighter_medium_gray" />
                    </div>

                    <div className="mt-auto flex flex-col p-5 flex-1">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-5xl font-lexend bg-gradient-to-r from-primary_blue via-purplish_blue to-primary_red inline-block text-transparent bg-clip-text w-max">Hello!</h1>
                            <h2 className="text-3xl font-lexend text-black dark:text-white">How can I help you today?</h2>
                        </div>

                        <div className="mt-auto lg:mt-0 lg:flex lg:flex-row lg:w-full">
                            <div className="mt-auto flex flex-col gap-5 items-center lg:mt-16 lg:items-start">

                                <div className="border-light_gray_border dark:border-lighter_medium_gray border-2 rounded-xl p-4 w-[90%] flex flex-col gap-3 max-w-[300px] lg:max-w-[270px] hover:shadow-light_gray_text hover:shadow-sm cursor-pointer" onClick={() => setChatText("Suggest beautiful places to visit on an upcoming road trip")}>
                                    <p className="text-[16px] text-black dark:text-white">Suggest beautiful places to visit on an upcoming road trip</p>
                                    <img src="./chat_icons/compass_chat.svg" alt="compass" className="w-9 h-9 ml-auto text-light_gray_text" />
                                </div>

                                <div className="border-light_gray_border dark:border-lighter_medium_gray border-2 rounded-xl p-4 w-[90%] flex flex-col gap-3 max-w-[300px] lg:max-w-[270px] hover:shadow-light_gray_text hover:shadow-sm cursor-pointer" onClick={() => setChatText("Brainstorm team bonding activities for our work retreat")}>
                                    <p className="text-[16px] text-black dark:text-white">Brainstorm team bonding activities for our work retreat</p>
                                    <img src="./chat_icons/lightbulb.svg" alt="lightbulb" className="w-9 h-9 ml-auto text-light_gray_text" />
                                </div>

                                <form onSubmit={handleSubmit} className="flex lg:hidden w-full rounded-xl px-2 py-2 bg-light_gray_border dark:bg-lighter_medium_gray justify-between items-center gap-1 sm:gap-5 sm:px-5">
                                    <Upload setImg={setImg} />

                                    {img && img.imgUrl && (
                                        <div className="flex items-center">
                                            <img src={img.imgUrl} alt="Uploaded" className="w-32 h-auto rounded mr-2" />
                                            <button type="button" onClick={handleRemoveImage} className="text-red-500 hover:text-red-700">
                                                <X />
                                            </button>
                                        </div>
                                    )}

                                    <textarea
                                        value={chatText}
                                        onChange={(e) => handleUpdateText(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault(); // Prevent new line
                                                handleSubmit(e); // Call the submit handler
                                            }
                                            // If Shift + Enter is pressed, let it create a new line
                                        }}
                                        placeholder="Ask anything..."
                                        className="p-1 min-w-[50px] outline-none flex-1 bg-light_gray_border dark:bg-lighter_medium_gray text-black dark:text-white resize-none h-10"
                                    />

                                    <button
                                        type="submit"
                                        disabled={chatText === "" || isLoading}
                                        className={`flex justify-center h-max items-center py-3 px-2 rounded-lg ${chatText === "" ? 'bg-light_gray_text/40 dark:bg-light_gray_text/70' : 'bg-default_black'}`}
                                    >
                                        {isLoading ? <Spinner /> : <ArrowUp className="w-6 h-6 sm:w-7 text-light_gray_border dark:text-lighter_medium_gray" />}
                                    </button>
                                </form>
                            </div>

                            <div className="hidden lg:flex flex-col gap-3 mt-16 flex-1">
                                <div className="flex items-center border-light_gray_border dark:border-lighter_medium_gray border-2 rounded-xl p-3 gap-5 flex-1">
                                    <div className="p-3 bg-primary_blue/20 rounded-lg w-max">
                                        <img src="./chat_icons/new_chat_icon.svg" alt="new chat" className="w-9 h-9" />
                                    </div>

                                    <p className="text-xl lg-normal:text-2xl text-black dark:text-white">Create a new Chat</p>
                                </div>

                                <div className="flex items-center border-light_gray_border dark:border-lighter_medium_gray border-2 rounded-xl p-3 gap-5 flex-1">
                                    <div className="p-3 bg-purplish_blue/20 rounded-lg w-max">
                                        <img src="./chat_icons/analyze.svg" alt="analyze" className="w-9 h-9" />
                                    </div>

                                    <p className="text-xl lg-normal:text-2xl text-black dark:text-white">Analyze images</p>
                                </div>

                                <div className="flex items-center border-light_gray_border dark:border-lighter_medium_gray border-2 rounded-xl p-3 gap-5 flex-1">
                                    <div className="p-3 bg-primary_red/20 rounded-lg w-max">
                                        <img src="./chat_icons/code.svg" alt="code" className="w-9 h-9" />
                                    </div>

                                    <p className="text-xl lg-normal:text-2xl text-black dark:text-white">Help me with my code</p>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="hidden lg:flex w-full rounded-xl px-2 py-2 bg-light_gray_border dark:bg-lighter_medium_gray justify-between items-center gap-1 sm:gap-5 sm:px-2 lg:mt-auto">
                            <Upload setImg={setImg} />

                            {img && img.imgUrl && (
                                <div className="flex items-center">
                                    <img src={img.imgUrl} alt="Uploaded" className="w-32 h-auto rounded mr-2" />
                                    <button type="button" onClick={handleRemoveImage} className="text-red-500 hover:text-red-700">
                                        <X />
                                    </button>
                                </div>
                            )}

                            <textarea
                                value={chatText}
                                onChange={(e) => handleUpdateText(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault(); // Prevent new line
                                        handleSubmit(e); // Call the submit handler
                                    }
                                    // If Shift + Enter is pressed, let it create a new line
                                }}
                                placeholder="Ask anything..."
                                className="p-1 min-w-[50px] outline-none flex-1 bg-light_gray_border dark:bg-lighter_medium_gray text-black dark:text-white resize-none h-10"
                            />

                            <button
                                type="submit"
                                disabled={chatText === "" || isLoading}
                                className={`flex justify-center h-max items-center py-3 px-2 rounded-lg ${chatText === "" ? 'bg-light_gray_text/40 dark:bg-light_gray_text/70' : 'bg-default_black'}`}
                            >
                                {isLoading ? <Spinner /> : <ArrowUp className="w-6 h-6 sm:w-7 text-light_gray_border dark:text-lighter_medium_gray" />}
                            </button>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;