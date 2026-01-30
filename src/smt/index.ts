/**
 * Semantic Merkle Trees (SMT) Module
 * 
 * Hash of MEANING, not bytes:
 * - Same meaning = same hash
 * - Detects paraphrases, contradictions, plagiarism
 * - Auditable truth tree
 */

export { 
    SMTRuntime,
    SMTBuilder,
    SemanticHasher,
    SemanticExtractor,
    type SemanticMerkleTree,
    type SemanticNode,
    type SemanticFeature,
    type SemanticComparisonResult
} from './semantic_merkle_tree';
