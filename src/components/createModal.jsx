function CreateWorkflowModal({
  isOpen,
  onClose,
  newWorkflow,
  setNewWorkflow,
  projects = [],
  datasets = [],
  tables = [],
  createWorkflow,
  onCreated,
}) {
  if (!isOpen) return null;

  const handleCreate = async () => {
    const result = await createWorkflow();
    if (result && onCreated) onCreated(result);
  };

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition";

  const selectClass = inputClass + " bg-white";

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">

      <div
        className="absolute inset-0 bg-opacity-30 backdrop-blur-sm"
        onClick={onClose}
      ></div>


      <div
        className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 z-10 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-gray-800 text-center">
          Create New Workflow
        </h2>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Workflow Name
          </label>
          <input
            type="text"
            placeholder="Enter workflow name"
            value={newWorkflow.workflowName}
            onChange={(e) =>
              setNewWorkflow({ ...newWorkflow, workflowName: e.target.value })
            }
            className={inputClass}
          />
        </div>


        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Workflow Type
          </label>
          <select
            value={newWorkflow.workflowType}
            onChange={(e) =>
              setNewWorkflow({ ...newWorkflow, workflowType: e.target.value })
            }
            className={selectClass}
          >
            <option value="">Select Type</option>
            <option value="contacts">Contacts</option>
            <option value="opportunities">Opportunities</option>
            <option value="callReports">Call Reports</option>
          </select>
        </div>

 
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Project</label>
          <select
            value={newWorkflow.projectId}
            onChange={(e) =>
              setNewWorkflow({
                ...newWorkflow,
                projectId: e.target.value,
                dataset: "",
                table: "",
              })
            }
            className={selectClass}
          >
            <option value="">Select Project</option>
            {projects.map((projectId) => (
              <option key={projectId} value={projectId}>
                {projectId}
              </option>
            ))}
          </select>
        </div>


        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Dataset</label>
          <select
            value={newWorkflow.dataset}
            onChange={(e) =>
              setNewWorkflow({
                ...newWorkflow,
                dataset: e.target.value,
                table: "",
              })
            }
            className={selectClass + (datasets.length === 0 ? " bg-gray-100 cursor-not-allowed" : "")}
            disabled={!datasets.length}
          >
            <option value="">Select Dataset</option>
            {datasets.map((datasetId) => (
              <option key={datasetId} value={datasetId}>
                {datasetId}
              </option>
            ))}
          </select>
        </div>


        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Table</label>
          <select
            value={newWorkflow.table}
            onChange={(e) =>
              setNewWorkflow({ ...newWorkflow, table: e.target.value })
            }
            className={selectClass + (tables.length === 0 ? " bg-gray-100 cursor-not-allowed" : "")}
            disabled={!tables.length}
          >
            <option value="">Select Table</option>
            {tables.map((tableId) => (
              <option key={tableId} value={tableId}>
                {tableId}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end space-x-3 pt-3">
          <button
            className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-5 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark transition"
            onClick={handleCreate}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateWorkflowModal;
