import React, { useRef, useState, useEffect } from 'react';
import Upload from '../../components/upload/Upload';
import NewPrompt from '../../components/newPrompt/NewPrompt';
import model from '../../lib/gemini';
import { ImageKit, IKImage } from 'imagekitio-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import Markdown from 'react-markdown';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowUp, Trash } from 'lucide-react';
import Spinner from '../../components/spinner/Spinner';

const Chat = () => {
    const [question, setQuestion] = useState("");
    const [chatText, setChatText] = useState("");
    const [answer, setAnswer] = useState("");
    const [showScrollToBottom, setShowScrollToBottom] = useState(false);
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [img, setImg] = useState({
        isLoading: false,
        error: "",
        dbData: {},
        aiData: {}
    });
    const { userData } = useAuth();
    const navigate = useNavigate();
    const path = useLocation().pathname;
    const chatId = path.split("/").pop();

    const queryClient = useQueryClient(); // Initialize Query Client
    const queryClientAns = useQueryClient();

    const chatContainerRef = useRef(null); // Ref for chat container
    const dropdownRef = useRef(null); // Ref for chat options
    const endRef = useRef(null); // Ref for bottom of chat
    const formRef = useRef(null); // Ref for input form

    const { isPending, error, data } = useQuery({
        queryKey: ["chat", chatId],
        queryFn: () => {
            if (!userData) return Promise.resolve([]);
            return fetch(`http://localhost:3000/api/chats/${chatId}`, {
                method: 'POST',
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userData }),
            }).then((res) => {
                if (!res.ok) {
                    navigate("/dashboard");
                    throw new Error('Network response was not ok');
                }
                return res.json();
            });
        },
        enabled: !!userData
    });

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

    useEffect(() => {
        endRef.current.scrollIntoView({ behavior: "smooth" });
    }, [data, question, answer, img.dbData]);

    // Handle scrolling and showing the arrow
    const handleScroll = () => {
        if (chatContainerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
            setShowScrollToBottom(scrollTop + clientHeight < scrollHeight);
        }
    };

    const scrollToBottom = () => {
        endRef.current.scrollIntoView({ behavior: "smooth" });
        setShowScrollToBottom(false);
    };

    const mutationChatId = useMutation({
        mutationFn: ({ userData, question, answer, img }) => {
            return fetch(`http://localhost:3000/api/chats/${data._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userData,
                    question: question.length ? question : undefined,
                    answer: answer,
                    img: img
                })
            }).then((res) => res.json());
        },
        onSuccess: (id) => {
            queryClientAns.invalidateQueries({ queryKey: ["chat", data._id] }).then(() => {
                formRef.current.reset();
                setQuestion("");
                setAnswer("");
                setImg({
                    isLoading: false,
                    error: "",
                    dbData: {},
                    aiData: {}
                });
            });
        },
        onError: (error) => {
            console.log(error);
        }
    });

    const add = async (text, isInitial) => {
        if (!isInitial) setQuestion(text);

        try {
            const result = await chat.sendMessageStream(
                Object.entries(img.aiData).length ? [img.aiData, text] : [text]
            );

            let accumulatedText = "";

            for await (const chunk of result.stream) {
                const chunkText = chunk.text();
                accumulatedText += chunkText;
                setAnswer(accumulatedText);
            }

            mutationChatId.mutate({
                userData,
                question: text, // use the current question
                answer: accumulatedText, // send the accumulated answer
                img: img.dbData?.filePath || undefined
            });
        } catch (error) {
            console.log(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        //const text = e.target.text.value;
        const text = chatText;
        setChatText("");
        if (!text) return;
        await add(text, false);
    };

    const handleToggleDropdown = () => {
        setDropdownOpen(prev => !prev);
    };

    const handleDeleteOption = async () => {
        try {
            await fetch(`http://localhost:3000/api/chats/${chatId}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userData }),
            });

            // Invalidate the user chats query to update the chat list
            queryClient.invalidateQueries(["userChats"]);

            // Redirect to the dashboard
            navigate('/dashboard');
        } catch (error) {
            console.error("Error deleting chat:", error);
        } finally {
            setDropdownOpen(false);
        }
    };

    const handleUpdateText = (content) => {
        setChatText(content);
    };

    useEffect(() => {
        if (data?.history?.length === 1) {
            add(data.history[0].parts[0].text, true);
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const chatContainer = chatContainerRef.current;

        if (chatContainer) {
            chatContainer.addEventListener('scroll', handleScroll);
        } else {
            console.error("Chat container is not defined");
        }

        return () => {
            if (chatContainer) {
                chatContainer.removeEventListener('scroll', handleScroll);
            }
        };
    }, [chatContainerRef]);

    const isLoading = mutationChatId.isLoading;

    return (
        <div className="flex flex-col h-[calc(100vh-90px)] lg:w-full lg:h-screen lg:bg-default_black lg:p-5">
            <div className="h-full flex flex-col bg-white dark:bg-medium_gray lg:rounded-xl lg-normal:items-center lg:w-full lg:p-4">
                <div className="h-full flex flex-col max-w-auto lg-normal:w-[900px] px-5 py-5 sm:py-1">
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-center relative z-10">
                            {data?.history[0]?.parts[0].text.length <= 90
                                ? (
                                    <h2 className="text-[18px] font-semibold text-black dark:text-white">
                                        {data?.history[0]?.parts[0].text.substring(0, 90)}
                                    </h2>
                                ) : (
                                    <h2 className="text-[18px] font-semibold text-black dark:text-white">
                                        {data?.history[0]?.parts[0].text.substring(0, 90)}...
                                    </h2>
                                )}
                            <img
                                id="deleteOptions"
                                src="/chat_icons/ellipse.svg"
                                alt="options"
                                onClick={handleToggleDropdown}
                                className="cursor-pointer"
                            />
                            {isDropdownOpen && (
                                <div ref={dropdownRef} className="absolute right-0 top-3 bg-default_white dark:bg-medium_gray shadow-md rounded mt-2 z-10">
                                    <ul className="flex flex-col p-2">
                                        <li
                                            onClick={handleDeleteOption}
                                            className="flex gap-2 p-2 text-primary_red border-primary_red/40 border-2 rounded-lg hover:bg-light_gray_background dark:hover:bg-lighter_medium_gray cursor-pointer"
                                        >
                                            Delete Chat
                                            <Trash />
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>

                        <div className="w-full h-[1px] bg-light_gray_border dark:bg-lighter_medium_gray" />
                    </div>

                    <div className="flex flex-col flex-1 overflow-hidden gap-10">
                        <div ref={chatContainerRef} className="wrapper_chat flex flex-col overflow-y-auto flex-1 p-2 sm:p-5">
                            <div className="chat flex flex-col gap-10">
                                {isPending
                                    ? "Loading..."
                                    : error
                                        ? "Something went wrong!"
                                        : data?.history?.map((message, index) => (
                                            <div key={index} className="flex items-start gap-3">
                                                {message.role !== "user" && (
                                                    <div className="avatar w-10 h-10 rounded-full border-light_gray_border dark:border-light_gray_text border-2 p-1 flex items-center justify-center text-white">
                                                        <img src="/chat_icons/logo.svg" alt="AI avatar" />
                                                    </div>
                                                )}
                                                <div className={`message ${message.role === "user" ? "user dark:bg-lighter_medium_gray" : ""} flex flex-col dark:text-default_white`}>
                                                    {message.img && (
                                                        <IKImage
                                                            urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
                                                            path={message.img.startsWith('/') ? message.img.slice(1) : message.img} // Remove leading slash if necessary
                                                            height="300"
                                                            width="400"
                                                            transformation={[{ height: 300, width: 400 }]}
                                                            loading="lazy"
                                                            lqip={{ active: true, quality: 20 }}
                                                        />
                                                    )}
                                                    <Markdown>
                                                        {message.parts[0].text}
                                                    </Markdown>
                                                </div>
                                                {message.role === "user" && (
                                                    <div className="avatar w-10 h-10 rounded-full bg-primary_blue flex items-center justify-center text-white">
                                                        {userData?.first_name.slice(0, 1).toUpperCase()}{userData?.last_name.slice(0, 1).toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                <NewPrompt question={question} answer={answer} />
                                {img.isLoading && (
                                    <div className="ml-auto">
                                        <Spinner />
                                    </div>
                                )}
                                {img.dbData?.filePath && (
                                    <IKImage
                                        urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
                                        path={img.dbData?.filePath}
                                        width="380"
                                        transformation={[{ width: 380 }]}
                                        className="ml-auto"
                                    />
                                )}
                                <div ref={endRef} />
                            </div>
                        </div>

                        <form ref={formRef} onSubmit={handleSubmit} className="relative flex w-full rounded-xl px-2 py-2 bg-light_gray_border dark:bg-lighter_medium_gray justify-between items-center gap-1 sm:gap-5">
                            {showScrollToBottom && (
                                <div className="absolute right-[50%] bottom-24 z-10">
                                    <button onClick={scrollToBottom} className="bg-light_gray_border dark:bg-lighter_medium_gray border-light_gray_background dark:border-light_gray_text border-[1px] rounded-full p-2">
                                        <ArrowUp className="w-6 h-6 rotate-180 dark:text-default_white" />
                                    </button>
                                </div>
                            )}

                            <Upload setImg={setImg} />
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
                                disabled={isLoading}
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
}

export default Chat;