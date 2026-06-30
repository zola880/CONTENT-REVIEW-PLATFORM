import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSubmissions } from '../../api/submissions.api';
import { FileText, Calendar, ArrowRight } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';

const RecentSubmissionsCards = () => {
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const response = await getSubmissions(1, 1);
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
      <div className="flex justify-center items-center py-12">
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

  const formattedDate = new Date(submission.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
        Latest Submission
      </h2>

      <Link to={`/submissions/${submission._id}`} className="block group">
        <div className="bg-white rounded-xl border border-gray-200/80 shadow-lg shadow-gray-200/50 p-6 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-200">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 mt-1">
              <div className="p-2 bg-[#0F766E]/10 rounded-xl group-hover:bg-[#0F766E]/20 transition-colors">
                <FileText className="h-5 w-5 text-[#0F766E]" strokeWidth={1.5} />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-[#1F2937] font-semibold group-hover:text-[#0F766E] transition-colors truncate">
                {submission.title}
              </h3>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-1.5 text-sm text-gray-500">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#0F766E]/10 text-[#0F766E]">
                  {submission.category}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" strokeWidth={1.5} />
                  {formattedDate}
                </span>
              </div>
              <div className="mt-3 flex items-center text-sm font-medium text-[#0F766E] opacity-0 group-hover:opacity-100 transition-opacity">
                View details
                <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform" strokeWidth={1.5} />
              </div>
            </div>

            <div className="flex-shrink-0">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#0F766E]/10 text-[#0F766E] border border-[#0F766E]/20">
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