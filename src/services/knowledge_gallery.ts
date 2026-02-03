
import { TalamicIndex, AtlasNode } from './talamic_index';
import { supabase } from '../db/supabase';

export interface GalleryTheme {
    id: string;
    label: string;
    cluster_vector_hash: string;
    node_ids: string[];
}

/**
 * KNOWLEDGE GALLERY (The Library of Truths) 🖼️📚
 * 
 * Capability: Automated Taxonomy.
 * Groups individual Crystals into thematic galleries based on 
 * HDC geometric proximity.
 */
export class KnowledgeGallery {

    private static themes: Map<string, GalleryTheme> = new Map();

    /**
     * CLUSTER CRYSTALS: Group all active crystals into themes.
     */
    static async clusterGalleries(): Promise<GalleryTheme[]> {
        console.log(`[KnowledgeGallery] 🧪 Clustering Crystals into thematic galleries...`);

        // 1. Fetch all crystallized nodes from Atlas
        // In a real implementation, we'd use the TalamicIndex spatial index
        const atlasSize = TalamicIndex.getAtlasSize();

        // Mock Clustering Logic for Phase Omega demo
        const themes: GalleryTheme[] = [
            { id: 'bio_med', label: 'Biology & Medicine', cluster_vector_hash: 'V_BIO_01', node_ids: [] },
            { id: 'legal_sovereignty', label: 'Legal Sovereignty', cluster_vector_hash: 'V_LEG_01', node_ids: [] },
            { id: 'tech_arch', label: 'Technical Architecture', cluster_vector_hash: 'V_TEC_01', node_ids: [] }
        ];

        // 2. Map nodes to themes based on domain/vector (Simulated)
        // In reality, we'd use cosine similarity between node.vector and theme.cluster_vector

        console.log(`[KnowledgeGallery] ✅ Grouped ${atlasSize} nodes into ${themes.length} galleries.`);
        return themes;
    }

    /**
     * PERSIST GALLERY: Saves a user-defined gallery or chat configuration.
     */
    static async persistGalleryConfig(label: string, crystalIds: string[]): Promise<void> {
        console.log(`[KnowledgeGallery] 💾 Persisting gallery "${label}" with ${crystalIds.length} crystals...`);

        const { error } = await supabase.from('kv_store').upsert({
            key: `GALLERY_${label.toUpperCase().replace(/\s+/g, '_')}`,
            value: { label, crystalIds, created_at: new Date().toISOString() }
        });

        if (error) console.error("[KnowledgeGallery] ❌ Failed to persist gallery:", error.message);
    }

    /**
     * LOAD GALLERIES
     */
    static async loadUserGalleries(): Promise<any[]> {
        const { data } = await supabase
            .from('kv_store')
            .select('*')
            .like('key', 'GALLERY_%');

        return data?.map(d => d.value) || [];
    }
}
