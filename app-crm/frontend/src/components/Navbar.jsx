import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <span className="navbar-brand">CRM</span>
      <div className="navbar-links">
        <Link to="/dashboard">Accueil</Link>
        <Link to="/profile">Mon profil</Link>
        {user?.role === 'ADMIN' && <Link to="/admin/users">Utilisateurs</Link>}
      </div>
      <div className="navbar-right">
        <span className="navbar-user">{user?.name}</span>
        <button onClick={handleLogout} className="btn-logout">Déconnexion</button>
      </div>
    </nav>
  );
};

export default Navbar;
