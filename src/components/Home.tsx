import { useEffect, useState } from "react";
import { IChat, IMessage, useChat } from "../contexts/ChatContext";
import ChatWindow from "../components/ChatWindow";
import Inbox from "./Inbox";
import { useAuth } from "../contexts/AuthContext";

const Home = () => {
  const [selectedChat, setSelectedChat] = useState<IChat | null>(null);
  const { connection, chatMessages, setChatMessages } = useChat();
  const { user } = useAuth();

  useEffect(() => {
    connection.on("Message", function (message) {
      const m = JSON.parse(message);
      const msg: IMessage = {
        id: m.Id,
        senderId: m.SenderId,
        recipientId: m.RecipientId,
        content: m.Content,
        createdAt: m.CreatedAt,
        deliveredAt: m.DeliveredAt,
        readAt: m.ReadAt,
      };

      const chatId = msg.senderId == user?.id ? msg.recipientId : msg.senderId;

      if (chatMessages[chatId]) {
        const chatMsgs = chatMessages[chatId];
        chatMsgs.push(m);
        setChatMessages({ ...chatMessages, [chatId]: chatMsgs });
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
      <div className="w-1/3 bg-white text-gray-800 shadow-lg">
        <Inbox setSelectedChat={setSelectedChat} />
      </div>
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
