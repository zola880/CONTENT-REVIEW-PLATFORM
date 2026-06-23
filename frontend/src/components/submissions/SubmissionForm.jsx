import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { CATEGORIES } from '../../utils/validators';
import { FilePlus, X, File, Loader2, Sparkles, Plus } from 'lucide-react';
import { useRef, useState } from 'react';

const baseSchema = yup.object({
  title: yup.string().min(3).max(100).required(),
  content: yup.string().min(0).max(10000).optional(),
  category: yup.string().oneOf(CATEGORIES).required(),
});

const SubmissionForm = ({
  onSaveAndNew,
  onPreview,
  isSubmitting,
  isPreviewing,
  initialData = {},
  selectedFile = null,
  onFileChange = () => {},
}) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(baseSchema),
    defaultValues: initialData,
  });

  const fileInputRef = useRef(null);
  const [fileError, setFileError] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) {
      onFileChange(null);
      setFileError(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFileError('File size must be less than 5MB');
      onFileChange(null);
      return;
    }

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

  const isFileSelected = !!selectedFile;

  // ✅ Save and reset for next entry
  const handleSaveAndNew = (data) => {
    if (!isFileSelected && (!data.content || data.content.trim().length < 10)) {
      alert('Content is required when no file is uploaded and must be at least 10 characters.');
      return;
    }
    onSaveAndNew(data, reset, selectedFile);
  };

  // ✅ Preview – works for both text and files
  const handlePreview = (data) => {
    // Pass both data and file to parent
    onPreview(data, selectedFile);
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

        <div
          className={`relative border-2 border-dashed rounded-lg p-4 transition ${
            isFileSelected
              ? 'border-accent bg-accent/5'
              : 'border-primary/20 hover:border-primary/40 bg-secondary'
          }`}
        >
          <div className="flex items-center space-x-4">
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
                  <FilePlus className="h-6 w-6" />
                  <span className="text-sm">Upload a file (max 5MB)</span>
                </label>
                <span className="text-xs text-text-muted">or</span>
              </>
            ) : (
              <div className="flex items-center flex-1 min-w-0">
                <File className="h-6 w-6 text-accent mr-2 flex-shrink-0" />
                <span className="text-sm text-text truncate flex-1">{selectedFile.name}</span>
                <span className="text-xs text-text-muted ml-2 flex-shrink-0">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </span>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="ml-2 text-error hover:text-error/80 transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>

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

      {/* ✅ Buttons – New Flow */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        {/* Preview Feedback – works for both text and files */}
        <button
          type="button"
          onClick={handleSubmit(handlePreview)}
          disabled={isPreviewing || isSubmitting}
          className="flex-1 bg-accent text-white font-medium py-3 px-6 rounded-lg hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPreviewing ? (
            <span className="flex items-center justify-center">
              <Loader2 className="animate-spin h-4 w-4 mr-2" />
              Generating Preview...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <Sparkles className="h-4 w-4 mr-2" />
              Preview Feedback
            </span>
          )}
        </button>

        {/* New Submission – saves and resets for next entry */}
        <button
          type="button"
          onClick={handleSubmit(handleSaveAndNew)}
          disabled={isSubmitting || isPreviewing}
          className="flex-1 bg-primary text-white font-medium py-3 px-6 rounded-lg hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <Loader2 className="animate-spin h-4 w-4 mr-2" />
              Saving...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <Plus className="h-4 w-4 mr-2" />
              New Submission
            </span>
          )}
        </button>
      </div>

      <p className="text-xs text-text-muted text-center mt-2">
        {isFileSelected
          ? 'Click "Preview Feedback" to analyze your file, then "New Submission" to save and create another.'
          : 'Click "Preview Feedback" to get AI suggestions, then "New Submission" to save and continue.'}
      </p>
    </form>
  );
};

export default SubmissionForm;