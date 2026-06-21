import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSubmissions } from '../../hooks/useSubmissions';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';
import ErrorMessage from '../common/ErrorMessage';
import { deleteSubmission, updateSubmission } from '../../api/submissions.api';
import { toast } from 'react-hot-toast';

const SubmissionList = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const { submissions, loading, error, totalPages, refetch } = useSubmissions(page, limit);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [newTitle, setNewTitle] = useState('');

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this submission?')) return;
    try {
      await deleteSubmission(id);
      toast.success('Submission deleted');
      refetch(page);
    } catch (error) {
      // handled by interceptor
    }
  };

  const handleRename = async () => {
    if (!newTitle.trim() || newTitle.trim().length < 3) {
      toast.error('Title must be at least 3 characters');
      return;
    }
    try {
      await updateSubmission(selectedSubmission._id, { title: newTitle.trim() });
      toast.success('Submission renamed');
      setShowRenameModal(false);
      setSelectedSubmission(null);
      setNewTitle('');
      refetch(page);
    } catch (error) {
      // handled by interceptor
    }
  };

  const openRenameModal = (submission) => {
    setSelectedSubmission(submission);
    setNewTitle(submission.title);
    setShowRenameModal(true);
    setDropdownOpen(null);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (submissions.length === 0)
    return <EmptyState message="No submissions yet. Create your first one!" actionText="New Submission" onAction={() => window.location.href = '/submissions/new'} />;

  return (
    <>
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Readability</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Clarity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((sub) => (
              <tr key={sub._id} className="border-t">
                <td className="px-6 py-4">{sub.title}</td>
                <td className="px-6 py-4">{sub.category}</td>
                <td className="px-6 py-4">{new Date(sub.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4">{sub.feedback?.readabilityScore ?? '—'}</td>
                <td className="px-6 py-4">{sub.feedback?.clarityScore ?? '—'}</td>
                <td className="px-6 py-4 relative">
                  <Link to={`/submissions/${sub._id}`} className="text-blue-600 hover:underline mr-2">
                    View
                  </Link>
                  <button
                    onClick={() => setDropdownOpen(dropdownOpen === sub._id ? null : sub._id)}
                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    ⋮
                  </button>
                  {dropdownOpen === sub._id && (
                    <div className="absolute right-0 mt-2 w-36 bg-white rounded shadow-lg border z-10">
                      <button
                        onClick={() => openRenameModal(sub)}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        Rename
                      </button>
                      <button
                        onClick={() => handleDelete(sub._id)}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {totalPages > 1 && (
          <div className="p-4 flex justify-between items-center">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Rename Modal */}
      {showRenameModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Rename Submission</h2>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-4"
              placeholder="Enter new title"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowRenameModal(false);
                  setSelectedSubmission(null);
                  setNewTitle('');
                }}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleRename}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SubmissionList;