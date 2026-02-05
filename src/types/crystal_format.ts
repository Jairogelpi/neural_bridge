// Crystal Format v0.1 - Official Specification
// This is the CORE IP: the universal knowledge container format

/**
 * CRYSTAL FORMAT SPECIFICATION v0.1
 * 
 * A Crystal is a structured, versioned, cryptographically verifiable
 * container for transferring knowledge between LLMs with guarantees.
 * 
 * Design Principles:
 * 1. Machine-readable (JSON)
 * 2. Human-auditable (clear structure)
 * 3. Extensible (additional fields allowed)
 * 4. Verifiable (cryptographic hashing)
 * 5. Domain-agnostic (works for medicine, law, code, etc.)
 */

// ============================================
// CORE TYPES
// ============================================

export interface CrystalMetadata {
    /** SCP (Structured Context Protocol) version */
    scp_version: string;

    /** Unique identifier for this Crystal */
    context_id: string;

    /** ISO 8601 timestamp of creation */
    created_at: string;

    /** Optional: Crystal name/title */
    name?: string;

    /** Optional: Human-readable description */
    description?: string;
}

export interface CrystalSource {
    /** Platform where it was minted */
    platform: string;

    /** URL to human-readable source */
    url: string;

    /** 
     * Raw Signal Reference (v0.2 Sigma - Phase Infinity)
     * URI to the original binary signal (image, code, log-stream) 
     */
    raw_uri?: string;

    /** Mime-type of the original signal */
    mime_type?: string;

    /** ISO Timestamp */
    timestamp: string;

    /** Model used for extraction */
    model?: string;

    /** Individual who initiated the crystallization */
    creator?: string;
}

export enum CrystalStatus {
    ACTIVE = 'active',
    DEPRECATED = 'deprecated',
    SUPERSEDED = 'superseded'
}

export interface CrystalIntent {
    /** Primary goal of this knowledge */
    primary: string;

    /** Current status: active, deprecated, superseded */
    status: CrystalStatus;

    /** Optional: Secondary goals */
    secondary?: string[];

    /** Optional: Known limitations */
    limitations?: string[];
}

export enum ConstraintRule {
    MUST = 'MUST',
    NEVER = 'NEVER',
    IF_THEN = 'IF_THEN',
    RANGE = 'RANGE',
    ENUM = 'ENUM',
    REGEX = 'REGEX',
    CUSTOM = 'CUSTOM'
}

export interface CrystalConstraint {
    /** Unique constraint ID */
    id: string;

    /** Rule type: MUST, NEVER, IF_THEN, RANGE, etc. */
    rule: ConstraintRule;

    /** The actual constraint value/statement */
    value: string;

    /** Why this constraint exists */
    rationale: string;

    /** Optional: Severity (critical, high, medium, low) */
    severity?: 'critical' | 'high' | 'medium' | 'low';

    /** Optional: Reference to external documentation */
    reference?: string;

    /** Optional: Tags for categorization */
    tags?: string[];
}

export interface CrystalEntity {
    /** Entity identifier */
    name: string;

    /** Entity type (person, medication, concept, etc.) */
    type: string;

    /** Entity category/domain */
    category?: string;

    /** Optional: Entity attributes */
    attributes?: Record<string, any>;

    /** 
     * @deprecated Use raw_toon predicate manifold for all semantic relationships.
     * Optional: Relationships to other entities 
     */
    relationships?: Array<{
        type: string;
        target: string;
    }>;
}

export interface CrystalEvidence {
    /** Evidence type: quote, fact, source, etc. */
    type: 'quote' | 'fact' | 'source' | 'calculation' | 'reference';

    /** The evidence content */
    content: string;

    /** Optional: Source of this evidence */
    source?: string;

    /** Optional: Timestamp or date */
    timestamp?: string;

    /** Optional: Confidence level (0-1) */
    confidence?: number;
}

