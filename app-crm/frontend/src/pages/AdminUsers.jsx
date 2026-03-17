import React, { useEffect, useState } from 'react';
import { getUsers, deleteUser, updateUser } from '../api/user';
import Navbar from '../components/Navbar';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const load = async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch {
      setError('Impossible de charger les utilisateurs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cet utilisateur ?')) return;
    try {
      await deleteUser(id);
      setUsers(users.filter((u) => u._id !== id));
    } catch {
      alert('Erreur lors de la suppression.');
    }
  };

  const startEdit = (user) => {
    setEditingId(user._id);
    setEditData({ name: user.name, email: user.email, role: user.role });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const saveEdit = async (id) => {
    try {
      await updateUser(id, editData);
      await load();
      cancelEdit();
    } catch {
      alert('Erreur lors de la mise à jour.');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="page-container">
        <h1>Gestion des utilisateurs</h1>

        {loading && <p className="text-muted">Chargement...</p>}
        {error && <p className="msg-error">{error}</p>}

        {!loading && (
          <table className="simple-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>Créé le</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  {editingId === u._id ? (
                    <>
                      <td><input className="form-input" value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} /></td>
                      <td><input className="form-input" value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} /></td>
                      <td>
                        <select className="form-input" value={editData.role} onChange={(e) => setEditData({ ...editData, role: e.target.value })}>
                          <option value="USER">USER</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      </td>
                      <td>—</td>
                      <td>
                        <button className="btn-small" onClick={() => saveEdit(u._id)}>Sauver</button>
                        <button className="btn-small btn-ghost" onClick={cancelEdit}>Annuler</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td><span className={`badge ${u.role === 'ADMIN' ? 'badge-admin' : 'badge-user'}`}>{u.role}</span></td>
                      <td>{new Date(u.createdAt).toLocaleDateString('fr-FR')}</td>
                      <td>
                        <button className="btn-small" onClick={() => startEdit(u)}>Modifier</button>
                        <button className="btn-small btn-danger" onClick={() => handleDelete(u._id)}>Supprimer</button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
