import { useState } from 'react';
import { UserInitial } from '../models/user';
import { User as UserIcon, Mail, Lock, Loader2 } from 'lucide-react';

const UserForm = ({ onSubmit, buttonText = "Créer", showRole = true }) => {
    const [user, setUser] = useState({
        ...UserInitial,
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setUser({ ...user, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (user.mdp !== user.confirmPassword) {
            setError("Les mots de passe ne correspondent pas");
            return;
        }

        setIsLoading(true);
        try {
            const { confirmPassword, ...userData } = user;
            await onSubmit(userData);
            // Si pas d'erreur, on peut réinitialiser le formulaire
            setUser({ ...UserInitial, confirmPassword: '' });
        } catch (err) {
            setError(err.message || "Une erreur est survenue");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={showRole ? { display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' } : {}}>
            {error && !showRole && (
                <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>
                    {error}
                </div>
            )}

            <div className="form-group">
                <label className="form-label" htmlFor="name">Nom complet</label>
                <div className="input-wrapper">
                    <UserIcon className="input-icon" size={18} />
                    <input
                        id="name"
                        className="form-input"
                        placeholder="Nom Prenom"
                        required
                        value={user.name}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className="form-group">
                <label className="form-label" htmlFor="email">Email</label>
                <div className="input-wrapper">
                    <Mail className="input-icon" size={18} />
                    <input
                        id="email"
                        className="form-input"
                        type="email"
                        placeholder="votre@email.com"
                        required
                        value={user.email}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className="form-group">
                <label className="form-label" htmlFor="mdp">Mot de passe</label>
                <div className="input-wrapper">
                    <Lock className="input-icon" size={18} />
                    <input
                        id="mdp"
                        className="form-input"
                        type="password"
                        placeholder="••••••••"
                        required
                        value={user.mdp}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className="form-group">
                <label className="form-label" htmlFor="confirmPassword">Confirmer le mot de passe</label>
                <div className="input-wrapper">
                    <Lock className="input-icon" size={18} />
                    <input
                        id="confirmPassword"
                        type="password"
                        className="form-input"
                        placeholder="••••••••"
                        value={user.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            {showRole && (
                <div className="form-group">
                    <label className="form-label" htmlFor="role">Rôle</label>
                    <div className="input-wrapper">
                        <UserIcon className="input-icon" size={18} />
                        <select
                            id="role"
                            className="form-input"
                            style={{ paddingLeft: '35px' }}
                            value={user.role}
                            onChange={handleChange}
                        >
                            <option value="USER">USER</option>
                            <option value="ADMIN">ADMIN</option>
                        </select>
                    </div>
                </div>
            )}

            <div style={showRole ? { display: 'flex', alignItems: 'flex-end', marginBottom: '15px' } : {}}>
                <button type="submit" className="btn-primary" disabled={isLoading} style={showRole ? { padding: '10px' } : {}}>
                    {isLoading ? <Loader2 size={18} className="spin" /> : buttonText}
                </button>
            </div>

            {error && showRole && (
                <div style={{ color: 'red', marginTop: '1rem', gridColumn: '1 / -1' }}>
                    {error}
                </div>
            )}
        </form>
    );
};

export default UserForm;
