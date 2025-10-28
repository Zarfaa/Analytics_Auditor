import { useState, useEffect } from "react";
import IntegrationCard from "../components/IntegrationCard";
import Spinner from "../components/Spinner";
import toast from "react-hot-toast";
import {
  fetchConnectionLog,
  connectIntegration,
  disconnectIntegration,
} from "../service/integrationService";

function GoogleIntegration() {
  const [loading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(null);
  const [connectionLog, setConnectionLog] = useState(null);

  const isConnected = !!connectionLog?.google?.access_token;


  const handleGoogleConnect = async () => {
    setLoadingAction("connect");
    try {
      await connectIntegration("google", "google-integration");
    } catch (err) {
      console.error("Google connect failed:", err);
      toast.error("Error connecting Google account.");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleGoogleDisconnect = async () => {
    setLoadingAction("disconnect");
    try {
      await disconnectIntegration("google");
      sessionStorage.removeItem("googleToastShown");
      await loadConnections();
      toast.success("Google account disconnected successfully!");
    } catch (err) {
      console.error("Google disconnect failed:", err);
      toast.error("Error disconnecting Google account.");
    } finally {
      setLoadingAction(null);
    }
  };

  const loadConnections = async () => {
    try {
      const data = await fetchConnectionLog();
      setConnectionLog(data);

      if (data?.google?.access_token && !sessionStorage.getItem("googleToastShown")) {
        toast.success("Google account connected successfully!");
        sessionStorage.setItem("googleToastShown", "true");
      }
    } catch (err) {
      console.error("Failed to fetch connection log:", err);
      toast.error("Failed to fetch connection log.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConnections();
  }, []);

  return (
    <div className="p-6">
      {loading ? (
        <div className="flex justify-center items-center h-[60vh]">
          <Spinner size="w-16 h-16" />
        </div>
      ) : (
        <IntegrationCard
          title="Google"
          description="Connect your Google account to sync and automate."
          isConnected={isConnected}
          details={{ expiry: connectionLog?.google?.expiry_date || "" }}
          onConnect={handleGoogleConnect}
          onDisconnect={handleGoogleDisconnect}
          loadingAction={loadingAction}
        />
      )}
    </div>
  );
}

export default GoogleIntegration;
