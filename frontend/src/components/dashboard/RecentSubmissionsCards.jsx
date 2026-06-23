import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSubmissions } from '../../api/submissions.api';
import { FileText, Clock, ArrowRight } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';

const RecentSubmissionsCards = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const response = await getSubmissions(1, 6); // fetch 6 most recent
        setSubmissions(response.data || []);
      } catch (error) {
        // handled by interceptor
      } finally {
        setLoading(false);
      }
    };
    fetchRecent();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="max-w-md mx-auto">
        <EmptyState
          message="No submissions yet. Start by creating your first one!"
          actionText="Create Submission"
          onAction={() => window.location.href = '/submissions/new'}
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header with subtle line */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-text-light flex items-center">
          <span className="inline-block w-1 h-6 bg-accent rounded-full mr-3"></span>
          Recent Submissions
        </h2>
        <Link
          to="/submissions" // if you have a full list page; if not, you can link to dashboard
          className="text-sm text-accent hover:text-accent-dark flex items-center transition"
        >
          View All <ArrowRight className="h-4 w-4 ml-1" />
        </Link>
      </div>

      {/* Cards grid – centered */}
      <div className="flex flex-wrap justify-center gap-5">
        {submissions.map((sub) => {
          // Pick a subtle color for the category dot
          const categoryColors = {
            Marketing: 'bg-accent',
            Technical: 'bg-primary',
            General: 'bg-success',
          };
          const dotColor = categoryColors[sub.category] || 'bg-primary/30';

          return (
            <Link
              key={sub._id}
              to={`/submissions/${sub._id}`}
              className="group w-full sm:w-[calc(50%-1rem)] md:w-[calc(33.33%-1rem)] lg:w-[calc(25%-1rem)] min-w-[200px] max-w-[280px]"
            >
              <div className="bg-secondary rounded-xl shadow-sm border border-primary/10 p-5 hover:shadow-md hover:border-primary/20 transition-all duration-200 h-full flex flex-col justify-between">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <FileText className="h-5 w-5 text-primary/60 group-hover:text-accent transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-text font-medium text-sm truncate group-hover:text-primary transition-colors">
                      {sub.title}
                    </p>
                    <div className="flex items-center mt-1.5 space-x-2">
                      <span className={`inline-block w-2 h-2 rounded-full ${dotColor}`}></span>
                      <span className="text-xs text-text-muted">{sub.category}</span>
                      <span className="text-text-muted/30">•</span>
                      <span className="text-xs text-text-muted flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(sub.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Optional subtle arrow on hover */}
                <div className="flex justify-end mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs text-accent">View →</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default RecentSubmissionsCards;