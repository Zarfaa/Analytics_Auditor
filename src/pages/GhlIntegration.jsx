import { useEffect, useState } from "react";
import { auth } from "../firebase";
import IntegrationCard from "../components/IntegrationCard";
import toast from "react-hot-toast";
import Spinner from "../components/Spinner"; 

function GhlIntegration() {
  const [connectionLog, setConnectionLog] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [loadingAction, setLoadingAction] = useState(null); 
  const redirect_uri = import.meta.env.VITE_REDIRECTION_URL;

  const fetchConnectionLog = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
        const res = await fetch(
          "https://marketing-automation-43871816946.us-west1.run.app/api/connections",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!res.ok) throw new Error("Failed to fetch connection log");

        const data = await res.json();

        if (data.ghl && Array.isArray(data.ghl)) {
          data.ghl.forEach((account) => {
            const key = `ghlToastShown:${account.location_id}`;
            if (account.access_token && !sessionStorage.getItem(key)) {
              toast.success(`GHL account connected successfully!`);
              sessionStorage.setItem(key, "true");
            }
          });
        }

        setConnectionLog(data);
      } else {
        setConnectionLog({ error: "User not authenticated." });
        toast.error("User not authenticated.");
      }
    } catch (err) {
      console.error(err);
      setConnectionLog({ error: "Failed to fetch connection log." });
      toast.error("Failed to fetch connection log.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnectionLog();
  }, []);

  const handleGhlConnect = async () => {
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

      if (!res.ok) throw new Error("Failed to start GHL connection");

      const data = await res.json();
      if (data.stateToken) {
        window.location.href = `https://marketing-automation-43871816946.us-west1.run.app/ghl/oauth/initiate?state=${data.stateToken}&redirect_uri=${redirect_uri}/ghl-integration`;
      } else {
        toast.error("Failed to get GHL connection token.");
      }
    } catch (err) {
      console.error("Failed to connect GHL", err);
      toast.error("Error connecting GHL account.");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleGhlDisconnect = async (location_id) => {
    setLoadingAction(`disconnect:${location_id}`);
    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error("User not authenticated.");
        return;
      }

      const token = await user.getIdToken();
      const res = await fetch(
        `https://marketing-automation-43871816946.us-west1.run.app/api/connections/ghl/${location_id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Failed to disconnect GHL account");

      sessionStorage.removeItem(`ghlToastShown:${location_id}`);
      await fetchConnectionLog();
      toast.success("GHL account disconnected successfully!");
    } catch (err) {
      console.error("Failed to disconnect GHL account", err);
      toast.error("Error disconnecting GHL account.");
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="p-6">
      {loading ? (
        <div className="flex justify-center items-center h-[60vh]">
          <Spinner />
        </div>
      ) : (
        <IntegrationCard
          title="Go High Level"
          description="Connect your GHL accounts to manage automation."
          multipleAccounts={connectionLog?.ghl || []}
          onConnect={handleGhlConnect}
          onDisconnect={handleGhlDisconnect}
          addAccountLabel="Add Another GHL Account"
          loadingAction={loadingAction}
        />
      )}
    </div>
  );
}

export default GhlIntegration;
