import { useEffect, useState } from "react";
import api from "../api/axios";
import TaskForm from "./TaskForm";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTasks = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const res = await api.get(`tasks/?page=${pageNumber}`);
      setTasks(res.data.results);
      setTotalPages(Math.ceil(res.data.count / 5));
      setPage(pageNumber);
    } catch {
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await api.delete(`tasks/${id}/`);
      setTasks(tasks.filter((t) => t.id !== id));
    } catch {
      alert("Failed to delete task");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks =
    statusFilter === "all"
      ? tasks
      : tasks.filter((t) => t.status === statusFilter);

  if (loading) return <p className="text-center mt-5">Loading tasks…</p>;
  if (error) return <div className="alert alert-danger mt-4">{error}</div>;

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">
        <h4 className="fw-bold">Your Tasks</h4>

        <div className="d-flex gap-2">
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <button
            className="btn btn-primary"
            onClick={() => {
              setSelectedTask(null);
              setShowForm(true);
            }}
          >
            + Add Task
          </button>
        </div>
      </div>

      {/* Task Cards */}
      {filteredTasks.length === 0 ? (
        <div className="alert alert-info text-center">
          No tasks found
        </div>
      ) : (
        <div className="row g-3">
          {filteredTasks.map((task) => (
            <div key={task.id} className="col-12 col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body d-flex flex-column">
                  <h6 className="fw-semibold">{task.title}</h6>
                  <p className="text-muted small flex-grow-1">
                    {task.description}
                  </p>

                  <span
                    className={`badge mb-3 align-self-start ${
                      task.status === "completed"
                        ? "bg-success"
                        : task.status === "in_progress"
                        ? "bg-warning text-dark"
                        : "bg-secondary"
                    }`}
                  >
                    {task.status.replace("_", " ")}
                  </span>

                  <div className="d-flex gap-2 mt-auto">
                    <button
                      className="btn btn-sm btn-outline-primary w-100"
                      onClick={() => {
                        setSelectedTask(task);
                        setShowForm(true);
                      }}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-sm btn-outline-danger w-100"
                      onClick={() => handleDelete(task.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="mt-4">
          <ul className="pagination justify-content-center flex-wrap">
            {[...Array(totalPages)].map((_, i) => (
              <li
                key={i}
                className={`page-item ${page === i + 1 ? "active" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => fetchTasks(i + 1)}
                >
                  {i + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
};

export default TaskList;
