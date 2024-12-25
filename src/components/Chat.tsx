import { IChat } from "../contexts/ChatContext";
import userImage from "../assets/profile.png";
const apiBaseUrl = import.meta.env.VITE_API_Base_URL;

interface ChatProps {
  chat: IChat;
  setSelectedChat: (chat: IChat) => void;
}

const Chat = ({ chat, setSelectedChat }: ChatProps) => {
  const formatDate = (date: Date): string => {
    const now = new Date();
    const today = now.toDateString();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    if (date.toDateString() === today) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }

    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    const startOfDate = new Date(date);
    startOfDate.setDate(date.getDate() - date.getDay());

    if (startOfWeek.toDateString() === startOfDate.toDateString())
      return date.toLocaleString("en-US", { weekday: "long" });

    return date.toLocaleDateString();
  };

  return (
    <li
      className="p-2 flex flex-row gap-2 justify-between bg-gray-100 rounded-lg shadow cursor-pointer hover:bg-gray-200 transition-all"
      onClick={() => {
        setSelectedChat(chat);
        chat.unreadMessagesCount = 0;
      }}
    >
      <div className="flex gap-2">
        <img
          className="w-12 h-12 rounded-full"
          src={chat.image ? `${apiBaseUrl}/${chat.image}` : userImage}
          alt={`${chat.name} image`}
        />

        <div>
          <p className="font-medium text-gray-800">{chat.name}</p>
          <p className="text-gray-500 max-w-32 truncate">{chat.lastMessage}</p>
        </div>
      </div>

      <div className="text-xs relative">
        <p className=" text-gray-500">
          {formatDate(new Date(chat.lastMessageTime))}
        </p>
        {chat.unreadMessagesCount > 0 && (
          <p className="bg-blue-400 rounded-full font-bold px-0.5 max-w-fit mt-2 absolute right-0">
            {chat.unreadMessagesCount}
          </p>
        )}
      </div>
    </li>
  );
};

export default Chat;
