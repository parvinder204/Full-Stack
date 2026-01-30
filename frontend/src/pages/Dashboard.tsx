import React, { useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import { Task, TaskFormData } from '../types';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import Modal from '../components/Modal';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import ConfirmModal from '../components/ConfirmModal';
import { Plus, Filter, ChevronLeft, ChevronRight } from 'lucide-react';


const Dashboard: React.FC = () => {
  const {
    tasks,
    loading,
    error,
    currentPage,
    totalPages,
    statusFilter,
    createTask,
    updateTask,
    deleteTask,
    fetchTasks,
    filterByStatus,
  } = useTasks();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [successMessage, setSuccessMessage] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const handleCreateTask = async (data: TaskFormData) => {
    try {
      await createTask(data);
      setIsModalOpen(false);
      setSuccessMessage('Task created successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error creating task:', err);
    }
  };

  const handleUpdateTask = async (data: TaskFormData) => {
    if (!editingTask) return;
    try {
      await updateTask(editingTask.id, data);
      setIsModalOpen(false);
      setEditingTask(undefined);
      setSuccessMessage('Task updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

//   const handleDeleteTask = async (id: number) => {
//     if (window.confirm('Are you sure you want to delete this task?')) {
//       try {
//         await deleteTask(id);
//         setSuccessMessage('Task deleted successfully!');
//         setTimeout(() => setSuccessMessage(''), 3000);
//       } catch (err) {
//         console.error('Error deleting task:', err);
//       }
//     }
//   };

  const handleDeleteClick = (task: Task) => {
  setTaskToDelete(task);
  setIsDeleteModalOpen(true);
};

const confirmDeleteTask = async () => {
  if (!taskToDelete) return;

  try {
    await deleteTask(taskToDelete.id);
    setSuccessMessage('Task deleted successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  } catch (err) {
    console.error('Error deleting task:', err);
  } finally {
    setIsDeleteModalOpen(false);
    setTaskToDelete(null);
  }
};

  const handleEditClick = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(undefined);
  };

  const handlePageChange = (page: number) => {
    fetchTasks(page, statusFilter);
  };

  const statusOptions = ['All', 'Pending', 'In Progress', 'Completed'];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Tasks</h1>
          <p className="text-gray-600">Manage and organize your tasks efficiently</p>
        </div>

        {successMessage && (
          <div className="mb-6">
            <Alert type="success" message={successMessage} onClose={() => setSuccessMessage('')} />
          </div>
        )}

        {error && (
          <div className="mb-6">
            <Alert type="error" message={error} />
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-600" />
              <span className="font-medium text-gray-700">Filter by status:</span>
              <div className="flex gap-2">
                {statusOptions.map((status) => (
                  <button
                    key={status}
                    onClick={() => filterByStatus(status)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      statusFilter === status
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <Button
              variant="primary"
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus size={20} />
              New Task
            </Button>
          </div>
        </div>

        {/* Task List */}
        {loading ? (
          <LoadingSpinner />
        ) : tasks.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg
                className="mx-auto h-24 w-24"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-600 mb-4">
              {statusFilter === 'All'
                ? 'Get started by creating your first task!'
                : `No ${statusFilter.toLowerCase()} tasks found.`}
            </p>
            <Button variant="primary" onClick={() => setIsModalOpen(true)}>
              Create Your First Task
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {tasks.map((task) => (
                // <TaskCard
                //   key={task.id}
                //   task={task}
                //   onEdit={handleEditClick}
                //   onDelete={handleDeleteTask}
                // />
                <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={handleEditClick}
                    onDelete={() => handleDeleteClick(task)}
                    />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft size={16} />
                  Previous
                </Button>

                <span className="text-gray-700 font-medium">
                  Page {currentPage} of {totalPages}
                </span>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1"
                >
                  Next
                  <ChevronRight size={16} />
                </Button>
              </div>
            )}
          </>
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={editingTask ? 'Edit Task' : 'Create New Task'}
        >
          <TaskForm
            task={editingTask}
            onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
            onCancel={handleCloseModal}
          />
        </Modal>
        <ConfirmModal
            isOpen={isDeleteModalOpen}
            message={`Are you sure you want to delete "${taskToDelete?.title}"?`}
            onCancel={() => setIsDeleteModalOpen(false)}
            onConfirm={confirmDeleteTask}
            confirmText="Delete"
            cancelText="Cancel"
            />
      </div>
    </div>
  );
};

export default Dashboard;