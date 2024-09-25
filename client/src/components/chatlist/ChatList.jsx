import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Spinner from '../spinner/Spinner';

const ChatList = () => {
    const { userData } = useAuth(); // Get userData from the Auth context
    const path = useLocation().pathname;
    const determinePath = path.split("/").pop();

    const { isPending, error, data } = useQuery({
        queryKey: ["userChats"],
        queryFn: () => {
            if (!userData) return Promise.resolve([]); // Handle case when userData is not available

            return fetch(`${import.meta.env.VITE_API_URL}/api/userchats`, {
                method: 'POST', // Change to POST
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userData }), // Send userData in the request body
            }).then((res) => {
                if (!res.ok) throw new Error('Network response was not ok');
                return res.json(); // Parse JSON response
            });
        },
        enabled: !!userData // Only run the query if userData is available
    });

    return (
        <div className="chatList h-full">
            <div className="list flex flex-col gap-2 overflow-y-auto">
                {isPending
                    ? <Spinner />
                    : error
                        ? "Something went wrong!"
                        : data.map(chat => (
                            <Link to={`/dashboard/chats/${chat._id}`} key={chat._id} className={`p-2 rounded-md block truncate transition-colors duration-200 ease-in-out ${determinePath === chat._id ? "bg-light_gray_text/40" : "hover:bg-light_gray_text/40"}`}>
                                {chat.title}
                            </Link>
                        ))}
            </div>
        </div>
    );
}

export default ChatList;