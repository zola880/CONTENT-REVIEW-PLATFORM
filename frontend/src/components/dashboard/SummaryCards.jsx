import { useEffect, useState } from 'react';
import { getSubmissions } from '../../api/submissions.api';
import LoadingSpinner from '../common/LoadingSpinner';
import { 
  DocumentTextIcon, 
  EyeIcon, 
  SparklesIcon 
} from '@heroicons/react/outline';

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
      icon: DocumentTextIcon,
      bg: 'bg-gradient-to-br from-blue-500 to-indigo-600',
    },
    {
      label: 'Avg Readability',
      value: stats.avgReadability + '%',
      icon: EyeIcon,
      bg: 'bg-gradient-to-br from-green-400 to-teal-500',
    },
    {
      label: 'Avg Clarity',
      value: stats.avgClarity + '%',
      icon: SparklesIcon,
      bg: 'bg-gradient-to-br from-purple-500 to-pink-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className={`${card.bg} rounded-lg shadow-lg p-6 text-white flex items-center justify-between`}
        >
          <div>
            <p className="text-sm font-medium opacity-80">{card.label}</p>
            <p className="text-3xl font-bold mt-1">{card.value}</p>
          </div>
          <card.icon className="h-12 w-12 opacity-50" />
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;