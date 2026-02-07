import { useState } from 'react';
import { Lecture } from '../store/useStore';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface LectureItemProps {
  lecture: Lecture;
  onSelect: () => void;
  isSelected: boolean;
}

export function LectureItem({ lecture, onSelect, isSelected }: LectureItemProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
      >
        <div className="text-left flex-1">
          <h4 className="font-semibold text-gray-900">{lecture.title}</h4>
          <p className="text-sm text-gray-500 mt-1">
            {lecture.topics?.length || 0} topics covered
          </p>
        </div>
        {expanded ? (
          <ChevronUp className="h-5 w-5 text-gray-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-400" />
        )}
      </button>

      {expanded && (
        <div className="px-4 pb-4 bg-slate-50 border-t border-slate-200">
          <div className="mb-4">
            <h5 className="font-medium text-sm text-gray-700 mb-3">Topics Covered:</h5>
            <div className="space-y-2">
              {lecture.topics && lecture.topics.map((topic, idx) => (
                <div key={idx} className="text-sm text-gray-600">
                  {typeof topic === 'string' ? (
                    <div>• {topic}</div>
                  ) : Array.isArray(topic) ? (
                    <div>
                      <div>• {topic[0]}</div>
                      {topic.slice(1).map((subtopic, sidx) => (
                        <div key={sidx} className="ml-4">
                          ◦ {subtopic}
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={onSelect}
            className={`w-full py-2 rounded-lg font-medium transition-colors ${
              isSelected
                ? 'bg-blue-500 text-white'
                : 'bg-white border border-blue-500 text-blue-500 hover:bg-blue-50'
            }`}
          >
            {isSelected ? '✓ Selected' : 'Select & View Feedback'}
          </button>
        </div>
      )}
    </div>
  );
}

interface CreateLectureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, topics: string[][]) => Promise<void>;
  isLoading: boolean;
}

export function CreateLectureModal({ isOpen, onClose, onSubmit, isLoading }: CreateLectureModalProps) {
  const [title, setTitle] = useState('');
  const [mainTopic, setMainTopic] = useState('');
  const [subtopics, setSubtopics] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const topicsArray: string[][] = mainTopic
      ? [[mainTopic, ...subtopics.split(',').map(s => s.trim()).filter(Boolean)]]
      : [];

    try {
      await onSubmit(title, topicsArray);
      setTitle('');
      setMainTopic('');
      setSubtopics('');
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Lecture</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Lecture Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Wave Functions Fundamentals"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Main Topic</label>
            <input
              type="text"
              value={mainTopic}
              onChange={(e) => setMainTopic(e.target.value)}
              placeholder="e.g., Quantum Mechanics"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subtopics (comma-separated)
            </label>
            <textarea
              value={subtopics}
              onChange={(e) => setSubtopics(e.target.value)}
              placeholder="e.g., Wave Function, Schrodinger Equation, Probability Density"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-20"
            />
            <p className="text-xs text-gray-500 mt-1">
              Separate multiple subtopics with commas
            </p>
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
              disabled={isLoading || !title}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 font-medium"
            >
              {isLoading ? 'Creating...' : 'Create Lecture'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
