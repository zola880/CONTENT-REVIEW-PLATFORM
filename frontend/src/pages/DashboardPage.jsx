import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSubmissions } from '../hooks/useSubmissions';
import SummaryCards from '../components/dashboard/SummaryCards';
import { Plus, TrendingUp, BarChart3, Activity, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  const { submissions, loading } = useSubmissions(1, 5); // Fetch 5 most recent

  // Helper to format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Helper to get status badge
  const getStatusBadge = (sub) => {
    if (sub.feedback && sub.feedback.readabilityScore && sub.feedback.clarityScore) {
      return { label: 'Analyzed', color: 'bg-green-100 text-green-800' };
    }
    return { label: 'Pending', color: 'bg-amber-100 text-amber-800' };
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
            Welcome back, <span className="text-teal-600">{user?.name?.split(' ')[0] || 'User'}</span>
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">Here's an overview of your content submissions</p>
        </div>
        <Link
          to="/submissions/new"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-all duration-200 shadow-sm hover:shadow-md flex-shrink-0"
        >
          <Plus className="h-4 w-4 mr-1.5" strokeWidth={1.5} />
          New Submission
        </Link>
      </div>

      {/* Summary Cards */}
      <SummaryCards />

      {/* Analytics Row - Charts (placeholder) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-700">Submission Growth</h3>
            <TrendingUp className="h-4 w-4 text-gray-400" strokeWidth={1.5} />
          </div>
          <div className="h-48 flex items-center justify-center bg-gray-50/50 rounded-lg border border-gray-200/30">
            <span className="text-sm text-gray-400">Chart placeholder – Recharts coming soon</span>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-700">Readability Trend</h3>
            <BarChart3 className="h-4 w-4 text-gray-400" strokeWidth={1.5} />
          </div>
          <div className="h-48 flex items-center justify-center bg-gray-50/50 rounded-lg border border-gray-200/30">
            <span className="text-sm text-gray-400">Chart placeholder – Recharts coming soon</span>
          </div>
        </div>
      </div>

      {/* Recent Submissions Table & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table - takes 2/3 on large screens */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200/50 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200/60 flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-700">Recent Submissions</h3>
              <Link to="/" className="text-sm text-teal-600 hover:text-teal-700 transition">
                View All
              </Link>
            </div>
            {loading ? (
              <div className="p-6 space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : submissions.length === 0 ? (
              <div className="p-6 text-center text-gray-400 text-sm">No submissions yet</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50/80 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-3 text-left">Title</th>
                      <th className="px-6 py-3 text-left">Category</th>
                      <th className="px-6 py-3 text-left">Readability</th>
                      <th className="px-6 py-3 text-left">Clarity</th>
                      <th className="px-6 py-3 text-left">Date</th>
                      <th className="px-6 py-3 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {submissions.map((sub) => {
                      const status = getStatusBadge(sub);
                      return (
                        <tr
                          key={sub._id}
                          className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                          onClick={() => window.location.href = `/submissions/${sub._id}`}
                        >
                          <td className="px-6 py-3 font-medium text-gray-900 truncate max-w-[150px]">
                            {sub.title}
                          </td>
                          <td className="px-6 py-3 text-gray-600">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                              {sub.category}
                            </span>
                          </td>
                          <td className="px-6 py-3 text-gray-600">
                            {sub.feedback?.readabilityScore ?? '—'}
                          </td>
                          <td className="px-6 py-3 text-gray-600">
                            {sub.feedback?.clarityScore ?? '—'}
                          </td>
                          <td className="px-6 py-3 text-gray-500">
                            {formatDate(sub.createdAt)}
                          </td>
                          <td className="px-6 py-3">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                              {status.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Activity Feed - takes 1/3 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-700">Recent Activity</h3>
            <Activity className="h-4 w-4 text-gray-400" strokeWidth={1.5} />
          </div>
          <div className="space-y-4">
            {/* Mock activity items – replace with real data later */}
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <CheckCircle className="h-4 w-4 text-green-500" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-sm text-gray-700">New submission <span className="font-medium">"Product Launch"</span> analyzed</p>
                <p className="text-xs text-gray-400">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <Clock className="h-4 w-4 text-amber-500" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-sm text-gray-700">Feedback regenerated for <span className="font-medium">"Blog Draft"</span></p>
                <p className="text-xs text-gray-400">5 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <AlertCircle className="h-4 w-4 text-blue-500" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-sm text-gray-700">New user <span className="font-medium">@johndoe</span> registered</p>
                <p className="text-xs text-gray-400">1 day ago</p>
              </div>
            </div>
            <p className="text-xs text-gray-400 italic mt-2">Activity feed coming soon with real data</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;