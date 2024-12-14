import { useEffect, useState } from "react";
import { IChat, IMessage, useChat } from "../contexts/ChatContext";
import ChatWindow from "../components/ChatWindow";
import Inbox from "./Inbox";

const Home = () => {
  const [selectedChat, setSelectedChat] = useState<IChat | null>(null);
  const { connection, messages, setMessages } = useChat();

  useEffect(() => {
    connection.on("Message", function (message) {
      const msg = JSON.parse(message);
      const m: IMessage = {
        id: msg.Id,
        chatId: msg.ChatId,
        senderId: msg.SenderId,
        content: msg.Content,
        createdAt: msg.CreatedAt,
        isDeleted: msg.IsDeleted,
      };

      if (messages[msg.ChatId]) {
        const chatMsgs = messages[msg.ChatId];
        chatMsgs.push(m);
        setMessages({ ...messages, [msg.ChatId]: chatMsgs });
      }
    });
    connection.on("Error", function (error) {
      console.log("Error Message: " + error);
    });
    connection.start().catch(function (err) {
      return console.error(err.toString());
    });
  }, []);

  return (
    <div
      className={`min-h-[90vh] flex bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-inner shadow-current`}
    >
      {/* Inbox List */}
      <div className="w-1/3 bg-white text-gray-800 shadow-lg">
        <Inbox setSelectedChat={setSelectedChat} />
      </div>
      {/* Chat Window */}
      <div className="flex-1">
        {selectedChat ? (
          <ChatWindow chat={selectedChat} />
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-lg font-semibold">
              Select a conversation to start chatting.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
