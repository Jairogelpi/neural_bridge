import { type Crystal, CrystalStatus, ConstraintRule } from '../types/crystal_format';
import { ToonService } from '../lib/toon';
import { CrystallizationService } from './crystallization';
import { SemanticCache } from './semantic_cache';
import { SCPService } from './llm';

export type CrystallizationTier = 'flash' | 'smart' | 'deep';

export interface TurboCrystallizeOptions {
    tier: CrystallizationTier;
    domain?: string;
    autoUpgrade?: boolean; // Auto-upgrade to Deep in background
}

/**
 * TURBO CRYSTALLIZER ⚡💎
 * 
 * Revolutionary 3-Tier Crystallization System:
 * - FLASH (0ms): Pure math, instant, 100% deterministic
 * - SMART (200ms): Fast AI, good enough for 90% of cases
 * - DEEP (2s): Full power, runs in background
 * 
 * Includes semantic caching for instant duplicate detection.
 */
export class TurboCrystallizer {

    private static backgroundQueue: Array<{ text: string, domain: string, protoId: string }> = [];
    private static isProcessingQueue = false;

    /**
     * Main entry point - intelligent tier selection with caching.
     */
    static async crystallize(
        text: string,
        options: TurboCrystallizeOptions
    ): Promise<Crystal> {
        const startTime = Date.now();

        // 1. CHECK SEMANTIC CACHE FIRST (instant if hit)
        const cached = SemanticCache.check(text);
        if (cached) {
            console.log(`[TurboCrystallizer] ⚡ Cache hit - returning in ${Date.now() - startTime}ms`);
            return cached;
        }

        // 2. ROUTE TO APPROPRIATE TIER
        let crystal: Crystal;
        switch (options.tier) {
            case 'flash':
                crystal = await this.flashCrystallize(text, options.domain || 'general');
                break;
            case 'smart':
                crystal = await this.smartCrystallize(text, options.domain || 'general');
                break;
            case 'deep':
                crystal = await this.deepCrystallize(text, options.domain || 'general');
                break;
        }

        // 3. STORE IN CACHE
        SemanticCache.store(text, crystal);

        // 4. QUEUE FOR BACKGROUND UPGRADE (if Flash/Smart + autoUpgrade enabled)
        if (options.autoUpgrade !== false && (options.tier === 'flash' || options.tier === 'smart')) {
            this.queueForUpgrade(text, options.domain || 'general', crystal.context_id);
        }

        const elapsed = Date.now() - startTime;
        console.log(`[TurboCrystallizer] ✅ ${options.tier.toUpperCase()} crystallization done in ${elapsed}ms`);

        return crystal;
    }

    /**
     * TIER 0: FLASH MODE ⚡
     * Pure mathematical crystallization - NO LLM calls.
     * Returns instantly with 100% deterministic results.
     */
    private static async flashCrystallize(text: string, domain: string): Promise<Crystal> {
        const crystal = CrystallizationService.mineProtoCrystal(text, domain);

        // Mark as Flash tier for tracking
        crystal.tags = (crystal.tags || []).concat(['tier:flash', 'speed:instant']);
        crystal.tier = 'community'; // Proto tier
        crystal.metadata = {
            ...crystal.metadata,
            turbo_tier: 'flash',
            crystallized_at: Date.now()
        };

        return crystal;
    }

