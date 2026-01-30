/**
 * Zero-Knowledge Verification (ZKV) Module
 * 
 * Prove answer correctness WITHOUT revealing:
 * - Source document (proprietary data protection)
 * - Verification logic (trade secret)
 */

export { 
    ZKProver, 
    ZKVerifier, 
    ZKVRuntime,
    type ZKProof,
    type ZKCommitment,
    type ZKVerificationResult
} from './zero_knowledge_verification';
