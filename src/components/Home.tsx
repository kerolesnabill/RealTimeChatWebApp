import { useEffect, useRef, useState } from "react";
import { IChat, IMessage, useChat } from "../contexts/ChatContext";
import ChatWindow from "../components/ChatWindow";
import Inbox from "./Inbox";

const Home = () => {
  const [selectedChat, setSelectedChat] = useState<IChat | null>(null);
  const [showInbox, setShowInbox] = useState(true);
  const { connection, chatMessages, setChatMessages, chats, setChats } =
    useChat();

  const chatsRef = useRef(chats);

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

      const chatCopy = [...chatsRef.current];
      const index = chatCopy.findIndex((c) => c.userId == msg.senderId);
      chatCopy[index].lastMessage = msg.content;
      chatCopy[index].lastMessageTime = msg.createdAt;
      chatCopy[index].unreadMessagesCount++;
      setChats(chatCopy);
    });

    connection.on("SendMessage", function (message) {
      const m = JSON.parse(message);
      const msg = convertMsgJsonToMsgObj(m);
      const messages = chatMessages[msg.recipientId];
      messages.push(msg);
      setChatMessages({ ...chatMessages, [msg.senderId]: messages });

      const chatCopy = [...chatsRef.current];
      const index = chatCopy.findIndex((c) => c.userId == msg.recipientId);
      chatCopy[index].lastMessage = msg.content;
      chatCopy[index].lastMessageTime = msg.createdAt;
      setChats(chatCopy);
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

  useEffect(() => {
    selectedChat && setShowInbox(false);
  }, [selectedChat]);

  useEffect(() => {
    chatsRef.current = chats;
  }, [chats]);

  return (
    <div
      className={`min-h-[90vh] flex flex-col md:flex-row bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-inner shadow-current`}
    >
      {selectedChat && (
        <button
          onClick={() => setShowInbox(!showInbox)}
          className="md:hidden bg-white text-gray-800 px-4 py-2 m-2 rounded-md shadow hover:bg-gray-200"
        >
          {showInbox ? "Close Inbox" : "Open Inbox"}
        </button>
      )}

      <div
        className={`md:w-1/3 w-full bg-white text-gray-800 shadow-lg transform md:translate-x-0 ${
          showInbox ? "translate-x-0" : "-translate-x-[150%] max-md:h-0"
        } transition-transform duration-300 lg:block`}
      >
        <Inbox setSelectedChat={setSelectedChat} />
      </div>

      <div className="flex-1 w-full">
        {selectedChat ? (
          <ChatWindow chat={selectedChat} />
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-lg font-semibold text-center">
              Select a conversation to start chatting.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
