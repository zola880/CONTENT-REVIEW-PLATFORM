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

  const handleSaveAndNew = (data) => {
    if (!isFileSelected && (!data.content || data.content.trim().length < 10)) {
      alert('Content is required when no file is uploaded and must be at least 10 characters.');
      return;
    }
    onSaveAndNew(data, reset, selectedFile);
  };

  const handlePreview = (data) => {
    onPreview(data, selectedFile);
  };

  return (
    <form className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-[#1F2937] mb-1">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          {...register('title')}
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-white text-[#1F2937] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0F766E] focus:border-transparent transition shadow-sm focus:shadow"
          placeholder="Give your submission a clear title"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      {/* Content & File Upload Section */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-medium text-[#1F2937]">
            Content <span className="text-red-500">*</span>
          </label>
          <span className="text-xs text-gray-400">
            {isFileSelected ? 'File selected' : 'Paste text or upload a file'}
          </span>
        </div>

        <div
          className={`relative border-2 border-dashed rounded-lg p-4 transition shadow-sm hover:shadow ${
            isFileSelected
              ? 'border-[#0F766E]/30 bg-[#0F766E]/5'
              : 'border-gray-200 hover:border-gray-300 bg-white'
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
                  className="cursor-pointer flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition"
                >
                  <FilePlus className="h-6 w-6" strokeWidth={1.5} />
                  <span className="text-sm">Upload a file (max 5MB)</span>
                </label>
                <span className="text-xs text-gray-300">or</span>
              </>
            ) : (
              <div className="flex items-center flex-1 min-w-0">
                <File className="h-6 w-6 text-[#0F766E] mr-2 flex-shrink-0" strokeWidth={1.5} />
                <span className="text-sm text-gray-700 truncate flex-1">{selectedFile.name}</span>
                <span className="text-xs text-gray-400 ml-2 flex-shrink-0">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </span>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="ml-2 text-red-500 hover:text-red-700 transition"
                >
                  <X className="h-5 w-5" strokeWidth={1.5} />
                </button>
              </div>
            )}
          </div>

          {fileError && (
            <p className="mt-1 text-sm text-red-500">{fileError}</p>
          )}

          {!isFileSelected && (
            <div className="mt-2">
              <textarea
                {...register('content')}
                rows="6"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white text-[#1F2937] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0F766E] focus:border-transparent transition resize-y shadow-sm focus:shadow"
                placeholder="Write your product description, blog post, or article here..."
                disabled={isFileSelected}
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-500">{errors.content.message}</p>
              )}
            </div>
          )}

          {isFileSelected && (
            <p className="text-xs text-gray-400 mt-2">
              File will be uploaded and analyzed. The textarea below is disabled.
            </p>
          )}
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-[#1F2937] mb-1">
          Category <span className="text-red-500">*</span>
        </label>
        <select
          {...register('category')}
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#0F766E] focus:border-transparent transition shadow-sm focus:shadow appearance-none"
        >
          <option value="">Select a category</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        {errors.category && (
          <p className="mt-1 text-sm text-red-500">{errors.category.message}</p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="button"
          onClick={handleSubmit(handlePreview)}
          disabled={isPreviewing || isSubmitting}
          className="flex-1 border border-[#0F766E] text-[#0F766E] bg-white hover:bg-[#0F766E]/5 font-medium py-2.5 px-6 rounded-lg transition-all duration-200 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0F766E] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isPreviewing ? (
            <>
              <Loader2 className="animate-spin h-4 w-4 mr-2" strokeWidth={2} />
              Generating Preview...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" strokeWidth={1.5} />
              Preview Feedback
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleSubmit(handleSaveAndNew)}
          disabled={isSubmitting || isPreviewing}
          className="flex-1 bg-[#0F766E] hover:bg-[#115E59] text-white font-medium py-2.5 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0F766E] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin h-4 w-4 mr-2" strokeWidth={2} />
              Saving...
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" strokeWidth={1.5} />
              New Submission
            </>
          )}
        </button>
      </div>

      <p className="text-xs text-gray-400 text-center mt-2">
        {isFileSelected
          ? 'Click "Preview Feedback" to analyze your file, then "New Submission" to save and create another.'
          : 'Click "Preview Feedback" to get AI suggestions, then "New Submission" to save and continue.'}
      </p>
    </form>
  );
};

export default SubmissionForm;