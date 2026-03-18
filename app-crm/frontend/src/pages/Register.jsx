import { Link, useNavigate } from 'react-router-dom';
import { createUser } from '../api/user';
import UserForm from '../components/UserForm';

const Register = () => {
  const navigate = useNavigate();

  const handleRegister = async (userData) => {
    await createUser(userData);
    navigate('/login');
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">Inscription</h1>
            <p className="auth-subtitle">Créez votre compte CRM</p>
          </div>

          <UserForm
            onSubmit={handleRegister}
            buttonText="S'inscrire"
            showRole={false}
          />

          <div className="auth-footer">
            Déjà un compte ?{' '}
            <Link to="/login" className="auth-link">Se connecter</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
