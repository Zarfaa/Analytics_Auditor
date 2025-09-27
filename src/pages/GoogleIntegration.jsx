import { useEffect, useState } from "react";
import { auth } from "../firebase";
import IntegrationCard from "../components/IntegrationCard";

function GoogleIntegration() {
  const [loading, setLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState(null);
  const [connectionLog, setConnectionLog] = useState(null);

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

  useEffect(() => {
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
    fetchConnectionLog();
  }, []);

  return (
    <IntegrationCard
      title="Google Integration"
      description="Connect your Google account to sync and automate."
      isConnected={isConnected}
      details={{ email: connectionLog?.google?.email || "" }}
      onConnect={handleGoogleConnect}
      onDisconnect={handleGoogleDisconnect}
      loadingAction={loadingAction}
    />
  );
}

export default GoogleIntegration;
