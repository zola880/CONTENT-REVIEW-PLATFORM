import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSubmissions } from '../../api/submissions.api';
import { FileText, Clock, ArrowRight, Sparkles } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';

const RecentSubmissionsCards = () => {
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const response = await getSubmissions(1, 1); // fetch only the most recent
        const data = response.data || [];
        setSubmission(data.length > 0 ? data[0] : null);
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
      <div className="flex justify-center items-center py-16">
        <LoadingSpinner />
      </div>
    );
  }

  if (!submission) {
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

  // Category color mapping for the accent dot
  const categoryColors = {
    Marketing: 'bg-accent',
    Technical: 'bg-primary',
    General: 'bg-success',
  };
  const dotColor = categoryColors[submission.category] || 'bg-primary/30';

  // Format date
  const formattedDate = new Date(submission.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-text-light flex items-center">
          <span className="inline-block w-1 h-6 bg-accent rounded-full mr-3"></span>
          Latest Submission
        </h2>
        <Link
          to="/submissions" // if you have a full list page
          className="text-sm text-accent hover:text-accent-dark flex items-center transition"
        >
          View All <ArrowRight className="h-4 w-4 ml-1" />
        </Link>
      </div>

      {/* Single Card – Centered */}
      <Link
        to={`/submissions/${submission._id}`}
        className="block group"
      >
        <div className="bg-secondary rounded-2xl shadow-sm border border-primary/10 p-8 hover:shadow-lg hover:border-primary/20 transition-all duration-300 max-w-2xl mx-auto">
          <div className="flex items-start space-x-4">
            {/* Icon with subtle background */}
            <div className="flex-shrink-0 p-3 bg-primary/5 rounded-xl group-hover:bg-accent/10 transition-colors">
              <FileText className="h-8 w-8 text-primary/70 group-hover:text-accent transition-colors" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-semibold text-text group-hover:text-primary transition-colors truncate">
                {submission.title}
              </h3>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-2">
                <span className="flex items-center text-sm text-text-muted">
                  <span className={`inline-block w-2.5 h-2.5 rounded-full ${dotColor} mr-2`}></span>
                  {submission.category}
                </span>
                <span className="text-text-muted/30">•</span>
                <span className="flex items-center text-sm text-text-muted">
                  <Clock className="h-4 w-4 mr-1.5" />
                  {formattedDate}
                </span>
              </div>

              {/* Hover indicator */}
              <div className="mt-4 flex items-center text-sm font-medium text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                View details
                <ArrowRight className="h-4 w-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Optional subtle badge */}
            <div className="flex-shrink-0 hidden sm:block">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent-dark">
                <Sparkles className="h-3 w-3 mr-1" />
                Latest
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default RecentSubmissionsCards;