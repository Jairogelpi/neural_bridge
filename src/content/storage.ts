import { supabase } from "../db/supabase";
import type { Transcript } from "../transcript/transcript";
import type { ContextCrystal } from "../core/scp_types";

export type BridgeCard = {
    id: string;
    created_at: string;
    platform: "chatgpt" | "gemini" | "claude" | "other";
    title: string;
    preview: string;
    transcript_id: string;
    context_id: string;
};

const CARDS_KEY = "nb_cards_v1";
const TRANSCRIPT_PREFIX = "nb_tx_";
const CRYSTAL_PREFIX = "nb_cc_";
const MAX_CARDS = 30;

// POLY-STORAGE ENGINE (100% REAL NODE/BROWSER/SUPABASE HYBRID)
const memoryStorage: Record<string, any> = {};
const isBrowser = typeof chrome !== 'undefined' && !!chrome.storage;

const storage = {
    get: async (key: string): Promise<any> => {
        if (isBrowser) return chrome.storage.local.get(key);
        
        // Server-side: Use Supabase
        const { data, error } = await supabase
            .from('kv_store')
            .select('value')
            .eq('key', key)
            .single();
            
        if (error) {
            console.error(`Supabase error fetching ${key}:`, error.message);
            return { [key]: memoryStorage[key] };
        }
        return { [key]: data?.value };
    },
    set: async (items: Record<string, any>): Promise<void> => {
        if (isBrowser) return chrome.storage.local.set(items);
        
        // Server-side: Use Supabase upsert
        for (const [key, value] of Object.entries(items)) {
            const { error } = await supabase
                .from('kv_store')
                .upsert({ key, value, updated_at: new Date().toISOString() });
            
            if (error) {
                console.error(`Supabase error saving ${key}:`, error.message);
                memoryStorage[key] = value;
            }
        }
    }
};

export async function loadCards(): Promise<BridgeCard[]> {
    const res = await storage.get(CARDS_KEY);
    return (res[CARDS_KEY] ?? []) as BridgeCard[];
}

export async function saveCard(card: BridgeCard): Promise<void> {
    const cards = await loadCards();
    const next = [card, ...cards].slice(0, MAX_CARDS);
    await storage.set({ [CARDS_KEY]: next });
}

export async function saveTranscript(t: Transcript): Promise<void> {
    await storage.set({ [`${TRANSCRIPT_PREFIX}${t.transcript_id}`]: t });
}

export async function loadTranscript(id: string): Promise<Transcript | null> {
    const res = await storage.get(`${TRANSCRIPT_PREFIX}${id}`);
    return res[`${TRANSCRIPT_PREFIX}${id}`] ?? null;
}

export async function saveCrystal(c: ContextCrystal): Promise<void> {
    await storage.set({ [`${CRYSTAL_PREFIX}${c.context_id}`]: c });
}

export async function loadCrystal(id: string): Promise<ContextCrystal | null> {
    const res = await storage.get(`${CRYSTAL_PREFIX}${id}`);
    return res[`${CRYSTAL_PREFIX}${id}`] ?? null;
}

export async function getActiveContextId(): Promise<string | undefined> {
    if (!isBrowser || typeof chrome.runtime === 'undefined') return memoryStorage['nb_active_crystal_id'];
    const res = await chrome.runtime.sendMessage({ type: "NB_GET_STATE" });
    return res?.state?.activeContextId as string | undefined;
}

export async function setActiveContextId(id: string): Promise<void> {
    if (!isBrowser || typeof chrome.runtime === 'undefined') {
        memoryStorage['nb_active_crystal_id'] = id;
        return;
    }
    await chrome.runtime.sendMessage({
        type: "NB_SET_ACTIVE_CONTEXT",
        contextId: id,
        host: typeof location !== 'undefined' ? location.host : 'cli'
    });
}
