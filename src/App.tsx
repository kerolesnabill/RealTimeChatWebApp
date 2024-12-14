import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext.tsx";
import { useEffect } from "react";
import Home from "./components/Home.tsx";
import { ChatProvider } from "./contexts/ChatContext.tsx";

function App() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigator = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (
      !isLoading &&
      !isAuthenticated &&
      pathname !== "/login" &&
      pathname !== "/signup"
    )
      navigator("/login");
  }, [isLoading]);

  return (
    <>
      {isLoading ? (
        <div className="h-screen flex justify-center justify-items-center">
          <span className="loading loading-bars loading-lg"></span>
        </div>
      ) : (
        <ChatProvider>
          <Home />
        </ChatProvider>
      )}
    </>
  );
}

export default App;
