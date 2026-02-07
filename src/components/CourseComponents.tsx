import { Trash2 } from 'lucide-react';
import { Course } from '../store/useStore';
import { useState } from 'react';

interface CourseCardProps {
  course: Course;
  onClick: () => void;
  onDelete?: () => void;
}

export function CourseCard({ course, onClick, onDelete }: CourseCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all cursor-pointer group">
      <div onClick={onClick}>
        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
          {course.name}
        </h3>
        <p className="text-sm text-gray-500">
          Created {new Date(course.created_at).toLocaleDateString()}
        </p>
      </div>

      {onDelete && (
        <div className="mt-4 pt-4 border-t border-slate-200">
          {showDeleteConfirm ? (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  onDelete();
                  setShowDeleteConfirm(false);
                }}
                className="flex-1 px-3 py-1 bg-rose-500 text-white text-sm rounded hover:bg-rose-600"
              >
                Confirm Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-3 py-1 bg-slate-200 text-gray-700 text-sm rounded hover:bg-slate-300"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1"
            >
              <Trash2 className="h-3 w-3" />
              Delete Course
            </button>
          )}
        </div>
      )}
    </div>
  );
}

interface CreateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => Promise<void>;
  isLoading: boolean;
}

export function CreateCourseModal({ isOpen, onClose, onSubmit, isLoading }: CreateCourseModalProps) {
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(name);
      setName('');
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Course</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Course Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Quantum Mechanics 101"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-200 text-gray-700 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 font-medium"
            >
              {isLoading ? 'Creating...' : 'Create Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
