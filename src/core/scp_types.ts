import { type Crystal } from '../types/crystal_format';

/** 
 * LEGACY ARCHITECTURE BRIDGE
 * @deprecated Use imports from '../types/crystal_format' directly.
 * We're keeping these exports as aliases to avoid breaking the entire system during the v0.2 migration.
 */
export type {
    Crystal as ContextCrystal,
    CrystalConstraint as Constraint,
    CrystalEntity as Entity,
    CrystalEvidence as Evidence
} from '../types/crystal_format';

/** 
 * @deprecated Use Crystal.decisions if available, or extensions.
 */
export interface Decision {
    id: string;
    statement: string;
    rationale?: string;
    timestamp_hint?: string;
}

export type BridgeMessage =
    | { type: "NB_SET_ACTIVE_CONTEXT"; contextId: string; host: string }
    | { type: "NB_GET_STATE" };
