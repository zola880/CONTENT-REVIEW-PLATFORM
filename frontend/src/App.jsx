import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Layout from './components/common/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import NewSubmissionPage from './pages/NewSubmissionPage';
import SubmissionDetailPage from './pages/SubmissionDetailPage';
import AccountSettingsPage from './pages/AccountSettingsPage'; // ✅ import

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout>
                  <DashboardPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/submissions/new"
            element={
              <ProtectedRoute>
                <Layout>
                  <NewSubmissionPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/submissions/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <SubmissionDetailPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          {/* ✅ New route – inside <Routes> */}
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <Layout>
                  <AccountSettingsPage />
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;