    /**
     * TIER 1: SMART MODE 🧠
     * Uses fast, small AI models (~7B params) for good-enough results.
     * Target: <500ms
     */
    private static async smartCrystallize(text: string, domain: string): Promise<Crystal> {
        // Use a fast model from OpenRouter
        const fastModel = 'qwen/qwen-2.5-7b-instruct'; // Fast & free

        const systemPrompt = `You are a FAST crystallization engine. Extract key facts from this text into TOON:
{
  @intent(PRIMARY_GOAL)
  (Subject) -[Relationship]-> (Object)
  MUST [Rigid Logic Rule]
}
Be FAST. Return ONLY TOON.`;

        const response = await SCPService.resilientCallLLM(
            `Crystallize into TOON: ${text.substring(0, 1000)}`,
            fastModel,
            systemPrompt
        );

        let toonData;
        let toonContent = response.content;
        try {
            const toonMatch = toonContent.match(/```toon?\s*([\s\S]*?)```/) || toonContent.match(/\{([\s\S]*?)\}/);
            if (toonMatch) toonContent = toonMatch[1];
            toonData = ToonService.parse(toonContent);
        } catch (e) {
            // Fallback to Flash if parsing fails
            console.warn('[TurboCrystallizer] TOON parse failed, falling back to Flash');
            return this.flashCrystallize(text, domain);
        }

        const crystal: Crystal = {
            scp_version: '1.0',
            context_id: `cry_smart_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            created_at: new Date().toISOString(),
            raw_toon: toonContent,
            version: '1.0.0',
            tier: 'verified',
            domain: domain,
            tags: ['tier:smart', 'speed:fast'],
            source: {
                platform: 'neural-bridge-turbo',
                url: 'internal://smart_crystallization',
                timestamp: new Date().toISOString(),
                model: fastModel
            },
            intent: {
                primary: toonData.metadata?.intent || 'Knowledge Transfer',
                status: CrystalStatus.ACTIVE
            },
            author: {
                id: 'turbo_smart',
                name: 'Turbo Smart Engine',
                reputation: 0.7
            },
            constraints: (toonData.constraints || []).map((c: any) => ({
                id: `c_${Math.random().toString(36).substr(2, 4)}`,
                rule: c.type || ConstraintRule.MUST,
                value: c.value,
                rationale: 'Extracted truth'
            })),
            verification: {
                canonical_hash: 'pending',
                semantic_invariants: [],
                policy: {
                    min_checks: 1,
                    accept_threshold: 0.7,
                    max_retries: 1,
                    strategy: 'balanced'
                }
            },
            metadata: {
                turbo_tier: 'smart',
                crystallized_at: Date.now()
            }
        };

        return crystal;
    }

    /**
     * TIER 2: DEEP MODE 🔬
     * Full power crystallization with best models.
     * Runs in background, no rush.
     */
    private static async deepCrystallize(text: string, domain: string): Promise<Crystal> {
        const crystal = await CrystallizationService.mineCrystal(text, {
            domain,
            tier: 'trusted',
            compress: true
        });

        crystal.tags = (crystal.tags || []).concat(['tier:deep', 'speed:thorough']);
        crystal.metadata = {
            ...crystal.metadata,
            turbo_tier: 'deep',
            crystallized_at: Date.now()
        };

        return crystal;
    }

    /**
     * BACKGROUND UPGRADE SYSTEM 🔄
     * Queues Flash/Smart crystals for Deep refinement.
     */
    private static queueForUpgrade(text: string, domain: string, protoId: string): void {
        this.backgroundQueue.push({ text, domain, protoId });
        console.log(`[TurboCrystallizer] 📋 Queued ${protoId} for background upgrade(queue size: ${this.backgroundQueue.length})`);

        // Start processing if not already running
        if (!this.isProcessingQueue) {
            this.processUpgradeQueue();
        }
    }

    /**
     * Process the background upgrade queue.
     */
    private static async processUpgradeQueue(): Promise<void> {
        if (this.isProcessingQueue || this.backgroundQueue.length === 0) return;

        this.isProcessingQueue = true;
        console.log(`[TurboCrystallizer] 🔄 Starting background upgrade queue(${this.backgroundQueue.length} items)`);

        while (this.backgroundQueue.length > 0) {
            const job = this.backgroundQueue.shift();
            if (!job) break;

            try {
                console.log(`[TurboCrystallizer] ⚗️ Upgrading ${job.protoId} to Deep...`);
                const deepCrystal = await this.deepCrystallize(job.text, job.domain);

                // Mark as superseding the proto
                deepCrystal.supersedes = job.protoId;

                // Update cache with deep version
                SemanticCache.store(job.text, deepCrystal);

                console.log(`[TurboCrystallizer] ✅ Upgraded ${job.protoId} → ${deepCrystal.context_id} `);
            } catch (error) {
                console.error(`[TurboCrystallizer] ❌ Failed to upgrade ${job.protoId}: `, error);
            }

            // Small delay to avoid hammering the API
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        this.isProcessingQueue = false;
        console.log(`[TurboCrystallizer] 🏁 Background upgrade queue completed`);
    }

    /**
     * Get queue statistics.
     */
    static getQueueStats() {
        return {
            queued: this.backgroundQueue.length,
            processing: this.isProcessingQueue,
            cache: SemanticCache.stats()
        };
    }
}
