
import { supabase } from '../db/supabase';

/**
 * THE HOLOGRAPHIC CORTEX (Long-Term Memory) 🧠
 * 
 * Manages the "Semantic Lattice" - the graph of learned synonyms and relationships.
 * PERSISTENT: Saves to Supabase so knowledge survives restarts.
 * SHARED: All nodes (Extension/Backend) share this wisdom.
 */
export class SemanticLattice {
    // In-memory cache for O(1) lookups
    private static cache: Map<string, string[]> = new Map();
    private static isDirty: boolean = false;
    private static lastSave: number = Date.now();

    /**
     * Initialize: Load from Supabase "Cortex"
     */
    static async initialize(): Promise<void> {
        console.log('[SemanticLattice] 🧠 Loading Cortex from Truth Vault...');
        const { data, error } = await supabase
            .from('kv_store')
            .select('value')
            .eq('key', 'nb_cortex_lattice_v1')
            .single();

        if (data && data.value) {
            // Rehydrate Map
            const rawObj = data.value as Record<string, string[]>;
            this.cache = new Map(Object.entries(rawObj));
            console.log(`[SemanticLattice] ✅ Loaded ${this.cache.size} semantic nodes.`);
        } else {
            console.log('[SemanticLattice] 👶 Cortex incomplete. Starting fresh.');
        }
    }

    /**
     * Add a semantic link (Bidirectional)
     * "King" <-> "Royal"
     */
    static addLink(a: string, b: string) {
        this._add(a, b);
        this._add(b, a);
        this.isDirty = true;
        this.saveDebounced();
    }

    private static _add(key: string, value: string) {
        if (!this.cache.has(key)) {
            this.cache.set(key, []);
        }
        const existing = this.cache.get(key)!;
        if (!existing.includes(value)) {
            existing.push(value);
        }
    }

    /**
     * Get related concepts for a token
     */
    static getRelated(token: string): string[] {
        return this.cache.get(token) || [];
    }

    /**
     * Persist to Supabase (Debounced)
     */
    private static async saveDebounced() {
        const now = Date.now();
        if (now - this.lastSave < 5000) return; // Max save every 5s

        if (!this.isDirty) return;

        this.lastSave = now;
        this.isDirty = false;

        // Serialize Map to Object
        const obj = Object.fromEntries(this.cache);

        console.log('[SemanticLattice] 💾 Persisting Cortex to Long-Term Memory...');
        await supabase.from('kv_store').upsert({
            key: 'nb_cortex_lattice_v1',
            value: obj,
            updated_at: new Date().toISOString()
        });
    }

    /**
     * Force Save (e.g. on shutdown)
     */
    static async forceSave() {
        if (this.isDirty) {
            const obj = Object.fromEntries(this.cache);
            await supabase.from('kv_store').upsert({
                key: 'nb_cortex_lattice_v1',
                value: obj,
                updated_at: new Date().toISOString()
            });
            this.isDirty = false;
        }
    }
}
