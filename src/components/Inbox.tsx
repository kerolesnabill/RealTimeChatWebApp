import React, { useEffect, useState } from "react";
import apiClient from "../api/axios";
import userImage from "../assets/profile.png";
import { useAuth } from "../contexts/AuthContext";
import { IChat, useChat } from "../contexts/ChatContext";
const apiBaseUrl = import.meta.env.VITE_API_Base_URL;

interface InboxProps {
  setSelectedChat: (chat: IChat) => void;
}

const Inbox: React.FC<InboxProps> = ({ setSelectedChat }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>();

  const { chats, setChats } = useChat();
  const { token } = useAuth();

  useEffect(() => {
    setError(null);
    if (token)
      apiClient

        .get("/chats", { headers: { Authorization: `Bearer ${token}` } })
        .then(({ data }) => {
          setChats(data);
          console.log(data);
        })
        .catch((error) =>
          setError(error?.response?.data || "Error while getting chats")
        )
        .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Inbox</h2>
      {isLoading ? (
        <div className="flex justify-center mt-10">
          <span className="loading loading-bars loading-md"></span>
        </div>
      ) : (
        <>
          <div className="flex justify-center">
            {error && <p className="text-red-600 mt-10">{error}</p>}
            {!error && chats.length == 0 && (
              <p className="mt-10">There are no chats</p>
            )}
          </div>
          <ul className="space-y-3">
            {chats.map((chat) => (
              <li
                key={chat.userId}
                className="p-1 bg-gray-100 rounded-lg shadow cursor-pointer hover:bg-gray-200 transition-all"
                onClick={() => setSelectedChat(chat)}
              >
                <div className="flex">
                  <img
                    className="w-12 h-12 rounded-full"
                    src={chat.image ? `${apiBaseUrl}/${chat.image}` : userImage}
                    alt={`${chat.name} image`}
                  />
                  <div className="ml-2 w-full">
                    <div className="flex justify-between">
                      <p className="font-medium text-gray-800">{chat.name}</p>
                      <p className="text-xs text-gray-500 truncate max-w-36">
                        {new Date(chat.lastMessageTime).toLocaleString()}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      {chat.lastMessage}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default Inbox;