export interface SemanticInvariant {
    /** Unique invariant ID */
    id: string;

    /** Invariant kind: constraint_check, safety_check, fact_check, etc. */
    kind: 'constraint_check' | 'safety_check' | 'fact_check' | 'derivation' | 'custom';

    /** Test prompt/question */
    prompt: string;

    /** Expected result */
    expected: {
        type: 'boolean' | 'string' | 'number' | 'enum' | 'regex' | 'json';
        value: any;
    };

    /** Weight of this invariant (0-1, default 1.0) */
    weight: number;

    /** Is this a strict failure? (if false, SRI drops but continues) */
    strict: boolean;

    /** Why this invariant matters */
    rationale: string;

    /** Optional: Custom metadata */
    metadata?: Record<string, any>;
}

export interface VerificationPolicy {
    /** Minimum number of checks required */
    min_checks: number;

    /** Acceptance threshold (SRI minimum) */
    accept_threshold: number;

    /** Maximum retries on failure */
    max_retries: number;

    /** Verification strategy */
    strategy: 'strict' | 'balanced' | 'lenient';

    /** Optional: Domain-specific rules */
    domain_rules?: Record<string, any>;
}

export interface CrystalVerification {
    /** Canonical hash of the Crystal content (SHA-256) */
    canonical_hash: string;

    /** Semantic invariants to verify */
    semantic_invariants: SemanticInvariant[];

    /** Verification policy */
    policy: VerificationPolicy;

    /** Optional: Cost of verification/generation */
    cost?: number;

    /** Optional: External verifier requirements */
    external_verifiers?: string[];

    /** Optional: Expert cryptographic signatures (Jury of Truth) */
    expert_signatures?: Array<{
        algorithm: 'ECDSA-P256' | 'PGP' | 'WebAuthn';
        public_key: string;
        signature: string;
        timestamp: string;
        expert_id: string;
        domain: string;
    }>;

    /** Optional: Retroactively applied vaccine IDs for safety hardening */
    retroactive_vaccines?: string[];

    /** FRACTAL: Merkle proof for recursive verification */
    merkle_proof?: {
        root: string;
        path: string[];
        leaf: string;
    };
}

export interface CrystalDependency {
    /** Dependency Crystal ID */
    crystal_id: string;

    /** Required version (semver) */
    version: string;

    /** Dependency type */
    type: 'requires' | 'extends' | 'conflicts_with';

    /** Scope of dependency */
    scope: 'domain' | 'client' | 'project' | 'implementation';

    /** Optional: Why this dependency exists */
    reason?: string;
}

export interface RealityProof {
    /** The domain of reality (e.g., 'legal_spain', 'physics_newtonian') */
    domain: string;

    /** The specific constraints that were checked */
    constraints: string[];

    /** Validation status - output is BLOCKED if not 'valid' */
    status: 'valid' | 'invalid' | 'unchecked';

    /** Confidence score of the proof (0-1) */
    confidence: number;

    /** ID of the attestation record */
    attestation_id?: string;

    /** Timestamp of reality check */
    checked_at: string;
}

// ============================================
// CRYSTAL ROOT INTERFACE
// ============================================

// ============================================
// HDC & MANIFOLD PHYSICS (v0.2 Sigma)
// ============================================

export type HDCVector = number[]; // Normally 10,000D Float32Array

export enum ManifoldTopology {
    EUCLIDEAN = 'euclidean',
    SPHERICAL = 'spherical',
    HYPERBOLIC = 'hyperbolic' // For scale-free semantic networks
}

export interface VaccinePayload {
    /** Target error/hallucination fingerprint */
    target_id: string;

    /** The corrective truth (TOON) */
    correction: string;

    /** Propagation logic: broad | targeted */
    propagation: 'broad' | 'targeted';

    /** Expiry of the vaccine */
    expires_at?: string;
}

// ============================================
// PROVENANCE TRACKING (Phase Omega Prime)
// ============================================

