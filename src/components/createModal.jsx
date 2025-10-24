import React from "react";

function CreateWorkflowModal({
  isOpen,
  onClose,
  newWorkflow,
  setNewWorkflow,
  projects,
  datasets,
  tables,
  createWorkflow,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div
        className="relative bg-white rounded-lg shadow-lg p-6 w-96 z-10 space-y-4"
        onClick={(e) => e.stopPropagation()} // prevent overlay click
      >
        <h2 className="text-lg font-semibold">Create New Workflow</h2>

        <input
          type="text"
          placeholder="Workflow Name"
          value={newWorkflow.workflowName}
          onChange={(e) => setNewWorkflow({ ...newWorkflow, workflowName: e.target.value })}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />

        <select
          value={newWorkflow.workflowType}
          onChange={(e) => setNewWorkflow({ ...newWorkflow, workflowType: e.target.value })}
          className="w-full border border-gray-300 rounded px-3 py-2"
        >
          <option value="contacts">Contacts</option>
          <option value="opportunities">Opportunities</option>
          <option value="callReports">Call Reports</option>
        </select>

        <select
          value={newWorkflow.projectId}
          onChange={(e) =>
            setNewWorkflow({ ...newWorkflow, projectId: e.target.value, dataset: "", table: "" })
          }
          className="w-full border border-gray-300 rounded px-3 py-2"
        >
          <option value="">Select Project</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <select
          value={newWorkflow.dataset}
          onChange={(e) => setNewWorkflow({ ...newWorkflow, dataset: e.target.value, table: "" })}
          className="w-full border border-gray-300 rounded px-3 py-2"
          disabled={!datasets.length}
        >
          <option value="">Select Dataset</option>
          {datasets.map((d) => (
            <option key={d.name} value={d.name}>
              {d.name}
            </option>
          ))}
        </select>

        <select
          value={newWorkflow.table}
          onChange={(e) => setNewWorkflow({ ...newWorkflow, table: e.target.value })}
          className="w-full border border-gray-300 rounded px-3 py-2"
          disabled={!tables.length}
        >
          <option value="">Select Table</option>
          {tables.map((t) => (
            <option key={t.name} value={t.name}>
              {t.name}
            </option>
          ))}
        </select>

        <div className="flex justify-end space-x-3">
          <button className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400" onClick={onClose}>
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded bg-primary text-white hover:bg-primary-dark"
            onClick={createWorkflow}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateWorkflowModal;
