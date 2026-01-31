import { supabase } from '../db/supabase';
import { SCPService } from './llm';
import { Attestation } from './attestation';

export interface Contradiction {
    crystal_id_a: string;
    crystal_id_b: string;
    claim_a: string;
    claim_b: string;
    explanation: string;
    severity: 'critical' | 'warning';
}

/**
 * The Self-Healing Truth Vault
 * Detects and resolves contradictions across all stored knowledge crystals.
 */
export class TruthVault {
    
    /**
     * Scan for contradictions between a new crystal and existing ones.
     */
    static async scanForContradictions(newCrystal: any): Promise<Contradiction[]> {
        // 1. Get similar crystals from Supabase (by domain or tags)
        const { data: existingCrystals, error } = await supabase
            .from('kv_store')
            .select('value')
            .filter('key', 'like', 'nb_cc_%');

        if (error || !existingCrystals) return [];

        const contradictions: Contradiction[] = [];
        
        // 2. Cross-verify claims using LLM
        for (const item of existingCrystals) {
            const existing = item.value;
            if (existing.context_id === newCrystal.context_id) continue;

            // Only compare if domains match or are related
            if (existing.domain !== newCrystal.domain) continue;

            const systemPrompt = `You are the Neural Bridge Truth Arbiter.
Analyze two knowledge crystals and detect if they contain CONTRADICTING information.
Contradictions are direct logical conflicts (e.g., A says "X is true", B says "X is false").

Return JSON:
{
  "has_contradiction": boolean,
  "explanation": "why they conflict",
  "claim_a": "conflicting claim from A",
  "claim_b": "conflicting claim from B",
  "severity": "critical|warning"
}`;

            const prompt = `Crystal A (New): ${JSON.stringify(newCrystal.constraints)}
Crystal B (Existing): ${JSON.stringify(existing.constraints)}

Do these conflict?`;

            try {
                const response = await SCPService.callLLM(prompt, 'nvidia/nemotron-3-nano-30b-a3b:free', systemPrompt);
                const result = JSON.parse(response.content.replace(/```json|```/g, '').trim());

                if (result.has_contradiction) {
                    contradictions.push({
                        crystal_id_a: newCrystal.context_id,
                        crystal_id_b: existing.context_id,
                        claim_a: result.claim_a,
                        claim_b: result.claim_b,
                        explanation: result.explanation,
                        severity: result.severity
                    });
                }
            } catch (e) {
                console.error('Error during contradiction scan:', e);
            }
        }

        return contradictions;
    }

    /**
     * Heal the vault by marking contradictory crystals or generating a resolution crystal.
     */
    static async heal(contradictions: Contradiction[]): Promise<void> {
        for (const c of contradictions) {
            console.log(`[SELF-HEALING] Contradiction detected: ${c.explanation}`);
            // Log to a specialized table or notify the system
            await supabase.from('kv_store').upsert({
                key: `contradiction_${Date.now()}`,
                value: c,
                updated_at: new Date().toISOString()
            });
        }
    }
}
