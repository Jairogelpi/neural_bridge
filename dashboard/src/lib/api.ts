import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://neural-bridge-backend.onrender.com',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('nb_auth_token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Inject Sovereign Keys if present
        const sovereignKeys = localStorage.getItem('nb_sovereign_keys');
        if (sovereignKeys && config.headers) {
            try {
                const keys = JSON.parse(sovereignKeys);
                if (keys.openai) config.headers['x-openai-key'] = keys.openai;
                if (keys.anthropic) config.headers['x-anthropic-key'] = keys.anthropic;
            } catch (e) {
                console.warn('Failed to parse sovereign keys', e);
            }
        }
    }
    return config;
});

export default api;