export type ProvenanceOrigin =
    | 'web_ingest'      // From browser extension
    | 'file_ingest'     // From local file
    | 'api_ingest'      // From API call
    | 'manual_entry'    // User typed it
    | 'llm_generated'   // AI generated
    | 'derived'         // Computed from other crystals
    | 'external_import' // Imported from external system
    ;

export interface ProvenanceRecord {
    /** Unique provenance chain ID */
    chain_id: string;

    /** How this knowledge originated */
    origin: ProvenanceOrigin;

    /** Original source URL/path if applicable */
    source_uri?: string;

    /** Confidence in this source (0-1) */
    source_confidence: number;

    /** When was this sourced */
    sourced_at: string;

    /** Chain of custody - each transformation recorded */
    custody_chain: Array<{
        action: 'created' | 'modified' | 'verified' | 'derived' | 'merged';
        actor: string; // user_id, system, llm_model, etc.
        timestamp: string;
        details?: string;
    }>;

    /** If derived, IDs of parent crystals */
    derived_from?: string[];

    /** Verification status of provenance */
    verified: boolean;
}

// ============================================
// CRYSTAL ROOT INTERFACE
// ============================================

/**
 * Crystal v0.2 - The Neural Singularity Specification
 * 
 * This version pushes the format into the realm of "Active Inference"
 * and "Holographic Reduced Representations" (HDC).
 */
export interface Crystal {
    // ========== REQUIRED FIELDS ==========
    /** Truth-Oriented Object Notation (TOON) content */
    raw_toon: string;

    /** SCP version identifier (v0.2 Sigma) */
    scp_version: string;

    /** Unique Crystal identifier (Context Fingerprint) */
    context_id: string;

    /** Creation timestamp */
    created_at: string;

    /** Optional: Cost of crystallization */
    cost?: number;

    /** Source of this Crystal */
    source: CrystalSource;

    /** Intent and purpose */
    intent: CrystalIntent;

    /** 
     * Dynamic State (v0.2 Sigma + Phase Axiom)
     * Captures the current active context for conversational continuity and autonomous execution.
     */
    dynamic_state?: {
        summary: string;
        open_items: string[];
        next_actions: string[];
        next_executive_mission?: string; // Phase Axiom: Next autonomous goal
        sovereignty_score?: number;
    };

    /** Verification config (REQUIRED for runtime) */
    verification: CrystalVerification;

    // ========== NEW: HDC & MANIFOLD PHYSICS ==========

    /** 
     * Vector Anchor (HDC)
     * The crystal's coordinate in the 10,000D semantic manifold.
     */
    vector_anchor?: HDCVector;

    /** 
     * Topology of the local manifold 
     * Defines how 'distance' is calculated between this and other crystals.
     */
    topology?: ManifoldTopology;

    /** 
     * Neural Gravity
     * How strongly this crystal attracts other semantic units.
     */
    gravity?: number; // 0.0 - 1.0

    // ========== OPTIONAL BUT RECOMMENDED ==========

    /** Human-readable name */
    name?: string;

    /** Description of this Crystal */
    description?: string;

    /** Domain (medicine, law, tech, general, etc.) */
    domain?: string;

    /** Constraints (NEVER, MUST, IF_THEN rules) */
    constraints?: CrystalConstraint[];

    /** Entities mentioned in this Crystal */
    entities?: CrystalEntity[];

    /** Evidence supporting this knowledge */
    evidence?: CrystalEvidence[];

    /** Dependencies on other Crystals */
    dependencies?: CrystalDependency[];

    // ========== BIOLOGICAL RESILIENCE ==========

    /** 
     * Self-Correction Vaccine 
     * Data used to 'infect' and fix incorrect downstream knowledge.
     */
    vaccine?: VaccinePayload;

    /** Resilience Score (How hard it is to 'mutate' this truth) */
    resilience?: number; // 0.0 - 1.0

