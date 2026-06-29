import { useState } from 'react';
import { Menu, X, Search, Bell, Settings } from 'lucide-react';
import Sidebar from './Sidebar';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-20 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-30 w-64 bg-gray-900 text-white shadow-2xl transform transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0 md:flex md:flex-col
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <Sidebar closeMobile={closeSidebar} />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header – premium glassmorphism */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/60 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-10">
          {/* Left: mobile menu + logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="md:hidden text-gray-500 hover:text-gray-700 transition"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <Link to="/" className="md:hidden text-lg font-semibold text-gray-900">
              Content Review
            </Link>
          </div>

          {/* Center: search */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" strokeWidth={1.5} />
              <input
                type="text"
                placeholder="Search submissions..."
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition shadow-sm"
              />
            </div>
          </div>

          {/* Right: notifications, settings, user */}
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition">
              <Bell className="h-5 w-5" strokeWidth={1.5} />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition">
              <Settings className="h-5 w-5" strokeWidth={1.5} />
            </button>
            <div className="h-6 w-px bg-gray-200 mx-1" />
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-medium shadow-sm">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="hidden sm:inline text-sm font-medium text-gray-700">
                {user?.name?.split(' ')[0] || 'User'}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;