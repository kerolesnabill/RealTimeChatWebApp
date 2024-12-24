import React, { useEffect, useState } from "react";
import apiClient from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import { IChat, useChat } from "../contexts/ChatContext";
import Chat from "./Chat";
import NewChat from "./NewChat";

interface InboxProps {
  setSelectedChat: (chat: IChat) => void;
}

const Inbox: React.FC<InboxProps> = ({ setSelectedChat }) => {
  const [isLoadingNewChat, setIsLoadingNewChat] = useState(false);
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

  const handleStartChat = async (username: string) => {
    setIsLoadingNewChat(true);
    setError("");

    apiClient
      .get(`/users/${username}`)
      .then(({ data }: any) => {
        const chat = chats.find((c) => c.userId == data.id);
        if (chat) {
          setSelectedChat(chat);
          return;
        }

        const newChat: IChat = {
          userId: data.id,
          name: data.name,
          username: data.username,
          image: data.image,
          lastMessage: "",
          lastMessageTime: "",
          unreadMessagesCount: 0,
        };
        setChats([newChat, ...chats]);
      })
      .catch(({ response }) => {
        setError(response.data.error || "An error occurred.");
      })
      .finally(() => setIsLoadingNewChat(false));
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2 text-center lg:text-left">Inbox</h2>
      {isLoading ? (
        <div className="flex justify-center mt-10">
          <span className="loading loading-bars loading-md"></span>
        </div>
      ) : (
        <>
          <NewChat onStartChat={handleStartChat} isLoading={isLoadingNewChat} />

          <div className="flex justify-center lg:justify-start text-sm">
            {error && <p className="text-red-600 mb-2">{error}</p>}
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
