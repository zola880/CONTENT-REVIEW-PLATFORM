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
      bg: 'bg-primary',
      iconColor: 'text-white/40',
      textColor: 'text-white',
    },
    {
      label: 'Avg Readability',
      value: stats.avgReadability + '%',
      icon: Eye,
      bg: 'bg-accent',
      iconColor: 'text-white/40',
      textColor: 'text-white',
    },
    {
      label: 'Avg Clarity',
      value: stats.avgClarity + '%',
      icon: Sparkles,
      bg: 'bg-success',
      iconColor: 'text-white/40',
      textColor: 'text-white',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className={`${card.bg} rounded-xl shadow-lg p-6 text-white flex items-center justify-between hover:shadow-xl transition-shadow duration-200`}
        >
          <div>
            <p className="text-sm font-medium opacity-80">{card.label}</p>
            <p className="text-3xl font-bold mt-1">{card.value}</p>
          </div>
          <card.icon className={`h-12 w-12 opacity-50 ${card.iconColor}`} />
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;