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
      color: 'text-primary',
      bg: 'bg-primary/5',
      iconBg: 'bg-primary/10',
    },
    {
      label: 'Avg Readability',
      value: stats.avgReadability + '%',
      icon: Eye,
      color: 'text-accent',
      bg: 'bg-accent/5',
      iconBg: 'bg-accent/10',
    },
    {
      label: 'Avg Clarity',
      value: stats.avgClarity + '%',
      icon: Sparkles,
      color: 'text-success',
      bg: 'bg-success/5',
      iconBg: 'bg-success/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="bg-secondary rounded-xl shadow-sm border border-primary/5 p-6 hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-muted">{card.label}</p>
              <p className="text-2xl font-semibold text-text mt-0.5">{card.value}</p>
            </div>
            <div className={`${card.iconBg} p-3 rounded-xl`}>
              <card.icon className={`h-5 w-5 ${card.color}`} strokeWidth={1.5} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;