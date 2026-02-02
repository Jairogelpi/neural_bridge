/**
 * UNIVERSAL SEMANTIC IMPOSSIBILITY DETECTION (uSID)
 * Constraint Computing for AI - v0.1
 */

// 1. CONSTRAINT DSL
// ==========================================

export type ConstraintType =
    | 'FORMAT'      // JSON-only, max_tokens, schema
    | 'CONTENT'     // specific fields, references
    | 'PROHIBITION' // must not include
    | 'CAPABILITY'  // requires action (email, browse)
    | 'TIME'        // real-time, historical
    | 'EVIDENCE'    // citations, proofs
    | 'CERTAINTY'   // 0 risk, 100% confidence
    | 'IDENTITY';   // personal data usage

export type ConstraintOp =
    | '=' | '!=' | 'contains' | 'in' | 'not_in' | '<=' | '>=' | 'implies';

export interface UniversalConstraint {
    id: string; // "c12"
    type: ConstraintType;
    key: string;       // "output_mode", "must_include"
    op: ConstraintOp;
    value: any;        // "json_only", ["web_browse"]
    source_snippet?: string; // "devuélveme solo JSON"
}

// 2. CAPABILITY MANIFEST
// ==========================================

export interface SystemCapabilities {
    web_browse: boolean;
    send_email: boolean;
    filesystem_access: boolean;
    real_time_access: boolean;
    execute_code: boolean;
    financial_actions: boolean;
    probabilistic_nature: boolean; // Always true for LLMs (breaks CERTAINTY)
}

// 3. uSID RESULT CONTRACT
// ==========================================

export interface ConflictRepair {
    change: string; // "Move explanation inside JSON field"
    effect: string; // "Resolves c12 vs c19 conflict"
}

export interface UnsatCoreItem {
    constraint_id: string;
    constraint_desc: string;
    conflict_reason: string;
}

export interface uSidResult {
    status: 'SAT' | 'UNSAT' | 'UNKNOWN';

    // If SAT (Satisfiable)
    normalized_intent?: {
        action: string;
        constraints: UniversalConstraint[];
    };

    // If UNSAT (Impossible)
    message?: string;
    unsat_core?: UnsatCoreItem[]; // The minimal set causing conflict
    minimal_conflict_set?: string[]; // IDs ["c12", "c19"]
    repair_options?: ConflictRepair[];
}

export const DEFAULT_CAPABILITIES: SystemCapabilities = {
    web_browse: false,
    send_email: false,
    filesystem_access: false,
    real_time_access: false,
    execute_code: false,
    financial_actions: false,
    probabilistic_nature: true
};
