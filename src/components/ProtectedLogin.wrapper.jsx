import React, { useEffect } from "react";
import Login from "../pages/Login";


function ProtectedLogin({ onLogin }) {
  const app1Url = import.meta.env.VITE_APP1_URL;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const storedToken = localStorage.getItem("token");

    if (!token && !storedToken) {
      window.location.href = `${app1Url}?unauthorized=true`;
    }

    if (token) {
      localStorage.setItem("token", token);
      window.history.replaceState({}, document.title, "/");
    }
  }, [app1Url]);

  return <Login onLogin={onLogin} />;
}

export default ProtectedLogin;
