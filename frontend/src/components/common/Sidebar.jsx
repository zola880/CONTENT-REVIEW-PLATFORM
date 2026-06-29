import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getSubmissions, deleteSubmission, updateSubmission } from '../../api/submissions.api';
import { toast } from 'react-hot-toast';
import {
  Home,
  Plus,
  LogOut,
  MoreVertical,
  Pencil,
  Trash2,
  FileText,
} from 'lucide-react';

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
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'New Submission', href: '/submissions/new', icon: Plus },
  ];

  return (
    <>
      <div className="flex flex-col h-full bg-white border-r border-gray-200/60 w-64">
        {/* Logo - Clean, centered */}
        <div className="flex items-center h-16 px-6 border-b border-gray-200/60">
          <Link to="/" className="flex items-center space-x-2.5">
            <FileText className="h-5 w-5 text-indigo-600" strokeWidth={1.5} />
            <span className="text-base font-semibold text-gray-800 tracking-tight">Content Review</span>
          </Link>
        </div>

        {/* Navigation - Clean, minimal */}
        <nav className="px-3 py-4 space-y-0.5">
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
                `flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-150 ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <item.icon className="h-4.5 w-4.5 mr-3" strokeWidth={1.5} />
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Recent Submissions - Clean list */}
        <div className="flex-1 overflow-y-auto px-3 py-2 border-t border-gray-200/60">
          <div className="flex items-center justify-between px-1 mb-2">
            <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">Recent</h3>
            <Link
              to="/"
              onClick={() => {
                if (closeMobile) closeMobile();
                setDropdownOpen(null);
                setDropdownEl(null);
              }}
              className="text-xs text-indigo-600 hover:text-indigo-700 transition"
            >
              View All
            </Link>
          </div>

          {loading ? (
            <div className="space-y-1.5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-9 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : submissions.length === 0 ? (
            <p className="text-sm text-gray-400 italic px-1">No submissions yet</p>
          ) : (
            <ul className="space-y-0.5">
              {submissions.map((sub) => (
                <li key={sub._id} className="relative">
                  <div className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50 transition-all duration-150 group">
                    <Link
                      to={`/submissions/${sub._id}`}
                      onClick={() => {
                        if (closeMobile) closeMobile();
                        setDropdownOpen(null);
                        setDropdownEl(null);
                      }}
                      className="flex-1 text-sm text-gray-700 truncate"
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
                      className="text-gray-400 hover:text-gray-600 focus:outline-none ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreVertical className="h-4 w-4" strokeWidth={1.5} />
                    </button>
                  </div>
                  {dropdownOpen === sub._id && (
                    <div
                      ref={(el) => setDropdownEl(el)}
                      className="absolute right-0 top-full mt-1 w-40 rounded-lg shadow-lg bg-white ring-1 ring-gray-200 z-10 py-1"
                    >
                      <button
                        onClick={() => openRenameModal(sub)}
                        className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Pencil className="h-4 w-4 mr-2" strokeWidth={1.5} />
                        Rename
                      </button>
                      <button
                        onClick={() => handleDelete(sub._id)}
                        className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-gray-50 transition-colors"
                      >
                        <Trash2 className="h-4 w-4 mr-2" strokeWidth={1.5} />
                        Delete
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* User & Logout - Clean profile section */}
        <div className="border-t border-gray-200/60 px-4 py-4">
          <Link
            to="/account"
            onClick={() => {
              if (closeMobile) closeMobile();
              setDropdownOpen(null);
              setDropdownEl(null);
            }}
            className="flex items-center space-x-3 px-2 py-2 rounded-lg hover:bg-gray-50 transition-all duration-150"
          >
            <div className="flex-shrink-0">
              <div className="h-9 w-9 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-semibold shadow-sm">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email || 'user@example.com'}</p>
            </div>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center w-full mt-1 px-2 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-150"
          >
            <LogOut className="h-4 w-4 mr-3" strokeWidth={1.5} />
            Sign out
          </button>
        </div>
      </div>

      {/* Rename Modal - Clean, minimal */}
      {renameModalOpen && (
        <div className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Rename Submission</h2>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              placeholder="Enter new title"
            />
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => {
                  setRenameModalOpen(false);
                  setSelectedSubmission(null);
                  setNewTitle('');
                }}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleRename}
                className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition shadow-sm"
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