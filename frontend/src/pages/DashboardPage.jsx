import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import SummaryCards from '../components/dashboard/SummaryCards';
import RecentSubmissionsCards from '../components/dashboard/RecentSubmissionsCards';
import { Plus } from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Welcome back, <span className="text-indigo-600">{user?.name?.split(' ')[0] || 'User'}</span>
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">Here's an overview of your content submissions</p>
        </div>
        <Link
          to="/submissions/new"
          className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] flex-shrink-0"
        >
          <Plus className="h-4 w-4 mr-2" strokeWidth={1.5} />
          New Submission
        </Link>
      </div>

      {/* Statistics Cards */}
      <SummaryCards />

      {/* Latest Submission */}
      <RecentSubmissionsCards />
    </div>
  );
};

export default DashboardPage;