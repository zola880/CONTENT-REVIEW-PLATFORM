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
    <div className="flex h-screen bg-secondary overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-primary/30 backdrop-blur-sm z-20 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-30 w-64 bg-secondary border-r border-primary/10 shadow-md transform transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0 md:flex md:flex-col
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <Sidebar closeMobile={closeSidebar} />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header – calm & sharp */}
        <header className="bg-secondary border-b border-primary/10 shadow-md px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-10">
          {/* Left: mobile menu + logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="md:hidden text-text-muted hover:text-text transition"
            >
              {sidebarOpen ? (
                <X className="h-5 w-5" strokeWidth={1.5} />
              ) : (
                <Menu className="h-5 w-5" strokeWidth={1.5} />
              )}
            </button>
            <Link to="/" className="md:hidden text-lg font-semibold text-text">
              Content Review
            </Link>
          </div>

          {/* Center: search */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted/40" strokeWidth={1.5} />
              <input
                type="text"
                placeholder="Search submissions..."
                className="w-full pl-9 pr-4 py-2 bg-secondary border border-primary/10 rounded-lg text-sm text-text placeholder:text-text-muted/40 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition shadow-sm focus:shadow-md"
              />
            </div>
          </div>

          {/* Right: notifications, settings, user */}
          <div className="flex items-center gap-2">
            <button className="p-2 text-text-muted/40 hover:text-text-muted rounded-lg hover:bg-primary/5 transition">
              <Bell className="h-5 w-5" strokeWidth={1.5} />
            </button>
            <button className="p-2 text-text-muted/40 hover:text-text-muted rounded-lg hover:bg-primary/5 transition">
              <Settings className="h-5 w-5" strokeWidth={1.5} />
            </button>
            <div className="h-6 w-px bg-primary/10 mx-1" />
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium shadow-sm">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="hidden sm:inline text-sm font-medium text-text">
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