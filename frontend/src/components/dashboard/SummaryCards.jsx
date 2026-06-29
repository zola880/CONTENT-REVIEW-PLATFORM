import { useEffect, useState } from 'react';
import { getSubmissions } from '../../api/submissions.api';
import LoadingSpinner from '../common/LoadingSpinner';
import { FileText, Eye, Sparkles } from 'lucide-react';

const SummaryCards = () => {
  const [stats, setStats] = useState({ total: 0, avgReadability: 0, avgClarity: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getSubmissions(1, 100);
        const submissions = response.data || [];
        const total = submissions.length;
        if (total === 0) {
          setStats({ total: 0, avgReadability: 0, avgClarity: 0 });
        } else {
          let readabilitySum = 0,
            claritySum = 0;
          submissions.forEach((s) => {
            readabilitySum += s.feedback?.readabilityScore || 0;
            claritySum += s.feedback?.clarityScore || 0;
          });
          setStats({
            total,
            avgReadability: Math.round(readabilitySum / total),
            avgClarity: Math.round(claritySum / total),
          });
        }
      } catch (error) {
        // handled by interceptor
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner />;

  const cards = [
    {
      label: 'Total Submissions',
      value: stats.total,
      icon: FileText,
    },
    {
      label: 'Avg Readability',
      value: stats.avgReadability + '%',
      icon: Eye,
    },
    {
      label: 'Avg Clarity',
      value: stats.avgClarity + '%',
      icon: Sparkles,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white rounded-xl border border-gray-200/80 shadow-lg shadow-gray-200/50 p-6 hover:shadow-xl hover:shadow-gray-300/50 transition-all duration-200"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">{card.label}</p>
              <p className="text-3xl font-bold text-gray-900 mt-1 tracking-tight">{card.value}</p>
            </div>
            <div className="bg-indigo-50 p-3 rounded-xl">
              <card.icon className="h-5 w-5 text-indigo-600" strokeWidth={1.5} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;