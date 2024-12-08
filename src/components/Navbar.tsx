import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar bg-transparent text-white container m-auto">
      <div className="flex-1">
        <Link to="/" className="text-2xl font-bold">
          ChatWorld
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link to="/login" className="hover:scale-105 transition-all">
              Login
            </Link>
          </li>
          <li>
            <Link to="/signup" className="hover:scale-105 transition-all">
              Signup
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
