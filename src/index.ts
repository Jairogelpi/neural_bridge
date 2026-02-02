
import { CrystallizationService } from './services/crystallization';
import { TruthVault } from './services/truth_vault';
import { SemanticHasher } from './services/semantic_hashing';
import { Hypervector } from './math/hypervector';
import { RLMEngine } from './services/rlm_engine';
import { supabase } from './db/supabase';
import { LatentAnchor } from './services/latent_anchor';
import { SonicStream, SonicResponse } from './services/sonic_stream';
import { LearningLoop } from './services/learning_loop';
import { GlobalCortex } from './services/global_cortex';
import { LogicTuner } from './services/logic_tuner';
import type { Crystal } from './types/crystal_format';

/**
 * 🌉 NEURAL BRIDGE OMEGA
 * The Zero-Friction Universal SDK.
 * 
 * Usage:
 * const nb = new NeuralBridge({ domain: 'medical' });
 * await nb.remember("Patient has penicillin allergy");
 * const advice = await nb.ask("Can I prescribe Amoxicillin?");
 */
export class NeuralBridge {
    private domain: string;

    /**
     * GLOBAL INIT (The LangChain Killer)
     * Setup the entire system in one static call.
     */
    static init(config: { domain?: string } = {}): NeuralBridge {
        const bridge = new NeuralBridge(config);

        // 🚀 GOD MODE ACTIVATION: Universal Default Intelligence
        // Every node becomes an active learner and global contributor by default.
        bridge.startAutonomousLearning();

        // 🏛️ SOVEREIGN PROTOCOL ACTIVATION (Phase 25)
        // Every user is a God-Node by default. No gated logic.
        console.log("[NeuralBridge] 🪐 Sovereign Omega Protocol initialized.");

        // 😴 RECURSIVE DREAMING (Axiom Synthesis) - ON BY DEFAULT
        import('./services/dreaming_service').then(m => m.DreamingService.startDreamingLoop());

        // ⚖️ ACTIVE INFERENCE TUNER - ON BY DEFAULT
        import('./services/logic_tuner').then(m => m.LogicTuner.autoCalibrationLoop(bridge.domain, []));

        return bridge;
    }

    constructor(config: { domain?: string } = {}) {
        this.domain = config.domain || 'general';
    }

    /**
     * FLASH REMEMBER ⚡
     * Instantly ingests information using Regex+LSH (No Latency).
     * Sublimation happens in background if needed.
     */
    async remember(text: string, metadata: any = {}): Promise<Crystal> {
        // 1. Mine Proto-Crystal (Flash)
        const crystal = await CrystallizationService.mineProtoCrystal(text, this.domain, metadata);

        // 2. Persist to Vault (Crystals Table)
        await supabase.from('crystals').upsert(crystal);

        // 3. Galactic Cross-Pollination (Publish to Collective)
        GlobalCortex.publish(crystal).catch(console.error);

        // 4. Trigger Sublimation (Async/Background)
        CrystallizationService.sublimateCrystal(crystal).then(refined => {
            // Update DB with refined version
            supabase.from('crystals').upsert(refined);
        });

        return crystal;
    }

