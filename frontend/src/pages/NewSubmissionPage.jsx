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
  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleSave = async (data, resetForm, file) => {
    setIsSaving(true);
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
      toast.success('Submission saved!');
      resetForm();
      setPreview(null);
      setSelectedFile(null);
    } catch (error) {
      // handled by interceptor
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = async (data) => {
    if (selectedFile) {
      toast.error('Preview is only available for text input.');
      return;
    }
    setIsPreviewing(true);
    try {
      const response = await previewFeedback(data);
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
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-accent/10 rounded-lg">
          <FilePlus className="h-8 w-8 text-accent" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-text">Create New Submission</h1>
          <p className="text-text-muted text-sm">Write your content or upload a file for analysis</p>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-secondary rounded-xl shadow-md border border-primary/10 overflow-hidden">
        <div className="p-6 md:p-8">
          <SubmissionForm
            onSave={handleSave}
            onPreview={handlePreview}
            isSaving={isSaving}
            isPreviewing={isPreviewing}
            selectedFile={selectedFile}
            onFileChange={handleFileChange}
          />
        </div>

        {/* Preview Feedback Section (below form) */}
        {preview && (
          <div className="border-t border-primary/10 bg-primary/5 px-6 md:px-8 py-6">
            <h2 className="text-lg font-semibold text-text mb-4 flex items-center">
              <span className="inline-block w-1 h-6 bg-accent rounded-full mr-3"></span>
              AI Feedback Preview
            </h2>
            <div className="max-w-2xl">
              <FeedbackDisplay feedback={preview} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewSubmissionPage;