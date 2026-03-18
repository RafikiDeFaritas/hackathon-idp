import { useNavigate, Link } from 'react-router-dom';
import { LogOut, User as UserIcon } from 'lucide-react';
import { deconnexion, getUserConnecte } from '../api/user';

const TopBar = () => {
  const navigate = useNavigate();
  const user = getUserConnecte();

  const handleLogout = () => {
    deconnexion();
    navigate('/login');
  };

  return (
    <header className="top-bar">
      <div className="top-bar-left">
        <h1 className="logo">CRM IDP</h1>
        <nav className="top-nav">
          <Link to="/upload" className="nav-link">
            <span>Upload</span>
          </Link>
          <Link to="/documents" className="nav-link">
            <span>Mes documents</span>
          </Link>
          {user.role === 'ADMIN' && (
            <>
              <Link to="/dashboard-admin" className="nav-link">
                <span>Dashboard</span>
              </Link>
              <Link to="/users-management" className="nav-link">
                <span>Utilisateurs</span>
              </Link>
            </>
          )}
        </nav>
      </div>
      <div className="top-bar-right">
        {user && (
          <div className="user-info">
            <UserIcon size={18} />
            <span className="user-name">{user.name}</span>
            <span className="user-role">({user.role})</span>
          </div>
        )}
        <button onClick={handleLogout} className="logout-btn" title="Déconnexion">
          <LogOut size={18} />
          <span>Déconnexion</span>
        </button>
      </div>
    </header>
  );
};

export default TopBar;