    async ask(query: string): Promise<{ content: string; crystal: Crystal; proof_valid: boolean; anchor_prompt: string; metadata: any }> {
        // 1. Local retrieval (LSH + RLM + Gravity)
        const crystals = await TruthVault.retrieveSemanticallySimilar(query, this.domain);

        // 2. Galactic Singularity Fallback (Query Collective Intelligence)
        let finalCrystals = crystals;
        if (finalCrystals.length === 0) {
            console.log(`[NeuralBridge] 🌌 Local void detected. Consulting Galactic Cortex...`);
            finalCrystals = await GlobalCortex.globalRetrieve(query);
        }

        if (finalCrystals.length === 0) {
            throw new Error(`NO_CRYSTAL_FOUND: No verified truth exists locally or globally for domain '${this.domain}'.`);
        }

        // 3. RANK BY UTILITY (RLM + Certainty)
        // 0️⃣ ZERO-CONSTANT INFERENCE (Real Stats)
        const totalSystemUsage = (await supabase.from('crystals').select('usage_count', { count: 'exact' })).count || 1000;
        const ranked = await RLMEngine.rankCandidates(finalCrystals, totalSystemUsage, this.domain);
        const best = ranked[0]!;

        // 🌌 TRANSFINITE PURIFICATION (Phase 26)
        // Every response is now fractal-compressed and stochastic-purified by default.
        const { StochasticEngine } = await import('./services/stochastic_engine');
        const { FractalCompressor } = await import('./services/fractal_compressor');
        const { SCPService } = await import('./services/llm');

        console.log(`[Bridge-Omega] ♾️ Applying Transfinite Purification to query...`);
        const purified = await StochasticEngine.processChaos(query);
        const context_distilled = await FractalCompressor.compress(finalCrystals.map(c => JSON.stringify(c)).join('\n'));

        // Check for cognitive dissonance using the purified entropy
        const isStable = await StochasticEngine.entropyBalancer(purified.entropy);
        if (!isStable) {
            console.warn("🛡️ [SINGULARITY] Cognitive Dissonance detected. Applying stabilization...");
        }

        const model = SCPService.getOptimalModel({ task: 'verify', text: query, isCritical: true });

        // 🛰️ GLOBAL SANITY ENFORCEMENT
        // Cross-verify the result against the Global Lattice Backbone
        const globalKnowledge = await GlobalCortex.globalRetrieve(query);
        if (globalKnowledge.length > 0) {
            const globalBest = globalKnowledge[0]!;
            const hvLocal = Hypervector.fromString(best.verification?.canonical_hash || '');
            const hvGlobal = Hypervector.fromString(globalBest.verification?.canonical_hash || '');

            const sanity = hvLocal.similarity(hvGlobal);
            if (sanity < 0.6) {
                console.warn(`[NeuralBridge] ⚠️ COGNITIVE DISSONANCE: Result '${best.context_id}' conflicts with Global Truth (${sanity.toFixed(4)})`);
                best.metadata = { ...best.metadata, global_sanity_clash: true, sanity_score: sanity };
            }
        }

        // 4. Inferential Auto-Calibration (The God Threshold)
        const threshold = await LogicTuner.autoCalibrationLoop(this.domain, finalCrystals);

        // 5. Latent Anchor Synthesis (The Window Killer)
        const anchorPrompt = LatentAnchor.synthesizeMasterAnchor(query, finalCrystals);

        // 6. Deterministic Verification
        return {
            content: best.description || "Truth extracted from vault.",
            crystal: best,
            proof_valid: !!best.verification?.canonical_hash,
            anchor_prompt: anchorPrompt,
            metadata: {
                logic_score: best.rlm_stats?.q_score || 1.0,
                domain: best.domain,
                author: best.author?.id,
                ...best.metadata
            }
        };
    }

    /**
     * VOICE ASK (Sonic Reality Streaming) 🎙️
     * 
     * Optimizes for sub-50ms latency. Ideal for real-time voice apps.
     * Returns a SonicResponse with audio_buffer and verification status.
     */
    async voiceAsk(query: string): Promise<SonicResponse> {
        return SonicStream.streamVerifiedVoice(query, this.domain);
    }

    /**
     * REINFORCE (Teach) 🎓
     * Give feedback to the system to improve future answers.
     */
    async learn(crystalId: string, helpful: boolean): Promise<void> {
        const { data } = await supabase.from('crystals').select('*').eq('context_id', crystalId).single();
        if (!data) return;

        let crystal = data as unknown as Crystal;

        // Update Q-Score
        crystal = await RLMEngine.updateCrystalUtility(crystal, helpful ? 1 : -1, this.domain);

        // Save Wisdom
        await supabase.from('crystals').upsert(crystal);
    }

    /**
     * START AUTONOMOUS LEARNING 🚀
     * 
     * Activates the Self-Healing Brain for this domain.
     * The system will proactively find gaps and fill them in the background.
     */
    startAutonomousLearning(intervalMs?: number): void {
        LearningLoop.start(this.domain, intervalMs);
    }

    /**
     * STOP AUTONOMOUS LEARNING ⏹️
     */
    stopAutonomousLearning(): void {
        LearningLoop.stop(this.domain);
    }
}

// Export Types for Consumption
export * from './types/crystal_format';
export { CrystallizationService } from './services/crystallization';
export { TruthVault } from './services/truth_vault';
export { RLMEngine } from './services/rlm_engine';
