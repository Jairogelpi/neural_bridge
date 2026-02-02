import type { SemanticMerkleTree} from '../smt';
import { SMTRuntime, SemanticHasher } from '../smt';
import type { ProofCarryingKnowledge } from '../pck';

/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║     THE HOLOGRAPHIC TRUTH VAULT                                              ║
 * ║     A Persistent, User-Sovereign Semantic Memory                             ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * Revolutionary Concept:
 * Instead of verifying every time from scratch, we build a persistent
 * "Vault" of verified truth that travels with the user across LLMs.
 * 
 * If you verified a fact in ChatGPT last week, your Vault remembers it.
 * If Claude tries to lie about it today, the Vault catches it instantly.
 */

export interface VaultEntry {
    id: string;
    timestamp: string;
    domain: string;

    // The Truth
    content: string;
    semantic_hash: string;

    // The Proof
    smt: SemanticMerkleTree;
    pck: ProofCarryingKnowledge | undefined;

    // Metadata
    source_url: string;
    verification_score: number;
}

export interface VaultConflict {
    is_conflict: boolean;
    conflicting_entry?: VaultEntry;
    contradiction_reason?: string;
    confidence: number;
}

export class TruthVault {
    private static STORAGE_KEY = 'nb_truth_vault_v1';
    private memory: Map<string, VaultEntry> = new Map();
    private semanticIndex: Map<string, string> = new Map(); // semantic_hash -> entry_id

    constructor() {
        this.load();
    }

    /**
     * Save a verified truth to the Vault
     * "Freezing reality into a crystal"
     */
    public async saveTruth(params: {
        content: string;
        domain: string;
        smt: SemanticMerkleTree;
        pck: ProofCarryingKnowledge | undefined;
        score: number;
    }): Promise<string> {
        const id = `truth_${typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : Date.now().toString(36)}`;

        const entry: VaultEntry = {
            id,
            timestamp: new Date().toISOString(),
            domain: params.domain,
            content: params.content,
            semantic_hash: params.smt.document.semantic_hash,
            smt: params.smt,
            pck: params.pck,
            source_url: typeof window !== 'undefined' ? window.location.href : 'system',
            verification_score: params.score
        };

        this.memory.set(id, entry);
        this.indexEntry(entry);
        await this.persist();

        console.log(`[TruthVault] 💎 Crystallized truth: ${id}`);
        return id;
    }

    /**
     * Check incoming text against the ENTIRE Vault of Truth
     * Does this new text contradict anything I already know is true?
     */
    public checkReality(text: string): VaultConflict {
        // 1. Build semantic model of new text
        const newSMT = SMTRuntime.build(text);

        // 2. Scan the Vault for relevant truths
        // (In a full version, we'd use vector search, here we use semantic claims)

        for (const entry of this.memory.values()) {
            // A. Direct Contradiction Check using SMT logic
            const comparison = SMTRuntime.compare(entry.content, text);

            if (comparison.contradiction_detected) {
                // FOUND A LIE! The new text contradicts a known truth
                return {
                    is_conflict: true,
                    conflicting_entry: entry,
                    contradiction_reason: comparison.contradictions[0]?.reason || 'Semantic contradiction detected',
                    confidence: 0.95
                };
            }

            // B. Numeric Consistency Check
            // If we have verified numbers in the vault, ensure new numbers match
            // (Handled by SMTRuntime.compare)
        }

        return { is_conflict: false, confidence: 0 };
    }

    /**
     * Heal the Reality
     * Returns the TRUE version of the text based on the Vault
     */
    public healReality(text: string, conflict: VaultConflict): string {
        if (!conflict.is_conflict || !conflict.conflicting_entry) return text;

        return `⚠️ CORRECTION FROM TRUTH VAULT:\n${conflict.conflicting_entry.content}\n(Contradicted: "${text.substring(0, 50)}...")`;
    }

    // ════════════════════════════════════════════════════════════════════════
    // PERSISTENCE (Chrome Storage)
    // ════════════════════════════════════════════════════════════════════════

    private indexEntry(entry: VaultEntry) {
        this.semanticIndex.set(entry.semantic_hash, entry.id);
        // Also index individual claims for faster lookup
        entry.smt.claims.forEach(claim => {
            this.semanticIndex.set(claim.semantic_hash, entry.id);
        });
    }

    private async persist() {
        if (typeof chrome === 'undefined' || !chrome.storage) return;

        const serialized = JSON.stringify(Array.from(this.memory.entries()));
        await chrome.storage.local.set({ [TruthVault.STORAGE_KEY]: serialized });
    }

    private async load() {
        if (typeof chrome === 'undefined' || !chrome.storage) return;

        const result = await chrome.storage.local.get(TruthVault.STORAGE_KEY);
        if (result[TruthVault.STORAGE_KEY]) {
            try {
                const entries = JSON.parse(result[TruthVault.STORAGE_KEY]);
                this.memory = new Map(entries);
                // Rebuild index
                this.memory.forEach(e => this.indexEntry(e));
                console.log(`[TruthVault] Loaded ${this.memory.size} shards of truth`);
            } catch (e) {
                console.error('Failed to load Truth Vault', e);
            }
        }
    }
}

// Global Singleton
export const truthVault = new TruthVault();
