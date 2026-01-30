import React from 'react';
import { Task } from '../types';
import { formatDate } from '../utils/dateUtils';
import { Calendar, Edit, Trash2, Clock } from 'lucide-react';
import Button from './Button';
import { TASK_STATUS_LABELS } from '../types';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const isOverdue =
    task.due_date &&
    new Date(task.due_date) < new Date() &&
    task.status !== 'completed';

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-semibold text-gray-900 flex-1">
          {task.title}
        </h3>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
            task.status
          )}`}
        >
          {TASK_STATUS_LABELS[task.status]}
        </span>
      </div>

      <p className="text-gray-600 mb-4 line-clamp-2">
        {task.description || 'No description'}
      </p>

      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
        <div className="flex items-center gap-1">
          <Calendar size={16} />
          <span>
            Due: {task.due_date ? formatDate(task.due_date) : 'No due date'}
          </span>
        </div>

        {isOverdue && (
          <span className="flex items-center gap-1 text-red-600 font-medium">
            <Clock size={16} />
            Overdue
          </span>
        )}
      </div>

      <div className="flex gap-2 pt-4 border-t border-gray-100">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onEdit(task)}
          className="flex items-center gap-1"
        >
          <Edit size={16} />
          Edit
        </Button>

        <Button
          variant="danger"
          size="sm"
          onClick={() => onDelete(task.id)}
          className="flex items-center gap-1"
        >
          <Trash2 size={16} />
          Delete
        </Button>
      </div>
    </div>
  );
};

export default TaskCard;
