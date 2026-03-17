import { Navigate } from 'react-router-dom';
import { estConnecte } from '../api/user';

const ProtectedRoute = ({ children }) => {
    if (!estConnecte()) {
        // Si non connecté ou token expiré, redirection vers login
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
