import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import IntegrationCard from "../components/IntegrationCard";
import toast from "react-hot-toast";

function SlackIntegration() {
  const [connectionLog, setConnectionLog] = useState(null);
  const [loadingAction, setLoadingAction] = useState(null);
  const redirect_uri = import.meta.env.VITE_REDIRECTION_URL;
  const isConnected = connectionLog?.slack || false;

  const handleSlackConnect = async () => {
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
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Failed to initiate Slack connection");

      const data = await res.json();
      if (data.stateToken) {
        window.location.href = `https://marketing-automation-43871816946.us-west1.run.app/slack/oauth?state=${data.stateToken}&redirect_uri=${redirect_uri}/slack-integration`;
      } else {
        toast.error("Failed to get Slack connection token.");
      }
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
      const user = auth.currentUser;
      if (!user) {
        toast.error("User not authenticated.");
        return;
      }
      const token = await user.getIdToken();

      const res = await fetch(
        "https://marketing-automation-43871816946.us-west1.run.app/api/connections/slack",
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Failed to disconnect Slack");
      sessionStorage.removeItem("slackToastShown");
      setConnectionLog((prev) => ({
        ...prev,
        slack: null,
      }));
      toast.success("Slack disconnected successfully!");
    } catch (err) {
      toast.error("Error disconnecting Slack.");
    } finally {
      setLoadingAction(null);
    }
  };

  useEffect(() => {
    const fetchConnectionLog = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setConnectionLog({ error: "User not authenticated." });
          toast.error("User not authenticated.");
          return;
        }

        const token = await user.getIdToken();
        const res = await fetch(
          "https://marketing-automation-43871816946.us-west1.run.app/api/connections",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!res.ok) throw new Error("Failed to fetch connection log");

        const data = await res.json();

        if (data.slack.accessToken && !connectionLog?.slack) {
          if (!sessionStorage.getItem("slackToastShown")) {
            toast.success("Slack connected successfully!");
            sessionStorage.setItem("slackToastShown", "true");
          }
        }

        setConnectionLog(data);
      } catch (err) {
        setConnectionLog({ error: "Failed to fetch connection log." });
      }
    };

    fetchConnectionLog();
  }, []);

  return (
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
  );
}

export default SlackIntegration;
