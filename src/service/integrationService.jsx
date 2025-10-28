import { auth } from "../firebase";
import { API_ENDPOINTS } from "./apis";

export const getAuthToken = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");
  return user.getIdToken();
};

export const fetchConnectionLog = async () => {
  const token = await getAuthToken();
  const res = await fetch(API_ENDPOINTS.CONNECTIONS, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch connection log");
  return res.json();
};

export const connectIntegration = async (service, redirectPath) => {
  const token = await getAuthToken();
  const redirect_uri = import.meta.env.VITE_REDIRECTION_URL;

  const stateRes = await fetch(API_ENDPOINTS.STATE_TOKEN, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!stateRes.ok) throw new Error("Failed to get state token");

  const { stateToken } = await stateRes.json();
  if (!stateToken) throw new Error("Invalid state token received");

  let authUrl;
  switch (service) {
    case "google":
      authUrl = API_ENDPOINTS.GOOGLE_AUTH;
      break;
    case "slack":
      authUrl = API_ENDPOINTS.SLACK_AUTH;
      break;
    case "ghl":
      authUrl = API_ENDPOINTS.GHL_AUTH;
      break;
    case "google_bigquery": 
      authUrl = API_ENDPOINTS.GOOGLE_BIGQUERY_AUTH;
      break;
    default:
      throw new Error(`Unsupported integration: ${service}`);
  }

  window.location.href = `${authUrl}?state=${stateToken}&redirect_uri=${redirect_uri}/${redirectPath}`;
};

export const disconnectIntegration = async (service) => {
  const token = await getAuthToken();
  let url;

  switch (service) {
    case "google_bigquery":
      url = API_ENDPOINTS.GOOGLE_BIGQUERY_CONNECTION;
      break;
    default:
      url = `${API_ENDPOINTS.CONNECTIONS}/${service}`;
  }

  const res = await fetch(url, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error(`Failed to disconnect ${service}`);
  return true;
};
