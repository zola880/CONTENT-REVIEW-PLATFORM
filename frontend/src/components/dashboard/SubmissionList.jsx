import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSubmissions } from '../../hooks/useSubmissions';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';
import ErrorMessage from '../common/ErrorMessage';
import { deleteSubmission, updateSubmission } from '../../api/submissions.api';
import { toast } from 'react-hot-toast';
import { MoreVertical, Pencil, Trash2 } from 'lucide-react';

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
    } catch (error) {}
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
    } catch (error) {}
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
      <div className="bg-white rounded-xl border border-gray-200/80 shadow-lg shadow-gray-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50/50 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200/80">
              <tr>
                <th className="px-6 py-3 text-left">Title</th>
                <th className="px-6 py-3 text-left">Category</th>
                <th className="px-6 py-3 text-left">Readability</th>
                <th className="px-6 py-3 text-left">Clarity</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {submissions.map((sub) => (
                <tr
                  key={sub._id}
                  className="hover:bg-gray-50/80 transition-colors cursor-pointer"
                  onClick={() => window.location.href = `/submissions/${sub._id}`}
                >
                  <td className="px-6 py-4 font-medium text-[#1F2937] truncate max-w-[150px]">
                    {sub.title}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#0F766E]/10 text-[#0F766E]">
                      {sub.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {sub.feedback?.readabilityScore ?? '—'}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {sub.feedback?.clarityScore ?? '—'}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(sub.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Link
                        to={`/submissions/${sub._id}`}
                        className="text-[#0F766E] hover:text-[#115E59] font-medium"
                      >
                        View
                      </Link>
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDropdownOpen(dropdownOpen === sub._id ? null : sub._id);
                          }}
                          className="text-gray-400 hover:text-gray-600 focus:outline-none"
                        >
                          <MoreVertical className="h-4 w-4" strokeWidth={1.5} />
                        </button>
                        {dropdownOpen === sub._id && (
                          <div className="origin-top-right absolute right-0 mt-2 w-40 rounded-lg shadow-lg bg-white ring-1 ring-gray-200 z-10 py-1">
                            <button
                              onClick={() => openRenameModal(sub)}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              <Pencil className="h-4 w-4 mr-2" strokeWidth={1.5} />
                              Rename
                            </button>
                            <button
                              onClick={() => handleDelete(sub._id)}
                              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition-colors"
                            >
                              <Trash2 className="h-4 w-4 mr-2" strokeWidth={1.5} />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="border-t border-gray-200/80 px-6 py-4 flex items-center justify-between bg-gray-50/30">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200/80 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200/80 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Rename Modal */}
      {showRenameModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-[#1F2937] mb-4">Rename Submission</h2>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0F766E] focus:border-transparent bg-white text-[#1F2937] transition"
              placeholder="Enter new title"
            />
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowRenameModal(false);
                  setSelectedSubmission(null);
                  setNewTitle('');
                }}
                className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleRename}
                className="px-4 py-2 bg-[#0F766E] text-white text-sm font-medium rounded-lg hover:bg-[#115E59] transition shadow-sm"
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