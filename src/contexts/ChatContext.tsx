import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
const apiBaseUrl = import.meta.env.VITE_API_Base_URL as string;

interface ChatContextProps {
  chats: IChat[];
  setChats: (chats: IChat[]) => void;
  chatMessages: IChatMessages;
  setChatMessages: (messages: IChatMessages) => void;
  connection: HubConnection;
}

export interface IChat {
  userId: string;
  name: string;
  username: string;
  image: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadMessagesCount: number;
}

export interface IMessage {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  createdAt: string;
  deliveredAt: string;
  readAt: string;
}

interface IChatMessages {
  [chatId: string]: IMessage[];
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { token } = useAuth();
  const hubConnection = new HubConnectionBuilder()
    .withUrl(`${apiBaseUrl}/ChatHub`, {
      accessTokenFactory: () => token ?? "",
    })
    .withAutomaticReconnect()
    .build();

  const [chats, setChats] = useState<IChat[]>([]);
  const [chatMessages, setChatMessages] = useState<IChatMessages>({});
  const [connection, setConnection] = useState<HubConnection>(hubConnection);

  useEffect(() => setConnection(connection), [token]);

  return (
    <ChatContext.Provider
      value={{ chats, setChats, chatMessages, setChatMessages, connection }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within an ChatProvider");
  }
  return context;
};
