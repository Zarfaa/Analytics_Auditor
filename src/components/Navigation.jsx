import { Link } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import logo from "../assets/Analytics_Audtor_logo.png";
import { useLocation } from "react-router-dom";

const Navigation = ({ onLogout }) => {
  const app1Url = import.meta.env.VITE_APP1_URL;

  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("token"),
    onLogout();
    window.location.href = app1Url;
  };


  return (
    <nav className="h-screen w-64 bg-primary-ultra-dark text-white fixed top-0 left-0 flex flex-col p-6 space-y-6">

      <div className="flex items-center justify-center bg-white rounded-lg h-12 w-full">
        <img src={logo} alt="Logo" className="h-10 object-contain" />
      </div>

      <ul className="space-y-3 flex-1">
        <li>
          <Link
            to="/"
            className="block px-3 py-2 rounded hover:bg-gray-700 transition"
          >
            Home
          </Link>
        </li>
        <li>
          <Link to="/slack-integration" className={`block px-3 py-2 rounded transition ${isActive('/slack-integration') ? 'bg-gray-700 ' : 'hover:bg-gray-700'}`}> Slack Integerations</Link>
        </li>
        <li>
          <Link
            to="/google-integration"
            className={`block px-3 py-2 rounded transition ${isActive('/google-integration') ? 'bg-gray-700 ' : 'hover:bg-gray-700'}`}>
            Google Integration
          </Link>
        </li>
        <li>
          <Link
            to="/ghl-integration"
            className={`block px-3 py-2 rounded transition ${isActive('/ghl-integration') ? 'bg-gray-700 ' : 'hover:bg-gray-700'}`}>
            GHL Integration
          </Link>
        </li>
      </ul>

      <div className="bg-neutral-ultraLight p-4 rounded-lg">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-primary hover:scale-105 text-white px-6 py-2 rounded-lg shadow-md transition"
        >
          <FaSignOutAlt className="text-lg" />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
