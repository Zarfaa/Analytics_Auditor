import { getAuthToken } from "./integrationService";
import { API_ENDPOINTS } from "./apis";

export const fetchProjects = async () => {
  const token = await getAuthToken();
  const res = await fetch(API_ENDPOINTS.PROJECTS, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch projects");
  const data = await res.json();
  return data.projectIds || [];
};

export const fetchDatasets = async (projectId) => {
  const token = await getAuthToken();
  const res = await fetch(
    `${API_ENDPOINTS.DATASETS}?projectId=${projectId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) throw new Error("Failed to fetch datasets");
  const data = await res.json();
 return data.datasetIds || [];
};

export const fetchTables = async (projectId, dataset) => {
  const token = await getAuthToken();
  const res = await fetch(
    `${API_ENDPOINTS.TABLES}?projectId=${projectId}&dataset=${dataset}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) throw new Error("Failed to fetch tables");
  const data = await res.json();
  return data.tableIds || [];
};

export const fetchWorkflows = async (offset = 0, limit = 50, search = "") => {
  const token = await getAuthToken();
  const query = new URLSearchParams({
    offset,
    limit,
    search,
  });

  const res = await fetch(`${API_ENDPOINTS.WORKFLOWS_LIST}?${query.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to fetch workflows");
  return res.json();
};


export const createWorkflow = async (workflow) => {
  const token = await getAuthToken();
  const res = await fetch(API_ENDPOINTS.WORKFLOW_CREATE, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(workflow),
  });
  if (!res.ok) throw new Error("Failed to create workflow");
  return res.json();
};

export const updateWorkflow = async (workflowId, data) => {
  const token = await getAuthToken();
  const res = await fetch(`${API_ENDPOINTS.WORKFLOW_EDIT}/${workflowId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update workflow");
  return res.json();
};

export const deleteWorkflow = async (workflowId) => {
  const token = await getAuthToken();
  const res = await fetch(`${API_ENDPOINTS.WORKFLOW_DELETE}/${workflowId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to delete workflow");
  return true;
};

export const runWorkflow = async (workflow) => {
  const token = await getAuthToken();
  let endpoint = "";
  switch (workflow.workflowType) {
    case "contacts":
      endpoint = API_ENDPOINTS.WORKFLOW_RUN_CONTACTS;
      break;
    case "opportunities":
      endpoint = API_ENDPOINTS.WORKFLOW_RUN_OPPORTUNITIES;
      break;
    case "callReports":
      endpoint = API_ENDPOINTS.WORKFLOW_RUN_CALLREPORTS;
      break;
    default:
      throw new Error("Unknown workflow type");
  }

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ workflowId: workflow.id }),
  });
  if (!res.ok) throw new Error("Failed to run workflow");
  return res.json();
};
