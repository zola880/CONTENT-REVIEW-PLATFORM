import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { CATEGORIES } from '../../utils/validators';
import { DocumentPlusIcon, XMarkIcon, DocumentIcon } from '@heroicons/react/24/outline';
import { useRef, useState } from 'react';

// Conditional schema: content is required only if no file is selected
// We'll handle this dynamically in the component
const baseSchema = yup.object({
  title: yup.string().min(3).max(100).required(),
  content: yup.string().min(0).max(10000).optional(),
  category: yup.string().oneOf(CATEGORIES).required(),
});

const SubmissionForm = ({
  onSave,
  onPreview,
  isSaving,
  isPreviewing,
  initialData = {},
  selectedFile = null,
  onFileChange = () => {},
}) => {
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(baseSchema),
    defaultValues: initialData,
  });

  const fileInputRef = useRef(null);
  const [fileError, setFileError] = useState(null);

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) {
      onFileChange(null);
      setFileError(null);
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setFileError('File size must be less than 5MB');
      onFileChange(null);
      return;
    }

    // Validate file type (based on extension)
    const allowedExtensions = ['.txt', '.md', '.csv', '.json', '.pdf', '.doc', '.docx'];
    const ext = file.name.split('.').pop().toLowerCase();
    if (!allowedExtensions.includes('.' + ext)) {
      setFileError(`Unsupported file type. Allowed: ${allowedExtensions.join(', ')}`);
      onFileChange(null);
      return;
    }

    setFileError(null);
    onFileChange(file);
  };

  const handleRemoveFile = () => {
    onFileChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Determine if content is required based on file presence
  const isFileSelected = !!selectedFile;

  // Prepare save handler
  const handleSave = (data) => {
    // If no file selected, content must be provided
    if (!isFileSelected && (!data.content || data.content.trim().length < 10)) {
      alert('Content is required when no file is uploaded and must be at least 10 characters.');
      return;
    }
    // We'll pass the data along with file info
    onSave(data, reset, selectedFile);
  };

  const handlePreview = (data) => {
    // Preview only supports text content (no file)
    if (isFileSelected) {
      alert('Preview is only available for text input. Please save the submission to get feedback on files.');
      return;
    }
    onPreview(data);
  };

  return (
    <form className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-text-light mb-1">
          Title <span className="text-error">*</span>
        </label>
        <input
          {...register('title')}
          className="w-full border border-primary/20 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-secondary text-text transition"
          placeholder="Give your submission a clear title"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-error">{errors.title.message}</p>
        )}
      </div>

      {/* Content & File Upload Section */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-medium text-text-light">
            Content <span className="text-error">*</span>
          </label>
          <span className="text-xs text-text-muted">
            {isFileSelected ? 'File selected' : 'Paste text or upload a file'}
          </span>
        </div>

        {/* File Upload Area */}
        <div
          className={`relative border-2 border-dashed rounded-lg p-4 transition ${
            isFileSelected
              ? 'border-accent bg-accent/5'
              : 'border-primary/20 hover:border-primary/40 bg-secondary'
          }`}
        >
          <div className="flex items-center space-x-4">
            {/* File input (hidden) */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
              accept=".txt,.md,.csv,.json,.pdf,.doc,.docx"
            />

            {!isFileSelected ? (
              <>
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex items-center space-x-2 text-text-muted hover:text-text transition"
                >
                  <DocumentPlusIcon className="h-6 w-6" />
                  <span className="text-sm">Upload a file (max 5MB)</span>
                </label>
                <span className="text-xs text-text-muted">or</span>
              </>
            ) : (
              <div className="flex items-center flex-1 min-w-0">
                <DocumentIcon className="h-6 w-6 text-accent mr-2 flex-shrink-0" />
                <span className="text-sm text-text truncate flex-1">{selectedFile.name}</span>
                <span className="text-xs text-text-muted ml-2 flex-shrink-0">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </span>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="ml-2 text-error hover:text-error/80 transition"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>

          {/* File error */}
          {fileError && (
            <p className="mt-1 text-sm text-error">{fileError}</p>
          )}

          {!isFileSelected && (
            <div className="mt-2">
              <textarea
                {...register('content')}
                rows="6"
                className="w-full border border-primary/20 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-secondary text-text transition resize-y"
                placeholder="Write your product description, blog post, or article here..."
                disabled={isFileSelected}
              />
              {errors.content && (
                <p className="mt-1 text-sm text-error">{errors.content.message}</p>
              )}
            </div>
          )}

          {isFileSelected && (
            <p className="text-xs text-text-muted mt-2">
              File will be uploaded and analyzed. The textarea below is disabled.
            </p>
          )}
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-text-light mb-1">
          Category <span className="text-error">*</span>
        </label>
        <select
          {...register('category')}
          className="w-full border border-primary/20 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-secondary text-text transition appearance-none"
        >
          <option value="">Select a category</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        {errors.category && (
          <p className="mt-1 text-sm text-error">{errors.category.message}</p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="button"
          onClick={handleSubmit(handleSave)}
          disabled={isSaving || isPreviewing}
          className="flex-1 bg-primary text-white font-medium py-3 px-6 rounded-lg hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 100 8v4a8 8 0 01-8-8z" />
              </svg>
              Saving...
            </span>
          ) : (
            'Save Submission'
          )}
        </button>

        {onPreview && (
          <button
            type="button"
            onClick={handleSubmit(handlePreview)}
            disabled={isPreviewing || isSaving}
            className="flex-1 bg-accent text-white font-medium py-3 px-6 rounded-lg hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPreviewing ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 100 8v4a8 8 0 01-8-8z" />
                </svg>
                Generating...
              </span>
            ) : (
              'Preview Feedback'
            )}
          </button>
        )}
      </div>

      <p className="text-xs text-text-muted text-center mt-2">
        {isFileSelected
          ? 'File will be uploaded and analyzed. Click "Save Submission" to process.'
          : 'Click "Preview Feedback" to get AI suggestions without saving.'}
      </p>
    </form>
  );
};

export default SubmissionForm;