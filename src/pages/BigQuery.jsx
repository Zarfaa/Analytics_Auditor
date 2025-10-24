import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import { FaGoogle, FaPlus } from "react-icons/fa";
import Workflows from "./WorkFlow";

const ButtonSpinner = ({ isPrimary = true }) => (
  <div
    className={`w-4 h-4 border-2 rounded-full animate-spin 
      ${isPrimary ? "border-white/60 border-t-white" : "border-red-400 border-t-white"}`}
  ></div>
);

function BigQueryIntegration() {
  const [connectionLog, setConnectionLog] = useState(null);
  const [loadingAction, setLoadingAction] = useState(null);

  const redirect_uri = import.meta.env.VITE_REDIRECTION_URL;
  const isConnected = !!connectionLog?.google_bigquery?.access_token;

  const integrationName = "Google BigQuery";

  const handleConnect = async () => {
    setLoadingAction("connect");
    try {
      const user = auth.currentUser;
      if (!user) {
        alert("User not authenticated.");
        return;
      }
      const token = await user.getIdToken();
      const res = await fetch(
        "https://marketing-automation-43871816946.us-west1.run.app/api/oauth/state-token",
        { method: "POST", headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (data.stateToken) {
        window.location.href = `https://marketing-automation-43871816946.us-west1.run.app/auth/google-bigquery?state=${data.stateToken}&redirect_uri=${redirect_uri}/gbq-integration`;
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting BigQuery account.");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDisconnect = async () => {
    setLoadingAction("disconnect");
    try {
      const user = auth.currentUser;
      if (!user) return;

      const token = await user.getIdToken();
      const res = await fetch(
        "https://marketing-automation-43871816946.us-west1.run.app/api/connections/google_bigquery",
        { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Failed to disconnect");
      setConnectionLog((prev) => ({ ...prev, google_bigquery: null }));
      alert("Disconnected successfully!");
    } catch (err) {
      console.error(err);
      alert("Error disconnecting BigQuery account.");
    } finally {
      setLoadingAction(null);
    }
  };

  const fetchConnectionLog = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;
      const token = await user.getIdToken();
      const res = await fetch(
        "https://marketing-automation-43871816946.us-west1.run.app/api/connections",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setConnectionLog(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchConnectionLog();
  }, []);

  const isLoading = Boolean(loadingAction);

  return (
    <>
      {!isConnected ?
        <div className="flex justify-center items-center min-h-screen p-6 relative">
          {isLoading && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex flex-col items-center justify-center space-y-4">
              <div
                className="w-12 h-12 border-4 border-primary/60 border-t-primary rounded-full animate-spin"
                role="status"
                aria-label="Loading"
              ></div>
              <p className="text-neutral-dark font-medium text-center">
                {loadingAction === "disconnect"
                  ? `Disconnecting ${integrationName}...`
                  : `Connecting ${integrationName}...`}
              </p>
            </div>
          )}

          <div
            className={`w-full max-w-xl rounded-2xl shadow-xl/30 border border-gray-200 p-8 space-y-6 transition-all duration-300 hover:shadow-xl ${isLoading ? "opacity-50 pointer-events-none" : ""
              }`}
          >
            <div className="text-center space-y-2">
              <div className="flex justify-center items-center gap-3 text-primary text-3xl font-bold">
                <FaGoogle className="text-4xl text-primary" />
                <h1>{integrationName}</h1>
              </div>
              <p className="text-neutral-semi-dark text-sm">
                Sync your data with Google BigQuery
              </p>
            </div>

            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 space-y-4 text-center">
              <p className="text-neutral-ultra-dark font-semibold text-lg">
                {integrationName} is Not Connected
              </p>
              <p className="text-neutral-semi-dark text-sm">
                Click Connect to start syncing data
              </p>

              <div className="flex justify-center mt-6">
                <button
                  onClick={handleConnect}
                  disabled={loadingAction === "connect"}
                  className="flex items-center gap-2 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition transform hover:scale-[1.02]"
                >
                  {loadingAction === "connect" ? (
                    <ButtonSpinner />
                  ) : (
                    <FaGoogle className="text-base text-white" />
                  )}
                  Connect
                </button>
              </div>
            </div>
          </div>
        </div> :


        <div>
          <label className="inline-flex items-center cursor-pointer mt-5 ml-5 mb-20">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={isConnected}
              onChange={isConnected ? handleDisconnect : handleConnect}
              disabled={loadingAction === "connect" || loadingAction === "disconnect"}
            />
            <div className="relative w-13 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary dark:peer-checked:bg-primary"></div>
            <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
              {loadingAction === "connect" || loadingAction === "disconnect" ? (
                <ButtonSpinner />
              ) : isConnected ? (
                "Disconnect Google BigQuery"
              ) : (
                "Connect Google BigQuery"
              )}
            </span>
          </label>

          <Workflows /> </div>}
    </>
  );
}

export default BigQueryIntegration;
