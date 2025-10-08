import { FaSignOutAlt } from "react-icons/fa";
import logo from "../assets/Analytics_Audtor_logo.png";

const HorizontalNavbar = ({ onLogout }) => {
    const app1Url = import.meta.env.VITE_APP1_URL;

    const handleLogout = () => {
        localStorage.removeItem("token");
        if (onLogout) onLogout(); // triggers App.jsx logout logic
        window.location.href = `${app1Url}?loggedOut=true`; // tell App1 to clear token too
    };

    return (
        <nav className="w-full bg-primary-ultra-dark text-white flex items-center justify-between px-6 py-8 fixed top-0 left-0 z-50">
            <div className="flex items-center justify-center bg-white rounded-lg h-10 w-30">
                <img
                    src={logo}
                    alt="Analytics Auditor Logo"
                    className="h-10 w-auto object-contain"
                />
            </div>
            <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-primary px-4 py-2 rounded-lg shadow-md hover:scale-105 transition"
            >
                <FaSignOutAlt className="text-lg" />
                <span>Logout</span>
            </button>
        </nav>
    );
};

export default HorizontalNavbar;
