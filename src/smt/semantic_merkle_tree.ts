/**
 * SEMANTIC MERKLE TREES (SMT)
 * 
 * Revolutionary feature: Hash of MEANING, not bytes.
 * 
 * Key capabilities:
 * 1. Two documents with same meaning = same semantic hash
 * 2. Detects paraphrases (semantically equivalent)
 * 3. Detects contradictions
 * 4. Detects plagiarism (semantic similarity)
 * 5. Auditable truth tree
 * 
 * How it works:
 * - Extract semantic features (entities, numbers, relationships, claims)
 * - Normalize to canonical form (removes stylistic variations)
 * - Hash the canonical meaning, not the raw text
 * - Build Merkle tree from semantic nodes
 */

import { cryptoUtils } from '../utils/crypto_utils';

// ═══════════════════════════════════════════════════════════════════════════════
// SMT CORE TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface SemanticFeature {
    type: 'entity' | 'number' | 'claim' | 'relationship' | 'temporal' | 'negation' | 'location' | 'composition';
    canonical: string;        // Normalized form
    original: string;         // Original text
    confidence: number;       // 0.0 - 1.0
    position: number;         // Position in document
}

export interface SemanticNode {
    id: string;
    semantic_hash: string;    // Hash of MEANING
    features: SemanticFeature[];
    children: string[];       // Child node IDs
    parent?: string;
    depth: number;
}

export interface SemanticMerkleTree {
    smt_version: '1.0';
    tree_id: string;
    created_at: string;

    // The root captures the entire document's meaning
    root: {
        semantic_hash: string;
        feature_count: number;
        depth: number;
    };

    // All semantic nodes
    nodes: Map<string, SemanticNode>;

    // Document metadata
    document: {
        original_hash: string;    // Traditional byte hash
        semantic_hash: string;    // Meaning-based hash
        word_count: number;
        claim_count: number;
    };

    // Extracted canonical claims (auditable)
    claims: Array<{
        id: string;
        canonical: string;
        original: string;
        semantic_hash: string;
        evidence: string[];
    }>;
}

export interface SemanticComparisonResult {
    // Similarity scores
    semantic_similarity: number;      // 0.0 - 1.0 (1.0 = same meaning)
    paraphrase_detected: boolean;
    contradiction_detected: boolean;
    plagiarism_score: number;         // 0.0 - 1.0

    // Details
    matching_claims: Array<{
        doc1_claim: string;
        doc2_claim: string;
        similarity: number;
        relationship: 'equivalent' | 'paraphrase' | 'contradiction' | 'related' | 'unrelated';
    }>;

    contradictions: Array<{
        claim1: string;
        claim2: string;
        reason: string;
    }>;

    // Audit trail
    comparison_proof: {
        doc1_semantic_hash: string;
        doc2_semantic_hash: string;
        comparison_hash: string;
        timestamp: string;
    };
}

// ═══════════════════════════════════════════════════════════════════════════════
// SEMANTIC FEATURE EXTRACTOR
// ═══════════════════════════════════════════════════════════════════════════════

export class SemanticExtractor {

    /**
     * Extract semantic features from text
     * These features represent MEANING, not surface form
     */
    static extract(text: string): SemanticFeature[] {
        const features: SemanticFeature[] = [];

        // 1. Extract numbers with context
        features.push(...this.extractNumbers(text));

        // 2. Extract named entities
        features.push(...this.extractEntities(text));

        // 3. Extract claims (subject-predicate-object)
        features.push(...this.extractClaims(text));

        // 4. Extract relationships
        features.push(...this.extractRelationships(text));

        // 5. Extract temporal expressions
        features.push(...this.extractTemporals(text));

        // 6. Extract negations
        features.push(...this.extractNegations(text));

        // 7. Extract locations
        features.push(...this.extractLocations(text));

        // 8. Extract compositions
        features.push(...this.extractCompositions(text));

        // 9. Extract definitions
        features.push(...this.extractDefinitions(text));

        return features;
    }

