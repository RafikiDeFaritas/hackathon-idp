import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Upload from './pages/Upload';
import MyDocuments from './pages/MyDocuments';
import TopBar from './components/TopBar';
import ProtectedRoute from './components/ProtectedRoute';

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
      </Routes>
    </Router>
  );
}

export default App;
