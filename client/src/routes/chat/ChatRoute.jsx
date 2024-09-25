import { useEffect, useState } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Chat from './Chat';
import RequireAuth from '../../contexts/RequireAuth';

const fetchUserChats = async (userId) => {
    const response = await fetch(`http://localhost:3000/api/chats/${userId}`, {
        method: "GET"
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network response was not ok: ${errorText}`);
    }

    const data = await response.json();
    console.log("Fetched chats data structure:", data); // Log structure
    return data.chats || [];
};

const ChatRoute = () => {
    const { userData, loading, isAuthenticated } = useAuth();
    const [chats, setChats] = useState([]);
    const path = useLocation().pathname;
    const chatPathId = path.split("/").pop();

    useEffect(() => {
        const getChats = async () => {
            if (userData && isAuthenticated) {
                try {
                    const data = await fetchUserChats(userData._id);
                    setChats(data);
                    console.log("Fetched chats:", data); // Log fetched chats
                } catch (error) {
                    console.error("Error fetching chats:", error);
                }
            }
        };

        getChats();
    }, [userData, isAuthenticated]);

    if (loading) {
        return <div>Loading...</div>;
    }

    console.log("Chat path ID:", chatPathId); // Log chat path ID

    // Ensure chat exists after fetching
    const chatExists = chats.some(chat => chat._id.toString() === chatPathId.toString());
    if (!chatExists) {
        console.error("Chat does not exist:", chatPathId);
        return <Navigate to="/dashboard" />;
    }

    return (
        <RequireAuth>
            <Chat chatId={chatPathId} />
        </RequireAuth>
    );
};

export default ChatRoute;