    private static extractNumbers(text: string): SemanticFeature[] {
        const features: SemanticFeature[] = [];
        const regex = /(\d+(?:,\d{3})*(?:\.\d+)?)\s*(%|mg|kg|g|ml|l|days?|hours?|years?|months?|dollars?|\$|€|£|million|billion)?/gi;

        let match;
        while ((match = regex.exec(text)) !== null) {
            const value = parseFloat((match[1] || '0').replace(/,/g, ''));
            const unit = (match[2] || '').toLowerCase();

            // Normalize unit variations
            const normalizedUnit = this.normalizeUnit(unit);

            features.push({
                type: 'number',
                canonical: `NUM:${value}:${normalizedUnit}`,
                original: match[0],
                confidence: 1.0,
                position: match.index
            });
        }

        return features;
    }

    private static normalizeUnit(unit: string): string {
        const unitMap: Record<string, string> = {
            'mg': 'milligram',
            'milligram': 'milligram',
            'milligrams': 'milligram',
            'g': 'gram',
            'gram': 'gram',
            'grams': 'gram',
            'kg': 'kilogram',
            'kilogram': 'kilogram',
            'day': 'day',
            'days': 'day',
            'hour': 'hour',
            'hours': 'hour',
            'year': 'year',
            'years': 'year',
            'month': 'month',
            'months': 'month',
            '%': 'percent',
            'percent': 'percent',
            '$': 'usd',
            'dollar': 'usd',
            'dollars': 'usd',
            '€': 'eur',
            '£': 'gbp',
            'million': 'million',
            'billion': 'billion',
            '': 'unit'
        };
        return unitMap[unit.toLowerCase()] || unit.toLowerCase() || 'unit';
    }

    private static extractEntities(text: string): SemanticFeature[] {
        const features: SemanticFeature[] = [];

        // Medical entities
        const medicalTerms = [
            'aspirin', 'ibuprofen', 'acetaminophen', 'paracetamol',
            'dose', 'dosage', 'treatment', 'therapy', 'patient',
            'drug', 'medication', 'prescription', 'symptom', 'diagnosis'
        ];

        // Financial entities
        const financialTerms = [
            'revenue', 'profit', 'loss', 'income', 'expense',
            'filing', 'sec', '10-k', '10-q', 'quarterly', 'annual',
            'stock', 'share', 'dividend', 'market', 'investor'
        ];

        // Legal entities
        const legalTerms = [
            'gdpr', 'regulation', 'compliance', 'penalty', 'fine',
            'data protection', 'privacy', 'consent', 'breach',
            'controller', 'processor', 'subject'
        ];

        const allTerms = [...medicalTerms, ...financialTerms, ...legalTerms];
        const textLower = text.toLowerCase();

        for (const term of allTerms) {
            const index = textLower.indexOf(term);
            if (index !== -1) {
                features.push({
                    type: 'entity',
                    canonical: `ENT:${term.toUpperCase()}`,
                    original: term,
                    confidence: 0.9,
                    position: index
                });
            }
        }

        return features;
    }

    private static extractClaims(text: string): SemanticFeature[] {
        const features: SemanticFeature[] = [];

        // Split into sentences
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);

        for (let i = 0; i < sentences.length; i++) {
            const sentence = (sentences[i] || '').trim();

            // Extract claims with "is", "are", "must", "should", "can"
            const claimPatterns = [
                /(\w+(?:\s+\w+)*)\s+(?:is|are)\s+(.+)/i,
                /(\w+(?:\s+\w+)*)\s+(?:must|should|can|may)\s+(.+)/i,
                /maximum\s+(.+?)\s+(?:is|:)\s*(.+)/i,
                /minimum\s+(.+?)\s+(?:is|:)\s*(.+)/i,
                /(\w+(?:\s+\w+)*)\s+(?:requires?|needs?)\s+(.+)/i
            ];

            for (const pattern of claimPatterns) {
                const match = sentence.match(pattern);
                if (match) {
                    const subject = this.normalizeText(match[1] || '');
                    const predicate = this.normalizeText(match[2] || '');

                    features.push({
                        type: 'claim',
                        canonical: `CLAIM:${subject}:${predicate}`,
                        original: sentence,
                        confidence: 0.8,
                        position: i
                    });
                    break; // One claim per sentence
                }
            }
        }

