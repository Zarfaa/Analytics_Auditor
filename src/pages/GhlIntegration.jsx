import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import IntegrationCard from "../components/IntegrationCard";

function GhlIntegration() {
  const [connectionLog, setConnectionLog] = useState(null);
  const [loadingAction, setLoadingAction] = useState(null); 

  const fetchConnectionLog = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
        const res = await fetch(
          "https://marketing-automation-43871816946.us-west1.run.app/api/connections",
          { headers: { Authorization: `Bearer ${token}` } }
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

  useEffect(() => {
    fetchConnectionLog();
  }, []);

  const handleGhlConnect = async () => {
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
        window.location.href = `https://marketing-automation-43871816946.us-west1.run.app/ghl/oauth/initiate?state=${data.stateToken}`;
      }
    } catch (err) {
      console.error("Failed to connect GHL", err);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleGhlDisconnect = async (locationId) => {
    setLoadingAction(`disconnect:${locationId}`);
    try {
      const user = auth.currentUser;
      if (!user) return;
      const token = await user.getIdToken();

      const res = await fetch(
        `https://marketing-automation-43871816946.us-west1.run.app/api/connections/ghl/${locationId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to disconnect GHL account");
      }

      await fetchConnectionLog();
    } catch (err) {
      console.error("Failed to disconnect GHL account", err);
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <IntegrationCard
      title="Go High Level Integration"
      description="Connect your GHL accounts to manage automation."
      multipleAccounts={connectionLog?.ghl || []}
      onConnect={handleGhlConnect}
      onDisconnect={handleGhlDisconnect}
      addAccountLabel="Add Another GHL Account"
      loadingAction={loadingAction} 
    />
  );
}

export default GhlIntegration;
