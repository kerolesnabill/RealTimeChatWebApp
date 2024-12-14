import React, { useEffect, useState } from "react";
import { IChat, IMessage, useChat } from "../contexts/ChatContext";
import userImage from "../assets/profile.png";
import apiClient from "../api/axios";
const apiBaseUrl = import.meta.env.VITE_API_Base_URL;

interface ChatWindowProps {
  chat: IChat;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ chat }) => {
  const { messages, setMessages, connection } = useChat();
  const [input, setInput] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>();

  useEffect(() => {
    if (chat && !messages[chat.id]) {
      setIsLoading(true);
      setError(null);

      apiClient
        .get(`chats/${chat.id}/messages`)
        .then(({ data }: { data: IMessage[] }) => {
          messages[chat.id] = data;

          setMessages(messages);
        })
        .catch((error) =>
          setError(error?.response?.data || "Error while getting chats")
        )
        .finally(() => setIsLoading(false));
    }
  }, [chat]);

  const sendMessage = () => {
    connection
      .invoke("SendMessage", chat.id, input)
      .then(() => setInput(""))
      .catch((err) => console.error(err.toString()));
  };

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex-1 overflow-y-auto bg-white text-gray-800 shadow-lg rounded-lg p-4 pt-2">
        <div className="flex gap-3 mb-2">
          <img
            className="w-10 h-10 rounded-full my-auto"
            src={chat.image ? `${apiBaseUrl}/${chat.image}` : userImage}
            alt={`${chat.name} image`}
          />
          <div>
            <h2 className="text-lg font-bold">{chat.name}</h2>
            <p className="text-xs">Online</p>
          </div>
        </div>
        <div className="space-y-3">
          {isLoading ? (
            <div className="flex justify-center mt-10">
              <span className="loading loading-bars loading-md"></span>
            </div>
          ) : (
            messages[chat.id]?.map((msg) => (
              <div
                key={msg.id}
                className="p-3 bg-blue-100 rounded-lg shadow max-w-xs self-end"
              >
                {msg.content}
              </div>
            ))
          )}
          <div className="flex justify-center">
            {error && <p className="text-red-600 mt-10">{error}</p>}
            {!error && messages[chat.id]?.length == 0 && (
              <p className="mt-10">There are no messages</p>
            )}
          </div>
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
