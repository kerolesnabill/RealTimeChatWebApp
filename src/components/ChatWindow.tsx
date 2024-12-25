import React, { useEffect, useRef, useState } from "react";
import { IChat, IMessage, useChat } from "../contexts/ChatContext";
import userImage from "../assets/profile.png";
import apiClient from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import Message from "./Message";
const apiBaseUrl = import.meta.env.VITE_API_Base_URL;

interface ChatWindowProps {
  chat: IChat;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ chat }) => {
  const { token } = useAuth();
  const { chatMessages, setChatMessages, connection } = useChat();
  const [input, setInput] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>();

  useEffect(() => {
    if (chat && !chatMessages[chat.userId]) {
      setIsLoading(true);
      setError(null);

      apiClient
        .get(`messages/${chat.userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(({ data }: { data: IMessage[] }) => {
          chatMessages[chat.userId] = data;
          setChatMessages(chatMessages);
          readMessages();
        })
        .catch((error) =>
          setError(error?.response?.data || "Error while getting chats")
        )
        .finally(() => setIsLoading(false));
    }
  }, [chat]);

  const sendMessage = () => {
    connection
      .invoke("SendMessage", chat.userId, input)
      .then(() => setInput(""))
      .catch((err) => console.error(err.toString()));
  };

  const readMessages = () => {
    connection
      .invoke("ReadMessages", chat.userId)
      .catch((err) => console.error(err.toString()));
  };

  let prvMsgDate: Date | null = null;
  const renderMsg = (msg: IMessage) => {
    const msgDate = new Date(msg.createdAt);

    const dateElement = (
      <div className="flex justify-center mb-4">
        <p className="p-2 rounded-lg shadow bg-slate-100 text-xs">
          {msgDate.toLocaleDateString()}
        </p>
      </div>
    );

    if (prvMsgDate == null) {
      prvMsgDate = msgDate;
      return (
        <div key={msg.id}>
          {dateElement}
          <Message msg={msg} />
        </div>
      );
    } else if (prvMsgDate.toDateString() != msgDate.toDateString()) {
      prvMsgDate = msgDate;
      return (
        <div key={msg.id}>
          {dateElement}
          <Message msg={msg} />
        </div>
      );
    }

    prvMsgDate = msgDate;
    return <Message msg={msg} key={msg.id} />;
  };

  const messageContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [chatMessages[chat.userId], chatMessages[chat.userId]?.length]);

  return (
    <div className="p-4 h-full max-h-[90vh] flex flex-col">
      <div className="flex flex-row gap-3 items-center bg-white text-gray-800 p-2 rounded-t-lg">
        <img
          className="w-10 h-10 rounded-full"
          src={chat.image ? `${apiBaseUrl}/${chat.image}` : userImage}
          alt={`${chat.name} image`}
        />
        <div className="text-center lg:text-left">
          <h2 className="text-lg font-bold">{chat.name}</h2>
          <p className="text-xs">Online</p>
        </div>
      </div>
      <div
        ref={messageContainerRef}
        className="flex-1 overflow-auto bg-white text-gray-800 shadow-lg rounded-b-lg p-4"
      >
        <div className="space-y-3">
          {isLoading ? (
            <div className="flex justify-center mt-10">
              <span className="loading loading-bars loading-md"></span>
            </div>
          ) : (
            chatMessages[chat.userId]?.map((msg) => renderMsg(msg))
          )}
        </div>
        <div className="flex justify-center">
          {error && <p className="text-red-600 mt-10">{error}</p>}
          {!error && chatMessages[chat.userId]?.length == 0 && (
            <p className="mt-10">There are no messages</p>
          )}
        </div>
      </div>
      <div className="flex items-center mt-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="input input-bordered flex-1 mr-4 text-black"
        />
        <button
          onClick={sendMessage}
          className="btn btn-primary"
          disabled={!input.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
