import { FaPlus } from "react-icons/fa";

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
  const isLoading = Boolean(loadingAction);

  return (
    <div className="flex justify-center items-center min-h-screen p-6">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center space-y-3">
          <div
            className="w-12 h-12 border-4 border-primary/60 border-t-primary rounded-full animate-spin"
            role="status"
            aria-label="Loading"
          ></div>

          <p className="text-neutral-dark font-medium text-center">
            {loadingAction?.startsWith("disconnect")
              ? `Disconnecting ${title}...`
              : `Connecting ${title}...`}
          </p>
        </div>
      ) : (
        <div className="w-full max-w-xl rounded-2xl shadow-xl/30 border border-gray-200 shadow-primary-dark/50 p-8 space-y-6 transition-all duration-300 hover:shadow-xl hover:scale-105">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-primary">{title}</h1>
            <p className="text-neutral-semi-dark text-sm">{description}</p>
          </div>

          {/* Multiple accounts (for GHL) */}
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
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={true}
                          disabled={loadingAction === `disconnect:${acc.location_id}`} // 👈 disable during specific account disconnect
                          onChange={() => onDisconnect(acc.location_id)}
                        />
                        <div className="w-11 h-6 bg-neutral-light peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer-checked:bg-primary-dark transition-all"></div>
                        <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-md peer-checked:translate-x-full transition-transform"></div>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Add Another Account */}
              <div className="flex justify-center mt-6">
                <button
                  onClick={onConnect}
                  disabled={loadingAction === "connect"} // 👈 disable while connecting
                  className="flex items-center gap-2 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white font-semibold px-6 py-2 rounded-lg shadow transition"
                >
                  <FaPlus className="text-sm" />
                  {addAccountLabel}
                </button>
              </div>
            </>
          )}

          {/* Single account (Slack, Google, etc.) */}
          {multipleAccounts.length === 0 && (
            <>
              {isConnected && (
                <div className="p-6 bg-primary-light rounded-2xl shadow-lg border border-gray-200 space-y-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 text-center">
                  <p className="text-neutral-ultra-dark font-semibold text-lg">
                    {title} is Connected
                  </p>

                  {details.email && (
                    <p className="text-neutral-dark">
                      <span className="font-semibold">Email:</span> {details.email}
                    </p>
                  )}

                  {details.teamName && (
                    <p className="text-neutral-dark">
                      <span className="font-semibold">Workspace:</span> {details.teamName}
                    </p>
                  )}

                  {details.slackUserId && (
                    <p className="text-neutral-dark">
                      <span className="font-semibold">Slack User:</span> {details.slackUserId}
                    </p>
                  )}

                  {details.teamId && (
                    <p className="text-neutral-dark">
                      <span className="font-semibold">Slack Team:</span> {details.teamId}
                    </p>
                  )}
                </div>
              )}

              {/* Toggle for connect/disconnect */}
              <div className="flex items-center justify-center gap-3 mt-4">
                <span className="text-neutral-dark font-medium">
                  {isConnected ? `Disconnect ${title}` : `Connect ${title}`}
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={isConnected}
                    disabled={
                      loadingAction === "connect" ||
                      loadingAction?.startsWith("disconnect")
                    } // 👈 disable toggle during loading
                    onChange={isConnected ? onDisconnect : onConnect}
                  />
                  <div className="w-11 h-6 bg-neutral-light peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer-checked:bg-primary-dark transition-all"></div>
                  <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-md peer-checked:translate-x-full transition-transform"></div>
                </label>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default IntegrationCard;
