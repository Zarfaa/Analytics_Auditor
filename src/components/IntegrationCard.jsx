import { FaPlus, FaGoogle, FaSlack, FaBuilding } from "react-icons/fa";
import { MdIntegrationInstructions } from "react-icons/md";
import React from "react";

const ICONS_BY_TITLE = {
  "Slack": FaSlack,
  "Google": FaGoogle,
  "GHL": FaBuilding,
};


const ButtonSpinner = ({ isPrimary = true }) => (
  <div
    className={`w-4 h-4 border-2 rounded-full animate-spin 
      ${isPrimary ? "border-white/60 border-t-white" : "border-red-400 border-t-white"}`}
  ></div>
);

function IntegrationCard({
  title,
  description,
  isConnected,
  details = {},
  onConnect,
  onDisconnect,
  multipleAccounts = [],
  addAccountLabel = "Add Another Account",
  loadingAction = null,
}) {
  const IconComponent = ICONS_BY_TITLE[title] || MdIntegrationInstructions;
  const isLoading = Boolean(loadingAction);
  const integrationName = title.split(" ")[0];

  return (
    <div className={`flex justify-center items-center min-h-screen p-6`}>
      {isLoading && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex flex-col items-center justify-center space-y-4">
          <div
            className="w-12 h-12 border-4 border-primary/60 border-t-primary rounded-full animate-spin"
            role="status"
            aria-label="Loading"
          ></div>
          <p className="text-neutral-dark font-medium text-center">
            {loadingAction?.startsWith("disconnect")
              ? `Disconnecting ${integrationName}...`
              : `Connecting ${integrationName}...`}
          </p>
        </div>
      )}

      <div className={`w-full max-w-xl rounded-2xl shadow-xl/30 border border-gray-200 shadow-primary-dark/50 p-8 space-y-6 transition-all duration-300 hover:shadow-xl ${isLoading ? "opacity-50 pointer-events-none" : ""}`}>

        <div className="text-center space-y-2">
          <div className="flex justify-center items-center gap-3 text-primary text-3xl font-bold">
            <IconComponent className="text-4xl text-primary" />
            <h1>{title}</h1>
          </div>

          <p className="text-neutral-semi-dark text-sm">{description}</p>
        </div>

        {/* --- Multi-Account View (GHL) --- */}
        {multipleAccounts.length > 0 && (
          <>
            <div className="p-6 bg-primary-light rounded-2xl shadow-lg border border-gray-200 space-y-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <p className="text-neutral-ultra-dark font-semibold text-lg text-center">
                Connected Accounts
              </p>
              <ul className="space-y-3">
                {multipleAccounts.map((acc, idx) => (
                  <li
                    key={idx}
                    className="flex justify-between items-center bg-white border border-gray-200 rounded-lg px-4 py-2 shadow-sm"
                  >
                    <div>
                      {acc.location_id && (
                        <p className="text-xs text-neutral-semi-dark">
                          Location ID: {acc.location_id}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => onDisconnect(acc.location_id)}
                      disabled={loadingAction === `disconnect:${acc.location_id}`}
                      className="text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
                    >
                      {loadingAction === `disconnect:${acc.location_id}` ? (
                        <ButtonSpinner isPrimary={false} />
                      ) : (
                        "Disconnect"
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-center mt-6">
              <button
                onClick={onConnect}
                disabled={loadingAction === "connect"}
                className="flex items-center gap-2 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white font-semibold px-6 py-2 rounded-lg shadow transition"
              >
                {loadingAction === "connect" ? (
                  <ButtonSpinner />
                ) : (
                  <FaPlus className="text-sm" />
                )}
                {addAccountLabel}
              </button>
            </div>
          </>
        )}

        {/* --- Single-Account View (Google, Slack, etc.) --- */}
        {multipleAccounts.length === 0 && (
          <>
            {isConnected ? (
              <div className="p-6 bg-green-50 rounded-2xl border border-green-200 space-y-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <p className="text-green-800 font-bold text-lg">
                    {integrationName} is Connected
                  </p>
                </div>
                {details.email && (
                  <p className="text-neutral-dark">
                    <span className="font-semibold">Account:</span> {details.email}
                  </p>
                )}

                {details.teamName && (
                  <p className="text-neutral-dark">
                    <span className="font-semibold">Workspace:</span> {details.teamName}
                  </p>
                )}
                {details.expiry && (
                  <p className="text-sm text-neutral-dark mt-2">
                    <span className="font-semibold">Token Expires:</span>{" "}
                    {new Date(details.expiry).toLocaleString()}
                  </p>
                )}
              </div>
            ) : (
              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 space-y-4 text-center">
                <p className="text-neutral-ultra-dark font-semibold text-lg">
                  {title} is Not Connected
                </p>
                <p className="text-neutral-semi-dark text-sm">
                  Click Connect to start syncing data
                </p>
              </div>
            )}

            <div className="flex justify-center mt-6">
              {isConnected ? (
                <button
                  onClick={onDisconnect}
                  disabled={loadingAction === "disconnect"}
                  className="flex items-center gap-2 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition transform hover:scale-[1.02]"
                >
                  {loadingAction === "disconnect" ? (
                    <ButtonSpinner isPrimary={false} />
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  )}
                  Disconnect {integrationName}
                </button>
              ) : (
                <button
                  onClick={onConnect}
                  disabled={loadingAction === "connect"}
                  className="flex items-center gap-2 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition transform hover:scale-[1.02]"
                >
                  {loadingAction === "connect" ? (
                    <ButtonSpinner />
                  ) : (
                    <IconComponent className="text-base text-white" />
                  )}
                  Connect {integrationName}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default IntegrationCard;