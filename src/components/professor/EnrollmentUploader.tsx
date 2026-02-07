import { useState } from 'react';
import { Upload, AlertCircle, CheckCircle2, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import { parseCSV, validateStudents, StudentRecord } from '../../lib/csv-parser';
import { enrollStudents } from '../../lib/ai-analytics';

interface EnrollmentUploaderProps {
  courseId: string;
  onSuccess?: (count: number) => void;
}

export default function EnrollmentUploader({ courseId, onSuccess }: EnrollmentUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<StudentRecord[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleParse = async (file: File) => {
    if (!file.name.endsWith('.csv')) {
      setErrors(['Please upload a CSV file']);
      return;
    }

    setParsing(true);
    try {
      const parsed = await parseCSV(file);
      const { valid, errors: validationErrors } = validateStudents(parsed);

      if (validationErrors.length > 0) {
        setErrors(validationErrors);
      }

      if (valid.length > 0) {
        setPreview(valid);
        setSuccess(false);
      }
    } catch (error) {
      setErrors([error instanceof Error ? error.message : 'Parse error']);
    } finally {
      setParsing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files?.[0]) {
      handleParse(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files?.[0]) {
      handleParse(files[0]);
    }
  };

  const handleEnroll = async () => {
    setUploading(true);
    try {
      const result = await enrollStudents(courseId, preview);
      setSuccess(true);
      setPreview([]);
      setErrors([]);
      onSuccess?.(result.count);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      setErrors([error instanceof Error ? error.message : 'Enrollment failed']);
    } finally {
      setUploading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg border border-slate-200"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">📋 Bulk Enroll Students</h2>
        <p className="text-gray-600">Upload CSV with name, email, roll_number</p>
      </div>

      {/* Drop Zone */}
      {preview.length === 0 ? (
        <motion.div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          whileHover={{ scale: 1.02 }}
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
            dragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-slate-50'
          }`}
        >
          <Upload className="w-12 h-12 mx-auto mb-4 text-blue-500" />
          <h3 className="text-lg font-semibold mb-2">Drag CSV file here</h3>
          <p className="text-sm text-gray-600 mb-4">or</p>
          <label className="inline-block">
            <span className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 cursor-pointer transition">
              Select File
            </span>
            <input type="file" accept=".csv" onChange={handleFileSelect} className="hidden" />
          </label>
        </motion.div>
      ) : null}

      {parsing && (
        <div className="flex items-center justify-center py-8">
          <Loader className="w-6 h-6 animate-spin text-blue-500" />
          <span className="ml-2 text-gray-600">Parsing CSV...</span>
        </div>
      )}

      {/* Errors */}
      {errors.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-red-900 mb-2">Validation Errors</h4>
              <ul className="text-sm text-red-800 space-y-1">
                {errors.slice(0, 5).map((error, i) => (
                  <li key={i}>• {error}</li>
                ))}
                {errors.length > 5 && <li>• ... and {errors.length - 5} more</li>}
              </ul>
            </div>
          </div>
        </motion.div>
      )}

      {/* Preview */}
      {preview.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              ✅ Ready to enroll {preview.length} students
            </h3>

            <div className="max-h-64 overflow-y-auto rounded-lg border border-slate-200">
              <table className="w-full text-sm">
                <thead className="bg-slate-100 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold">Name</th>
                    <th className="px-4 py-2 text-left font-semibold">Email</th>
                    <th className="px-4 py-2 text-left font-semibold">Roll No</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.map((student, idx) => (
                    <tr key={idx} className="border-t hover:bg-slate-50">
                      <td className="px-4 py-2">{student.name}</td>
                      <td className="px-4 py-2 text-blue-600">{student.email}</td>
                      <td className="px-4 py-2 text-gray-600">{student.roll_number}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleEnroll}
              disabled={uploading}
              className="flex-1 px-6 py-3 bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-600 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {uploading ? <Loader className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              {uploading ? 'Enrolling...' : 'Confirm & Enroll'}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setPreview([]);
                setErrors([]);
              }}
              className="px-6 py-3 bg-slate-200 text-gray-700 rounded-lg font-semibold hover:bg-slate-300"
            >
              Cancel
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Success Message */}
      {success && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-3"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span className="text-emerald-800 font-semibold">Students enrolled successfully! 🎉</span>
        </motion.div>
      )}

      {/* CSV Template */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm font-semibold text-blue-900 mb-2">📝 CSV Format (Download Template)</p>
        <pre className="text-xs bg-white p-2 rounded border border-blue-100 overflow-x-auto">
          {`name,email,roll_number\nRaj Kumar,raj@iitgn.ac.in,21110001\nPriya Singh,priya@iitgn.ac.in,21110002`}
        </pre>
      </div>
    </motion.div>
  );
}
