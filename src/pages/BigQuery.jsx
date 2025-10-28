import { useState, useEffect } from "react";
import { FaGoogle } from "react-icons/fa";
import toast from "react-hot-toast";
import { ButtonSpinner } from "../components/Spinner";
import Workflows from "./WorkFlow";
import {
  fetchConnectionLog,
  connectIntegration,
  disconnectIntegration,
} from "../service/integrationService";

function BigQueryIntegration() {
  const [connectionLog, setConnectionLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(null);

  const isConnected = !!connectionLog?.google_bigquery?.access_token;
  const integrationName = "Google BigQuery";

  const handleConnect = async () => {
    setLoadingAction("connect");
    try {
      await connectIntegration("google_bigquery", "gbq-integration");
    } catch (err) {
      console.error(err);
      toast.error("Error connecting BigQuery account.");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDisconnect = async () => {
    setLoadingAction("disconnect");
    try {
      await disconnectIntegration("google_bigquery");
      setConnectionLog((prev) => ({ ...prev, google_bigquery: null }));
      toast.success("Disconnected successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Error disconnecting BigQuery account.");
    } finally {
      setLoadingAction(null);
    }
  };

  const loadConnections = async () => {
    setLoading(true);
    try {
      const data = await fetchConnectionLog();
      setConnectionLog(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch connection log.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConnections();
  }, []);

  const isLoadingAction = Boolean(loadingAction);


  return (
    <>
      {!isConnected ? (
        <div className="flex justify-center items-center min-h-screen p-6">
          <div
            className={`w-full max-w-xl rounded-2xl shadow-xl border border-gray-200 p-8 space-y-6 transition-all duration-300`}
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

            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 text-center">
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
                  className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-2 rounded-lg shadow-md transition transform hover:scale-[1.02]"
                >
                  {loadingAction === "connect" ? <ButtonSpinner /> : <FaGoogle />}
                  Connect
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <label className="inline-flex items-center cursor-pointer mt-5 ml-5 mb-20">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={isConnected}
              onChange={isConnected ? handleDisconnect : handleConnect}
              disabled={isLoadingAction}
            />
            <div className="relative w-13 h-7 bg-gray-200 rounded-full peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:after:translate-x-full"></div>
            <span className="ml-3 text-sm font-medium text-gray-900">
              {isConnected ? (
                "Disconnect Google BigQuery"
              ) : (
                "Connect Google BigQuery"
              )}
            </span>
          </label>

          <Workflows />
        </div>
      )}
    </>
  );
}

export default BigQueryIntegration;
