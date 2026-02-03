
import { TalamicIndex } from './talamic_index';
import { DomainHeuristics } from './domain_heuristics';

export interface IngestSource {
    type: 'text' | 'url' | 'file';
    content: string;
    metadata?: Record<string, any>;
}

/**
 * SYNAPTIC INGESTOR (Zero-Friction Gateway) ⚡🔌
 * 
 * Capability: Universal Plug-and-Play.
 * It takes any raw input and proactively prepares it for the Talamic Singularity.
 * No manual chunking or DB setup needed.
 */
export class SynapticIngestor {

    /**
     * QUICK INGEST: The "One-Click" entry point.
     * Automatically detects domain, cleans text, and pushes to Atlas.
     */
    static async fastPlug(source: IngestSource): Promise<{
        nodesIndexed: number;
        detectedDomain: string;
        resonanceScore: number;
    }> {
        console.log(`[SynapticIngestor] 🔌 Plug-and-Play initiated for source type: ${source.type}`);

        // 1. Clean and Normalize
        const cleanText = this.normalizeContent(source.content);

        // 2. Autonomous Domain Detection
        const { domain, confidence } = await DomainHeuristics.detect(cleanText);
        console.log(`[SynapticIngestor] 🧠 Autonomous Onboarding: Detected domain "${domain}" (Confidence: ${confidence.toFixed(2)})`);

        // 3. Automated Sigma Ingestion (Talamic Atlas)
        const sourceId = source.metadata?.name || `plug_${Date.now()}`;
        await TalamicIndex.ingest(cleanText, sourceId, domain);

        const nodes = TalamicIndex.getAtlasSize();

        return {
            nodesIndexed: nodes,
            detectedDomain: domain,
            resonanceScore: confidence
        };
    }

    /**
     * NORMALIZE CONTENT: Strips boilerplate and prepared for HDC projection.
     */
    private static normalizeContent(text: string): string {
        // Remove excessive whitespace, HTML tags if any, etc.
        return text
            .replace(/<[^>]*>?/gm, '')
            .replace(/\s+/g, ' ')
            .trim();
    }

    /**
     * BATCH INGEST: For entire folders or complex datasets.
     */
    static async batchPlug(contents: IngestSource[]): Promise<number> {
        let total = 0;
        for (const item of contents) {
            const res = await this.fastPlug(item);
            total += res.nodesIndexed;
        }
        return total;
    }
}
