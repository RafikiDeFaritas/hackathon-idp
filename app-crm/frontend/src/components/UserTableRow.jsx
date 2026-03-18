import { useState } from 'react';
import { Pencil, Trash2, X, Check, Eye } from 'lucide-react';

const UserTableRow = ({ user, onDelete, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ name: user.name, email: user.email, role: user.role });

    const handleSave = async () => {
        try {
            await onUpdate(user._id, editForm);
            setIsEditing(false);
        } catch (error) {
            alert("Erreur lors de la mise à jour de l'utilisateur : " + error.message);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditForm({ name: user.name, email: user.email, role: user.role });
    };

    return (
        <tr>
            <td>
                {isEditing ? (
                    <input
                        className="form-input"
                        style={{ padding: '5px' }}
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    />
                ) : user.name}
            </td>
            <td>
                {isEditing ? (
                    <input
                        className="form-input"
                        style={{ padding: '5px' }}
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    />
                ) : user.email}
            </td>
            <td>
                {isEditing ? (
                    <select
                        className="form-input"
                        style={{ padding: '5px' }}
                        value={editForm.role}
                        onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                    >
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                    </select>
                ) : (
                    <span className={`role-badge ${user.role === 'ADMIN' ? 'admin' : 'user'}`}>
                        {user.role}
                    </span>
                )}
            </td>
            <td>
                0 {/* A FAIRE : Récupérer le nombre de documents via l'API pour cet utilisateur */}
            </td>
            <td className="actions-cell">
                {isEditing ? (
                    <>
                        <button className="action-btn success" onClick={handleSave} title="Enregistrer">
                            <Check size={18} />
                        </button>
                        <button className="action-btn cancel" onClick={handleCancel} title="Annuler">
                            <X size={18} />
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            className="action-btn"
                            style={{ color: '#0ea5e9' }}
                            onClick={() => alert("A FAIRE : Afficher les documents de cet utilisateur")}
                            title="Voir les documents"
                        >
                            <Eye size={18} />
                        </button>
                        <button className="action-btn edit" onClick={() => setIsEditing(true)} title="Modifier">
                            <Pencil size={18} />
                        </button>
                        <button className="action-btn delete" onClick={() => onDelete(user._id)} title="Supprimer">
                            <Trash2 size={18} />
                        </button>
                    </>
                )}
            </td>
        </tr>
    );
};

export default UserTableRow;
