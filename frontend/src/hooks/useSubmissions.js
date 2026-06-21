import { useState, useEffect } from 'react';
import { getSubmissions } from '../api/submissions.api';

export const useSubmissions = (page = 1, limit = 10) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);

  const fetchSubmissions = async (pageNum) => {
    setLoading(true);
    try {
      const response = await getSubmissions(pageNum, limit);
      const { data, pagination } = response;
      setSubmissions(data);
      setTotal(pagination.total);
      setTotalPages(pagination.totalPages);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions(page);
  }, [page]);

  return { submissions, loading, error, totalPages, total, refetch: fetchSubmissions };
};