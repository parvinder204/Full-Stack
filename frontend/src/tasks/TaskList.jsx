import { useEffect, useState } from "react";
import api from "../api/axios";
import TaskForm from "./TaskForm";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [showForm, setShowForm] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchTasks = async (pageNumber = 1) => {
        setLoading(true);
        setError("");
        try {
            const res = await api.get(`tasks/?page=${pageNumber}`);
            setTasks(res.data.results);
            setTotalPages(Math.ceil(res.data.count / 6));
            setPage(pageNumber);
        } catch {
            setError("Failed to load tasks");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this task?")) return;
        try {
            await api.delete(`tasks/${id}/`);
            setTasks(tasks.filter((t) => t.id !== id));
        } catch {
            alert("Failed to delete task");
        }
    };

    const filteredTasks =
        statusFilter === "all"
            ? tasks
            : tasks.filter((t) => t.status === statusFilter);

    return (
        <div className="mt-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 gap-2">
                <h3 className="fw-bold text-primary">Your Tasks</h3>

                <div className="d-flex flex-column flex-sm-row gap-2">
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
                        className="btn btn-success d-flex align-items-center gap-1"
                        style={{ whiteSpace: "nowrap" }} // prevent wrapping text
                        onClick={() => {
                            setSelectedTask(null);
                            setShowForm(true);
                        }}
                    >
                        <FaPlus /> Add Task
                    </button>
                </div>
            </div>


            {loading && <div className="text-center mt-3">Loading tasks...</div>}
            {error && <div className="alert alert-danger">{error}</div>}
            {!loading && filteredTasks.length === 0 && (
                <div className="alert alert-info">No tasks found</div>
            )}

            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                {filteredTasks.map((task) => (
                    <div key={task.id} className="col">
                        <div className="card shadow-sm h-100 border-start border-4"
                            style={{
                                borderColor:
                                    task.status === "completed"
                                        ? "#28a745"
                                        : task.status === "in_progress"
                                            ? "#ffc107"
                                            : "#6c757d",
                            }}
                        >
                            <div className="card-body d-flex flex-column justify-content-between">
                                <div>
                                    <h5 className="card-title">{task.title}</h5>
                                    <p className="card-text text-muted">{task.description}</p>
                                    <span
                                        className={`badge ${task.status === "completed"
                                                ? "bg-success"
                                                : task.status === "in_progress"
                                                    ? "bg-warning text-dark"
                                                    : "bg-secondary"
                                            }`}
                                    >
                                        {task.status.replace("_", " ")}
                                    </span>
                                    {task.due_date && (
                                        <small className="d-block mt-1 text-muted">
                                            Due: {task.due_date}
                                        </small>
                                    )}
                                </div>

                                <div className="mt-3 d-flex gap-2 justify-content-end">
                                    <button
                                        className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
                                        onClick={() => {
                                            setSelectedTask(task);
                                            setShowForm(true);
                                        }}
                                    >
                                        <FaEdit /> Edit
                                    </button>
                                    <button
                                        className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
                                        onClick={() => handleDelete(task.id)}
                                    >
                                        <FaTrash /> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <nav className="mt-4">
                    <ul className="pagination justify-content-center flex-wrap gap-1">
                        {[...Array(totalPages)].map((_, idx) => (
                            <li
                                key={idx}
                                className={`page-item ${page === idx + 1 ? "active" : ""}`}
                            >
                                <button
                                    className="page-link"
                                    onClick={() => fetchTasks(idx + 1)}
                                >
                                    {idx + 1}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            )}

            {/* Add/Edit Modal */}
            <TaskForm
                show={showForm}
                task={selectedTask}
                onClose={() => setShowForm(false)}
                onSuccess={fetchTasks}
            />
        </div>
    );
};

export default TaskList;
