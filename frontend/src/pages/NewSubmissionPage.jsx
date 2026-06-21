import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createSubmission, previewFeedback } from '../api/submissions.api';
import SubmissionForm from '../components/submissions/SubmissionForm';
import FeedbackDisplay from '../components/submissions/FeedbackDisplay';

const NewSubmissionPage = () => {
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);
  const [isPreviewing, setIsPreviewing] = useState(false);

  const handleSubmit = async (data) => {
    try {
      await createSubmission(data);
      navigate('/');
    } catch (error) {
      // handled by interceptor
    }
  };

  const handlePreview = async (data) => {
    setIsPreviewing(true);
    try {
      const response = await previewFeedback(data);
      setPreview(response.data.feedback);
    } catch (error) {
      // handled by interceptor
    }
    setIsPreviewing(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Submission</h1>
      <div className="bg-white p-6 rounded shadow">
        <SubmissionForm
          onSubmit={handleSubmit}
          onPreview={handlePreview}
          isPreviewing={isPreviewing}
        />
        {preview && (
          <div className="mt-6 border-t pt-4">
            <h2 className="text-lg font-semibold mb-2">AI Feedback Preview</h2>
            <FeedbackDisplay feedback={preview} />
          </div>
        )}
      </div>
    </div>
  );
};

export default NewSubmissionPage;