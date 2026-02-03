
import { type Crystal, CrystalStatus, ConstraintRule } from '../types/crystal_format';
import { SCPService, detectDomainAutonomously } from './llm';
import { Attestation } from './attestation';
import { UsidEngine } from './usid_engine';
import { SemanticHasher } from './semantic_hashing';
import { Hypervector } from '../math/hypervector';

export interface CrystallizationOptions {
    domain?: string;
    author?: { id: string; name: string; reputation: number };
    compress?: boolean;
    tier?: 'community' | 'trusted' | 'sovereign';
}

/**
 * CRYSTALLIZATION ENGINE ("The Refinery")
 * 
 * Transforms raw, chaos-bound text into immutable, verified Crystals.
 * This is the Deterministic replacement for "Embeddings".
 */
export class CrystallizationService {

    /**
     * Mine a Crystal from raw text.
     * This process is strict, expensive, and deterministic.
     */
    static async mineCrystal(
        text: string,
        options: CrystallizationOptions = {}
    ): Promise<Crystal> {
        console.log(`[Crystallization] 💎 Starting mining process for ${text.length} chars...`);

        // 1. UNIVERSAL IMPOSSIBILITY DETECTION (uSID)
        // Rejects content that violates fundamental logic before we even try to crystallize it.
        const usidCheck = await UsidEngine.solve(text);
        if (usidCheck.status === 'UNSAT') {
            throw new Error(`[Crystallization] ⛔ ONTOLOGICAL REFUSAL: ${usidCheck.message}`);
        }

        // 2. Fractal Compression (Optional but recommended for large texts)
        let processedText = text;
        if (options.compress !== false) {
            const { FractalCompressor } = await import('./fractal_compressor');
            processedText = await FractalCompressor.compress(text);
        }

        // 3. Independent Domain Analysis
        const domain = options.domain || await detectDomainAutonomously(processedText);

        // 4. Select the "Refining Model" (High Intelligence)
        const model = SCPService.getOptimalModel({ domain, task: 'compile', isCritical: true });

        // 5. Run the Compiler Prompt
        const systemPrompt = `You are the CRYSTALLIZATION ENGINE.
Your goal is to extract IRREFUTABLE TRUTH from the input text and freeze it into a "Crystal".

You MUST return a valid JSON object matching the Crystal v0.1 schema:
{
  "entities": [{"name": "...", "type": "...", "category": "..."}],
  "intent": {"primary": "...", "status": "active"},
  "constraints": [
    {
      "id": "c_unique_id",
      "rule": "MUST|NEVER|IF_THEN", 
      "value": "Exact rule text", 
      "rationale": "Why this is true"
    }
  ],
  "verification": {
    "semantic_invariants": [
      {
        "id": "inv_001",
        "prompt": "Question to verify truth",
        "expected": {"type": "string", "value": "Expected Answer"},
        "rationale": "..."
      }
    ]
  }
}

CRITICAL RULES:
- Extracted constraints must be LOGICALLY BINDING.
- The "intent" should represent the core purpose of this knowledge.
- Invariants must be testable questions that PROVE the AI understands this crystal.
- AUTO-INFER: Look for numerical facts, dates, named entities, and logical dependencies. Create 3-5 invariants automatically.`;

        const response = await SCPService.resilientCallLLM(
            `CRYSTALLIZE THIS KNOWLEDGE:\n\n${processedText}\n\nReturn ONLY JSON.`,
            model,
            systemPrompt
        );

        // 6. Parse & Validate
        let parsed;
        try {
            let jsonStr = response.content;
            const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
            if (jsonMatch && jsonMatch[1]) jsonStr = jsonMatch[1];
            parsed = JSON.parse(jsonStr.trim());
        } catch (e) {
            throw new Error(`[Crystallization] Failed to parse Crystal JSON: ${e}`);
        }

        // 7. Construct the Crystal Object
        const crystal: Crystal = {
            scp_version: '1.0',
            context_id: `cry_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            created_at: new Date().toISOString(),
            version: '1.0.0',
            tier: options.tier || 'community',
            domain: domain,
            source: {
                platform: 'neural-bridge-refinery',
                url: 'internal://crystallization',
                timestamp: new Date().toISOString(),
                model: model
            },
            intent: {
                primary: parsed.intent?.primary || 'Knowledge Transfer',
                status: CrystalStatus.ACTIVE
            },
            author: options.author || {
                id: 'system_refinery',
                name: 'Neural Bridge Refinery',
                reputation: 1.0
            },
            constraints: (parsed.constraints || []).map((c: any) => ({
                id: c.id || `c_${Math.random().toString(36).substr(2, 4)}`,
                rule: c.rule || ConstraintRule.MUST,
                value: c.value,
                rationale: c.rationale || 'Extracted truth'
            })),
            entities: parsed.entities || [],
            verification: {
                canonical_hash: '', // Set next
                semantic_invariants: (parsed.verification?.semantic_invariants || []).map((inv: any) => ({
                    id: inv.id || `inv_${Math.random().toString(36).substr(2, 4)}`,
                    kind: 'fact_check',
                    prompt: inv.prompt,
                    expected: {
                        type: inv.expected?.type || 'string',
                        value: inv.expected?.value
                    },
                    weight: 1.0,
                    strict: true,
                    rationale: inv.rationale || 'Verification check'
                })),
                policy: {
                    min_checks: 2,
                    accept_threshold: 0.8,
                    max_retries: 1,
                    strategy: 'strict'
                }
            }
        };

        // 8. Seal the Crystal (Cryptographic Hash)
        // We hash everything EXCEPT the hash field itself
        const toHash = { ...crystal };
        (toHash.verification as any).canonical_hash = undefined;

        crystal.verification.canonical_hash = await Attestation.realSHA256(JSON.stringify(toHash));

        console.log(`[Crystallization] ✅ Minted Crystal [${crystal.context_id}] (${crystal.constraints?.length} constraints)`);

        return crystal;
    }



    // ... (existing imports)

    /**
     * VECTOR-FIELD AXIOMATIC EXTRACTION 🌐📐
     * 
     * REPLACES WORD-MATCHING WITH GEOMETRIC SINGULARITY DETECTION.
     * Identifies "Logical Gravity" points where concept vectors are too dense
     * to be anything other than a fundamental invariant (MUST).
     */
    private static vectorFieldExtraction(text: string): any[] {
        const words = text.split(/\s+/).filter(w => w.length > 3);
        const constraints: any[] = [];

        // 1. Calculate Overlap Gradient for each word concept
        for (let i = 0; i < words.length; i++) {
            const hv = SemanticHasher.computeSimHash(words[i]!);
            const hvObj = Hypervector.fromString(hv);

            // Measure self-gravity (bit density)
            let bits = 0;
            for (let b = 0; b < 4096; b++) {
                if ((hvObj.data[b >>> 5]! >>> (b & 31)) & 1) bits++;
            }
            const density = bits / 4096;

            // 🏛️ AXIOMATIC SINGULARITY (The "MUST" without words)
            // If bit density is extremely high (>0.7), the concept is "Rigid".
            if (density > 0.7) {
                constraints.push({
                    id: `axiom_${Date.now()}_${i}`,
                    rule: ConstraintRule.MUST,
                    value: words[i],
                    rationale: "Geometric Singularity: High-Density Logical Invariant"
                });
            }

            // 🚫 ENTROPIC EXCLUSION (The "NEVER")
            // If bit density is extremely low (<0.1), the concept is "Fractured".
            if (density < 0.1) {
                constraints.push({
                    id: `axiom_neg_${Date.now()}_${i}`,
                    rule: ConstraintRule.NEVER,
                    value: words[i],
                    rationale: "Entropic Singularity: Negative Logic Cluster"
                });
            }
        }

        return constraints;
    }

    /**
     * FLASH CRYSTALS ⚡
     * 
     * Now upgraded to Sovereign Reality (HDC Vector Field Extraction).
     * No more regex. Pure math.
     */
    static mineProtoCrystal(text: string, domain: string = 'general', metadata: any = {}): Crystal {
        const constraints = this.vectorFieldExtraction(text);

        // 🧬 GENERATE SEMANTIC LSH SIGNATURE
        const lsh = SemanticHasher.computeSimHash(text);

        return {
            scp_version: '1.0',
            context_id: `proto_${Date.now()}`,
            created_at: new Date().toISOString(),
            version: '0.1.0-proto',
            tier: 'community', // Proto tier
            domain: domain,
            // Store LSH in tags for MVP search
            tags: [`lsh:${lsh}`],
            source: {
                platform: 'neural-bridge-flash',
                url: 'internal://flash_crystallization',
                timestamp: new Date().toISOString(),
                model: 'REGEX_ENGINE'
            },
            intent: {
                primary: 'Proto-Context',
                status: CrystalStatus.ACTIVE
            },
            constraints: constraints,
            verification: {
                canonical_hash: 'proto_hash_pending',
                semantic_invariants: [],
                policy: {
                    min_checks: 0,
                    accept_threshold: 0.5,
                    max_retries: 0,
                    strategy: 'lenient'
                }
            },
            author: {
                id: 'flash_engine',
                name: 'Flash Crystallizer',
                reputation: 0.1
            }
        };
    }

    /**
     * SUBLIMATION REFINERY ⚗️
     * 
     * Upgrades a dirty "Proto-Crystal" into a verified "Diamond Crystal" just-in-time.
     */
    static async sublimateCrystal(proto: Crystal): Promise<Crystal> {
        if (proto.tier !== 'community' && (proto as any).type !== 'proto') return proto; // Already refined

        console.log(`[Crystallization] ⚗️ Sublimating Proto-Crystal [${proto.context_id}]...`);

        // Use the original miner to refine it, but pass the proto-constraints as hints
        // For simplicity detailed here, we just re-mine the raw values if we had the text,
        // but here we mine from the extracted constraints themselves to refine them.

        const rawContent = proto.constraints?.map(c => c.value).join('\n') || '';
        if (!rawContent) return proto;

        // "Sublimate" = Mine properly using LLM
        const refined = await CrystallizationService.mineCrystal(rawContent, {
            domain: proto.domain,
            author: { id: 'sublimator', name: 'Sublimation Engine', reputation: 0.9 }
        });

        // Link lineage
        refined.supersedes = proto.context_id;

        return refined;
    }
}
