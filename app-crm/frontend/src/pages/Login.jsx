import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { connexion } from '../api/user';
import { UserInitial } from '../models/user';

const Login = () => {
  const [user, setUser] = useState({
    email: UserInitial.email,
    mdp: UserInitial.mdp
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await connexion(user);
      navigate('/upload'); 
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Connexion</h1>
          <p className="auth-subtitle">Accédez à votre espace CRM</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={18} />
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="votre@email.com"
                value={user.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="mdp">Mot de passe</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={18} />
              <input
                id="mdp"
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={user.mdp}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? <Loader2 size={18} className="spin" /> : 'Se connecter'}
          </button>
        </form>

        <div className="auth-footer">
          Pas encore de compte ?{' '}
          <Link to="/register" className="auth-link">Créer un compte</Link>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Login;
