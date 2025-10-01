import { useEffect, useState } from "react";
import { auth } from "../firebase";
import IntegrationCard from "../components/IntegrationCard";

function GoogleIntegration() {
  const [loading, setLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState<null | "connect" | "disconnect">(null);
  const [connectionLog, setConnectionLog] = useState<any>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  const isConnected = !!connectionLog?.google?.access_token;

  const handleGoogleConnect = async () => {
    setLoading(true);
    setLoadingAction("connect");
    try {
      const user = auth.currentUser;
      if (!user) return;
      const token = await user.getIdToken();
      const res = await fetch(
        "https://marketing-automation-43871816946.us-west1.run.app/api/oauth/state-token",
        { method: "POST", headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (data.stateToken) {
        window.location.href = `https://marketing-automation-43871816946.us-west1.run.app/auth/google?state=${data.stateToken}`;
      }
    } finally {
      setLoading(false);
      setLoadingAction(null);
    }
  };

  const handleGoogleDisconnect = async () => {
    setLoading(true);
    setLoadingAction("disconnect");
    try {
      const user = auth.currentUser;
      if (!user) return;
      const token = await user.getIdToken();
      const res = await fetch(
        "https://marketing-automation-43871816946.us-west1.run.app/api/connections/google",
        { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Failed to disconnect Google");
      setConnectionLog((prev) => ({ ...prev, google: null }));
    } finally {
      setLoading(false);
      setLoadingAction(null);
    }
  };

  // fetch connection log
  const fetchConnectionLog = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return setConnectionLog({ error: "User not authenticated." });
      const token = await user.getIdToken();
      const res = await fetch(
        "https://marketing-automation-43871816946.us-west1.run.app/api/connections",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setConnectionLog(data);
    } catch {
      setConnectionLog({ error: "Failed to fetch connection log." });
    }
  };

  useEffect(() => {
    // ✅ Handle query params
    const params = new URLSearchParams(window.location.search);
    const success = params.get("success");
    const msg = params.get("message");

    if (success === "true") {
      setMessage(msg || "Google account connected successfully!");
      setIsError(false);
    } else if (success === "false") {
      setMessage(msg || "Failed to connect Google account.");
      setIsError(true);
    }

    // Clean up URL (remove query params)
    if (success) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    fetchConnectionLog();
  }, []);

  return (
    <>
      {message && (
        <div
          className={`p-2 mb-4 rounded ${
            isError ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
          }`}
        >
          {message}
        </div>
      )}

      <IntegrationCard
        title="Google Integration"
        description="Connect your Google account to sync and automate."
        isConnected={isConnected}
        details={{ email: connectionLog?.google?.email || "" }}
        onConnect={handleGoogleConnect}
        onDisconnect={handleGoogleDisconnect}
        loadingAction={loadingAction}
      />
    </>
  );
}

export default GoogleIntegration;
