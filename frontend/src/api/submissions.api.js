import apiClient from './client';

export const getSubmissions = (page = 1, limit = 10) =>
  apiClient.get('/submissions', { params: { page, limit } });

export const getSubmissionById = (id) => apiClient.get(`/submissions/${id}`);

export const createSubmission = (data) => apiClient.post('/submissions', data);

export const regenerateFeedback = (id) =>
  apiClient.post(`/submissions/${id}/regenerate-feedback`);
export const deleteAllSubmissions = () => apiClient.delete('/submissions/all');

// ✅ NEW – preview feedback without saving
export const previewFeedback = (data) =>
  apiClient.post('/submissions/preview-feedback', data);
export const deleteSubmission = (id) => apiClient.delete(`/submissions/${id}`);
export const updateSubmission = (id, data) => apiClient.patch(`/submissions/${id}`, data);