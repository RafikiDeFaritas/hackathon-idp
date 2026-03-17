import React from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <Navbar />
      <div className="page-container">
        <h1>Bonjour, {user?.name} 👋</h1>
        <p className="text-muted">Bienvenue dans votre espace CRM.</p>

        <div className="card-grid">
          <div className="card">
            <h3>Mon profil</h3>
            <p>Voir et modifier vos informations personnelles.</p>
            <a href="/profile" className="btn-link">Accéder →</a>
          </div>

          {user?.role === 'ADMIN' && (
            <div className="card">
              <h3>Utilisateurs</h3>
              <p>Gérer les comptes utilisateurs de l'application.</p>
              <a href="/admin/users" className="btn-link">Accéder →</a>
            </div>
          )}

          <div className="card">
            <h3>Documents</h3>
            <p>Traitement automatique de documents administratifs.</p>
            <a href="/documents" className="btn-link">Accéder →</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
