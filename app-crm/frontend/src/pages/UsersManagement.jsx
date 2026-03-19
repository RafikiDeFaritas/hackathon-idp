import { useState, useEffect } from 'react';
import { getUsers, deleteUser, updateUser, createUser } from '../api/user';
import { getDocumentsByUserId } from '../api/document';
import { X, Plus } from 'lucide-react';
import UserTableRow from '../components/UserTableRow';
import UserForm from '../components/UserForm';
import DocumentCard from '../components/DocumentCard';

const UsersManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddingUser, setIsAddingUser] = useState(false);
    const [selectedUserForDocs, setSelectedUserForDocs] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userDocuments, setUserDocuments] = useState([]);

    const fetchUsers = async () => {
        try {
            const data = await getUsers();
            setUsers(data);
        } catch (error) {
            console.error('Failed to load users', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleAddUser = async (newUser) => {
        await createUser(newUser);
        setIsAddingUser(false);
        fetchUsers();
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
            await deleteUser(id);
            setUsers(users.filter((u) => u.id !== id && u._id !== id));
        }
    };

    const handleUpdateUser = async (id, updatedData) => {
        await updateUser(id, updatedData);
        setUsers(users.map(u => (u._id === id) ? { ...u, ...updatedData } : u));
    };

    const handleViewDocuments = async (user) => {
        setSelectedUser(user);
        const docs = await getDocumentsByUserId(user._id);
        setUserDocuments(docs);
    };

    const handleCloseModal = () => {
        setSelectedUser(null);
        setUserDocuments([]);
    };

    return (
        <div className="page-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 className="page-title" style={{ marginBottom: 0 }}>Gestion des Utilisateurs</h1>
                <button
                    className="btn-upload-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '10px 20px' }}
                    onClick={() => setIsAddingUser(!isAddingUser)}
                >
                    {isAddingUser ? <X size={20} /> : <Plus size={20} />}
                    {isAddingUser ? "Annuler" : "Ajouter un utilisateur"}
                </button>
            </div>

            {isAddingUser && (
                <div className="content-card" style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.25rem', marginTop: 0, marginBottom: '1.5rem' }}>Nouvel Utilisateur</h2>
                    <UserForm
                        onSubmit={handleAddUser}
                        buttonText="Créer"
                        showRole={true}
                    />
                </div>
            )}

            <div className="content-card">
                {loading ? (
                    <p>Chargement des utilisateurs...</p>
                ) : (
                    <div className="table-responsive">
                        <table className="users-table">
                            <thead>
                                <tr>
                                    <th>Nom</th>
                                    <th>Email</th>
                                    <th>Rôle</th>
                                    <th>Documents</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <UserTableRow
                                        key={user._id}
                                        user={user}
                                        onDelete={handleDeleteUser}
                                        onUpdate={handleUpdateUser}
                                        onViewDocuments={handleViewDocuments}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {selectedUser && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div className="content-card" style={{ width: '600px', maxHeight: '80vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h2 style={{ margin: 0 }}>Documents de {selectedUser.name}</h2>
                            <button className="action-btn cancel" onClick={handleCloseModal}>
                                <X size={20} />
                            </button>
                        </div>

                        {userDocuments.length === 0 ? (
                            <p>Aucun document</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                                {userDocuments.map((doc) => (
                                    <DocumentCard key={doc._id || doc.filename} doc={doc} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersManagement;
