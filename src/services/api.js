import { API_BASE_URL } from '../config';

const api = {
    async get(endpoint) {
        const response = await fetch(`${API_BASE_URL}${endpoint}`);
        if (!response.ok) throw new Error('Network response was not ok');
        return { data: await response.json() };
    },

    async post(endpoint, body) {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        if (!response.ok) throw new Error('Network response was not ok');
        return { data: await response.json() };
    },

    async put(endpoint, body) {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        if (!response.ok) throw new Error('Network response was not ok');
        return { data: await response.json() };
    },

    async delete(endpoint) {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Network response was not ok');
        return { data: await response.json() };
    },
};

export default api;
