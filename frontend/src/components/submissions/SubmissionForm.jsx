import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { CATEGORIES } from '../../utils/validators';

const schema = yup.object({
  title: yup.string().min(3).max(100).required(),
  content: yup.string().min(10).max(10000).required(),
  category: yup.string().oneOf(CATEGORIES).required(),
});

const SubmissionForm = ({
  onSave,
  onPreview,
  isSaving,
  isPreviewing,
  initialData = {},
}) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialData,
  });

  const handleSave = (data) => {
    onSave(data, reset);
  };

  const handlePreview = (data) => {
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

      {/* Content */}
      <div>
        <label className="block text-sm font-medium text-text-light mb-1">
          Content <span className="text-error">*</span>
        </label>
        <textarea
          {...register('content')}
          rows="6"
          className="w-full border border-primary/20 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-secondary text-text transition resize-y"
          placeholder="Write your product description, blog post, or article here..."
        />
        {errors.content && (
          <p className="mt-1 text-sm text-error">{errors.content.message}</p>
        )}
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

      {/* Optional helper text */}
      <p className="text-xs text-text-muted text-center mt-2">
        Click "Preview Feedback" to get AI suggestions without saving.
      </p>
    </form>
  );
};

export default SubmissionForm;