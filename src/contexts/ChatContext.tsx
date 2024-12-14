import { createContext, useContext, useState } from "react";

interface ChatContextProps {
  chats: IChat[];
  setChats: (chats: IChat[]) => void;
  messages: IChatMessages;
  setMessages: (messages: IChatMessages) => void;
}

export interface IChat {
  id: string;
  name: string;
  isGroupChat: boolean;
  image: string;
  lastMessage: string;
  lastMessageTime: string;
}

export interface IMessage {
  chatId: string;
  content: string;
  createdAt: Date;
  id: string;
  isDeleted: boolean | null;
  senderId: string;
}

interface IChatMessages {
  [chatId: string]: IMessage[];
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [chats, setChats] = useState<IChat[]>([]);
  const [messages, setMessages] = useState<IChatMessages>({});

  return (
    <ChatContext.Provider value={{ chats, setChats, messages, setMessages }}>
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
