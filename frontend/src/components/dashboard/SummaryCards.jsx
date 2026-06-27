import { useEffect, useState } from 'react';
import { getSubmissions } from '../../api/submissions.api';
import LoadingSpinner from '../common/LoadingSpinner';
import { FileText, Eye, Sparkles, TrendingUp, TrendingDown } from 'lucide-react';

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

  // Mock trend data – in real app, compute from previous period
  const getTrend = (type) => {
    const trends = {
      total: { value: '+12%', direction: 'up' },
      readability: { value: '+5%', direction: 'up' },
      clarity: { value: '-2%', direction: 'down' },
    };
    return trends[type];
  };

  const cards = [
    {
      key: 'total',
      label: 'Total Submissions',
      value: stats.total,
      icon: FileText,
      bg: 'bg-primary/5',
      iconBg: 'bg-primary/10',
      color: 'text-primary',
    },
    {
      key: 'readability',
      label: 'Avg Readability',
      value: stats.avgReadability + '%',
      icon: Eye,
      bg: 'bg-accent/5',
      iconBg: 'bg-accent/10',
      color: 'text-accent',
    },
    {
      key: 'clarity',
      label: 'Avg Clarity',
      value: stats.avgClarity + '%',
      icon: Sparkles,
      bg: 'bg-success/5',
      iconBg: 'bg-success/10',
      color: 'text-success',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => {
        const trend = getTrend(card.key);
        const TrendIcon = trend.direction === 'up' ? TrendingUp : TrendingDown;
        const trendColor = trend.direction === 'up' ? 'text-success' : 'text-error';

        return (
          <div
            key={card.key}
            className="bg-secondary border border-primary/10 rounded-lg p-6 shadow-md transition-all duration-200 hover:shadow-lg hover:border-primary/20"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-text-muted">{card.label}</p>
                <p className="text-3xl font-bold text-text mt-1 tracking-tight">{card.value}</p>
                <div className={`flex items-center gap-1 mt-1.5 text-xs font-medium ${trendColor}`}>
                  <TrendIcon className="h-3 w-3" strokeWidth={2} />
                  {trend.value} <span className="text-text-muted/60 font-normal">vs last month</span>
                </div>
              </div>
              <div className={`${card.iconBg} p-3 rounded-lg`}>
                <card.icon className={`h-5 w-5 ${card.color}`} strokeWidth={1.5} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SummaryCards;