import { Navigate } from 'react-router-dom';
import { estConnecte, getUserConnecte } from '../api/user';

const AdminRoute = ({ children }) => {
    if (!estConnecte()) {
        return <Navigate to="/login" replace />;
    }

    const user = getUserConnecte();
    if (!user || user.role !== 'ADMIN') {
       // Si l'utilisateur n'est pas un admin, redirige vers la page des documents
        return <Navigate to="/documents" replace />;
    }

    return children;
};

export default AdminRoute;
