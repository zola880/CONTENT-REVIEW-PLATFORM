import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getSubmissionById, regenerateFeedback } from '../api/submissions.api';
import FeedbackDisplay from '../components/submissions/FeedbackDisplay';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { ArrowLeft, FileText, MessageCircle, RefreshCw } from 'lucide-react';
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="group inline-flex items-center text-sm text-text-muted hover:text-primary transition-colors duration-200 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1 group-hover:-translate-x-0.5 transition-transform" />
        Back to Dashboard
      </button>

      {/* Header Card */}
      <div className="bg-secondary rounded-2xl shadow-md border border-primary/10 p-6 md:p-8 mb-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold text-text break-words">
              {submission.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-text-muted">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent-dark">
                {submission.category}
              </span>
              <span className="flex items-center">
                <span className="w-1 h-1 bg-text-muted/30 rounded-full mx-1.5"></span>
                Created {formattedDate}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-secondary rounded-2xl shadow-md border border-primary/10 p-6 md:p-8 mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <FileText className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-text">Content</h2>
        </div>
        <div className="bg-primary/5 rounded-xl p-4 md:p-6 border border-primary/10">
          <p className="text-text whitespace-pre-wrap leading-relaxed">
            {submission.content}
          </p>
        </div>
      </div>

      {/* Feedback Section */}
      <div className="bg-secondary rounded-2xl shadow-md border border-primary/10 p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5 text-accent" />
            <h2 className="text-lg font-semibold text-text">Feedback & Suggestions</h2>
          </div>
          <button
            onClick={handleRegenerate}
            disabled={regenerating}
            className="inline-flex items-center px-4 py-2 bg-accent text-primary font-medium text-sm rounded-lg hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {regenerating ? (
              <>
                <RefreshCw className="animate-spin h-4 w-4 mr-1.5" />
                Regenerating...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-1.5" />
                Regenerate Feedback
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