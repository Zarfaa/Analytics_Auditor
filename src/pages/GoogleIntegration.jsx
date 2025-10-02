import { useEffect, useState } from "react";
import { auth } from "../firebase";
import IntegrationCard from "../components/IntegrationCard";
import toast from "react-hot-toast";

function GoogleIntegration() {
  const [loading, setLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState(null);
  const [connectionLog, setConnectionLog] = useState(null);
  const redirect_uri = import.meta.env.VITE_REDIRECTION_URL;
  const isConnected = !!connectionLog?.google?.access_token;

  const handleGoogleConnect = async () => {
    setLoading(true);
    setLoadingAction("connect");
    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error("User not authenticated.");
        return;
      }
      const token = await user.getIdToken();
      const res = await fetch(
        "https://marketing-automation-43871816946.us-west1.run.app/api/oauth/state-token",
        { method: "POST", headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Failed to start Google connection");
      const data = await res.json();
      if (data.stateToken) {
        window.location.href = `https://marketing-automation-43871816946.us-west1.run.app/auth/google?state=${data.stateToken}&redirect_uri=${redirect_uri}/google-integration`;
      } else {
        toast.error("Failed to get Google connection token.");
      }
    } catch (err) {
      toast.error("Error connecting Google account.");
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
      if (!user) {
        toast.error("User not authenticated.");
        return;
      }
      const token = await user.getIdToken();
      const res = await fetch(
        "https://marketing-automation-43871816946.us-west1.run.app/api/connections/google",
        { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Failed to disconnect Google");
      sessionStorage.removeItem("googleToastShown");
      setConnectionLog((prev) => ({ ...prev, google: null }));
      toast.success("Google account disconnected successfully!");
    } catch {
      toast.error("Error disconnecting Google account.");
    } finally {
      setLoading(false);
      setLoadingAction(null);
    }
  };

  const fetchConnectionLog = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        setConnectionLog({ error: "User not authenticated." });
        return;
      }

      const token = await user.getIdToken();
      const res = await fetch(
        "https://marketing-automation-43871816946.us-west1.run.app/api/connections",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.ok) throw new Error("Failed to fetch connection log");

      const data = await res.json();

      if (data.google.access_token && !connectionLog?.google) {
        if (!sessionStorage.getItem("googleToastShown")) {
          toast.success("Google account connected successfully!");
          sessionStorage.setItem("googleToastShown", "true");
        }
      }

      setConnectionLog(data);
    } catch {
      setConnectionLog({ error: "Failed to fetch connection log." });
    }
  };


  useEffect(() => {
    fetchConnectionLog();
  }, []);

  return (
    <>
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
