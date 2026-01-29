const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080';

export async function apiGet<T>(path: string, token: string): Promise<T> {
    const res = await fetch(API_BASE + path, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
        throw new Error(`${res.status} ${await res.text()}`);
    }
    return res.json();
}

export async function apiBootstrap(installId: string): Promise<{ session_token: string; expires_at: string }> {
    const res = await fetch(API_BASE + '/v1/session/bootstrap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            install_id: installId,
            extension_version: "2.0.0-dashboard",
            browser: { name: "chrome", version: "1.0.0" },
            locale: "es",
            timezone: "UTC"
        }),
    });
    if (!res.ok) {
        throw new Error(`${res.status} ${await res.text()}`);
    }
    return res.json();
}
