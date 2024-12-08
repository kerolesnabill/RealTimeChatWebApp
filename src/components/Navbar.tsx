import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const Navbar = () => {
  const { isAuthenticated, logout, isLoading } = useAuth();

  return (
    <nav className="navbar bg-transparent text-white container m-auto">
      <div className="flex-1">
        <Link to="/" className="text-2xl font-bold">
          ChatWorld
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          {!isLoading && (
            <>
              {isAuthenticated ? (
                <>
                  <li>
                    <button
                      onClick={logout}
                      className="btn btn-outline btn-warning hover:scale-105 transition-all"
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      to="/login"
                      className="hover:scale-105 transition-all"
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/signup"
                      className="hover:scale-105 transition-all"
                    >
                      Signup
                    </Link>
                  </li>
                </>
              )}
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
