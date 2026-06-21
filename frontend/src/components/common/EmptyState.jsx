const EmptyState = ({ message = 'No data available', actionText, onAction }) => (
  <div className="text-center p-8 text-gray-500">
    <p>{message}</p>
    {actionText && onAction && (
      <button
        onClick={onAction}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {actionText}
      </button>
    )}
  </div>
);

export default EmptyState;