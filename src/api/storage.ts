const KEY = {
    installId: "nb_install_id_v1",
    sessionToken: "nb_session_token_v1",
    sessionExpiresAt: "nb_session_expires_at_v1",
    policy: "nb_policy_v1",
} as const;

// In-memory storage for non-extension environments (Demo/CLI)
const _memStorage: Record<string, any> = {};

function uuid(): string {
    const c = (globalThis as any).crypto;
    return c?.randomUUID
        ? c.randomUUID()
        : `id_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

async function getStorage(keys: string | string[]): Promise<Record<string, any>> {
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
        return await chrome.storage.local.get(keys);
    }
    const res: Record<string, any> = {};
    const keyList = Array.isArray(keys) ? keys : [keys];
    for (const k of keyList) {
        res[k] = _memStorage[k];
    }
    return res;
}

async function setStorage(data: Record<string, any>): Promise<void> {
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
        return await chrome.storage.local.set(data);
    }
    for (const [k, v] of Object.entries(data)) {
        _memStorage[k] = v;
    }
}

export async function getOrCreateInstallId(): Promise<string> {
    const res = await getStorage(KEY.installId);
    if (res[KEY.installId]) return res[KEY.installId] as string;
    const id = uuid();
    await setStorage({ [KEY.installId]: id });
    return id;
}

export async function getSession(): Promise<{ token?: string | undefined; expiresAt?: string | undefined; policy?: any | undefined }> {
    const res = await getStorage([KEY.sessionToken, KEY.sessionExpiresAt, KEY.policy]);
    return {
        token: res[KEY.sessionToken] as string | undefined,
        expiresAt: res[KEY.sessionExpiresAt] as string | undefined,
        policy: res[KEY.policy],
    };
}

export async function setSession(token: string, expiresAtISO: string, policy?: any): Promise<void> {
    await setStorage({
        [KEY.sessionToken]: token,
        [KEY.sessionExpiresAt]: expiresAtISO,
        [KEY.policy]: policy ?? null,
    });
}

export function isExpired(expiresAtISO?: string, skewSeconds = 60): boolean {
    if (!expiresAtISO) return true;
    const exp = Date.parse(expiresAtISO);
    if (Number.isNaN(exp)) return true;
    return Date.now() > exp - skewSeconds * 1000;
}
