import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Upload from './pages/Upload';
import MyDocuments from './pages/MyDocuments';
import TopBar from './components/TopBar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import DashboardAdmin from './pages/DashboardAdmin';
import UsersManagement from './pages/UsersManagement';
import DocumentDetails from './pages/DocumentDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <div className="dashboard-layout">
                <TopBar />
                <Upload />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/documents"
          element={
            <ProtectedRoute>
              <div className="dashboard-layout">
                <TopBar />
                <MyDocuments />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/documents/details"
          element={
            <ProtectedRoute>
              <div className="dashboard-layout">
                <TopBar />
                <DocumentDetails />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard-admin"
          element={
            <AdminRoute>
              <div className="dashboard-layout">
                <TopBar />
                <DashboardAdmin />
              </div>
            </AdminRoute>
          }
        />
        <Route
          path="/users-management"
          element={
            <AdminRoute>
              <div className="dashboard-layout">
                <TopBar />
                <UsersManagement />
              </div>
            </AdminRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
