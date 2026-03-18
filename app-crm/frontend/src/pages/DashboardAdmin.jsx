import { useState, useEffect } from 'react';
import { getDocuments } from '../api/document';
import { getUsers } from '../api/user';

const DashboardAdmin = () => {
    const [documents, setDocuments] = useState([]);
    const [users, setUsers] = useState([]);
    useEffect(() => {
        getDocuments().then((data) => {
            setDocuments(data);
        });
        getUsers().then((data) => {
            setUsers(data);
        });
    }, []);
    return (
        <div className="page-container">
            <h1 className="page-title">Tableau de Bord Admin</h1>
            <div className="content-card">
                <p>Bienvenue sur le tableau de bord d'administration. Voici les statistiques actuelles :</p>
                <div className="dashboard-stats">
                    <div className="stat-card">
                        <div className="stat-card-title">Documents Créés</div>
                        <div className="stat-card-value">{documents.length}</div>
                    </div>
                    <div className="stat-card secondary">
                        <div className="stat-card-title">Utilisateurs Inscrits</div>
                        <div className="stat-card-value">{users.length}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardAdmin;