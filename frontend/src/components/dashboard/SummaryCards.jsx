import { useEffect, useState } from 'react';
import { getSubmissions } from '../../api/submissions.api';
import LoadingSpinner from '../common/LoadingSpinner';

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-sm text-gray-500">Total Submissions</h3>
        <p className="text-2xl font-bold">{stats.total}</p>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-sm text-gray-500">Avg Readability</h3>
        <p className="text-2xl font-bold">{stats.avgReadability}%</p>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-sm text-gray-500">Avg Clarity</h3>
        <p className="text-2xl font-bold">{stats.avgClarity}%</p>
      </div>
    </div>
  );
};

export default SummaryCards;