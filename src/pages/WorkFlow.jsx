import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaPlayCircle, FaPencilAlt, FaTrash, FaSearch } from "react-icons/fa";
import Spinner from "../components/Spinner";
import ConfirmModal from "../components/ConfirmModal";
import CreateWorkflowModal from "../components/createModal";
import * as workflowService from "../service/workflowServices";

function Workflows() {
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [limit] = useState(50);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [editingWorkflow, setEditingWorkflow] = useState(null);
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, workflowId: null, workflowName: "" });

  const [projects, setProjects] = useState([]);
  const [datasets, setDatasets] = useState([]);
  const [tables, setTables] = useState([]);

  const [newWorkflow, setNewWorkflow] = useState({
    workflowName: "",
    workflowType: "contacts",
    projectId: "",
    dataset: "",
    table: "",
  });

  const [editForm, setEditForm] = useState({
    workflowName: "",
    workflowType: "",
    projectId: "",
    dataset: "",
    table: "",
  });

  const openNewWorkflowModal = async () => {
    setNewModalOpen(true);
    try {
      const projectsList = await workflowService.fetchProjects();
      setProjects(projectsList);
      setDatasets([]);
      setTables([]);
      setNewWorkflow({
        workflowName: "",
        workflowType: "contacts",
        projectId: "",
        dataset: "",
        table: "",
      });
    } catch (err) {
      toast.error("Failed to fetch projects");
      console.error(err);
    }
  };

  const fetchDatasets = async (projectId) => {
    if (!projectId) return;
    try {
      const list = await workflowService.fetchDatasets(projectId);
      setDatasets(list);
      setTables([]);
    } catch (err) {
      toast.error("Failed to fetch datasets");
      console.error(err);
    }
  };

  const fetchTables = async (projectId, dataset) => {
    if (!projectId || !dataset) return;
    try {
      const list = await workflowService.fetchTables(projectId, dataset);
      setTables(list);
    } catch (err) {
      toast.error("Failed to fetch tables");
      console.error(err);
    }
  };

  const fetchWorkflows = async (newOffset = 0) => {
    setLoading(true);
    try {
      const data = await workflowService.fetchWorkflows(newOffset, limit);
      setWorkflows(data.data || []);
      setOffset(data.offset || 0);
      setTotalCount(data.totalCount || 0);
      setHasMore(data.hasMore || false);
    } catch (err) {
      toast.error("Error fetching workflows");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createNewWorkflow = async () => {
    const { workflowName, workflowType, projectId, dataset, table } = newWorkflow;
    if (!workflowName || !workflowType || !projectId || !dataset || !table) {
      toast.error("All fields are required");
      return;
    }
    try {
      const createdWorkflow = await workflowService.createWorkflow(newWorkflow);
      toast.success("Workflow created successfully!");
      setWorkflows((prev) => [createdWorkflow, ...prev]);
      setNewModalOpen(false);
      setNewWorkflow({ workflowName: "", workflowType: "contacts", projectId: "", dataset: "", table: "" });
    } catch (err) {
      toast.error("Error creating workflow");
      console.error(err);
    }
  };

  const startEditingWorkflow = async (workflow) => {
    setEditingWorkflow(workflow);
    setEditForm({ ...workflow });

    try {
      const projectsList = await workflowService.fetchProjects();
      setProjects(projectsList);
      if (workflow.projectId) await fetchDatasets(workflow.projectId);
      if (workflow.projectId && workflow.dataset) await fetchTables(workflow.projectId, workflow.dataset);
    } catch (err) {
      toast.error("Failed to load data for editing");
      console.error(err);
    }
  };

  const saveEditedWorkflow = async () => {
    if (!editingWorkflow) return;
    try {
      await workflowService.updateWorkflow(editingWorkflow.id, editForm);
      toast.success("Workflow updated successfully!");
      setWorkflows((prev) =>
        prev.map((wf) => (wf.id === editingWorkflow.id ? { ...wf, ...editForm } : wf))
      );
      setEditingWorkflow(null);
    } catch (err) {
      toast.error("Error updating workflow");
      console.error(err);
    }
  };

  const confirmDeleteWorkflow = (workflow) => {
    setConfirmModal({ isOpen: true, workflowId: workflow.id, workflowName: workflow.workflowName });
  };

  const handleDeleteConfirmed = async () => {
    try {
      await workflowService.deleteWorkflow(confirmModal.workflowId);
      toast.success("Workflow deleted successfully!");
      setWorkflows((prev) => prev.filter((wf) => wf.id !== confirmModal.workflowId));
    } catch (err) {
      toast.error("Error deleting workflow");
      console.error(err);
    } finally {
      setConfirmModal({ ...confirmModal, isOpen: false });
    }
  };

  const runWorkflow = async (workflow) => {
    toast.loading(`Running ${workflow.workflowName}...`);
    try {
      await workflowService.runWorkflow(workflow);
      toast.success(`${workflow.workflowName} executed successfully!`);
    } catch (err) {
      toast.error(`Error running ${workflow.workflowName}`);
      console.error(err);
    }
  };

  useEffect(() => {
    fetchWorkflows();
  }, []);

  useEffect(() => {
    if (newWorkflow.projectId) fetchDatasets(newWorkflow.projectId);
  }, [newWorkflow.projectId]);

  useEffect(() => {
    if (newWorkflow.projectId && newWorkflow.dataset) fetchTables(newWorkflow.projectId, newWorkflow.dataset);
  }, [newWorkflow.projectId, newWorkflow.dataset]);

  const handlePrevPage = () => { if (offset > 0) fetchWorkflows(offset - limit); };
  const handleNextPage = () => { if (hasMore) fetchWorkflows(offset + limit); };
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="p-6">
      <div className="flex justify-center items-center">
        <h1 className="text-2xl font-semibold text-center">Workflows</h1>
      </div>

      <div className="flex justify-center items-center mt-6">
        <h3 className="text-md font-medium text-center text-gray-700">
          Google BigQuery Integration & Workflow Management
        </h3>
      </div>

      <div className="flex justify-between items-center mb-6 mt-20">
        <form className="flex-1 max-w-md">
          <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaSearch />
            </div>
            <input
              type="search"
              id="default-search"
              className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search Workflows"
              required
            />
            <button
              type="submit"
              className="text-white absolute right-2.5 bottom-2.5 bg-primary hover:bg-primary-dark focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Search
            </button>
          </div>
        </form>

        <button
          className="ml-4 bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark whitespace-nowrap"
          onClick={openNewWorkflowModal}
        >
          + New Workflow
        </button>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <>
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full text-sm text-left border-collapse">
              <thead className="bg-primary-light text-gray-100 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 border-b">Name</th>
                  <th className="px-4 py-3 border-b">Type</th>
                  <th className="px-4 py-3 border-b">Project</th>
                  <th className="px-4 py-3 border-b">Dataset</th>
                  <th className="px-4 py-3 border-b">Table</th>
                  <th className="px-4 py-3 border-b">Last Updated</th>
                  <th className="px-4 py-3 border-b">Owner</th>
                  <th className="px-4 py-3 border-b text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {workflows.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-4 py-3 text-center text-gray-500">
                      No workflows found
                    </td>
                  </tr>
                ) : (
                  workflows.map((wf) => (
                    <tr key={wf.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-800">
                        {editingWorkflow?.id === wf.id ? (
                          <input
                            value={editForm.workflowName}
                            onChange={(e) =>
                              setEditForm({ ...editForm, workflowName: e.target.value })
                            }
                            className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
                          />
                        ) : (
                          wf.workflowName
                        )}
                      </td>

                      <td className="px-4 py-3">
                        {editingWorkflow?.id === wf.id ? (
                          <select
                            value={editForm.workflowType}
                            onChange={(e) =>
                              setEditForm({ ...editForm, workflowType: e.target.value })
                            }
                            className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
                          >
                            <option value="contacts">Contacts</option>
                            <option value="opportunities">Opportunities</option>
                            <option value="callReports">Call Reports</option>
                          </select>
                        ) : (
                          wf.workflowType
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {editingWorkflow?.id === wf.id ? (
                          <select
                            value={editForm.projectId}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                projectId: e.target.value,
                                dataset: "",
                                table: "",
                              })
                            }
                            className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
                          >
                            <option value="">Select Project</option>
                            {projects.map((projectId) => (
                              <option key={projectId} value={projectId}>
                                {projectId}
                              </option>
                            ))}
                          </select>
                        ) : (
                          wf.projectId
                        )}
                      </td>

                      <td className="px-4 py-3">
                        {editingWorkflow?.id === wf.id ? (
                          <select
                            value={editForm.dataset}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                dataset: e.target.value,
                                table: "",
                              })
                            }
                            className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
                            disabled={!datasets.length}
                          >
                            <option value="">Select Dataset</option>
                            {datasets.map((d) => (
                              <option key={d} value={d}>
                                {d}
                              </option>
                            ))}
                          </select>
                        ) : (
                          wf.dataset
                        )}
                      </td>

                      <td className="px-4 py-3">
                        {editingWorkflow?.id === wf.id ? (
                          <select
                            value={editForm.table}
                            onChange={(e) =>
                              setEditForm({ ...editForm, table: e.target.value })
                            }
                            className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
                            disabled={!tables.length}
                          >
                            <option value="">Select Table</option>
                            {tables.map((t) => (
                              <option key={t} value={t}>
                                {t}
                              </option>
                            ))}
                          </select>
                        ) : (
                          wf.table
                        )}
                      </td>

                      <td className="px-4 py-3">{new Date(wf.createdAt).toLocaleString()}</td>

                      <td className="px-4 py-3 text-gray-600">{wf.uid}</td>

                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end items-center space-x-2">
                          {editingWorkflow?.id === wf.id ? (
                            <>
                              <button
                                onClick={saveEditedWorkflow}
                                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingWorkflow(null)}
                                className="bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400 transition"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => runWorkflow(wf)}
                                className="bg-primary text-white px-3 py-1 rounded hover:bg-primary-dark transition flex items-center gap-1"
                              >
                                <FaPlayCircle className="w-4 h-4" /> Run
                              </button>
                              <button
                                onClick={() => startEditingWorkflow(wf)}
                                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition flex items-center gap-1"
                              >
                                <FaPencilAlt className="w-4 h-4" /> Edit
                              </button>
                              <button
                                onClick={() => confirmDeleteWorkflow(wf)}
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition flex items-center gap-1"
                              >
                                <FaTrash className="w-4 h-4" /> Delete
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>

            </table>
          </div>

          <div className="flex justify-between items-center mt-10">
            <button
              onClick={handlePrevPage}
              disabled={offset === 0}
              className="bg-primary-light px-3 py-1 rounded disabled:opacity-50 hover:bg-primary-dark"
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={!hasMore}
              className="bg-primary-light px-3 py-1 rounded disabled:opacity-50 hover:bg-primary-dark"
            >
              Next
            </button>
          </div>
        </>
      )}

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title="Delete Workflow"
        message={`Are you sure you want to delete the workflow "${confirmModal.workflowName}"?`}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setConfirmModal({ ...confirmModal, isOpen: false })}
      />
      <CreateWorkflowModal
        isOpen={newModalOpen}
        onClose={() => setNewModalOpen(false)}
        newWorkflow={newWorkflow}
        setNewWorkflow={setNewWorkflow}
        projects={projects}
        datasets={datasets}
        tables={tables}
        createWorkflow={createNewWorkflow}
        onCreated={(createdWorkflow) => {
          setWorkflows((prev) => [createdWorkflow, ...prev]);
          setNewModalOpen(false);
          setNewWorkflow({
            workflowName: "",
            workflowType: "contacts",
            projectId: "",
            dataset: "",
            table: "",
          });
        }}
      />


    </div>
  );
}

export default Workflows;