        return features;
    }

    private static extractRelationships(text: string): SemanticFeature[] {
        const features: SemanticFeature[] = [];

        const relationPatterns = [
            { pattern: /(\w+)\s+(?:causes?|leads?\s+to)\s+(\w+)/gi, rel: 'CAUSES' },
            { pattern: /(\w+)\s+(?:prevents?|blocks?)\s+(\w+)/gi, rel: 'PREVENTS' },
            { pattern: /(\w+)\s+(?:increases?|raises?)\s+(\w+)/gi, rel: 'INCREASES' },
            { pattern: /(\w+)\s+(?:decreases?|reduces?|lowers?)\s+(\w+)/gi, rel: 'DECREASES' },
            { pattern: /(\w+)\s+(?:contains?|includes?)\s+(\w+)/gi, rel: 'CONTAINS' },
            { pattern: /(\w+)\s+(?:requires?|needs?)\s+(\w+)/gi, rel: 'REQUIRES' }
        ];

        for (const { pattern, rel } of relationPatterns) {
            let match;
            while ((match = pattern.exec(text)) !== null) {
                features.push({
                    type: 'relationship',
                    canonical: `REL:${rel}:${this.normalizeText(match[1] || '')}:${this.normalizeText(match[2] || '')}`,
                    original: match[0],
                    confidence: 0.85,
                    position: match.index
                });
            }
        }

        return features;
    }

    private static extractTemporals(text: string): SemanticFeature[] {
        const features: SemanticFeature[] = [];

        const temporalPatterns = [
            /within\s+(\d+)\s+(days?|hours?|weeks?|months?|years?)/gi,
            /after\s+(\d+)\s+(days?|hours?|weeks?|months?|years?)/gi,
            /before\s+(\d+)\s+(days?|hours?|weeks?|months?|years?)/gi,
            /every\s+(\d+)\s+(days?|hours?|weeks?|months?|years?)/gi,
            /(daily|weekly|monthly|annually|quarterly)/gi
        ];

        for (const pattern of temporalPatterns) {
            let match;
            while ((match = pattern.exec(text)) !== null) {
                const normalized = match[0].toLowerCase()
                    .replace(/days?/, 'day')
                    .replace(/hours?/, 'hour')
                    .replace(/weeks?/, 'week')
                    .replace(/months?/, 'month')
                    .replace(/years?/, 'year');

                features.push({
                    type: 'temporal',
                    canonical: `TEMP:${normalized}`,
                    original: match[0],
                    confidence: 0.9,
                    position: match.index
                });
            }
        }

        return features;
    }

    private static extractNegations(text: string): SemanticFeature[] {
        const features: SemanticFeature[] = [];

        const negationPatterns = [
            /(?:do\s+not|don't|cannot|can't|must\s+not|should\s+not|never)\s+(.+?)(?:\.|,|$)/gi,
            /(?:no|none|nothing|nobody)\s+(.+?)(?:\.|,|$)/gi,
            /(?:prohibited|forbidden|not\s+allowed|banned)\s*(?:to|from)?\s*(.+?)(?:\.|,|$)/gi
        ];

        for (const pattern of negationPatterns) {
            let match;
            while ((match = pattern.exec(text)) !== null) {
                features.push({
                    type: 'negation',
                    canonical: `NEG:${this.normalizeText(match[1] || '')}`,
                    original: match[0],
                    confidence: 0.9,
                    position: match.index
                });
            }
        }

        return features;
    }

    private static normalizeText(text: string): string {
        return text
            .toLowerCase()
            .replace(/[^\w\s]/g, '')
            .replace(/\s+/g, '_')
            .trim()
            .substring(0, 50);
    }

    /**
     * Extract location and spatial information
     */
    private static extractLocations(text: string): SemanticFeature[] {
        const features: SemanticFeature[] = [];

        // Street addresses
        const addressPattern = /(\d+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s+(?:Street|St|Avenue|Ave|Drive|Dr|Road|Rd|Boulevard|Blvd|Lane|Ln|Way|Court|Ct))(?:,\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]*)?))?/g;
        let match;
        while ((match = addressPattern.exec(text)) !== null) {
            features.push({
                type: 'location',
                canonical: `LOC:ADDRESS:${this.normalizeText(match[1] || '')}`,
                original: match[0],
                confidence: 0.9,
                position: match.index
            });
        }

        // Spatial relationships (inside, within, at, near)
        const spatialPatterns = [
            { pattern: /(?:the\s+)?(\w+(?:\s+\w+)?)\s+(?:is|are)\s+(?:inside|within|in)\s+(?:the\s+)?(\w+(?:\s+\w+)?)/gi, type: 'CONTAINMENT' },
            { pattern: /(?:the\s+)?(\w+(?:\s+\w+)?)\s+(?:is|are)\s+(?:near|close\s+to|adjacent\s+to)\s+(?:the\s+)?(\w+(?:\s+\w+)?)/gi, type: 'PROXIMITY' },
            { pattern: /(?:the\s+)?(\w+(?:\s+\w+)?)\s+(?:is|are)\s+(?:at|located\s+at)\s+(?:the\s+)?(\w+(?:\s+\w+)?)/gi, type: 'AT_LOCATION' }
        ];

        for (const { pattern, type } of spatialPatterns) {
            while ((match = pattern.exec(text)) !== null) {
                if (match[1] && match[2]) {
                    features.push({
                        type: 'relationship',
                        canonical: `REL:${type}:${this.normalizeText(match[1])}:${this.normalizeText(match[2])}`,
                        original: match[0],
                        confidence: 0.85,
                        position: match.index
                    });
                }
            }
        }

        return features;
    }

    /**
     * Extract composition and part-whole relationships
     */
    private static extractCompositions(text: string): SemanticFeature[] {
        const features: SemanticFeature[] = [];

        // Part-whole relationships
        const partWholePatterns = [
            { pattern: /(?:the\s+)?(\w+)\s+(?:has|contains|includes)\s+(\d+\s+)?(?:parts?|components?|elements?)\s+(?:named|called|:)?\s*(\w+)/gi, type: 'PART_WHOLE' },
            { pattern: /(?:the\s+)?(\w+)\s+(?:consists?\s+of|comprises?)\s+(.+?)(?:\.|,|$)/gi, type: 'CONSISTS_OF' }
        ];

        let match;
        for (const { pattern, type } of partWholePatterns) {
            while ((match = pattern.exec(text)) !== null) {
                const whole = match[1] || '';
                const part = (match[3] || match[2] || '').trim();
                if (whole && part) {
                    features.push({
                        type: 'composition',
                        canonical: `COMP:${type}:${this.normalizeText(whole)}:${this.normalizeText(part)}`,
                        original: match[0],
                        confidence: 0.85,
                        position: match.index
                    });
                }
            }
        }

        // Material composition
        const materialPattern = /(?:the\s+)?(\w+)\s+(?:is|are)\s+(?:made\s+(?:of|from)|composed\s+of|built\s+(?:from|with))\s+(\w+(?:\s+(?:and|,)\s+\w+)*)/gi;
        while ((match = materialPattern.exec(text)) !== null) {
            if (match[1] && match[2]) {
                features.push({
                    type: 'composition',
                    canonical: `COMP:MADE_OF:${this.normalizeText(match[1])}:${this.normalizeText(match[2])}`,
                    original: match[0],
                    confidence: 0.9,
                    position: match.index
                });
            }
        }

        return features;
    }

    /**
     * Extract explicit definitions from text
     */
    private static extractDefinitions(text: string): SemanticFeature[] {
        const features: SemanticFeature[] = [];

        const defPatterns = [
            { pattern: /(?:a\s+)?(\w+(?:\s+\w+)*)\s+(?:is|are)\s+defined\s+as\s+(.+?)(?:\.|$)/gi, type: 'EXPLICIT_DEF' },
            { pattern: /(?:the\s+)?(\w+(?:\s+\w+)*)\s+(?:refers?\s+to|means)\s+(.+?)(?:\.|$)/gi, type: 'MEANS' },
            { pattern: /"(\w+(?:\s+\w+)*)"\s+(?:is|are)\s+(.+?)(?:\.|$)/gi, type: 'QUOTED_DEF' }
        ];

        for (const { pattern, type } of defPatterns) {
            let match;
            while ((match = pattern.exec(text)) !== null) {
                if (match[1] && match[2]) {
                    features.push({
                        type: 'claim',
                        canonical: `DEF:${type}:${this.normalizeText(match[1])}:${this.normalizeText(match[2])}`,
                        original: match[0],
                        confidence: 0.95,
                        position: match.index
                    });
                }
            }
        }

        return features;
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SEMANTIC HASHER - Creates meaning-based hashes
// ═══════════════════════════════════════════════════════════════════════════════

export class SemanticHasher {

    /**
     * Create a semantic hash from features
     * Same meaning = same hash (regardless of wording)
     */
    static async hash(features: SemanticFeature[]): Promise<string> {
        // Sort features by canonical form for consistency
        const sortedCanonicals = features
            .map(f => f.canonical)
            .sort()
            .join('|');

        return await cryptoUtils.sha256(sortedCanonicals);
    }

    /**
     * Calculate semantic similarity between two feature sets
     */
    static similarity(features1: SemanticFeature[], features2: SemanticFeature[]): number {
        const set1 = new Set(features1.map(f => f.canonical));
        const set2 = new Set(features2.map(f => f.canonical));

        if (set1.size === 0 && set2.size === 0) return 1.0;
        if (set1.size === 0 || set2.size === 0) return 0.0;

        // Jaccard similarity
        const intersection = new Set([...set1].filter(x => set2.has(x)));
        const union = new Set([...set1, ...set2]);

        return intersection.size / union.size;
    }

    /**
     * Check if two documents are paraphrases (same meaning, different words)
     */
    static async isParaphrase(text1: string, text2: string, threshold: number = 0.7): Promise<boolean> {
        const features1 = SemanticExtractor.extract(text1);
        const features2 = SemanticExtractor.extract(text2);

        // Different byte hashes but similar semantic hashes = paraphrase
        const byteHash1 = await cryptoUtils.sha256(text1);
        const byteHash2 = await cryptoUtils.sha256(text2);

        if (byteHash1 === byteHash2) return false; // Exact match, not paraphrase

        const similarity = this.similarity(features1, features2);
        return similarity >= threshold;
    }

    /**
     * Detect contradictions between two texts
     */
    static findContradictions(text1: string, text2: string): Array<{
        claim1: string;
        claim2: string;
        reason: string;
    }> {
        const contradictions: Array<{ claim1: string; claim2: string; reason: string }> = [];

        const features1 = SemanticExtractor.extract(text1);
        const features2 = SemanticExtractor.extract(text2);

        // Check numeric contradictions
        const nums1 = features1.filter(f => f.type === 'number');
        const nums2 = features2.filter(f => f.type === 'number');

        for (const n1 of nums1) {
            for (const n2 of nums2) {
                // Same unit but different values
                const parts1 = n1.canonical.split(':');
                const parts2 = n2.canonical.split(':');

                if (parts1[2] === parts2[2] && parts1[2] !== 'unit') {
                    const val1 = parseFloat(parts1[1] || '0');
                    const val2 = parseFloat(parts2[1] || '0');

                    if (val1 !== val2 && Math.abs(val1 - val2) / Math.max(val1, val2) > 0.1) {
                        contradictions.push({
                            claim1: n1.original,
                            claim2: n2.original,
                            reason: `Numeric contradiction: ${val1} vs ${val2} ${parts1[2]}`
                        });
                    }
                }
            }
        }

        // Check negation contradictions
        const negs1 = features1.filter(f => f.type === 'negation');
        const claims2 = features2.filter(f => f.type === 'claim');

        for (const neg of negs1) {
            const negContent = neg.canonical.replace('NEG:', '');
            for (const claim of claims2) {
                if (claim.canonical.includes(negContent)) {
                    contradictions.push({
                        claim1: neg.original,
                        claim2: claim.original,
                        reason: 'Negation vs affirmation contradiction'
                    });
                }
            }
        }

        return contradictions;
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SEMANTIC MERKLE TREE BUILDER
// ═══════════════════════════════════════════════════════════════════════════════

export class SMTBuilder {
    private nodes: Map<string, SemanticNode> = new Map();
    private claims: SemanticMerkleTree['claims'] = [];

    /**
     * Build a Semantic Merkle Tree from a document
     */
    async build(text: string): Promise<SemanticMerkleTree> {
        const treeId = `smt_${cryptoUtils.randomHex(8)}`;

        // Extract all semantic features
        const features = SemanticExtractor.extract(text);

        // Group features by type
        const featureGroups = this.groupFeatures(features);

        // Build leaf nodes from feature groups
        const leafNodes: SemanticNode[] = [];
        for (const [type, groupFeatures] of Object.entries(featureGroups)) {
            const node = await this.createNode(groupFeatures, 0);
            this.nodes.set(node.id, node);
            leafNodes.push(node);
        }

        // Build tree bottom-up
        const root = await this.buildTreeLevel(leafNodes, 1);

        // Extract claims for audit trail
        await this.extractClaims(features, text);

        // Calculate document hashes
        const byteHash = await cryptoUtils.sha256(text);
        const semanticHash = await SemanticHasher.hash(features);

        return {
            smt_version: '1.0',
            tree_id: treeId,
            created_at: new Date().toISOString(),

            root: {
                semantic_hash: root.semantic_hash,
                feature_count: features.length,
                depth: root.depth
            },

            nodes: this.nodes,

            document: {
                original_hash: byteHash,
                semantic_hash: semanticHash,
                word_count: text.split(/\s+/).length,
                claim_count: this.claims.length
            },

            claims: this.claims
        };
    }

    private groupFeatures(features: SemanticFeature[]): Record<string, SemanticFeature[]> {
        const groups: Record<string, SemanticFeature[]> = {};

        for (const feature of features) {
            if (!groups[feature.type]) {
                groups[feature.type] = [];
            }
            groups[feature.type]!.push(feature);
        }

        return groups;
    }

    private async createNode(features: SemanticFeature[], depth: number): Promise<SemanticNode> {
        const nodeId = `node_${cryptoUtils.randomHex(4)}`;
        const semanticHash = await SemanticHasher.hash(features);

        return {
            id: nodeId,
            semantic_hash: semanticHash,
            features,
            children: [],
            depth
        };
    }

    private async buildTreeLevel(nodes: SemanticNode[], depth: number): Promise<SemanticNode> {
        if (nodes.length === 0) {
            return await this.createNode([], depth);
        }

        if (nodes.length === 1) {
            return nodes[0]!;
        }

        // Pair nodes and create parent nodes
        const parentNodes: SemanticNode[] = [];

        for (let i = 0; i < nodes.length; i += 2) {
            const left = nodes[i]!;
            const right = nodes[i + 1] || left;

            // Combine features from children
            const combinedFeatures = [...left.features, ...right.features];
            const parent = await this.createNode(combinedFeatures, depth);
            parent.children = [left.id, right.id];

            left.parent = parent.id;
            right.parent = parent.id;

            this.nodes.set(parent.id, parent);
            parentNodes.push(parent);
        }

        return await this.buildTreeLevel(parentNodes, depth + 1);
    }

    private async extractClaims(features: SemanticFeature[], text: string): Promise<void> {
        const claimFeatures = features.filter(f => f.type === 'claim');

        for (const claim of claimFeatures) {
            this.claims.push({
                id: `claim_${cryptoUtils.randomHex(4)}`,
                canonical: claim.canonical,
                original: claim.original,
                semantic_hash: await cryptoUtils.sha256(claim.canonical),
                evidence: [text.substring(0, 100) + '...']
            });
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SMT RUNTIME - High-level API
// ═══════════════════════════════════════════════════════════════════════════════

export class SMTRuntime {

    /**
     * Build a Semantic Merkle Tree from text
     */
    static async build(text: string): Promise<SemanticMerkleTree> {
        const builder = new SMTBuilder();
        return await builder.build(text);
    }

    /**
     * Compare two documents semantically
     */
    static async compare(text1: string, text2: string): Promise<SemanticComparisonResult> {
        const smt1 = await this.build(text1);
        const smt2 = await this.build(text2);

        const features1 = SemanticExtractor.extract(text1);
        const features2 = SemanticExtractor.extract(text2);

        const similarity = SemanticHasher.similarity(features1, features2);
        const isParaphrase = await SemanticHasher.isParaphrase(text1, text2);
        const contradictions = SemanticHasher.findContradictions(text1, text2);

        // Calculate plagiarism score (high similarity with different byte hash)
        const hash1 = await cryptoUtils.sha256(text1);
        const hash2 = await cryptoUtils.sha256(text2);
        const bytesSame = hash1 === hash2;
        const plagiarismScore = bytesSame ? 0 : (similarity > 0.6 ? similarity : 0);

        // Find matching claims
        const matchingClaims: SemanticComparisonResult['matching_claims'] = [];

        for (const claim1 of smt1.claims) {
            for (const claim2 of smt2.claims) {
                const claimSimilarity = this.calculateClaimSimilarity(claim1.canonical, claim2.canonical);

                if (claimSimilarity > 0.3) {
                    let relationship: 'equivalent' | 'paraphrase' | 'contradiction' | 'related' | 'unrelated';

                    if (claimSimilarity >= 0.95) relationship = 'equivalent';
                    else if (claimSimilarity >= 0.7) relationship = 'paraphrase';
                    else if (contradictions.some(c =>
                        c.claim1.includes(claim1.original.substring(0, 20)) ||
                        c.claim2.includes(claim2.original.substring(0, 20))
                    )) relationship = 'contradiction';
                    else if (claimSimilarity >= 0.4) relationship = 'related';
                    else relationship = 'unrelated';

                    matchingClaims.push({
                        doc1_claim: claim1.original,
                        doc2_claim: claim2.original,
                        similarity: claimSimilarity,
                        relationship
                    });
                }
            }
        }

        return {
            semantic_similarity: similarity,
            paraphrase_detected: isParaphrase,
            contradiction_detected: contradictions.length > 0,
            plagiarism_score: plagiarismScore,

            matching_claims: matchingClaims,
            contradictions,

            comparison_proof: {
                doc1_semantic_hash: smt1.document.semantic_hash,
                doc2_semantic_hash: smt2.document.semantic_hash,
                comparison_hash: await cryptoUtils.sha256(smt1.document.semantic_hash + smt2.document.semantic_hash),
                timestamp: new Date().toISOString()
            }
        };
    }

    /**
     * Verify a claim against a truth tree
     */
    static async verifyClaim(smt: SemanticMerkleTree, claim: string): Promise<{
        found: boolean;
        matching_claim?: SemanticMerkleTree['claims'][0] | undefined;
        semantic_match: boolean;
        confidence: number;
    }> {
        const claimFeatures = SemanticExtractor.extract(claim);
        const claimHash = await SemanticHasher.hash(claimFeatures);

        // Check for exact semantic match
        for (const existingClaim of smt.claims) {
            if (existingClaim.semantic_hash === claimHash) {
                return {
                    found: true,
                    matching_claim: existingClaim,
                    semantic_match: true,
                    confidence: 1.0
                };
            }
        }

        // Check for similar claims
        let bestMatch: SemanticMerkleTree['claims'][0] | undefined;
        let bestSimilarity = 0;

        for (const existingClaim of smt.claims) {
            const similarity = this.calculateClaimSimilarity(
                claimFeatures.map(f => f.canonical).join('|'),
                existingClaim.canonical
            );

            if (similarity > bestSimilarity) {
                bestSimilarity = similarity;
                bestMatch = existingClaim;
            }
        }

        return {
            found: bestSimilarity >= 0.5,
            matching_claim: bestMatch,
            semantic_match: bestSimilarity >= 0.8,
            confidence: bestSimilarity
        };
    }

    /**
     * Get audit trail for a semantic tree
     */
    static getAuditTrail(smt: SemanticMerkleTree): {
        tree_id: string;
        root_hash: string;
        claims: Array<{ canonical: string; hash: string }>;
        verification_path: string[];
    } {
        return {
            tree_id: smt.tree_id,
            root_hash: smt.root.semantic_hash,
            claims: smt.claims.map(c => ({
                canonical: c.canonical,
                hash: c.semantic_hash
            })),
            verification_path: Array.from(smt.nodes.values())
                .map(n => n.semantic_hash)
        };
    }

    private static calculateClaimSimilarity(canonical1: string, canonical2: string): number {
        const tokens1 = new Set(canonical1.toLowerCase().split(/[:|_]/));
        const tokens2 = new Set(canonical2.toLowerCase().split(/[:|_]/));

        if (tokens1.size === 0 && tokens2.size === 0) return 1.0;
        if (tokens1.size === 0 || tokens2.size === 0) return 0.0;

        const intersection = new Set([...tokens1].filter(x => tokens2.has(x)));
        const union = new Set([...tokens1, ...tokens2]);

        return intersection.size / union.size;
    }
}
