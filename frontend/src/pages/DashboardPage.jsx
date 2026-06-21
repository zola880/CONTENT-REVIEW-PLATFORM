import { Link } from 'react-router-dom';
import SummaryCards from '../components/dashboard/SummaryCards';
import SubmissionList from '../components/dashboard/SubmissionList';
import { PlusIcon } from '@heroicons/react/24/outline';

const DashboardPage = () => {
  return (
    <>
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Link
  to="/submissions/new"
  className="mt-3 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
>
  <PlusIcon className="h-4 w-4 mr-1" />
  New Submission
</Link>
      </div>
      <div className="mt-6">
        <SummaryCards />
      </div>
      <div className="mt-8">
        <SubmissionList />
      </div>
    </>
  );
};

export default DashboardPage;
