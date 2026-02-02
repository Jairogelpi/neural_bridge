/**
 * NEURAL BRIDGE PROTOCOL (NBP) - Core Types
 * 
 * This file defines the "Crystal" format: the universal container for verifiable knowledge.
 * In the "Trojan Horse" strategy, this is the format we want everyone to adopt.
 */

export interface CrystalMetadata {
    scp_version: '1.0';
    context_id: string;
    created_at: string;
    name?: string;
    description?: string;
}

export interface CrystalSource {
    platform: string;
    url: string;
    timestamp: string;
    model?: string;
    creator?: string;
}

export enum ConstraintRule {
    MUST = 'MUST',
    NEVER = 'NEVER',
    IF_THEN = 'IF_THEN',
    RANGE = 'RANGE',
    ENUM = 'ENUM',
    REGEX = 'REGEX'
}

export interface CrystalConstraint {
    id: string;
    rule: ConstraintRule;
    value: string;
    rationale: string;
    severity?: 'critical' | 'high' | 'medium' | 'low';
}

export interface Crystal {
    // Identity
    nbp_version: '1.0';  // Replaces "scp_version" for branding
    id: string;
    created_at: string;

    // Core Metadata
    name: string;
    description?: string;
    domain?: string;

    // The "Contract"
    constraints: CrystalConstraint[];

    // Provenance
    source?: CrystalSource;

    // Cryptographic Proof (Optional in Open Source, Required in Enterprise)
    verification?: {
        hash: string;
        signature?: string;
        integrity_proof?: string; // Merkle Root
    };
}
