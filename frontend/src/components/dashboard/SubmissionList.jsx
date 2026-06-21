import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSubmissions } from '../../hooks/useSubmissions';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';
import ErrorMessage from '../common/ErrorMessage';
import { deleteSubmission, updateSubmission } from '../../api/submissions.api';
import { toast } from 'react-hot-toast';
import { 
  EllipsisVerticalIcon, 
  PencilIcon, 
  TrashIcon 
} from '@heroicons/react/24/outline';

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
      <div className="bg-secondary rounded-xl shadow overflow-hidden border border-primary/10">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-primary/10">
            <thead className="bg-primary/5">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Readability</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Clarity</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-text-light uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-secondary divide-y divide-primary/10">
              {submissions.map((sub) => (
                <tr key={sub._id} className="hover:bg-primary/5 transition duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text">{sub.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-accent/20 text-accent-dark">
                      {sub.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted">
                    {new Date(sub.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted">
                    {sub.feedback?.readabilityScore ?? '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted">
                    {sub.feedback?.clarityScore ?? '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <Link
                        to={`/submissions/${sub._id}`}
                        className="text-accent hover:text-accent-dark"
                      >
                        View
                      </Link>
                      <div className="relative">
                        <button
                          onClick={() => setDropdownOpen(dropdownOpen === sub._id ? null : sub._id)}
                          className="text-text-muted hover:text-text focus:outline-none"
                        >
                          <EllipsisVerticalIcon className="h-5 w-5" />
                        </button>
                        {dropdownOpen === sub._id && (
                          <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-secondary ring-1 ring-primary/10 z-10">
                            <div className="py-1">
                              <button
                                onClick={() => openRenameModal(sub)}
                                className="flex items-center w-full px-4 py-2 text-sm text-text hover:bg-primary/5"
                              >
                                <PencilIcon className="h-4 w-4 mr-2" />
                                Rename
                              </button>
                              <button
                                onClick={() => handleDelete(sub._id)}
                                className="flex items-center w-full px-4 py-2 text-sm text-error hover:bg-primary/5"
                              >
                                <TrashIcon className="h-4 w-4 mr-2" />
                                Delete
                              </button>
                            </div>
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
          <div className="bg-primary/5 px-6 py-3 flex items-center justify-between border-t border-primary/10">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-primary/20 rounded-md text-sm font-medium text-text bg-secondary hover:bg-primary/5 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-text-muted">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="px-4 py-2 border border-primary/20 rounded-md text-sm font-medium text-text bg-secondary hover:bg-primary/5 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Rename Modal */}
      {showRenameModal && (
        <div className="fixed inset-0 bg-primary/50 flex items-center justify-center z-20">
          <div className="bg-secondary rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-text mb-4">Rename Submission</h2>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full border border-primary/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-secondary text-text"
              placeholder="Enter new title"
            />
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowRenameModal(false);
                  setSelectedSubmission(null);
                  setNewTitle('');
                }}
                className="px-4 py-2 border border-primary/20 rounded-lg text-sm font-medium text-text hover:bg-primary/5"
              >
                Cancel
              </button>
              <button
                onClick={handleRename}
                className="px-4 py-2 bg-primary rounded-lg text-sm font-medium text-white hover:bg-primary-light"
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