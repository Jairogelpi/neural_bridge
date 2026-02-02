import { SCPService } from './llm';
import { Sentinel } from './sentinel';
import { Crystal } from '../types/crystal_format';

export interface EvolvedOntology {
    domain: string;
    axioms: string[];
    confidence: number;
    discovered_at: string;
}

/**
 * DOMAIN EVOLVER 🧠🌀
 * 
 * Goal: Autonomously discover and map new knowledge domains in real-time.
 * If the system encounters a "random" or unknown topic, it synthesizes 
 * an ad-hoc ontology to master it.
 */
export class DomainEvolver {
    private static evolvedCache: Map<string, EvolvedOntology> = new Map();

    /**
     * Detects or evolves a domain from unstructured text.
     */
    static async evolveDomain(text: string): Promise<EvolvedOntology> {
        // 1. Check if text belongs to an existing "standard" domain (simplified for demo)
        const standardDomains = ['finance', 'medicine', 'law', 'tech', 'physics', 'logic'];

        // 2. If it's something 'random', start evolution
        console.log(`[DomainEvolver] 🧠 Analyzing context for evolutionary potential...`);

        const evolutionPrompt = `
        ACT AS AN ONTOLOGICAL ARCHITECT.
        The following text does not fit any standard knowledge domain.
        
        TEXT: "${text.substring(0, 500)}"
        
        TASK:
        1. Synthesize a UNIQUE domain name for this knowledge.
        2. Extract 3 fundamental AXIOMS (rules) that govern this specific "random" reality.
        3. Assign an Evolution Confidence score (0.0 to 1.0).
        
        Return JSON:
        {
            "domain": "...",
            "axioms": ["...", "...", "..."],
            "confidence": 0.0
        }
        `;

        let res;
        try {
            res = await SCPService.resilientCallLLM(evolutionPrompt, 'nvidia/nemotron-3-nano-30b-a3b:free', 'You are a master of spontaneous ontology.');
        } catch (e: unknown) {
            const msg = (e && typeof e === 'object' && 'message' in e && typeof e.message === 'string') ? e.message : '';
            if (msg === 'SOVEREIGN_REQUIRED') {
                return {
                    domain: 'sovereign_evolution',
                    axioms: ['Logic is the only anchor', 'Structure survives chaos'],
                    confidence: 1.0,
                    discovered_at: new Date().toISOString()
                };
            }
            throw e;
        }

        let evolved;
        try {
            evolved = JSON.parse(res.content.match(/\{[\s\S]*\}/)?.[0] || '{}');
        } catch {
            evolved = { domain: 'stochastic_anomaly', axioms: [], confidence: 0.1 };
        }

        const ontology: EvolvedOntology = {
            domain: evolved.domain || 'unknown_evolution',
            axioms: evolved.axioms || [],
            confidence: Number(evolved.confidence) || 0,
            discovered_at: new Date().toISOString()
        };

        if (ontology.confidence > 0.7) {
            this.evolvedCache.set(ontology.domain, ontology);
            await Sentinel.emit({
                type: 'CHAOS_EVOLUTION',
                severity: 'info',
                message: `New Domain Evolved: ${ontology.domain.toUpperCase()}`,
                details: ontology as unknown as Record<string, unknown>
            });
        }

        return ontology;
    }
}
