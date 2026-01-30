/**
 * PCK (Proof-Carrying Knowledge) Module
 * 
 * Revolutionary verification: Knowledge carries its own proof.
 * Zero external API calls needed for verification.
 */

export { 
    PCKBuilder, 
    PCKVerifier,
    type ProofCarryingKnowledge,
    type ProofNode,
    type ProofType,
    type DerivationRule,
    type VerificationResult
} from './proof_carrying_knowledge';

export { PCKRuntime } from './pck_runtime';
