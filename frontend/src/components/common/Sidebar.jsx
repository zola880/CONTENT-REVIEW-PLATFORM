import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getSubmissions, deleteSubmission, updateSubmission } from '../../api/submissions.api';
import { toast } from 'react-hot-toast';
import {
  HomeIcon,
  PlusIcon,
  ArrowRightOnRectangleIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

const Sidebar = ({ closeMobile }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [dropdownEl, setDropdownEl] = useState(null);
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [newTitle, setNewTitle] = useState('');

  const fetchRecent = async () => {
    setLoading(true);
    try {
      const response = await getSubmissions(1, 8);
      setSubmissions(response.data || []);
    } catch (err) {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecent();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownEl && !dropdownEl.contains(event.target)) {
        setDropdownOpen(null);
        setDropdownEl(null);
      }
    };
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setDropdownOpen(null);
        setDropdownEl(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [dropdownEl]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this submission?')) return;
    try {
      await deleteSubmission(id);
      toast.success('Submission deleted');
      setDropdownOpen(null);
      setDropdownEl(null);
      fetchRecent();
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
      setRenameModalOpen(false);
      setSelectedSubmission(null);
      setNewTitle('');
      setDropdownOpen(null);
      setDropdownEl(null);
      fetchRecent();
    } catch (error) {}
  };

  const openRenameModal = (sub) => {
    setSelectedSubmission(sub);
    setNewTitle(sub.title);
    setRenameModalOpen(true);
    setDropdownOpen(null);
    setDropdownEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    if (closeMobile) closeMobile();
  };

  const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'New Submission', href: '/submissions/new', icon: PlusIcon },
  ];

  return (
    <>
      <div className="flex flex-col h-full bg-primary text-white">
        {/* Logo */}
        <div className="flex items-center justify-center h-16 border-b border-white/10">
          <Link to="/" className="flex items-center space-x-2">
            <svg className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-xl font-bold">Content Review</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="px-4 py-4 space-y-1 border-b border-white/10">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={() => {
                if (closeMobile) closeMobile();
                setDropdownOpen(null);
                setDropdownEl(null);
              }}
              className={({ isActive }) =>
                `flex items-center px-4 py-2.5 text-sm rounded-lg transition duration-150 ${
                  isActive
                    ? 'bg-accent text-primary font-medium'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Recent Submissions List */}
        <div className="flex-1 overflow-y-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider">Recent Submissions</h3>
            <Link
              to="/"
              onClick={() => {
                if (closeMobile) closeMobile();
                setDropdownOpen(null);
                setDropdownEl(null);
              }}
              className="text-xs text-accent hover:text-accent-light transition"
            >
              View All
            </Link>
          </div>

          {loading ? (
            <div className="space-y-2 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-8 bg-white/10 rounded"></div>
              ))}
            </div>
          ) : submissions.length === 0 ? (
            <p className="text-sm text-white/40 italic">No submissions yet</p>
          ) : (
            <ul className="space-y-1">
              {submissions.map((sub) => (
                <li key={sub._id} className="relative group">
                  <div className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/10 transition duration-150">
                    <Link
                      to={`/submissions/${sub._id}`}
                      onClick={() => {
                        if (closeMobile) closeMobile();
                        setDropdownOpen(null);
                        setDropdownEl(null);
                      }}
                      className="flex-1 text-sm text-white/90 truncate"
                    >
                      {sub.title}
                    </Link>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const newState = dropdownOpen === sub._id ? null : sub._id;
                        setDropdownOpen(newState);
                        if (newState === null) setDropdownEl(null);
                      }}
                      className="text-white/40 hover:text-white focus:outline-none ml-2"
                    >
                      <EllipsisVerticalIcon className="h-5 w-5" />
                    </button>
                  </div>
                  {dropdownOpen === sub._id && (
                    <div
                      ref={(el) => setDropdownEl(el)}
                      className="absolute right-0 top-full mt-1 w-40 rounded-md shadow-lg bg-secondary ring-1 ring-primary/10 z-10"
                    >
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
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Bottom Section – User & Logout – now with Link to /account */}
        <div className="border-t border-white/10 px-4 py-4">
          <Link
            to="/account"
            onClick={() => {
              if (closeMobile) closeMobile();
              setDropdownOpen(null);
              setDropdownEl(null);
            }}
            className="flex items-center space-x-3 mb-3 hover:bg-white/10 rounded-lg p-2 transition duration-150"
          >
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-accent text-primary flex items-center justify-center font-bold text-lg">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-white/60 truncate">{user?.email}</p>
            </div>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm text-white/80 hover:bg-white/10 rounded-lg transition duration-150"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
            Logout
          </button>
        </div>
      </div>

      {/* Rename Modal */}
      {renameModalOpen && (
        <div className="fixed inset-0 bg-primary/50 flex items-center justify-center z-50">
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
                  setRenameModalOpen(false);
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

export default Sidebar;