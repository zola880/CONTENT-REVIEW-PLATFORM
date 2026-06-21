const FeedbackDisplay = ({ feedback }) => {
  if (!feedback) return <p className="text-gray-500">No feedback available</p>;

  const { readabilityScore, clarityScore, suggestions } = feedback;

  const renderScoreBar = (label, score, color) => (
    <div className="mb-4">
      <div className="flex justify-between">
        <span>{label}</span>
        <span className="font-bold">{score}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full ${color}`}
          style={{ width: `${score}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <div className="bg-white p-4 rounded shadow">
      {renderScoreBar('Readability', readabilityScore, 'bg-blue-600')}
      {renderScoreBar('Clarity', clarityScore, 'bg-green-600')}
      <div className="mt-4">
        <h4 className="font-medium">Suggestions</h4>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          {suggestions.map((suggestion, idx) => (
            <li key={idx} className="text-gray-700">{suggestion}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FeedbackDisplay;