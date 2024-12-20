import { useAuth } from "../contexts/AuthContext";
import { IMessage } from "../contexts/ChatContext";

const Message = ({ msg }: { msg: IMessage }) => {
  const { user } = useAuth();

  return (
    <div className={`flex ${msg.senderId == user?.id && "justify-end"}`}>
      <div
        className={`p-2 pr-1 pb-0 rounded-lg shadow max-w-xs break-words ${
          msg.senderId == user?.id ? "bg-blue-300" : "bg-blue-100"
        }`}
      >
        <p>{msg.content}</p>

        <div className="flex gap-2 mt-1 justify-end">
          {msg.senderId == user?.id && (
            <div className="dropdown dropdown-end">
              <label
                tabIndex={0}
                className="w-2 h-2 bottom-1.5 bg-gray-400 hover:bg-blue-400 btn-circle cursor-pointer avatar"
              ></label>
              <div
                tabIndex={0}
                className="dropdown-content menu p-2 shadow bg-white text-gray-800 rounded-lg w-60 bottom-5 -left-44 text-xs"
              >
                <p>
                  Delivered at:
                  {msg.deliveredAt ? (
                    <span>{new Date(msg.deliveredAt).toLocaleString()}</span>
                  ) : (
                    <span> Not yet</span>
                  )}
                </p>
                <p>
                  Read at:
                  {msg.readAt ? (
                    <span>{new Date(msg.readAt).toLocaleString()}</span>
                  ) : (
                    <span> Not yet</span>
                  )}
                </p>
              </div>
            </div>
          )}

          <p className="text-xs text-gray-700">
            {new Date(msg.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>

          {msg.senderId == user?.id && (
            <div className="relative ml-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                className={`w-3 absolute right-0.5 ${
                  msg.readAt ? "fill-blue-600" : "fill-gray-600"
                }`}
              >
                <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
              </svg>
              {msg.deliveredAt && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  className={`w-3 absolute right-1.5 ${
                    msg.readAt ? "fill-blue-600" : "fill-gray-600"
                  }`}
                >
                  <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
                </svg>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;