    // ========== FRACTAL KNOWLEDGE (SMT/PCK) ==========

    /** Semantic Merkle Root (Hash of Meaning) */
    smt_root?: string;

    /** Embedded Proof-Carrying Knowledge Tree */
    proof_tree?: Record<string, any>;

    /** Fractal depth (0 = atomic, >0 = meta-reality) */
    fractal_depth?: number;

    // ========== REALITY PROOF (RCI) ==========

    /** Proof of Reality (PoR) */
    reality_proof?: RealityProof;

    // ========== GOVERNANCE & ECONOMY ==========

    /** Version of THIS Crystal (semver) */
    version: string;

    /** Trust Tier: COMMUNITY | VERIFIED | CERTIFIED | TRUSTED | SOVEREIGN | SINGULARITY */
    tier: 'community' | 'verified' | 'certified' | 'trusted' | 'sovereign' | 'singularity';

    /** Author Metadata */
    author: {
        id: string;
        name: string;
        reputation: number;
        verified_credentials?: string[];
    };

    /** Crystal this supersedes */
    supersedes?: string;

    /** Is this Crystal deprecated? */
    deprecated?: boolean;

    /** Tags for categorization */
    tags?: string[];

    /** Metadata for extension data and caching */
    metadata?: Record<string, any>;

    // ========== RLM - ACTIVE INFERENCE (Phase Omega) ==========

    /** Reinforcement Logic Modeling (Active Stats) */
    rlm_stats?: {
        q_score: number; // Quality/Confidence
        use_count: number;
        last_inferred: string;
        /** 
         * Quantized Logic Bits (v0.2 Sigma)
         * Compact bitmask for binary axiomatic checks.
         */
        logic_bits?: string; // Hex-encoded bitmask
    };

    // ========== AXIOM - SOVEREIGN EXECUTION (Phase Axiom) ==========

    /** Executable logic embedded within the Knowledge unit */
    exec_logic?: ExecutablePayload;

    /** Interfaces/Capabilities this knowledge can command (e.g., 'browser', 'database', 'rest_api') */
    capabilities?: string[];

    // ========== NEUROMORPHIC SINGULARITY ==========

    /** Metrics for Active Inference engine */
    neuromorphic_stats?: {
        free_energy: number;
        surprise: number;
        geometric_density: number;
        is_singularity: boolean;

        /** 
         * Temporal Drift Tensor (v0.2 Sigma)
         * Differential time tensor for validity decay.
         */
        dt_tensor?: number[];
    };

    // ========== FRACTAL GENEALOGY (Lineage) ==========

    genealogy?: {
        generation: number;
        parents: string[];
        evolved_from?: string;
    };

    // ========== SYNAPTIC CONNECTOME ==========

    /** Autonomous semantic links between crystals */
    synapses?: Array<{
        target: string;
        type: 'SUPPORTS' | 'CONTRADICTS' | 'REFINES' | 'ORIGINATES_FROM' | 'RELATED_TO' | 'MERGED_INTO' | 'LOGICAL_OVERLAP';
        strength: number;
        affinity: number; // For v0.2: Autonomous clustering force
        discovered_at: string;
        justification?: string;
    }>;
}

/** 
 * Sovereign Execution Payload.
 * Encapsulates what the AI can ACTUALLY DO with this Knowledge.
 */
export interface ExecutablePayload {
    /** Type of execution: SANDBOX_JS | SHELL_CMD | API_CALL | TOON_STEP */
    type: 'SANDBOX_JS' | 'SHELL_CMD' | 'API_CALL' | 'TOON_STEP';

    /** The raw instruction or code to execute */
    payload: string;

    /** Expected result signature (for deterministic verification) */
    expected_fingerprint?: string;

    /** Maximum resources allowed (time in ms, memory, etc.) */
    resource_limits?: {
        timeout_ms: number;
        memory_mb?: number;
    };

