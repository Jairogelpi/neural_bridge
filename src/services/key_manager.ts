
/**
 * KEY MANAGER (The Sovereign Vault) 🔑🛡️
 * 
 * Capability: Secure Key Management.
 * Manages user-provided API keys in persistent storage.
 * Prioritizes user keys for total autonomy.
 */
export class KeyManager {

    private static STORAGE_KEY = 'nb_sovereign_keys';

    /**
     * SAVE KEYS: Stores a set of API keys.
     */
    static async saveKeys(keys: Record<string, string>): Promise<void> {
        console.log(`[KeyManager] 💾 Securing sovereign keys...`);
        if (typeof chrome !== 'undefined' && chrome.storage) {
            await chrome.storage.local.set({ [this.STORAGE_KEY]: keys });
        } else {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(keys));
        }
    }

    /**
     * GET KEY: Retrieves a specific key if it exists.
     */
    static async getKey(provider: string): Promise<string | null> {
        let keys: Record<string, string> = {};

        if (typeof chrome !== 'undefined' && chrome.storage) {
            const result = await chrome.storage.local.get(this.STORAGE_KEY);
            keys = result[this.STORAGE_KEY] || {};
        } else {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            if (stored) keys = JSON.parse(stored);
        }

        return keys[provider] || null;
    }

    /**
     * CLEAR KEYS
     */
    static async clearKeys(): Promise<void> {
        if (typeof chrome !== 'undefined' && chrome.storage) {
            await chrome.storage.local.remove(this.STORAGE_KEY);
        } else {
            localStorage.removeItem(this.STORAGE_KEY);
        }
    }

    /**
     * GET ALL KEYS: Returns the current set of keys.
     */
    static async getAllKeys(): Promise<Record<string, string>> {
        if (typeof chrome !== 'undefined' && chrome.storage) {
            const result = await chrome.storage.local.get(this.STORAGE_KEY);
            return result[this.STORAGE_KEY] || {};
        } else {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            return stored ? JSON.parse(stored) : {};
        }
    }
}
