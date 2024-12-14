import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import profileImg from "../assets/profile.png";

const Navbar = () => {
  const { isAuthenticated, logout, isLoading, user } = useAuth();

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
                <li className="relative">
                  <div className="dropdown dropdown-end p-0">
                    <label
                      tabIndex={0}
                      className="btn btn-ghost btn-circle avatar"
                    >
                      <div className="w-10 rounded-full border">
                        <img
                          src={user?.image || profileImg}
                          alt="User Profile"
                        />
                      </div>
                    </label>
                    <ul
                      tabIndex={0}
                      className="dropdown-content menu p-2 shadow bg-white text-gray-800 rounded-lg w-52 top-12"
                    >
                      <li>
                        <Link to="/profile" className="hover:bg-gray-200">
                          Profile
                        </Link>
                      </li>
                      <li>
                        <button onClick={logout} className="hover:bg-gray-200">
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                </li>
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
