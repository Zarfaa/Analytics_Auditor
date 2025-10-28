const BASE_URL = "https://marketing-automation-43871816946.us-west1.run.app";
const GBQ_BASE_URL = "https://ghl-automation-apis-43871816946.us-west1.run.app";

export const API_ENDPOINTS = {

  STATE_TOKEN: `${BASE_URL}/api/oauth/state-token`,
  CONNECTIONS: `${BASE_URL}/api/connections`,

  GOOGLE_AUTH: `${BASE_URL}/auth/google`,
  GHL_AUTH: `${BASE_URL}/ghl/oauth/initiate`,
  SLACK_AUTH: `${BASE_URL}/slack/oauth`,


  GOOGLE_BIGQUERY_AUTH: `${BASE_URL}/auth/google-bigquery`,
  GOOGLE_BIGQUERY_CONNECTION: `${BASE_URL}/api/connections/google_bigquery`,

  PROJECTS: `${GBQ_BASE_URL}/api/bigquery/projects`,
  DATASETS: `${GBQ_BASE_URL}/api/bigquery/datasets`,
  TABLES: `${GBQ_BASE_URL}/api/bigquery/tables`,

  WORKFLOWS_LIST: `${GBQ_BASE_URL}/api/workflows/test/list`,
  WORKFLOW_CREATE: `${GBQ_BASE_URL}/api/workflows/create`,
  WORKFLOW_EDIT: `${GBQ_BASE_URL}/api/workflows/edit`,
  WORKFLOW_DELETE: `${GBQ_BASE_URL}/workflows/delete`,
  WORKFLOW_RUN_CONTACTS: `${GBQ_BASE_URL}/contacts/run-workflow`,
  WORKFLOW_RUN_OPPORTUNITIES: `${GBQ_BASE_URL}/opportunities/run-workflow`,
  WORKFLOW_RUN_CALLREPORTS: `${GBQ_BASE_URL}/call-reports/run-workflow`,
};
