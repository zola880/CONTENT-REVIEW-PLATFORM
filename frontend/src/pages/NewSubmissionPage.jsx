import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createSubmission, previewFeedback } from '../api/submissions.api';
import SubmissionForm from '../components/submissions/SubmissionForm';
import FeedbackDisplay from '../components/submissions/FeedbackDisplay';
import { toast } from 'react-hot-toast';
import { FilePlus } from 'lucide-react';

const NewSubmissionPage = () => {
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleSaveAndNew = async (data, resetForm, file) => {
    setIsSubmitting(true);
    try {
      let payload;
      if (file) {
        payload = new FormData();
        payload.append('title', data.title);
        payload.append('category', data.category);
        payload.append('file', file);
        if (data.content) {
          payload.append('content', data.content);
        }
      } else {
        payload = data;
      }

      await createSubmission(payload);
      toast.success('Submission saved! Ready for next entry.');
      resetForm();
      setPreview(null);
      setSelectedFile(null);
    } catch (error) {
      // handled by interceptor
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreview = async (data, file) => {
    setIsPreviewing(true);
    try {
      let payload;
      const headers = {};

      if (file) {
        payload = new FormData();
        payload.append('title', data.title);
        payload.append('category', data.category);
        payload.append('file', file);
        if (data.content) {
          payload.append('content', data.content);
        }
      } else {
        payload = {
          title: data.title,
          content: data.content,
          category: data.category,
        };
        headers['Content-Type'] = 'application/json';
      }

      const response = await previewFeedback(payload, headers);
      setPreview(response.data.feedback);
    } catch (error) {
      // handled by interceptor
    } finally {
      setIsPreviewing(false);
    }
  };

  const handleFileChange = (file) => {
    setSelectedFile(file);
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header with icon */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-teal-50 rounded-lg">
          <FilePlus className="h-5 w-5 text-teal-600" strokeWidth={1.5} />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">New Submission</h1>
          <p className="text-gray-500 text-sm mt-0.5">Write your content or upload a file for analysis</p>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200/50 p-6 md:p-8">
        <SubmissionForm
          onSaveAndNew={handleSaveAndNew}
          onPreview={handlePreview}
          isSubmitting={isSubmitting}
          isPreviewing={isPreviewing}
          selectedFile={selectedFile}
          onFileChange={handleFileChange}
        />
      </div>

      {/* Preview Feedback Section */}
      {preview && (
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200/50 p-6 md:p-8">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
            AI Feedback Preview
          </h2>
          <FeedbackDisplay feedback={preview} />
        </div>
      )}
    </div>
  );
};

export default NewSubmissionPage;