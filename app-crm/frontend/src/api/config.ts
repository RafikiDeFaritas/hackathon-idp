let apiBase = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

if (apiBase.endsWith('/')) {
    apiBase = apiBase.slice(0, -1);
}

if (!apiBase.endsWith('/api')) {
    apiBase += '/api';
}

export const API_BASE = apiBase;

export const _HEADER = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
};
