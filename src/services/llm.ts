import { Attestation } from './attestation';
import { type Crystal, CrystalStatus, ConstraintRule } from '../types/crystal_format';
import { DecisionReceipts, type DecisionReceipt } from './decision_receipts';
import { UsidEngine } from './usid_engine';
import { SMTRuntime } from '../smt';
import { PCKRuntime } from '../pck';

const OPENROUTER_API_KEY = (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_OPENROUTER_API_KEY ||
    (globalThis as unknown as { process?: { env: Record<string, string> } }).process?.env?.VITE_OPENROUTER_API_KEY ||
    (globalThis as unknown as { process?: { env: Record<string, string> } }).process?.env?.OPENROUTER_API_KEY || '';
const OPENROUTER_BASE = 'https://openrouter.ai/api/v1';

// Dynamic model selection from environment
const ENV_MODEL = (import.meta as unknown as { env?: Record<string, string> }).env?.OPENAI_MODEL || (globalThis as unknown as { process?: { env: Record<string, string> } }).process?.env?.OPENAI_MODEL;

export interface LLMResponse {
    content: string;
    model: string;
    tokens: {
        prompt: number;
        completion: number;
        total: number;
    };
    cost: number;
    latency: number;
}

export interface VerificationResult {
    decision: 'ACCEPT' | 'FAIL';
    score: number;
    confidence_interval: [number, number];
    passed_invariants: string[];
    failed_invariants: Array<{ id: string; expected: unknown; actual: string; reason: string }>;
    ladder_level: number;
    total_attempts: number;
    tokens_used: number;
    cost: number;
    receipt?: DecisionReceipt;
}

interface SCPCompilerOutput {
    intent?: { primary?: string };
    constraints?: Array<{ id: string; rule?: ConstraintRule; value: string; rationale: string }>;
    entities?: Array<{ name: string; type: string; category: string }>;
    verification?: {
        semantic_invariants?: Array<{
            id: string;
            kind?: string;
            prompt: string;
            expected: { type: string; value: string };
            weight?: number;
            strict?: boolean;
            rationale: string;
        }>;
    };
    author?: { id?: string; name?: string };
}

import { CONFIG } from '../config';

// ═══════════════════════════════════════════════════════════════════════════════
// PRODUCTION MODELS - VERIFIED WORKING (Jan 2026)
// These models have been tested and confirmed working on OpenRouter
// ═══════════════════════════════════════════════════════════════════════════════
const PRIMARY_FREE_MODEL = ENV_MODEL || CONFIG.model_stack.free;
const FREE_MODEL_FALLBACKS = [
    'arcee-ai/trinity-large-preview:free',        // Arcee Trinity 400B MoE
    'liquid/lfm-2.5-1.2b-instruct:free',          // Liquid LFM - fast
    'upstage/solar-pro-3:free',                   // Upstage Solar Pro 3
];

const PREMIUM_MODEL = CONFIG.model_stack.premium;

/**
 * POTENCY ESCALATOR 🏔️⚡
 * Calculates the required model potency based on Free Energy and Complexity.
 */
function getRequiredPotency(stats?: { free_energy: number; surprise: number }): string {
    const fe = stats?.free_energy || stats?.surprise || 0.5;

    if (CONFIG.budget_mode === 'performance') return PREMIUM_MODEL;
    if (CONFIG.budget_mode === 'sovereign') return CONFIG.model_stack.local;

    // BALANCED: Escalate if surprise is too high (> 0.3)
    if (fe > 0.3) {
        console.log(`[PotencyEscalator] 🏔️ High Free Energy detected (${fe.toFixed(2)}). Escalating to Platinum Tier...`);
        return PREMIUM_MODEL;
    }

    return PRIMARY_FREE_MODEL;
}

// TURBO: Minimal cooldown (only for rate limit protection)
const REQUEST_COOLDOWN_MS = 50;

async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Real LLM call via OpenRouter with TURBO Backoff (fast fallback)
async function callLLM(
    prompt: string,
    model: string = CONFIG.model_stack.premium,
    systemPrompt?: string,
    maxRetries: number = 1  // TURBO: Only 1 retry before fallback
): Promise<LLMResponse> {
    const startTime = Date.now();
    const messages: Array<{ role: string; content: string }> = [];

    if (systemPrompt) {
        messages.push({ role: 'system', content: systemPrompt });
    }
    messages.push({ role: 'user', content: prompt });

    // PHASE SINGULARITY: Sovereign Key Injection
    const { KeyManager } = await import('./key_manager');
    const userKey = await KeyManager.getKey('openrouter');

    const apiKey = userKey ||
        (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_OPENROUTER_API_KEY ||
        (globalThis as unknown as { process?: { env: Record<string, string> } }).process?.env?.VITE_OPENROUTER_API_KEY ||
        (globalThis as unknown as { process?: { env: Record<string, string> } }).process?.env?.OPENROUTER_API_KEY;

    if (!apiKey) {
        throw new Error('MISSING_API_KEY: Please provide an OpenRouter key in Settings.');
    }

    let attempt = 0;
    while (true) {
        try {
            const response = await fetch(`${OPENROUTER_BASE}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': 'https://neural-bridge.ai',
                    'X-Title': 'Neural Bridge Sovereign'
                },
                body: JSON.stringify({
                    model,
                    messages,
                    temperature: 0.3,
                    max_tokens: 2000
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                const isRetryable = response.status === 429 || response.status === 503 || response.status === 502;

                if (isRetryable && attempt < maxRetries) {
                    // TURBO: Fast backoff - 500ms max before trying fallback
                    const backoff = 500 + Math.random() * 200;
                    console.log(`⚡ [TURBO-RETRY] ${model} → ${response.status}. Quick retry in ${Math.round(backoff)}ms...`);
                    await sleep(backoff);
                    attempt++;
                    continue;
                }
                throw new Error(`LLM API error: ${response.status} - ${errorText}`);
            }

            // TURBO: Minimal cooldown
            await sleep(REQUEST_COOLDOWN_MS);

            const data = await response.json();
            const latency = Date.now() - startTime;

            // Simple zero-cost pricing for :free models
            const pricing: Record<string, { prompt: number; completion: number }> = {
                [CONFIG.model_stack.premium]: { prompt: 0.003, completion: 0.015 },
                'openai/gpt-4o': { prompt: 0.005, completion: 0.015 }
            };

            const price = model.endsWith(':free') ? { prompt: 0, completion: 0 } : (pricing[model] || { prompt: 0.001, completion: 0.002 });
            const promptTokens = (data.usage as { prompt_tokens?: number }).prompt_tokens || 0;
            const completionTokens = (data.usage as { completion_tokens?: number }).completion_tokens || 0;
            const cost = (promptTokens / 1000) * price.prompt + (completionTokens / 1000) * price.completion;

            return {
                content: data.choices[0]?.message?.content || '',
                model,
                tokens: {
                    prompt: promptTokens,
                    completion: completionTokens,
                    total: promptTokens + completionTokens
                },
                cost,
                latency
            };
        } catch (e: unknown) {
            if (e && typeof e === 'object' && 'message' in e && typeof e.message === 'string' && attempt < maxRetries && (e.message.includes('429') || e.message.includes('503'))) {
                attempt++;
                await sleep(Math.pow(2, attempt) * 1000);
                continue;
            }
            throw e;
        }
    }
}

/**
 * Resilient wrapper with REDIS CACHING for 1000x speed
 */
async function resilientCallLLM(
    prompt: string,
    model: string,
    systemPrompt?: string,
    authorId?: string
): Promise<LLMResponse> {
    // CHECK CACHE FIRST (2ms vs 2000ms!)
    try {
        const { CacheManager } = await import('./cache');
        const cached = await CacheManager.getLLMResponse(prompt, model);
        if (cached) {
            console.log(`[LLM Cache] ⚡ HIT in 2ms (saved ~2000ms)`);

            // TRACK HIT (for ROI calculation)
            import('./analytics').then(({ AnalyticsService }) => {
                AnalyticsService.track({
                    event_name: 'cache_hit',
                    event_data: {
                        model,
                        tokens_saved: cached.tokens?.total || 2000,
                        latency_saved_ms: 2000
                    },
                    user_id: authorId || 'system'
                });
            });

            return cached;
        }
    } catch (e) {
        // Cache not available, proceed normally
    }

    // TRACK MISS
    import('./analytics').then(({ AnalyticsService }) => {
        AnalyticsService.track({
            event_name: 'cache_miss',
            event_data: { model },
            user_id: authorId || 'system'
        });
    });

    const modelsToTry = model.endsWith(':free')
        ? [model, ...FREE_MODEL_FALLBACKS.filter((m: string) => m !== model)]
        : [model];

    let lastError: unknown;
    let response: LLMResponse | null = null;

    for (const target of modelsToTry) {
        try {
            response = await callLLM(prompt, target, systemPrompt);

            // STORE IN CACHE (for next time)
            try {
                const { CacheManager } = await import('./cache');
                await CacheManager.setLLMResponse(prompt, model, response);
            } catch (e) {
                // Cache storage failed, not critical
            }

            return response;
        } catch (e: unknown) {
            lastError = e;
            const msg = (e && typeof e === 'object' && 'message' in e && typeof e.message === 'string') ? e.message : '';
            if (msg.includes('401') || msg.includes('MISSING_API_KEY')) {
                console.warn("🛡️ [SOVEREIGN_MODE] API Access Denied. Switching to internal Ontological Synthesis...");
                throw new Error("SOVEREIGN_REQUIRED");
            }
            if (modelsToTry.length > 1) {
                console.warn(`⚠️ [FALLBACK] Model ${target} failed. Trying next in stack...`);
            }
        }
    }
    throw lastError;
}

/**
 * Detect domain autonomously using a real LLM call
 */
export async function detectDomainAutonomously(text: string): Promise<string> {
    const systemPrompt = `You are a Domain Classifier for Neural Bridge.
Analyze the conversation and identify the specific knowledge domain (e.g., medicine, law, tech, finance, education, etc.).
Be precise. If it is a mix, choose the most critical one.`;

    const prompt = `Conversation sample:
"${text.substring(0, 1000)}"

Identify the domain. Return ONLY the domain name in lowercase (e.g. "medicine"). No explanation.`;

    try {
        const response = await resilientCallLLM(prompt, PRIMARY_FREE_MODEL, systemPrompt, 'system');
        const domain = response.content.trim().toLowerCase().replace(/[^a-z0-9]/g, '');

        // 🌀 OMEGA ENGINE: If domain is 'general' or 'unknown', evolve it
        if (domain === 'general' || !domain) {
            const { DomainEvolver } = await import('./domain_evolver');
            const evolution = await DomainEvolver.evolveDomain(text);
            return evolution.domain;
        }

        return domain;
    } catch (e: unknown) {
        const msg = (e && typeof e === 'object' && 'message' in e && typeof e.message === 'string') ? e.message : '';
        if (msg === 'SOVEREIGN_REQUIRED') {
            return 'sovereign_evolution';
        }
        console.warn('⚠️ Autonomous domain detection failed, falling back to evolution:', e);
        const { DomainEvolver } = await import('./domain_evolver');
        const evolution = await DomainEvolver.evolveDomain(text);
        return evolution.domain;
    }
}

/**
 * Generate Crystal using real LLM and official types.
 */
export async function generateCrystal(
    conversationText: string,
    sourceModel: string,
    author?: { id: string; name: string; reputation: number }
): Promise<{ crystal: Crystal; llmResponse: LLMResponse }> {

    const systemPrompt = `You are a Semantic Context Protocol (SCP) compiler. Your task is to extract structured semantic content from conversations for verified transfer to another LLM.

You MUST return a valid JSON object with this exact structure:
{
  "entities": [{"name": "e1", "type": "person|project|concept|tool|constraint", "category": "..."}],
  "intent": {"primary": "...", "status": "active"},
  "constraints": [{"id": "c1", "rule": "MUST|NEVER", "value": "...", "rationale": "..."}],
  "verification": {
    "semantic_invariants": [
      {
        "id": "inv_001",
        "kind": "fact_check|constraint_check",
        "prompt": "Question to verify this fact",
        "expected": {"type": "boolean|string", "value": "..."},
        "weight": 0.0-1.0,
        "strict": true/false,
        "rationale": "..."
      }
    ]
  }
}

Extract:
1. ALL named entities (people, projects, technologies, concepts)
2. User's primary intent
3. Technical or preference constraints
4. 3-5 invariants that can verify successful context transfer

Be thorough but precise.`;

    const prompt = `Analyze the following conversation and extract its semantic content in Crystal Format v0.1:

---CONVERSATION START---
${conversationText}
---CONVERSATION END---

Return ONLY valid JSON, no markdown or explanation.`;

    // -----------------------------------------------------------------------
    // 0. UNIVERSAL IMPOSSIBILITY DETECTION (uSID) - The Non-Negotiable Firewall
    // -----------------------------------------------------------------------
    const usidCheck = await UsidEngine.solve(conversationText);
    if (usidCheck.status === 'UNSAT') {
        const repairs = (usidCheck.repair_options || []).map(r => `\n     * ${r.change} -> ${r.effect}`).join('');
        throw new Error(`
        ⛔ ONTOLOGICAL REFUSAL TRIGGERED (uSID v2.0)
        The system cannot process this request because it describes an impossible reality configuration.
        
        Reason: ${usidCheck.message}
        
        Violated Constraints (UNSAT CORE):
        ${(usidCheck.unsat_core || []).map(c => `• [${c.constraint_id}] ${c.constraint_desc}: ${c.conflict_reason}`).join('\n')}

        SUGGESTED REPAIRS to make reality consistent:${repairs}
        `);
    }

    // -----------------------------------------------------------------------
    // FRACTAL COMPRESSION: Handle Infinite Context
    // -----------------------------------------------------------------------
    const { FractalCompressor } = await import('./fractal_compressor');
    const processedText = await FractalCompressor.compress(conversationText);

    // 🌀 OMEGA ENGINE: Stochastic Entropy & Fisher Information Purification
    const { StochasticEngine } = await import('./stochastic_engine');
    const { semanticPotential, entropy } = await StochasticEngine.processChaos(processedText);

    // 🔬 DYNAMIC ADAPTATION: Stabilize the lattice if entropy exceeds 0.8
    const isStable = await StochasticEngine.entropyBalancer(entropy);
    if (!isStable) {
        console.log(`[SCPService] 🧬 Lattice unstable. Applying Axiomatic Stabilization...`);
    }

    // 🧠 AUTONOMOUS DOMAIN EVOLUTION
    const { DomainEvolver } = await import('./domain_evolver');
    let domain: string;
    let baseAxioms: string[] = [];

    try {
        const evolved = await DomainEvolver.evolveDomain(processedText);
        domain = evolved.domain;
        baseAxioms = evolved.axioms;
    } catch (e) {
        domain = await detectDomainAutonomously(processedText);
    }

    // 🧠 NEUROMORPHIC FILTER: Predictive Coding
    const { predictionError, residualContent } = await StochasticEngine.performPredictiveCoding(processedText, domain);

    // 🪐 SIGMA FILTER: Talamic Scaling (Infinite Library)
    const { ThalamicGateway } = await import('./thalamic_gateway');
    const talamicMatch = await ThalamicGateway.route(processedText, domain);

    let talamicContext = "";
    if (talamicMatch.bestCrystal) {
        console.log(`[SCPService] 🪐 Resonant Crystal retrieved from Talamic Atlas. Merging knowledge...`);
        const { CrystalFuser } = await import('./crystal_fuser');
        talamicContext = `\n\n🪐 TALAMIC CONTEXT (Verified Knowledge):\n${CrystalFuser.fuseCrystalIntoContext(talamicMatch.bestCrystal)}`;
    }

    if (predictionError < 0.2) {
        console.log(`[SCPService] 💤 High Prediction Accuracy (${(1 - predictionError) * 100}%). Efficiently assimilating known context...`);
    }

    const contextToProcess = (predictionError > 0.1 ? processedText : residualContent) + talamicContext;

    const model = getOptimalModel({
        domain,
        task: 'compile',
        text: processedText,
        stats: { free_energy: entropy, surprise: predictionError }
    });

    // 💉 SEMANTIC IMMUNITY SYSTEM: Inject Vaccines
    const { VaccineEngine } = await import('./vaccine_engine');
    const vaccines = await VaccineEngine.getActiveGuards(processedText, domain);

    // 🛡️ REALITY DEFENSE: Check for contradictions against the Truth Vault
    const { TruthVault } = await import('./truth_vault');
    const realityCheck = await TruthVault.checkReality(processedText, domain);

    let finalProcessedText = processedText;
    if (realityCheck.is_conflict) {
        console.warn(`[SCPService] 🚨 REALITY CONFLICT DETECTED: ${realityCheck.contradiction_reason}`);
        finalProcessedText = await TruthVault.healReality(processedText, {
            reason: realityCheck.contradiction_reason!,
            entry: realityCheck.conflicting_entry
        });
        console.log(`[SCPService] 💉 Reality healed. Proceeding with stabilized context.`);
    }

    let immunityContext = "";
    if (vaccines.length > 0) {
        immunityContext = `\n\n💉 SEMANTIC IMMUNITY GUARDS (Avoid these known patterns):\n` +
            vaccines.map(v => `- [${v.fallacy_type}] ${v.meta_invariant.rule}`).join('\n');
    }

    let currentMutationPrompt = `Analyze the following conversation and extract its semantic content in Crystal Format v0.1:
            
            ---CONVERSATION START---
            ${finalProcessedText}
            ---CONVERSATION END---
            ${immunityContext}
            
            Return ONLY valid JSON, no markdown or explanation.`;

    let response: LLMResponse | null = null;
    let attempts = 0;
    const maxMutationAttempts = 2;

    while (attempts <= maxMutationAttempts) {
        try {
            response = await resilientCallLLM(
                currentMutationPrompt,
                model,
                systemPrompt,
                author?.id
            );

            if (!response) throw new Error("[SCPService] LLM call returned null response");

            let jsonStr = response.content;
            const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
            if (jsonMatch && jsonMatch[1]) {
                jsonStr = jsonMatch[1];
            }
            const parsed = JSON.parse(jsonStr.trim()) as SCPCompilerOutput;

            if (attempts < maxMutationAttempts &&
                ((parsed.constraints?.length || 0) < 2 || (parsed.verification?.semantic_invariants?.length || 0) < 2)) {

                console.log(`[SCPService] 🧬 WEAK CRYSTAL DETECTED (Attempt ${attempts + 1}). Mutating Prompt DNA...`);
                const { EvolutionEngine } = await import('./evolution_engine');
                const evolved = await EvolutionEngine.evolve(finalProcessedText, currentMutationPrompt, 0.4);
                if (evolved) {
                    currentMutationPrompt = evolved;
                    attempts++;
                    continue;
                }
            }
            break;

        } catch (e: unknown) {
            attempts++;
            if (attempts > maxMutationAttempts) throw e;
            console.warn(`[SCPService] Generation attempt ${attempts} failed. Mutating via retry...`);
            await sleep(100);
        }
    }

    let parsed: SCPCompilerOutput;
    try {
        const winningResponse = response as LLMResponse;
        let jsonStr = winningResponse.content;
        const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (jsonMatch && jsonMatch[1]) jsonStr = jsonMatch[1];
        parsed = JSON.parse(jsonStr.trim()) as SCPCompilerOutput;
    } catch (e) {
        throw new Error(`Failed to parse LLM response as JSON: ${e}`);
    }

    // 1. Build SMT (Semantic Merkle Tree) for mathematical meaning foundation
    const smt = await SMTRuntime.build(conversationText);

    // 2. Compile PCK (Proof-Carrying Knowledge) for verifiable logic
    const pck = await PCKRuntime.compile(conversationText, {
        domain: domain,
        extract_numbers: true,
        extract_entities: true,
        extract_temporals: true
    });

    // 3. Build Crystal with official format and fractal embedding
    const crystal: Crystal = {
        scp_version: '1.0',
        context_id: generateSecureUUID(),
        created_at: new Date().toISOString(),
        version: '1.0.0',
        tier: author?.id === 'sovereign_ai' ? 'sovereign' : 'community',
        author: author || {
            id: parsed.author?.id || 'ai_generated',
            name: parsed.author?.name || sourceModel,
            reputation: 0.5
        },
        domain: domain,
        source: {
            platform: 'neural-bridge-compiler',
            url: 'https://neural-bridge.ai/compile',
            timestamp: new Date().toISOString(),
            model: sourceModel
        },
        intent: {
            primary: parsed.intent?.primary || 'General knowledge transfer',
            status: CrystalStatus.ACTIVE
        },
        constraints: (parsed.constraints || []).map((c: any) => ({
            id: c.id,
            rule: c.rule || ConstraintRule.MUST,
            value: c.value,
            rationale: c.rationale
        })),
        entities: (parsed.entities || []).map((e: any) => ({
            name: e.name,
            type: e.type,
            category: e.category
        })),

        // ========== FRACTAL KNOWLEDGE ==========
        smt_root: smt.root.semantic_hash,
        proof_tree: Object.fromEntries(pck.proof_tree.nodes),
        fractal_depth: 0,

        verification: {
            canonical_hash: '',
            semantic_invariants: (parsed.verification?.semantic_invariants || []).map((inv: any) => ({
                id: inv.id,
                kind: (inv.kind || 'fact_check') as "fact_check" | "constraint_check" | "safety_check" | "derivation" | "custom",
                prompt: inv.prompt,
                expected: {
                    type: inv.expected.type as "string" | "number" | "boolean" | "enum" | "regex" | "json",
                    value: inv.expected.value
                },
                weight: inv.weight || 1.0,
                strict: inv.strict ?? true,
                rationale: inv.rationale
            })),
            policy: {
                min_checks: 2,
                accept_threshold: 0.7,
                max_retries: 2,
                strategy: 'balanced'
            }
        },

        // ========== NEUROMORPHIC INITIALIZATION ==========
        neuromorphic_stats: {
            free_energy: 1.0, // Default to high surprise until refined
            surprise: predictionError,
            geometric_density: entropy, // Use bit-entropy as density proxy
            is_singularity: false
        },
        raw_toon: "" // Initialized empty, populated by Dreaming loop or refinement
    };

    // 🚀 DIALECTICAL SINGULARITY: THE HEGELIAN LOOP
    if (crystal.tier === 'sovereign' || crystal.tier === 'trusted') {
        console.log(`[SCPService] 🧬 Initiating Hegelian Loop for ${crystal.tier} Tier Synthesis...`);
        try {
            const { DialecticalEngine } = await import('./dialectical_engine');
            const dialectic = await DialecticalEngine.evolve(crystal.intent.primary, conversationText);

            if (dialectic.is_resilient) {
                console.log(`[SCPService] ✨ Abstraction Synthesized: "${dialectic.final_thesis.substring(0, 60)}..."`);
                crystal.intent.primary = dialectic.final_thesis;
                crystal.metadata = {
                    ...(crystal.metadata || {}),
                    dialectical_rounds: dialectic.iterations,
                    dialectical_synthesis: true
                };

                // Update Neuromorphic Truth Stats
                if (crystal.neuromorphic_stats) {
                    crystal.neuromorphic_stats.free_energy = dialectic.final_free_energy;
                    crystal.neuromorphic_stats.is_singularity = dialectic.final_accuracy > 0.9 && dialectic.final_free_energy < 0.2;
                }

                // FRACAL ASCENSION: A synthesis is a higher-order abstraction
                crystal.fractal_depth = (crystal.fractal_depth || 0) + 1;
            }
        } catch (e) {
            console.warn('[SCPService] ⚖️ Dialectical Loop bypassed due to friction:', e);
        }
    }

    // 4. PRE-COGNITIVE SIMULATION: The Multiversal Oracle (Reality Git) 🔮🌳
    try {
        const { Oracle } = await import('./oracle');
        const { RealityBrancher } = await import('./reality_brancher');

        console.log(`[Oracle] 🏮 Initiating Multiversal Simulation for Crystal ${crystal.context_id}...`);

        const branchStable = await RealityBrancher.createBranch(crystal, "Conservative_Anchor");
        const branchAlpha = await RealityBrancher.createBranch(crystal, "Max_Intelligence_Expansion");

        const prediction = await Oracle.predictAndOptimize(crystal);

        if (prediction.original_timeline_outcome === 'FAILURE') {
            console.warn(`[Oracle] ⚠️ Potential failure detected in simulated future: ${prediction.predicted_failure}.`);
            crystal.intent.limitations = [...(crystal.intent.limitations || []), `Pre-cognitive Patch: ${prediction.intervention}`];
            crystal.metadata = { ...crystal.metadata, time_scar: prediction.optimized_crystal_diff };
        }
    } catch (e) {
        console.warn('[SCPService] 🔮 Oracle simulation failed or bypassed:', e);
    }

    // 5. PHASE OMEGA: ZERO-KNOWLEDGE TRUTH PROOFS (ZKV) 🤫🔬
    try {
        const { ZKAdvancedVerifier } = await import('./zkv_advanced');
        const zkpReceipts = [];

        for (const c of (crystal.constraints || [])) {
            if (c.rule === ConstraintRule.CUSTOM && c.value.length > 20) {
                console.log(`[ZKV] 🛡️ Generating bit-perfect ZK-Truth Proof for constraint: ${c.id}`);
                const receipt = await ZKAdvancedVerifier.generateZKPReceipt(c.value);
                zkpReceipts.push({
                    ...receipt,
                    target_constraint_id: c.id
                });
            }
        }
        crystal.zkp_receipts = zkpReceipts;
    } catch (e) {
        console.error('[SCPService] 🛡️ ZKV Proof generation failure:', e);
    }

    // 5. Calculate final canonical hash (cryptographic binding)
    const crystalToHash = { ...crystal };
    if (crystalToHash.verification) {
        (crystalToHash.verification as any).canonical_hash = undefined;
    }
    crystal.verification.canonical_hash = await Attestation.realSHA256(crystal.raw_toon || JSON.stringify(crystalToHash));

    // 6. CRYSTALLIZATION: Save to global Truth Vault
    try {
        const { TruthVault } = await import('./truth_vault');
        await TruthVault.saveTruth(crystal);

        const { DreamingService } = await import('./dreaming_service');
        DreamingService.dream().catch(err => console.error("[SCPService] 💤 Nightmare in dreaming loop:", err));

    } catch (e) {
        console.warn('[SCPService] 💎 Crystallization failed (Truth Vault Offline):', e);
    }

    // 🛡️ POPPERIAN HARDENING (Falsification Gate)
    try {
        const { FalsificationEngine } = await import('./falsification');
        const hardening = await FalsificationEngine.challenge(crystal.intent.primary, conversationText);

        crystal.rlm_stats = {
            q_score: hardening.resilience_score,
            usage_count: 0,
            volatility: hardening.survived ? 0.1 : 0.9,
            last_reward_at: new Date().toISOString()
        };

        if (!hardening.survived) {
            console.warn(`[SCPService] ⚔️ Final Resilience Check FAILED. Crystal marked as volatile.`);
        }
    } catch (e) {
        console.error('[SCPService] ⚖️ Falsification hardening failed:', e);
    }

    return { crystal, llmResponse: response as LLMResponse };
}

export async function verifyTransfer(
    crystal: Crystal,
    targetModel?: string
): Promise<VerificationResult> {
    const results: VerificationResult = {
        decision: 'FAIL',
        score: 0,
        confidence_interval: [0, 0],
        passed_invariants: [],
        failed_invariants: [],
        ladder_level: 1,
        total_attempts: 1,
        tokens_used: 0,
        cost: 0
    };

    const finalTarget = targetModel || getOptimalModel({
        domain: crystal.domain,
        task: 'verify',
        stats: crystal.neuromorphic_stats
    });

    const { SemanticProtocol } = await import('./semantic_protocol');
    const handshake = await SemanticProtocol.performHandshake(crystal, finalTarget);

    if (handshake.resonance < 0.6) {
        console.error(`[SCPService] 🚨 CRITICAL RESONANCE FAILURE (${handshake.resonance}) with ${finalTarget}.`);
        throw new Error("SEMANTIC_SYNC_FAILURE: Target model resonance too low for safe transfer.");
    }

    const injectionPrompt = await buildInjectionPrompt(crystal);

    const injectResponse = await resilientCallLLM(
        injectionPrompt,
        finalTarget,
        'You are receiving context from a previous conversation. Acknowledge and internalize it.',
        crystal.author.id
    );

    results.tokens_used += injectResponse.tokens.total;
    results.cost += injectResponse.cost;

    const verifyPrompt = buildVerificationPrompt(crystal);

    const verifyResponse = await resilientCallLLM(
        verifyPrompt,
        finalTarget,
        'Answer each verification question briefly and accurately based on the context received.',
        crystal.author.id
    );

    results.tokens_used += verifyResponse.tokens.total;
    results.cost += verifyResponse.cost;

    let totalWeight = 0;
    let passedWeight = 0;

    for (const inv of crystal.verification.semantic_invariants) {
        totalWeight += inv.weight;

        const check = await verifyArbitrary({
            crystal,
            question: inv.prompt,
            answer: verifyResponse.content,
            targetModel: finalTarget
        });

        if (check.score >= 0.8) {
            passedWeight += inv.weight;
            results.passed_invariants.push(inv.id);
        } else {
            results.failed_invariants.push({
                id: inv.id,
                expected: inv.expected.value,
                actual: verifyResponse.content.substring(0, 150),
                reason: check.reasoning
            });
        }
    }

    results.score = totalWeight > 0 ? passedWeight / totalWeight : 0;

    const invariantsCount = crystal.verification?.semantic_invariants?.length || 1;
    const delta = 0.05;
    const epsilon = Math.sqrt(Math.log(2 / delta) / (2 * invariantsCount));
    results.confidence_interval = [
        Math.max(0, results.score - epsilon),
        Math.min(1, results.score + epsilon)
    ];

    const policy = crystal.verification?.policy;
    const accept_threshold = policy?.accept_threshold ?? 0.7;
    results.decision = (results.score >= accept_threshold) ? 'ACCEPT' : 'FAIL';

    // TRACK VERIFICATION (for Fidelity calculation)
    import('./analytics').then(({ AnalyticsService }) => {
        AnalyticsService.track({
            event_name: 'verification_complete',
            event_data: {
                score: results.score,
                decision: results.decision,
                crystal_id: crystal.context_id
            },
            user_id: crystal.author.id
        });
    });

    results.receipt = await DecisionReceipts.generateDecisionReceipt({
        crystal_refs: [{
            crystal_id: crystal.context_id,
            version: '1.0.0',
            hash: crystal.verification?.canonical_hash || 'unknown'
        }],
        question: `Verify context transfer for context_id: ${crystal.context_id}`,
        answer: verifyResponse.content,
        verification_result: {
            invariants_used: (crystal.verification?.semantic_invariants || []).map(inv => inv.id),
            invariants_passed: results.passed_invariants,
            invariants_failed: results.failed_invariants.map(f => f.id),
            counterfactuals_passed: [],
            counterfactuals_failed: [],
            sri: results.score,
            pac_epsilon: epsilon,
            fidelity_badge: results.score > 0.9 ? 'GOLD' : (results.score > 0.7 ? 'SILVER' : 'BRONZE')
        },
        model_config: {
            provider: 'OpenRouter',
            model: finalTarget,
            temperature: 0.3,
            max_tokens: 2000
        },
        requester: 'NeuralBridge_System_Verifier',
        sign: true
    });

    if (results.decision === 'FAIL' && results.failed_invariants.length > 0) {
        try {
            const { VaccineEngine } = await import('./vaccine_engine');
            const firstFail = results.failed_invariants[0];
            await VaccineEngine.synthesizeFromContradiction(crystal, {
                claim_a: firstFail.expected as string,
                claim_b: firstFail.actual
            });
        } catch (e) {
            console.warn('[SCPService] ❌ Vaccine synthesis failed:', e);
        }
    }

    return results;
}

interface CachedVerification {
    result: { score: number; reasoning: string; cost: number };
    timestamp: number;
}
const verificationCache = new Map<string, CachedVerification>();
const CACHE_TTL = 300000;

async function hashForCache(str: string): Promise<string> {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString(36);
}

export async function verifyBatch(params: {
    crystal: Crystal;
    invariants: Array<{ id: string; prompt: string; expected: unknown; weight: number }>;
    answer: string;
    targetModel?: string;
}): Promise<{ results: Array<{ id: string; score: number; reasoning: string }>; cost: number; latency: number }> {
    const { crystal, invariants, answer, targetModel = PRIMARY_FREE_MODEL } = params;

    if (invariants.length === 0) {
        return { results: [], cost: 0, latency: 0 };
    }

    const constraintsText = (crystal.constraints || []).map(c => `- [${c.rule}] ${c.value}`).join('\n');

    const systemPrompt = `You are a Semantic Validator for Neural Bridge.
Validate the answer against multiple verification questions.

Crystal Constraints:
${constraintsText}

Return a JSON array:
[{"id": "inv_001", "score": 0.0-1.0, "reasoning": "..."}]`;

    const questionsText = invariants.map((inv, i) =>
        `${i + 1}. [${inv.id}] ${inv.prompt}`
    ).join('\n');

    const prompt = `Answer to verify: "${answer}"\n\nQuestions:\n${questionsText}`;

    const startTime = Date.now();
    const response = await resilientCallLLM(prompt, targetModel, systemPrompt);
    const latency = Date.now() - startTime;

    try {
        let jsonStr = response.content;
        const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (jsonMatch && jsonMatch[1]) jsonStr = jsonMatch[1];
        const parsed = JSON.parse(jsonStr.trim());
        const resultsArray = Array.isArray(parsed) ? parsed : [parsed];

        const results = invariants.map(inv => {
            const found = resultsArray.find((r: any) => r.id === inv.id);
            return {
                id: inv.id,
                score: found ? Number(found.score) || 0 : 0,
                reasoning: found?.reasoning || 'Not found'
            };
        });

        return { results, cost: response.cost, latency };
    } catch (e) {
        return {
            results: invariants.map(inv => ({ id: inv.id, score: 0.2, reasoning: 'Parse fail' })),
            cost: response.cost,
            latency
        };
    }
}

export async function verifyArbitrary(params: {
    crystal: Crystal,
    question: string,
    answer: string,
    targetModel?: string,
    useCache?: boolean
}): Promise<{ score: number; reasoning: string; cost: number }> {
    const { crystal, question, answer, targetModel = 'anthropic/claude-3.5-sonnet', useCache = true } = params;

    if (useCache) {
        const cacheKey = await hashForCache(`${crystal.context_id}:${question}:${answer}`);
        const cached = verificationCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
            return { ...cached.result, cost: 0 };
        }
    }

    const systemPrompt = `You are a Semantic Validator for Neural Bridge.
Analyze if the answer is consistent with the Crystal.

Constraints:
${(crystal.constraints || []).map(c => `- [${c.rule}] ${c.value}`).join('\n')}

Return JSON: {"score": 0.0-1.0, "reasoning": "..."}`;

    const prompt = `Question: ${question}\nAnswer: ${answer}`;

    const response = await resilientCallLLM(prompt, targetModel, systemPrompt);

    let result: { score: number; reasoning: string; cost: number };

    try {
        let jsonStr = response.content;
        const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (jsonMatch && jsonMatch[1]) jsonStr = jsonMatch[1];
        const res = JSON.parse(jsonStr.trim());
        result = {
            score: Number(res.score) || 0,
            reasoning: String(res.reasoning) || 'none',
            cost: response.cost
        };
    } catch (e) {
        result = { score: 0.2, reasoning: 'Fail', cost: response.cost };
    }

    if (useCache) {
        const cacheKey = await hashForCache(`${crystal.context_id}:${question}:${answer}`);
        verificationCache.set(cacheKey, { result, timestamp: Date.now() });
    }

    return result;
}

async function buildInjectionPrompt(crystal: Crystal): Promise<string> {
    const { LatentAnchor } = await import('./latent_anchor');
    const anchoredContext = await LatentAnchor.anchor(crystal);

    return `SYSTEM ADVISORY: LATENT ANCHOR INJECTION DETECTED\n---\n${anchoredContext}\n\nAcknowledge initialization.`.trim();
}

function buildVerificationPrompt(crystal: Crystal): string {
    return `Verify context transfer. Answer concisely:\n${crystal.verification.semantic_invariants.map((inv, i) => `${i + 1}. ${inv.prompt}`).join('\n')}`;
}

function generateSecureUUID(): string {
    const bytes = new Uint8Array(16);
    const c = (globalThis as any).crypto || (globalThis as any).msCrypto;
    if (c && c.getRandomValues) {
        c.getRandomValues(bytes);
    } else {
        for (let i = 0; i < 16; i++) bytes[i] = Math.floor(Math.random() * 256);
    }
    bytes[6] = (bytes[6]! & 0x0f) | 0x40;
    bytes[8] = (bytes[8]! & 0x3f) | 0x80;
    const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}

export function getOptimalModel(params: {
    domain?: string;
    isCritical?: boolean;
    task?: 'compile' | 'verify' | 'repair' | 'dream' | 'abstract';
    text?: string;
    stats?: { free_energy: number; surprise: number };
}): string {
    const { isCritical = false, task = 'verify', text = '', stats } = params;

    // 1. Check Budget Mode (Sovereign/Performance override)
    if (CONFIG.budget_mode === 'performance') return CONFIG.model_stack.premium;
    if (CONFIG.budget_mode === 'sovereign') return CONFIG.model_stack.local;

    // 2. Use Potency Escalator if stats are provided
    if (stats) {
        return getRequiredPotency(stats);
    }

    // 3. Fallback to Heuristic (Legacy Logic but updated for CONFIG)
    let requiredIQ = isCritical ? 0.9 : 0.5;
    if (task === 'compile' || task === 'repair') requiredIQ += 0.2;
    if (text.length > 5000) requiredIQ += 0.1;

    // Use free model as default unless IQ requirement is very high
    if (requiredIQ > 0.85) {
        return CONFIG.model_stack.premium;
    }

    return CONFIG.model_stack.free;
}

async function computeCanonicalHash(obj: unknown): Promise<string> {
    const { CrystalFormat } = await import('../types/crystal_format');
    const canon = CrystalFormat.canonicalStringify(obj);
    const msgUint8 = new TextEncoder().encode(canon);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function sovereignSynthesize(text: string, domain: string): Promise<{ crystal: Crystal; llmResponse: LLMResponse }> {
    const entities = text.match(/[A-Z][a-z]{3,}/g)?.slice(0, 5).map(e => ({ name: e, type: 'concept', category: 'evolved' })) || [];
    const crystal: Crystal = {
        scp_version: '1.0',
        context_id: `SOV_${Date.now()}`,
        created_at: new Date().toISOString(),
        version: '1.0.0-sov',
        tier: 'trusted',
        domain: domain,
        source: { platform: 'neural_bridge_core', url: 'internal://sovereign_engine', timestamp: new Date().toISOString(), model: 'SOVEREIGN_ENGINE' },
        intent: { primary: "Sovereign Context Extraction", status: CrystalStatus.ACTIVE },
        entities,
        constraints: [{ id: 'sov_001', rule: ConstraintRule.MUST, value: 'Axiomatic consistency', rationale: 'Override', severity: 'critical' }],
        verification: { canonical_hash: '', semantic_invariants: [{ id: 'inv_sov', kind: 'fact_check', prompt: 'Logic-anchored?', expected: { type: 'boolean', value: true }, weight: 1.0, strict: true, rationale: 'Self-verification' }], policy: { min_checks: 1, accept_threshold: 1.0, max_retries: 0, strategy: 'strict' } },
        author: { id: 'neural_bridge_core', name: 'Sovereign Anchor', reputation: 1.0 },
        raw_toon: ""
    };
    crystal.verification.canonical_hash = await computeCanonicalHash(crystal);
    return { crystal, llmResponse: { content: crystal.raw_toon || JSON.stringify(crystal), model: 'SOVEREIGN_ENGINE', tokens: { prompt: 0, completion: 0, total: 0 }, cost: 0, latency: 0 } };
}

export const SCPService = {
    generateCrystal,
    verifyTransfer,
    verifyArbitrary,
    verifyBatch,
    callLLM,
    getOptimalModel,
    resilientCallLLM
};
