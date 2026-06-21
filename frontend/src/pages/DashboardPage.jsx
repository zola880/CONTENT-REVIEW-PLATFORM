import { Link } from 'react-router-dom';
import SummaryCards from '../components/dashboard/SummaryCards';
import SubmissionList from '../components/dashboard/SubmissionList';

const DashboardPage = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link
          to="/submissions/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          New Submission
        </Link>
      </div>
      <SummaryCards />
      <SubmissionList />
    </div>
  );
};

export default DashboardPage;