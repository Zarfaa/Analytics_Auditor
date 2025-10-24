import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import Navigation from "./components/Navigation";
import SlackIntegration from "./pages/SlackIntegration";
import GoogleIntegration from "./pages/GoogleIntegration";
import GhlIntegration from "./pages/GhlIntegration";
import Home from "./pages/Home";
import { auth } from "./firebase";
import { signOut } from "firebase/auth";
import HorizontalNavbar from "./components/HorizontalNavbar";
import { Toaster } from "react-hot-toast"
import Spinner from "./components/Spinner";
import ProtectedLogin from "./components/ProtectedLogin.wrapper";
import BigQueryIntegration from "./pages/BigQuery";
import Workflows from "./pages/WorkFlow";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      window.history.replaceState({}, document.title, "/");
    }
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading)
    return (
      <Spinner />
    );

  const handleLogout = async () => {
    localStorage.removeItem("token");
    await signOut(auth);
    setUser(null);

    const app1Url = import.meta.env.VITE_APP1_URL;
    window.location.href = `${app1Url}?loggedOut=true`;
  };

  const handleEndOnboarding = async () => {
    await signOut(auth);
    setUser(null);
  };


  return (
    <Router>
      <div className="App flex">
        <Toaster position="top-right" reverseOrder={false} />
        {!user ? (
          <HorizontalNavbar onLogout={handleLogout} />
        ) : (
          <Navigation onLogout={handleLogout} />
        )}

        <div className={`flex-1 ${user ? "ml-64" : ""} p-6`}>
          <Routes>
            {!user ? (
              <Route
                path="/*"
                element={<ProtectedLogin onLogin={() => setUser(auth.currentUser)} />}
              />
            ) : (
              <>
                <Route
                  path="/"
                  element={
                    user ? (
                      <Home user={user} onLogout={handleEndOnboarding} />
                    ) : (
                      <Navigate to="/" replace />
                    )
                  }
                />
                <Route path="/slack-integration" element={<SlackIntegration />} />
                <Route path="/google-integration" element={<GoogleIntegration />} />
                <Route path="/ghl-integration" element={<GhlIntegration />} />
                <Route path="/gbq-integration" element={<BigQueryIntegration />} />
                <Route path="/workflows" element={<Workflows/>} />
                <Route path="*" element={<Navigate to="/" />} />
              </>
            )}
          </Routes>

        </div>
      </div>
    </Router>
  );
}

export default App;
