import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getSubmissionById, regenerateFeedback } from '../api/submissions.api';
import FeedbackDisplay from '../components/submissions/FeedbackDisplay';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

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
      await fetchSubmission(); // refresh
    } catch (error) {
      // handled by interceptor
    } finally {
      setRegenerating(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!submission) return <ErrorMessage message="Submission not found" />;

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate('/')}
        className="mb-4 text-blue-600 hover:underline"
      >
        ← Back to Dashboard
      </button>
      <div className="bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold">{submission.title}</h1>
        <div className="text-sm text-gray-500 mb-4">
          <span className="mr-4">Category: {submission.category}</span>
          <span>Created: {new Date(submission.createdAt).toLocaleString()}</span>
        </div>
        <div className="border-t pt-4">
          <h2 className="text-lg font-semibold mb-2">Content</h2>
          <p className="whitespace-pre-wrap">{submission.content}</p>
        </div>
        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Feedback</h2>
            <button
              onClick={handleRegenerate}
              disabled={regenerating}
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50 text-sm"
            >
              {regenerating ? 'Regenerating...' : 'Regenerate Feedback'}
            </button>
          </div>
          <FeedbackDisplay feedback={submission.feedback} />
        </div>
      </div>
    </div>
  );
};

export default SubmissionDetailPage;