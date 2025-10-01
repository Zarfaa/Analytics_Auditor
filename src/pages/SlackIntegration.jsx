import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { auth } from "../firebase";
import IntegrationCard from "../components/IntegrationCard";

function SlackIntegration() {
  const [connectionLog, setConnectionLog] = useState(null);
  const [loadingAction, setLoadingAction] = useState(null);
  const location = useLocation();


  const success = new URLSearchParams(location.search).get("success");

  const isConnected = connectionLog?.slack || false;


  const handleSlackConnect = async () => {
    setLoadingAction("connect");
    try {
      const user = auth.currentUser;
      if (!user) return;
      const token = await user.getIdToken();

      const res = await fetch(
        "https://marketing-automation-43871816946.us-west1.run.app/api/oauth/state-token",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();

      if (data.stateToken) {
        window.location.href = `https://marketing-automation-43871816946.us-west1.run.app/slack/oauth?state=${data.stateToken}`;
      }
    } catch (err) {
      console.error("Slack connect failed:", err);
      setLoadingAction(null);
    }
  };

  const handleSlackDisconnect = async () => {
    setLoadingAction("disconnect");
    try {
      const user = auth.currentUser;
      if (!user) return;
      const token = await user.getIdToken();

      await fetch(
        "https://marketing-automation-43871816946.us-west1.run.app/api/connections/slack",
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setConnectionLog((prev) => ({
        ...prev,
        slack: null,
      }));
    } catch (err) {
      console.error("Failed to disconnect Slack", err);
    } finally {
      setLoadingAction(null);
    }
  };


  useEffect(() => {
    const fetchConnectionLog = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const token = await user.getIdToken();
          const res = await fetch(
            "https://marketing-automation-43871816946.us-west1.run.app/api/connections",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const data = await res.json();
          setConnectionLog(data);
        } else {
          setConnectionLog({ error: "User not authenticated." });
        }
      } catch (err) {
        setConnectionLog({ error: "Failed to fetch connection log." });
      }
    };
    fetchConnectionLog();
  }, [success]);

  return (
    <IntegrationCard
      title="Slack Integration"
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
  );
}

export default SlackIntegration;
