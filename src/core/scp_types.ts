export interface Constraint {
    id: string;
    strength: "hard" | "soft";
    text: string;
    priority: number;
    tags: string[];
}

export interface Entity {
    name: string;
    type: string;
    notes?: string;
}

export interface Evidence {
    id: string;
    type: "text" | "code" | "file" | "url";
    title: string;
    ref?: string;
    content?: string;
    fingerprints: {
        sha256: string;
        rolling64_dec: string;
    };
}

export interface Decision {
    id: string;
    statement: string;
    rationale?: string;
    timestamp_hint?: string;
}

export interface ContextCrystal {
    scp_version: string;
    context_id: string;
    created_at: string;
    source: {
        platform: string;
        url: string;
        timestamp: string;
    };
    intent: {
        primary: string;
        status: "active" | "blocked" | "done";
    };
    constraints: Constraint[];
    state: {
        summary: string;
        open_items: string[];
        next_actions: string[];
    };
    entities: Entity[];
    evidence: Evidence[];
    decisions: Decision[];
    domain?: string; // Knowledge Domain (medicine, law, tech, finance)
    verification: {
        canonical_hash: string;
        semantic_invariants: string[];
        policy: {
            min_checks: number;
            accept_threshold: number;
            max_retries: number;
            strategy: string;
        };
    };
}

export type BridgeMessage =
    | { type: "NB_SET_ACTIVE_CONTEXT"; contextId: string; host: string }
    | { type: "NB_GET_STATE" };
