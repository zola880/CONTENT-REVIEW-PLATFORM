import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getSubmissions } from '../../api/submissions.api';
import {
  HomeIcon,
  PlusIcon,
  DocumentTextIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

const Sidebar = ({ closeMobile }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch recent submissions
  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const response = await getSubmissions(1, 8); // limit to 8
        setSubmissions(response.data || []);
      } catch (err) {
        // silently fail (interceptor shows toast)
      } finally {
        setLoading(false);
      }
    };
    fetchRecent();
  }, []);

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
            onClick={closeMobile}
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
            onClick={closeMobile}
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
              <li key={sub._id}>
                <Link
                  to={`/submissions/${sub._id}`}
                  onClick={closeMobile}
                  className="block px-3 py-2 rounded-lg hover:bg-white/10 transition duration-150"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/90 truncate">{sub.title}</span>
                    <span className="text-xs text-white/40">
                      {new Date(sub.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 mt-0.5">
                    <span className="text-xs text-white/40">{sub.category}</span>
                    <span className="text-white/20">•</span>
                    <span className="text-xs text-white/40">
                      R: {sub.feedback?.readabilityScore ?? '—'}
                    </span>
                    <span className="text-xs text-white/40">
                      C: {sub.feedback?.clarityScore ?? '—'}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Bottom Section – User & Logout */}
      <div className="border-t border-white/10 px-4 py-4">
        <div className="flex items-center space-x-3 mb-3">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-accent text-primary flex items-center justify-center font-bold text-lg">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-white/60 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-2 text-sm text-white/80 hover:bg-white/10 rounded-lg transition duration-150"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;