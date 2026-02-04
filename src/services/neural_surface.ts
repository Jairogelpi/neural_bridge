import { SCPService } from './llm';
import { TalamicIndex } from './talamic_index';
import { CONFIG } from '../config';
import type { Crystal } from '../types/crystal_format';
import { ToonService } from '../../dashboard/src/lib/toon';

export interface ChatSession {
    id: string;
    active_crystal_ids: string[];
    history: Array<{ role: 'user' | 'assistant'; content: string }>;
    created_at: string;
}

/**
 * NEURAL SURFACE (Talk to my Knowledge) 💬🧠
 * 
 * Capability: Crystal-Grounded Reasoning.
 * Orchestrates chat sessions where the LLM is strictly bound 
 * to the axioms defined in selected Crystals.
 */
export class NeuralSurface {

    private static activeSessions: Map<string, ChatSession> = new Map();

    /**
     * INITIATE CHAT: Starts a session bound to specific crystals.
     */
    static async initiateSession(crystalIds: string[]): Promise<string> {
        const sessionId = `SESSION_${Date.now()}`;
        this.activeSessions.set(sessionId, {
            id: sessionId,
            active_crystal_ids: crystalIds,
            history: [],
            created_at: new Date().toISOString()
        });
        console.log(`[NeuralSurface] 💬 Session ${sessionId} initiated with ${crystalIds.length} crystals.`);
        return sessionId;
    }

    /**
     * GROUNDED CHAT: Send a prompt to the LLM filtered by active crystals.
     */
    static async groundedChat(sessionId: string, userPrompt: string): Promise<string> {
        const session = this.activeSessions.get(sessionId);
        if (!session) throw new Error("Session not found");

        console.log(`[NeuralSurface] 💬 Processing grounded query: "${userPrompt.substring(0, 50)}..."`);

        // 1. Retrieve Knowledge Snippets from Active Crystals
        // We use the TalamicIndex to find the most relevant "geometric neighbors"
        // specifically within the context of the active crystals.
        const nodes = await TalamicIndex.search(userPrompt, 5);
        const filteredNodes = nodes.filter(n =>
            session.active_crystal_ids.some(id => n.node.metadata.source_id.includes(id))
        );

        const context = filteredNodes.map(n => n.node.metadata.preview).join("\n---\n");

        // 2. Synthesize Grounded Prompt
        const systemPrompt = `
        ACT AS A SOVEREIGN KNOWLEDGE ORACLE.
        Your responses MUST be strictly grounded in the FOLLOWING VERIFIED KNOWLEDGE:
        
        KNOWLEDGE BASE:
        ${context || "No direct crystals found for this specific query. Stick to general neuromorphic principles."}
        
        CONSTRAINTS:
        - If the information is not in the knowledge base, state it clearly.
        - Do not speculate beyond the provided axioms.
        - Maintain absolute factual fidelity.
        `;

        // 3. Call LLM (Using Potency Escalator)
        const response = await SCPService.resilientCallLLM(
            userPrompt,
            CONFIG.model_stack.flash,
            systemPrompt
        );

        // 4. Update History
        session.history.push({ role: 'user', content: userPrompt });
        session.history.push({ role: 'assistant', content: response.content });

        return response.content;
    }

    static getSession(id: string): ChatSession | undefined {
        return this.activeSessions.get(id);
    }

    /**
     * RECURSIVE REFINEMENT: Evolve crystals based on interaction success.
     */
    static async refineKnowledge(sessionId: string, interactionResult: string): Promise<void> {
        const session = this.activeSessions.get(sessionId);
        if (!session || session.active_crystal_ids.length === 0) return;

        console.log(`[NeuralSurface] 🧬 Initiating Recursive Refinement for ${session.active_crystal_ids.length} crystals...`);

        const { TruthVault } = await import('./truth_vault');
        const { EvolutionEngine } = await import('./evolution_engine');

        for (const crystalId of session.active_crystal_ids) {
            // 1. Fetch current crystal
            const { data: rawCrystal } = await (await import('../db/supabase')).supabase
                .from('crystals')
                .select('*')
                .eq('context_id', crystalId)
                .single();

            if (!rawCrystal) continue;

            const crystal = rawCrystal as unknown as Crystal;

            // 2. Synthesize refinement prompt
            const refinementPrompt = `
            NEURAL REFINEMENT PROTOCOL
            ---
            You are a Knowledge Architect. Analyze the following interaction and refine the CRYSTAL to incorporate new nuances, corrections, or deeper understanding discovered during the conversation.
            
            CRYSTAL (Current State):
            ${crystal.raw_toon || JSON.stringify(crystal.constraints)}
            
            INTERACTION OUTCOME:
            "${interactionResult}"
            
            TASK: Mutate the crystal's TOON manifold to reflect this growth. 
            Do not lose existing truth, but sharpen its accuracy.
            
            Return ONLY a valid TOON manifold.
            `;

            try {
                const response = await SCPService.resilientCallLLM(refinementPrompt, CONFIG.model_stack.flash, 'Knowledge Architect');
                const nextToon = response.content.trim();
                const toonData = ToonService.parse(nextToon);

                if (toonData.constraints?.length > 0) {
                    // 3. FRACTAL EVOLUTION (The Singularity Step)
                    // Instead of overwriting, we birth a new crystal that inherits the lineage.
                    const { SynapticBinder } = await import('./synaptic_binder');

                    console.log(`[NeuralSurface] 🧬 Spawning fractal child for Crystal ${crystal.context_id.substring(0, 8)}...`);

                    const childCrystal = await SynapticBinder.fractalize(crystal, nextToon, 'REFINEMENT');

                    // Apply the new data to the child
                    childCrystal.raw_toon = nextToon;
                    childCrystal.constraints = (toonData.constraints || []).map((c: any) => ({
                        id: `c_${Math.random().toString(36).substr(2, 4)}`,
                        rule: c.type || 'MUST',
                        value: c.value,
                        rationale: 'interaction_refinement'
                    }));

                    // Bind the child to the cortex (discover synapses)
                    const boundCrystal = await SynapticBinder.bind(childCrystal);

                    // Persist the new truth
                    await TruthVault.saveTruth(boundCrystal);

                    // Ideally, we mark the old one as superseded or keep it active but lower version
                    console.log(`[NeuralSurface] ✨ Fractal Evolution Complete. New Child: ${boundCrystal.context_id}`);
                }
            } catch (e) {
                console.warn(`[NeuralSurface] 🧬 Refinement failed for crystal ${crystalId}:`, e);
            }
        }
    }
}