    /** Does this action require explicit Sovereign confirmation? */
    privileged: boolean;
}

// ============================================
// VALIDATION SCHEMA (JSON Schema v7)
// ============================================

export const CrystalSchemaV01 = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "title": "Crystal Format v0.1",
    "type": "object",
    "required": [
        "scp_version",
        "context_id",
        "created_at",
        "source",
        "intent",
        "verification",
        "raw_toon"
    ],
    "properties": {
        "raw_toon": {
            "type": "string",
            "description": "Truth-Oriented Object Notation (TOON) content"
        },
        "scp_version": {
            "type": "string",
            "pattern": "^\\d+\\.\\d+$",
            "description": "SCP version (e.g., '1.0')"
        },
        "context_id": {
            "type": "string",
            "minLength": 1,
            "description": "Unique identifier for this Crystal"
        },
        "created_at": {
            "type": "string",
            "format": "date-time",
            "description": "ISO 8601 timestamp"
        },
        "name": {
            "type": "string",
            "description": "Human-readable name"
        },
        "description": {
            "type": "string",
            "description": "Crystal description"
        },
        "domain": {
            "type": "string",
            "description": "Domain classification"
        },
        "source": {
            "type": "object",
            "required": ["platform", "url", "timestamp"],
            "properties": {
                "platform": { "type": "string" },
                "url": { "type": "string" },
                "timestamp": { "type": "string", "format": "date-time" },
                "model": { "type": "string" },
                "creator": { "type": "string" }
            }
        },
        "intent": {
            "type": "object",
            "required": ["primary", "status"],
            "properties": {
                "primary": { "type": "string" },
                "status": {
                    "type": "string",
                    "enum": ["active", "deprecated", "superseded"]
                },
                "secondary": {
                    "type": "array",
                    "items": { "type": "string" }
                },
                "limitations": {
                    "type": "array",
                    "items": { "type": "string" }
                }
            }
        },
        "constraints": {
            "type": "array",
            "items": {
                "type": "object",
                "required": ["id", "rule", "value", "rationale"],
                "properties": {
                    "id": { "type": "string" },
                    "rule": {
                        "type": "string",
                        "enum": ["MUST", "NEVER", "IF_THEN", "RANGE", "ENUM", "REGEX", "CUSTOM"]
                    },
                    "value": { "type": "string" },
                    "rationale": { "type": "string" },
                    "severity": {
                        "type": "string",
                        "enum": ["critical", "high", "medium", "low"]
                    },
                    "reference": { "type": "string" }
                }
            }
        },
        "entities": {
            "type": "array",
            "items": {
                "type": "object",
                "required": ["name", "type"],
                "properties": {
                    "name": { "type": "string" },
                    "type": { "type": "string" },
                    "category": { "type": "string" },
                    "attributes": { "type": "object" },
                    "relationships": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "type": { "type": "string" },
                                "target": { "type": "string" }
                            }
                        }
                    }
                }
            }
        },
        "evidence": {
            "type": "array",
            "items": {
                "type": "object",
                "required": ["type", "content"],
                "properties": {
                    "type": {
                        "type": "string",
                        "enum": ["quote", "fact", "source", "calculation", "reference"]
                    },
                    "content": { "type": "string" },
                    "source": { "type": "string" },
                    "timestamp": { "type": "string" },
                    "confidence": { "type": "number", "minimum": 0, "maximum": 1 }
                }
            }
        },
        "verification": {
            "type": "object",
            "required": ["canonical_hash", "semantic_invariants", "policy"],
            "properties": {
                "canonical_hash": { "type": "string" },
                "semantic_invariants": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "required": ["id", "kind", "prompt", "expected", "weight", "strict", "rationale"]
                    }
                },
                "policy": {
                    "type": "object",
                    "required": ["min_checks", "accept_threshold", "max_retries", "strategy"]
                }
            }
        },
        "dependencies": {
            "type": "array",
            "items": {
                "type": "object",
                "required": ["crystal_id", "version", "type", "scope"],
                "properties": {
                    "crystal_id": { "type": "string" },
                    "version": { "type": "string" },
                    "type": {
                        "type": "string",
                        "enum": ["requires", "extends", "conflicts_with"]
                    },
                    "scope": {
                        "type": "string",
                        "enum": ["domain", "client", "project", "implementation"]
                    },
                    "reason": { "type": "string" }
                }
            }
        },
        "version": { "type": "string", "pattern": "^\\d+\\.\\d+\\.\\d+$" },
        "tier": {
            "type": "string",
            "enum": ["community", "verified", "certified", "trusted", "sovereign"]
        },
        "author": {
            "type": "object",
            "required": ["id", "name", "reputation"],
            "properties": {
                "id": { "type": "string" },
                "name": { "type": "string" },
                "reputation": { "type": "number", "minimum": 0, "maximum": 1 },
                "verified_credentials": { "type": "array", "items": { "type": "string" } }
            }
        },
        "supersedes": { "type": "string" },
        "deprecated": { "type": "boolean" },
        "tags": {
            "type": "array",
            "items": { "type": "string" }
        },
        "extensions": { "type": "object" },
        "metadata": { "type": "object" }
    },
    "additionalProperties": false
};

