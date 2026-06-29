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
  Search,
  FolderOpen,
  Box,
  Code,
  MoreHorizontal,
  MessageSquare,
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

  const libraryItems = [
    { name: 'Search chats', icon: Search },
    { name: 'Library', icon: FolderOpen },
    { name: 'Projects', icon: Box },
    { name: 'Apps', icon: Code },
    { name: 'Codex', icon: MoreHorizontal },
  ];

  return (
    <>
      <div className="flex flex-col h-full bg-gray-900 text-gray-300 w-full">
        {/* Logo */}
        <div className="flex items-center px-4 h-14 border-b border-gray-800/80">
          <Link to="/" className="flex items-center space-x-2.5">
            <MessageSquare className="h-5 w-5 text-indigo-400" strokeWidth={1.5} />
            <span className="text-sm font-semibold text-white tracking-tight">Content Review</span>
          </Link>
        </div>

        {/* Search */}
        <div className="px-3 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" strokeWidth={1.5} />
            <input
              type="text"
              placeholder="Search chats..."
              className="w-full pl-9 pr-3 py-2 text-sm bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>
        </div>

        {/* Quick Action */}
        <div className="px-3 pb-2">
          <button
            onClick={() => navigate('/submissions/new')}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition shadow-sm hover:shadow"
          >
            <Plus className="h-4 w-4" strokeWidth={1.5} />
            New Submission
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-3 py-2 space-y-0.5 border-t border-gray-800/80">
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
                `flex items-center px-3 py-2 text-sm font-medium rounded-xl transition-all duration-150 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`
              }
            >
              <item.icon className="h-4 w-4 mr-3" strokeWidth={1.5} />
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Library */}
        <div className="px-3 py-2 border-t border-gray-800/80">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 pb-1">Library</h3>
          <div className="space-y-0.5">
            {libraryItems.map((item) => (
              <button
                key={item.name}
                className="w-full flex items-center gap-3 px-3 py-1.5 text-sm text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-xl transition-colors"
              >
                <item.icon className="h-4 w-4" strokeWidth={1.5} />
                {item.name}
              </button>
            ))}
          </div>
        </div>

        {/* Recents */}
        <div className="flex-1 overflow-y-auto px-3 py-2 border-t border-gray-800/80">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 pb-1">Recents</h3>
          <div className="space-y-0.5 mt-1">
            {loading ? (
              <div className="space-y-1.5">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-8 bg-gray-800/30 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : submissions.length === 0 ? (
              <p className="text-sm text-gray-500 italic px-2 py-1">No submissions yet</p>
            ) : (
              submissions.map((sub) => (
                <div key={sub._id} className="relative group">
                  <div className="flex items-center justify-between px-2 py-1.5 rounded-xl hover:bg-gray-800/50 transition-colors">
                    <Link
                      to={`/submissions/${sub._id}`}
                      onClick={() => {
                        if (closeMobile) closeMobile();
                        setDropdownOpen(null);
                        setDropdownEl(null);
                      }}
                      className="flex-1 text-sm text-gray-300 truncate"
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
                      className="text-gray-600 hover:text-gray-400 focus:outline-none ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreVertical className="h-3.5 w-3.5" strokeWidth={1.5} />
                    </button>
                  </div>
                  {dropdownOpen === sub._id && (
                    <div
                      ref={(el) => setDropdownEl(el)}
                      className="absolute right-0 top-full mt-0.5 w-40 rounded-xl shadow-lg bg-gray-800 border border-gray-700/80 z-10 py-1"
                    >
                      <button
                        onClick={() => openRenameModal(sub)}
                        className="flex items-center w-full px-3 py-1.5 text-sm text-gray-300 hover:bg-gray-700/50 transition-colors"
                      >
                        <Pencil className="h-3.5 w-3.5 mr-2" strokeWidth={1.5} />
                        Rename
                      </button>
                      <button
                        onClick={() => handleDelete(sub._id)}
                        className="flex items-center w-full px-3 py-1.5 text-sm text-red-400 hover:bg-gray-700/50 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-2" strokeWidth={1.5} />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* User */}
        <div className="border-t border-gray-800/80 px-3 py-3">
          <Link
            to="/account"
            onClick={() => {
              if (closeMobile) closeMobile();
              setDropdownOpen(null);
              setDropdownEl(null);
            }}
            className="flex items-center gap-3 px-2 py-1.5 rounded-xl hover:bg-gray-800/50 transition-colors"
          >
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-semibold shadow-sm">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-500">Free</p>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                handleLogout();
              }}
              className="text-gray-500 hover:text-gray-300 transition-colors p-1"
            >
              <LogOut className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </Link>
        </div>
      </div>

      {/* Rename Modal */}
      {renameModalOpen && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Rename Submission</h2>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition shadow-sm"
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
                className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition shadow-sm"
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