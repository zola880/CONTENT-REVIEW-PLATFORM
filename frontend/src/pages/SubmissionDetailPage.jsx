import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getSubmissionById, regenerateFeedback } from '../api/submissions.api';
import FeedbackDisplay from '../components/submissions/FeedbackDisplay';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { ArrowLeft, FileText, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';

const SubmissionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [regenerating, setRegenerating] = useState(false);

  const fetchSubmission = async () => {
    setLoading(true);
    try {
      const response = await getSubmissionById(id);
      setSubmission(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmission();
  }, [id]);

  const handleRegenerate = async () => {
    setRegenerating(true);
    try {
      await regenerateFeedback(id);
      toast.success('Feedback regenerated');
      await fetchSubmission();
    } catch (error) {
      // handled by interceptor
    } finally {
      setRegenerating(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!submission) return <ErrorMessage message="Submission not found" />;

  const formattedDate = new Date(submission.createdAt).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="group inline-flex items-center text-sm text-text-muted hover:text-primary transition-colors duration-200 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1 group-hover:-translate-x-0.5 transition-transform" strokeWidth={1.5} />
        Back to Dashboard
      </button>

      {/* Title Card */}
      <div className="bg-secondary rounded-xl shadow-sm border border-primary/5 p-6 md:p-8 mb-6">
        <h1 className="text-2xl font-semibold text-text tracking-tight break-words">
          {submission.title}
        </h1>
        <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-text-muted">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent-dark">
            {submission.category}
          </span>
          <span className="text-text-muted/20">•</span>
          <span>{formattedDate}</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-secondary rounded-xl shadow-sm border border-primary/5 p-6 md:p-8 mb-6">
        <h2 className="text-sm font-medium text-text-muted uppercase tracking-wider mb-4">
          Content
        </h2>
        <div className="bg-primary/5 rounded-lg p-4 md:p-6 border border-primary/5">
          <p className="text-text whitespace-pre-wrap leading-relaxed">
            {submission.content}
          </p>
        </div>
      </div>

      {/* Feedback Section */}
      <div className="bg-secondary rounded-xl shadow-sm border border-primary/5 p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h2 className="text-sm font-medium text-text-muted uppercase tracking-wider">
            Feedback & Suggestions
          </h2>
          <button
            onClick={handleRegenerate}
            disabled={regenerating}
            className="inline-flex items-center px-3.5 py-1.5 text-sm font-medium text-primary bg-accent/10 hover:bg-accent/20 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {regenerating ? (
              <>
                <RefreshCw className="animate-spin h-3.5 w-3.5 mr-1.5" strokeWidth={1.5} />
                Regenerating...
              </>
            ) : (
              <>
                <RefreshCw className="h-3.5 w-3.5 mr-1.5" strokeWidth={1.5} />
                Regenerate
              </>
            )}
          </button>
        </div>
        <FeedbackDisplay feedback={submission.feedback} />
      </div>
    </div>
  );
};

export default SubmissionDetailPage;