// ============================================
// HELPER: Validate Crystal
// ============================================

export function validateCrystalFormat(crystal: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Required fields
    if (!crystal.scp_version) errors.push('Missing scp_version');
    if (!crystal.context_id) errors.push('Missing context_id');
    if (!crystal.created_at) errors.push('Missing created_at');
    if (!crystal.source) errors.push('Missing source');
    if (!crystal.intent) errors.push('Missing intent');
    if (!crystal.verification) errors.push('Missing verification');
    if (!crystal.raw_toon) errors.push('Missing raw_toon');
    if (!crystal.version) errors.push('Missing version');
    if (!crystal.tier) errors.push('Missing tier');
    if (!crystal.author) errors.push('Missing author');

    // Source validation
    if (crystal.source) {
        if (!crystal.source.platform) errors.push('source.platform is required');
        if (!crystal.source.url) errors.push('source.url is required');
        if (!crystal.source.timestamp) errors.push('source.timestamp is required');
    }

    // Intent validation
    if (crystal.intent) {
        if (!crystal.intent.primary) errors.push('intent.primary is required');
        if (!crystal.intent.status) errors.push('intent.status is required');
        if (crystal.intent.status && !['active', 'deprecated', 'superseded'].includes(crystal.intent.status)) {
            errors.push('intent.status must be active, deprecated, or superseded');
        }
    }

    // Verification validation
    if (crystal.verification) {
        if (!crystal.verification.canonical_hash) errors.push('verification.canonical_hash is required');
        if (!Array.isArray(crystal.verification.semantic_invariants)) {
            errors.push('verification.semantic_invariants must be an array');
        }
        if (!crystal.verification.policy) errors.push('verification.policy is required');
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

/**
 * Canonical JSON stringify to ensure consistent hashing.
 * Sorts all object keys alphabetically.
 */
export function canonicalStringify(obj: any): string {
    if (obj === null || typeof obj !== 'object') {
        return JSON.stringify(obj);
    }

    if (Array.isArray(obj)) {
        return '[' + obj.map(item => canonicalStringify(item)).join(',') + ']';
    }

    const sortedEntries = Object.entries(obj)
        .filter(([_, value]) => value !== undefined)
        .sort(([a], [b]) => a.localeCompare(b));

    const parts = sortedEntries.map(([key, value]) => {
        return `"${key}":${canonicalStringify(value)}`;
    });

    return '{' + parts.join(',') + '}';
}

export const CrystalFormat = {
    version: '0.1',
    schema: CrystalSchemaV01,
    validate: validateCrystalFormat,
    canonicalStringify
};
