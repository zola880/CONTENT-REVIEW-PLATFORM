import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import SummaryCards from '../components/dashboard/SummaryCards';
import RecentSubmissionsCards from '../components/dashboard/RecentSubmissionsCards';
import { Plus } from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-text tracking-tight">
          Welcome back, <span className="text-primary">{user?.name?.split(' ')[0] || 'User'}</span>
        </h1>
        <p className="text-text-muted text-sm mt-1">Here's an overview of your content submissions</p>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between mb-6">
        <div />
        <Link
          to="/submissions/new"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-light transition-all duration-200 shadow-sm hover:shadow"
        >
          <Plus className="h-4 w-4 mr-1.5" strokeWidth={1.5} />
          New Submission
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="mt-6">
        <SummaryCards />
      </div>

      {/* Recent Submissions */}
      <div className="mt-10">
        <RecentSubmissionsCards />
      </div>
    </>
  );
};

export default DashboardPage;