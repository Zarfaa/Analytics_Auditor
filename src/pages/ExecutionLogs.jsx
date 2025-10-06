import { useEffect, useState } from "react";

function ExecutionLogs() {
  const [logs, setLogs] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch(
          "https://marketing-automation-43871816946.us-west1.run.app/api/execution-logs"
        );
        if (!response.ok) throw new Error("Failed to fetch logs");
        const data = await response.json();
        if (data && typeof data === "object" && "message" in data) {
          setLogs(data.message);
        } else if (typeof data === "string") {
          setLogs(data);
        } else {
          setLogs("");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div>
      <h1>Execution Logs</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading &&
        !error &&
        (logs && logs.trim().length > 0 ? (
          <pre>{logs}</pre>
        ) : (
          <p>There are no logs yet.</p>
        ))}
    </div>
  );
}

export default ExecutionLogs;
