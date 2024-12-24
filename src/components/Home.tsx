import { useEffect, useState } from "react";
import { IChat, IMessage, useChat } from "../contexts/ChatContext";
import ChatWindow from "../components/ChatWindow";
import Inbox from "./Inbox";

const Home = () => {
  const [selectedChat, setSelectedChat] = useState<IChat | null>(null);
  const { connection, chatMessages, setChatMessages } = useChat();

  useEffect(() => {
    connection.on("ReceiveMessage", function (message) {
      const m = JSON.parse(message);
      const msg = convertMsgJsonToMsgObj(m);

      const messages = chatMessages[msg.senderId];
      if (messages) {
        messages.push(msg);
        setChatMessages({ ...chatMessages, [msg.senderId]: messages });
      }

      connection
        .invoke("DeliveredMessage", msg.id)
        .catch((error) => console.log(error));
    });

    connection.on("SendMessage", function (message) {
      const m = JSON.parse(message);
      const msg = convertMsgJsonToMsgObj(m);
      const messages = chatMessages[msg.recipientId];
      messages.push(msg);
      setChatMessages({ ...chatMessages, [msg.senderId]: messages });
    });

    connection.on("MessageStatus", function (messageArray) {
      const msgs = JSON.parse(messageArray);
      msgs.forEach((m: any) => {
        const msg = convertMsgJsonToMsgObj(m);
        const messages = chatMessages[msg.recipientId];
        if (messages) {
          const index = messages.findIndex((m) => m.id == msg.id);
          messages[index] = msg;
          setChatMessages({ ...chatMessages, [msg.senderId]: messages });
        }
      });
    });

    connection.on("Error", function (error) {
      console.log("Error Message: " + error);
    });

    connection.start().catch(function (err) {
      return console.error(err.toString());
    });
  }, []);

  function convertMsgJsonToMsgObj(message: any): IMessage {
    return {
      id: message.Id,
      senderId: message.SenderId,
      recipientId: message.RecipientId,
      content: message.Content,
      createdAt: message.CreatedAt,
      deliveredAt: message.DeliveredAt,
      readAt: message.ReadAt,
    };
  }

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
