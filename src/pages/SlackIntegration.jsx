import { useState, useEffect } from "react";
import IntegrationCard from "../components/IntegrationCard";
import Spinner from "../components/Spinner";
import toast from "react-hot-toast";
import {
  fetchConnectionLog,
  connectIntegration,
  disconnectIntegration,
} from "../service/integrationService";

function SlackIntegration() {
  const [loading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(null);
  const [connectionLog, setConnectionLog] = useState(null);

  const isConnected = !!connectionLog?.slack?.accessToken;

  const handleSlackConnect = async () => {
    setLoadingAction("connect");
    try {
      await connectIntegration("slack", "slack-integration");
    } catch (err) {
      console.error("Slack connect failed:", err);
      toast.error("Error connecting Slack workspace.");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleSlackDisconnect = async () => {
    setLoadingAction("disconnect");
    try {
      await disconnectIntegration("slack");
      sessionStorage.removeItem("slackToastShown");
      await loadConnections();
      toast.success("Slack disconnected successfully!");
    } catch (err) {
      console.error("Slack disconnect failed:", err);
      toast.error("Error disconnecting Slack.");
    } finally {
      setLoadingAction(null);
    }
  };

  const loadConnections = async () => {
    try {
      const data = await fetchConnectionLog();
      setConnectionLog(data);

      if (data?.slack?.accessToken && !sessionStorage.getItem("slackToastShown")) {
        toast.success("Slack connected successfully!");
        sessionStorage.setItem("slackToastShown", "true");
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
          title="Slack"
          description="Connect your Slack workspace to enable collaboration."
          isConnected={isConnected}
          details={{
            teamName: connectionLog?.slack?.teamName,
            slackUserId: connectionLog?.slack?.slackUserId,
          }}
          onConnect={handleSlackConnect}
          onDisconnect={handleSlackDisconnect}
          loadingAction={loadingAction}
        />
      )}
    </div>
  );
}

export default SlackIntegration;
