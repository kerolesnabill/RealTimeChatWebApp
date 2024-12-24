import { useState } from "react";

interface NewChatProps {
  onStartChat: (username: string) => void;
  isLoading: boolean;
}

export default function NewChat({ onStartChat, isLoading }: NewChatProps) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError("Username is required.");
      return;
    }
    setError("");
    onStartChat(username);
  };

  return (
    <div className="mb-4">
      <form
        onSubmit={handleSubmit}
        className="flex justify-between items-center gap-2"
      >
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
          className="input input-bordered w-full text-black"
        />
        <button
          type="submit"
          className={`btn btn-primary text-xs p-2 ${
            isLoading ? "loading" : ""
          }`}
          disabled={isLoading}
        >
          Start Chat
        </button>
      </form>
      {error && (
        <p className="text-red-600 text-sm mt-1 text-center">{error}</p>
      )}
    </div>
  );
}
