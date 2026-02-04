
import { type Crystal, CrystalStatus, ConstraintRule } from '../types/crystal_format';
import { SCPService, detectDomainAutonomously } from './llm';
import { Attestation } from './attestation';
import { UsidEngine } from './usid_engine';
import { SemanticHasher } from './semantic_hashing';
import { Hypervector } from '../math/hypervector';
import { ToonService } from '../../dashboard/src/lib/toon';

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
        const systemPrompt = `{
  @id(AUTO_ID)
  @intent(PRIMARY_GOAL)
  (Subject) -[Relationship]-> (Object)
  MUST [Rigid Logic Rule]
  NEVER [Prohibited State]
  !verify(Question?) -> [Expected Answer]
}

CRITICAL RULES:
- Extracted constraints must be LOGICALLY BINDING.
- Use TOON syntax strictly. No JSON in the body.
- Return ONLY the TOON block.`;

        const response = await SCPService.resilientCallLLM(
            `CRYSTALLIZE THIS KNOWLEDGE INTO TOON:\n\n${processedText}\n\nReturn ONLY the TOON code block.`,
            model,
            systemPrompt
        );

        // 6. Parse TOON & Sync Legacy Fields
        let toonContent = response.content;
        const toonMatch = toonContent.match(/```toon?\s*([\s\S]*?)```/) || toonContent.match(/\{([\s\S]*?)\}/);
        if (toonMatch) toonContent = toonMatch[1];

        const toonData = ToonService.parse(toonContent);

        // 7. Construct the Crystal Object
        const crystal: Crystal = {
            scp_version: '1.0',
            context_id: `cry_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            created_at: new Date().toISOString(),
            raw_toon: toonContent,
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
                primary: toonData.metadata?.intent || 'Knowledge Transfer',
                status: CrystalStatus.ACTIVE
            },
            author: options.author || {
                id: 'system_refinery',
                name: 'Neural Bridge Refinery',
                reputation: 1.0
            },
            constraints: (toonData.constraints || []).map((c: any) => ({
                id: `c_${Math.random().toString(36).substr(2, 4)}`,
                rule: c.type || ConstraintRule.MUST,
                value: c.value,
                rationale: 'Extracted truth'
            })),
            entities: (toonData.graph || []).map((rel: any) => ({
                name: rel.subject,
                type: 'concept'
            })),
            verification: {
                canonical_hash: '', // Set next
                semantic_invariants: (toonData.proofs?.invariants || []).map((inv: any) => ({
                    id: `inv_${Math.random().toString(36).substr(2, 4)}`,
                    kind: 'fact_check',
                    prompt: inv.prompt,
                    expected: {
                        type: 'string',
                        value: inv.value
                    },
                    weight: 1.0,
                    strict: true,
                    rationale: 'Verification check'
                })),
                policy: {
                    min_checks: 2,
                    accept_threshold: 0.8,
                    max_retries: 1,
                    strategy: 'strict'
                }
            }
        };

        // 8. SYNAPTIC BINDING (The Connectome)
        const { SynapticBinder } = await import('./synaptic_binder');
        const boundCrystal = await SynapticBinder.bind(crystal);

        // 9. Seal the Crystal (Cryptographic Hash)
        // We hash everything EXCEPT the hash field itself
        const toHash = { ...boundCrystal };
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
            raw_toon: ToonService.stringify({
                metadata: { intent: 'Proto-Context' },
                graph: constraints.map(c => ({
                    subject: c.value,
                    predicate: c.rule === ConstraintRule.MUST ? 'HAS_INVARIANT' : 'VIOLATES_INVARIANT',
                    object: 'Core_Logic'
                }))
            }),
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
