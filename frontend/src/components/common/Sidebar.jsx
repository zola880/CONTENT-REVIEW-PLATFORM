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
  User,
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
      <div className="flex flex-col h-full bg-secondary border-r border-primary/10">
        {/* Logo */}
        <div className="flex items-center justify-center h-16 border-b border-primary/10">
          <Link to="/" className="flex items-center space-x-2">
            <FileText className="h-7 w-7 text-accent" strokeWidth={1.5} />
            <span className="text-lg font-semibold text-text tracking-tight">Content Review</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="px-3 py-4 space-y-0.5 border-b border-primary/10">
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
                `flex items-center px-3 py-2.5 text-sm rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-primary text-white font-medium shadow-sm'
                    : 'text-text-muted hover:bg-primary/5 hover:text-text'
                }`
              }
            >
              <item.icon className="h-4.5 w-4.5 mr-3" strokeWidth={1.5} />
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Recent Submissions */}
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <div className="flex items-center justify-between mb-2 px-1">
            <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              Recent
            </h3>
            <Link
              to="/"
              onClick={() => {
                if (closeMobile) closeMobile();
                setDropdownOpen(null);
                setDropdownEl(null);
              }}
              className="text-xs text-accent hover:text-accent-dark transition"
            >
              View All
            </Link>
          </div>

          {loading ? (
            <div className="space-y-1.5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-9 bg-primary/5 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : submissions.length === 0 ? (
            <p className="text-sm text-text-muted/60 italic px-1">No submissions yet</p>
          ) : (
            <ul className="space-y-0.5">
              {submissions.map((sub) => (
                <li key={sub._id} className="relative">
                  <div className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-primary/5 transition-all duration-150 group">
                    <Link
                      to={`/submissions/${sub._id}`}
                      onClick={() => {
                        if (closeMobile) closeMobile();
                        setDropdownOpen(null);
                        setDropdownEl(null);
                      }}
                      className="flex-1 text-sm text-text truncate"
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
                      className="text-text-muted/40 hover:text-text-muted focus:outline-none ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreVertical className="h-4 w-4" strokeWidth={1.5} />
                    </button>
                  </div>
                  {dropdownOpen === sub._id && (
                    <div
                      ref={(el) => setDropdownEl(el)}
                      className="absolute right-0 top-full mt-1 w-40 rounded-lg shadow-lg bg-secondary ring-1 ring-primary/10 z-10 py-1"
                    >
                      <button
                        onClick={() => openRenameModal(sub)}
                        className="flex items-center w-full px-4 py-2 text-sm text-text hover:bg-primary/5 transition-colors"
                      >
                        <Pencil className="h-4 w-4 mr-2" strokeWidth={1.5} />
                        Rename
                      </button>
                      <button
                        onClick={() => handleDelete(sub._id)}
                        className="flex items-center w-full px-4 py-2 text-sm text-error hover:bg-primary/5 transition-colors"
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

        {/* User & Logout */}
        <div className="border-t border-primary/10 px-3 py-4">
          <Link
            to="/account"
            onClick={() => {
              if (closeMobile) closeMobile();
              setDropdownOpen(null);
              setDropdownEl(null);
            }}
            className="flex items-center space-x-3 px-2 py-2 rounded-lg hover:bg-primary/5 transition-all duration-150"
          >
            <div className="flex-shrink-0">
              <div className="h-9 w-9 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text truncate">{user?.name}</p>
              <p className="text-xs text-text-muted truncate">{user?.email}</p>
            </div>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center w-full mt-1 px-2 py-2 text-sm text-text-muted hover:text-text hover:bg-primary/5 rounded-lg transition-all duration-150"
          >
            <LogOut className="h-4 w-4 mr-3" strokeWidth={1.5} />
            Sign out
          </button>
        </div>
      </div>

      {/* Rename Modal */}
      {renameModalOpen && (
        <div className="fixed inset-0 bg-primary/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-secondary rounded-2xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-semibold text-text mb-4">Rename Submission</h2>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full border border-primary/20 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-secondary text-text transition"
              placeholder="Enter new title"
            />
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => {
                  setRenameModalOpen(false);
                  setSelectedSubmission(null);
                  setNewTitle('');
                }}
                className="px-4 py-2 text-sm text-text-muted hover:text-text transition"
              >
                Cancel
              </button>
              <button
                onClick={handleRename}
                className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-light transition"
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