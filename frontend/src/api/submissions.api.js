import apiClient from './client';

export const getSubmissions = (page = 1, limit = 10) =>
  apiClient.get('/submissions', { params: { page, limit } });

export const getSubmissionById = (id) => apiClient.get(`/submissions/${id}`);

/**
 * Create a new submission
 * Supports both JSON (text-only) and FormData (with file upload)
 * @param {Object|FormData} data - Submission data or FormData with file
 */
export const createSubmission = (data) => {
  // If data is FormData, let axios handle the content-type automatically
  if (data instanceof FormData) {
    return apiClient.post('/submissions', data);
  }
  // Otherwise, send as JSON (existing behavior)
  return apiClient.post('/submissions', data);
};

export const regenerateFeedback = (id) =>
  apiClient.post(`/submissions/${id}/regenerate-feedback`);

export const deleteAllSubmissions = () => apiClient.delete('/submissions/all');

export const previewFeedback = (data) =>
  apiClient.post('/submissions/preview-feedback', data);

export const deleteSubmission = (id) => apiClient.delete(`/submissions/${id}`);

export const updateSubmission = (id, data) => apiClient.patch(`/submissions/${id}`, data);