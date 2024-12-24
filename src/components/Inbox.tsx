import React, { useEffect, useState } from "react";
import apiClient from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import { IChat, useChat } from "../contexts/ChatContext";
import Chat from "./Chat";

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
      <h2 className="text-xl font-bold mb-2 text-center lg:text-left">Inbox</h2>
      {isLoading ? (
        <div className="flex justify-center mt-10">
          <span className="loading loading-bars loading-md"></span>
        </div>
      ) : (
        <>
          <div className="flex justify-center lg:justify-start">
            {error && <p className="text-red-600 mt-10">{error}</p>}
            {!error && chats.length == 0 && (
              <p className="mt-10 text-center">There are no chats</p>
            )}
          </div>
          <ul className="space-y-3">
            {chats.map((chat) => (
              <Chat
                chat={chat}
                setSelectedChat={setSelectedChat}
                key={chat.userId}
              />
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default Inbox;
