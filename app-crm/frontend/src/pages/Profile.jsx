import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserById, updateUser } from '../api/user';
import Navbar from '../components/Navbar';

const Profile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', mdp: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.id) {
      getUserById(user.id).then((data) => {
        setFormData({ name: data.name, email: data.email, mdp: '' });
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const payload = { name: formData.name, email: formData.email };
      if (formData.mdp) payload.mdp = formData.mdp;
      await updateUser(user.id, payload);
      setMessage('Profil mis à jour avec succès.');
    } catch (err) {
      setError('Erreur lors de la mise à jour.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="page-container">
        <h1>Mon profil</h1>
        <p className="text-muted">Rôle : <strong>{user?.role}</strong></p>

        <div className="form-card">
          <form onSubmit={handleSubmit}>
            {message && <p className="msg-success">{message}</p>}
            {error && <p className="msg-error">{error}</p>}

            <div className="form-group">
              <label className="form-label" htmlFor="name">Nom</label>
              <input id="name" type="text" className="form-input" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">Email</label>
              <input id="email" type="email" className="form-input" value={formData.email} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="mdp">Nouveau mot de passe <span className="text-muted">(laisser vide pour ne pas changer)</span></label>
              <input id="mdp" type="password" className="form-input" placeholder="••••••••" value={formData.mdp} onChange={handleChange} />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
