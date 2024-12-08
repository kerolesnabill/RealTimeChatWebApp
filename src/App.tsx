import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./auth/AuthContext.tsx";
import { useEffect } from "react";

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
        <h1>Home</h1>
      )}
    </>
  );
}

export default App;
