import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSubmissions } from '../hooks/useSubmissions';
import SummaryCards from '../components/dashboard/SummaryCards';
import { Plus, TrendingUp, BarChart3, Activity, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  const { submissions, loading } = useSubmissions(1, 5);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusBadge = (sub) => {
    if (sub.feedback && sub.feedback.readabilityScore && sub.feedback.clarityScore) {
      return { label: 'Analyzed', color: 'bg-success/10 text-success' };
    }
    return { label: 'Pending', color: 'bg-warning/10 text-warning' };
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-text tracking-tight">
            Welcome back, <span className="text-primary">{user?.name?.split(' ')[0] || 'User'}</span>
          </h1>
          <p className="text-text-muted text-sm mt-0.5">Here's an overview of your content submissions</p>
        </div>
        <Link
          to="/submissions/new"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-light transition-all duration-200 shadow-md hover:shadow-lg flex-shrink-0"
        >
          <Plus className="h-4 w-4 mr-1.5" strokeWidth={1.5} />
          New Submission
        </Link>
      </div>

      {/* Summary Cards */}
      <SummaryCards />

      {/* Analytics Row - Sharp Cards with Calm Colors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-secondary border border-primary/10 rounded-lg p-6 shadow-md transition-all duration-200 hover:shadow-lg hover:border-primary/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-text-light">Submission Growth</h3>
            <TrendingUp className="h-4 w-4 text-text-muted/40" strokeWidth={1.5} />
          </div>
          <div className="h-48 flex items-center justify-center bg-primary/5 rounded-lg border border-primary/10">
            <span className="text-sm text-text-muted/40">Chart placeholder – Recharts coming soon</span>
          </div>
        </div>
        <div className="bg-secondary border border-primary/10 rounded-lg p-6 shadow-md transition-all duration-200 hover:shadow-lg hover:border-primary/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-text-light">Readability Trend</h3>
            <BarChart3 className="h-4 w-4 text-text-muted/40" strokeWidth={1.5} />
          </div>
          <div className="h-48 flex items-center justify-center bg-primary/5 rounded-lg border border-primary/10">
            <span className="text-sm text-text-muted/40">Chart placeholder – Recharts coming soon</span>
          </div>
        </div>
      </div>

      {/* Recent Submissions Table & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table */}
        <div className="lg:col-span-2">
          <div className="bg-secondary border border-primary/10 rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-primary/20">
            <div className="px-6 py-4 border-b border-primary/10 flex items-center justify-between bg-primary/5">
              <h3 className="text-sm font-medium text-text-light">Recent Submissions</h3>
              <Link to="/" className="text-sm text-accent hover:text-accent-dark transition font-medium">
                View All →
              </Link>
            </div>
            {loading ? (
              <div className="p-6 space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 bg-primary/5 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : submissions.length === 0 ? (
              <div className="p-8 text-center text-text-muted/60 text-sm">No submissions yet</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-primary/5 text-xs font-medium text-text-muted uppercase tracking-wider border-b border-primary/10">
                    <tr>
                      <th className="px-6 py-3 text-left">Title</th>
                      <th className="px-6 py-3 text-left">Category</th>
                      <th className="px-6 py-3 text-left">Readability</th>
                      <th className="px-6 py-3 text-left">Clarity</th>
                      <th className="px-6 py-3 text-left">Date</th>
                      <th className="px-6 py-3 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-primary/5">
                    {submissions.map((sub) => {
                      const status = getStatusBadge(sub);
                      return (
                        <tr
                          key={sub._id}
                          className="hover:bg-primary/5 transition-colors cursor-pointer"
                          onClick={() => window.location.href = `/submissions/${sub._id}`}
                        >
                          <td className="px-6 py-3 font-medium text-text truncate max-w-[150px]">
                            {sub.title}
                          </td>
                          <td className="px-6 py-3 text-text-muted">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/5 text-text-muted">
                              {sub.category}
                            </span>
                          </td>
                          <td className="px-6 py-3 text-text-muted">
                            {sub.feedback?.readabilityScore ?? '—'}
                          </td>
                          <td className="px-6 py-3 text-text-muted">
                            {sub.feedback?.clarityScore ?? '—'}
                          </td>
                          <td className="px-6 py-3 text-text-muted/60">
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

        {/* Activity Feed */}
        <div className="bg-secondary border border-primary/10 rounded-lg p-6 shadow-md transition-all duration-200 hover:shadow-lg hover:border-primary/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-text-light">Recent Activity</h3>
            <Activity className="h-4 w-4 text-text-muted/40" strokeWidth={1.5} />
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <CheckCircle className="h-4 w-4 text-success" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-sm text-text">New submission <span className="font-medium">"Product Launch"</span> analyzed</p>
                <p className="text-xs text-text-muted/60">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <Clock className="h-4 w-4 text-warning" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-sm text-text">Feedback regenerated for <span className="font-medium">"Blog Draft"</span></p>
                <p className="text-xs text-text-muted/60">5 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <AlertCircle className="h-4 w-4 text-primary" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-sm text-text">New user <span className="font-medium">@johndoe</span> registered</p>
                <p className="text-xs text-text-muted/60">1 day ago</p>
              </div>
            </div>
            <p className="text-xs text-text-muted/40 italic mt-3 pt-2 border-t border-primary/5">Activity feed coming soon with real data</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;