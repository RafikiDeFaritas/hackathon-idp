import { API_BASE, _HEADER } from './config';
import { User } from '../models/user';
import { jwtDecode } from 'jwt-decode';

const TOKEN_KEY = 'token';

export const getToken = (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
};

const setToken = (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
};

const clearToken = (): void => {
    localStorage.removeItem(TOKEN_KEY);
};

export const estConnecte = (): boolean => {
    const token = getToken();
    if (!token) return false;
    try {
        const { exp } = jwtDecode<{ exp: number }>(token);
        if (!exp) return false;
        return Date.now() < exp * 1000;
    } catch {
        return false;
    }
};

export const getUserConnecte = (): { id: string; name: string, email: string, role: string } | null => {
    const token = getToken();
    if (!token) return null;
    try {
        const decoded = jwtDecode<{ id: string; email: string; name: string; role: string; exp: number }>(token);
        if (Date.now() >= decoded.exp * 1000) return null; // expiré
        return { 
            id: decoded.id, 
            name: decoded.name, 
            email: decoded.email, 
            role: decoded.role
        };
    } catch {
        return null;
    }
};

export const connexion = async (user: User): Promise<void> => {
    try {
        const response = await fetch(`${API_BASE}/users/login`, {
            method: 'POST',
            headers: _HEADER,
            body: JSON.stringify(user),
        });

        if (!response.ok) throw new Error('Échec de la connexion');

        const { token } = await response.json();
        if (!token) throw new Error('Token manquant dans la réponse');

        setToken(token);
    } catch (error) {
        console.error('Erreur lors de la connexion :', error);
        throw error;
    }
};

export const deconnexion = (): void => {
    clearToken();
};

export const getUsers = async (): Promise<User[]> => {
    try {
        const token = getToken();
        const headers = {
            ..._HEADER,
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };
        const response = await fetch(`${API_BASE}/users/`, {
            headers
        });
        if (!response.ok) throw new Error('Échec du chargement des utilisateurs');
        return response.json();
    } catch (error) {
        console.error('Erreur lors du chargement des utilisateurs :', error);
        throw error;
    }
};

export const getUserById = async (id: string): Promise<User> => {
    try {
        const token = getToken();
        const headers = {
            ..._HEADER,
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };
        const response = await fetch(`${API_BASE}/users/${id}`, {
            headers
        });
        if (!response.ok) throw new Error(`Échec du chargement de l'utilisateur avec l'ID ${id}`);
        return response.json();
    } catch (error) {
        console.error(`Erreur lors du chargement de l'utilisateur avec l'ID ${id} :`, error);
        throw error;
    }
};

export const createUser = async (user: User): Promise<User> => {
    try {
        const response = await fetch(`${API_BASE}/users/register`, {
            method: 'POST',
            headers: _HEADER,
            body: JSON.stringify(user),
        });

        if (!response.ok) {
            const errorPayload = await response.json().catch(() => null);
            const backendMessage = errorPayload?.message;
            throw new Error(backendMessage || "Échec de la création de l'utilisateur");
        }

        return response.json();
    } catch (error) {
        console.error("Erreur lors de la création de l'utilisateur :", error);
        throw error;
    }
};

export const updateUser = async (id: string, user: User): Promise<User> => {
    try {
        const token = getToken();
        const headers = {
            ..._HEADER,
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };
        const response = await fetch(`${API_BASE}/users/${id}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(user),
        });
        if (!response.ok) throw new Error(`Échec de la mise à jour de l'utilisateur avec l'ID ${id}`);
        return response.json();
    } catch (error) {
        console.error(`Erreur lors de la mise à jour de l'utilisateur avec l'ID ${id} :`, error);
        throw error;
    }
};

export const deleteUser = async (id: string): Promise<void> => {
    try {
        const token = getToken();
        const headers = {
            ..._HEADER,
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };
        const response = await fetch(`${API_BASE}/users/${id}`, {
            method: 'DELETE',
            headers
        });
        if (!response.ok) throw new Error(`Échec de la suppression de l'utilisateur avec l'ID ${id}`);
    } catch (error) {
        console.error(`Erreur lors de la suppression de l'utilisateur avec l'ID ${id} :`, error);
        throw error;
    }
};
