import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { CATEGORIES } from '../../utils/validators';

const schema = yup.object({
  title: yup.string().min(3).max(100).required(),
  content: yup.string().min(10).max(10000).required(),
  category: yup.string().oneOf(CATEGORIES).required(),
});

const SubmissionForm = ({ onSubmit, isLoading, onPreview, isPreviewing, initialData = {} }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          {...register('title')}
          className="mt-1 w-full border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Content</label>
        <textarea
          {...register('content')}
          rows="6"
          className="mt-1 w-full border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.content && <p className="text-red-500 text-sm">{errors.content.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Category</label>
        <select
          {...register('category')}
          className="mt-1 w-full border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select a category</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isLoading || isPreviewing}
          className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Submitting...' : 'Submit'}
        </button>
        {onPreview && (
          <button
            type="button"
            onClick={handleSubmit(onPreview)}
            disabled={isPreviewing || isLoading}
            className="flex-1 bg-gray-600 text-white py-2 rounded hover:bg-gray-700 disabled:opacity-50"
          >
            {isPreviewing ? 'Generating...' : 'Preview Feedback'}
          </button>
        )}
      </div>
    </form>
  );
};

export default SubmissionForm;