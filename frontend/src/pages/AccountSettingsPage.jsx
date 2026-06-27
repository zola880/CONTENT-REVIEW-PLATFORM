import { useAuth } from '../contexts/AuthContext';
import { deleteAllSubmissions } from '../api/submissions.api';
import { toast } from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { Trash2 } from 'lucide-react';

const AccountSettingsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAll = async () => {
    if (!window.confirm('⚠️ Are you sure you want to delete ALL your submissions? This action cannot be undone.')) {
      return;
    }
    setIsDeleting(true);
    try {
      await deleteAllSubmissions();
      toast.success('All submissions deleted');
      navigate('/');
    } catch (error) {
      // handled by interceptor
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-text tracking-tight">Account Settings</h1>
        <p className="text-text-muted text-sm mt-1">Manage your profile and data</p>
      </div>

      {/* Profile Card */}
      <div className="bg-secondary rounded-xl shadow-sm border border-primary/5 p-6 md:p-8 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-12 w-12 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <p className="text-text font-medium">{user?.name}</p>
            <p className="text-text-muted text-sm">{user?.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-text-muted uppercase tracking-wider">Full Name</label>
            <p className="mt-1 text-text">{user?.name}</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-text-muted uppercase tracking-wider">Email</label>
            <p className="mt-1 text-text">{user?.email}</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-text-muted uppercase tracking-wider">Member Since</label>
            <p className="mt-1 text-text">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
            </p>
          </div>
          <div>
            <label className="block text-xs font-medium text-text-muted uppercase tracking-wider">Total Submissions</label>
            <p className="mt-1 text-text">—</p>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-secondary rounded-xl shadow-sm border border-error/20 p-6 md:p-8">
        <div className="flex items-center gap-2 mb-2">
          <Trash2 className="h-4 w-4 text-error" strokeWidth={1.5} />
          <h3 className="text-sm font-medium text-error">Danger Zone</h3>
        </div>
        <p className="text-sm text-text-muted mb-4">
          Permanently delete all your submissions and associated feedback. This action <strong>cannot</strong> be undone.
        </p>
        <button
          onClick={handleDeleteAll}
          disabled={isDeleting}
          className="inline-flex items-center px-4 py-2 bg-error text-white text-sm font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-error transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDeleting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 100 8v4a8 8 0 01-8-8z" />
              </svg>
              Deleting...
            </>
          ) : (
            'Delete All Submissions'
          )}
        </button>
      </div>
    </div>
  );
};

export default AccountSettingsPage;