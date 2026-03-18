import { API_BASE } from './config';
import { getToken } from './user';

export interface UploadedDocument {
    _id?: string;
    filename: string;
    originalName: string;
    path: string;
    status?: string;
    createdAt?: string;
}

export const uploadDocument = async (file: File): Promise<UploadedDocument> => {
    const token = getToken();
    if (!token) {
        throw new Error('Utilisateur non authentifie');
    }

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE}/documents/upload`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.message || payload?.error || 'Echec de upload');
    }

    const data = await response.json();
    return data.document;
};

export const getDocuments = async (): Promise<UploadedDocument[]> => {
    const token = getToken();
    if (!token) {
        throw new Error('Utilisateur non authentifie');
    }

    const response = await fetch(`${API_BASE}/documents`, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
        },
    });

    if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.message || payload?.error || 'Echec du chargement des documents');
    }

    return response.json();
};