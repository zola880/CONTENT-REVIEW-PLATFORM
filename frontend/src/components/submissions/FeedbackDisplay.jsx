import { CheckCircle2, Lightbulb } from 'lucide-react';

const FeedbackDisplay = ({ feedback }) => {
  if (!feedback) return <p className="text-gray-500">No feedback available</p>;

  const { readabilityScore, clarityScore, suggestions } = feedback;

  const renderScoreBar = (label, score, color, icon) => {
    const getBarColor = () => {
      if (score >= 80) return color;
      if (score >= 50) return 'bg-amber-500';
      return 'bg-red-500';
    };

    const barColor = getBarColor();

    return (
      <div className="mb-5">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            {icon}
            <span className="text-sm font-medium text-gray-700">{label}</span>
          </div>
          <span className="text-sm font-semibold text-gray-900">{score}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-lg h-2.5 overflow-hidden shadow-inner">
          <div
            className={`h-2.5 rounded-lg transition-all duration-500 ease-out ${barColor}`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-xl transition-all duration-200 hover:shadow-2xl">
      <div className="space-y-5">
        {/* Scores */}
        {renderScoreBar(
          'Readability',
          readabilityScore,
          'bg-teal-500',
          <span className="text-teal-500">📖</span>
        )}
        {renderScoreBar(
          'Clarity',
          clarityScore,
          'bg-amber-500',
          <span className="text-amber-500">💡</span>
        )}

        {/* Suggestions */}
        {suggestions && suggestions.length > 0 && (
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="h-4 w-4 text-amber-500" strokeWidth={1.5} />
              <h4 className="text-sm font-medium text-gray-700">Suggestions</h4>
            </div>
            <ul className="space-y-1.5">
              {suggestions.map((suggestion, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-600 leading-relaxed">
                  <CheckCircle2 className="h-3.5 w-3.5 text-teal-500 mt-0.5 flex-shrink-0" strokeWidth={2} />
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackDisplay;