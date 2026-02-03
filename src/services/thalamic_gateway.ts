
import { TalamicIndex, AtlasNode } from './talamic_index';
import { generateCrystal } from './llm';
import { Crystal } from '../types/crystal_format';

/**
 * THALAMIC GATEWAY (Attentional Routing) 🧠⚡
 * 
 * Capability: The "Thalamic Filter".
 * It receives a user query, scans the massive Atlas (TalamicIndex),
 * and decides whether to provide a "Shallow" answer or trigger a
 * "Deep" Crystallization on the relevant data.
 */
export class ThalamicGateway {

    /**
     * ROUTE QUERY: The main entry point for massive context questions.
     * 1. Search Atlas for Resonant Nodes.
     * 2. If node is already Crystallized, use it.
     * 3. If "Shallow", trigger Lazy Crystallization.
     */
    static async route(query: string, domain: string): Promise<{
        bestCrystal?: Crystal;
        contextPreview: string;
        isLazyTriggered: boolean;
    }> {
        console.log(`[ThalamicGateway] 🧠 Attention shift detected for query: "${query.substring(0, 40)}..."`);

        // 1. Scan Atlas (O(1) Resonance)
        const resonantNodes = await TalamicIndex.search(query);

        if (resonantNodes.length === 0) {
            return { contextPreview: "No resonant data found in Atlas.", isLazyTriggered: false };
        }

        const topNode = resonantNodes[0]!;

        // 2. Convergence Check
        if (topNode.metadata.is_crystallized) {
            console.log(`[ThalamicGateway] ✨ High-Fidelity Match found: Already Crystallized.`);
            // In a real system, we'd fetch the crystal from DB via context_id
            return { contextPreview: topNode.metadata.preview, isLazyTriggered: false };
        }

        // 3. LAZY CRYSTALLIZATION: Thinking on Demand
        // RAG just dumps text here. We generate an ACTUAL BINDING TRUTH.
        console.log(`[ThalamicGateway] ⏳ Shallow node identified. Triggering Lazy Crystallization...`);

        const rawSourceText = topNode.metadata.preview;

        try {
            const { crystal } = await generateCrystal(rawSourceText, 'system_sigma', {
                id: 'thalamic_lazy',
                name: 'Talamic Catalyst',
                reputation: 1.0
            });

            // Promote node status
            TalamicIndex.setCrystallized(topNode.id);

            return {
                bestCrystal: crystal,
                contextPreview: crystal.intent.primary,
                isLazyTriggered: true
            };
        } catch (e) {
            console.error(`[ThalamicGateway] 🛡️ Lazy Crystallization failed:`, e);
            return { contextPreview: topNode.metadata.preview, isLazyTriggered: false };
        }
    }
}
