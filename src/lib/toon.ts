/**
 * TOON SERVICE (Truth-Oriented Object Notation)
 * 
 * The bridge between the raw TOON syntax and the structured Crystal world.
 * This is the BACKEND VERSION - shared across all backend services.
 */
export class ToonService {
    /**
     * Parse TOON string into a structured Knowledge Object
     */
    static parse(toon: string): any {
        if (!toon || toon.trim() === '') return { metadata: {}, graph: [], constraints: [], proofs: {} };

        // Clean up markdown blocks if present
        const cleanToon = toon.replace(/```toon?\s*([\s\S]*?)```/g, '$1').trim();
        const lines = cleanToon.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        const result: any = {
            metadata: {},
            graph: [],
            constraints: [],
            proofs: {}
        };

        for (const line of lines) {
            // 1. Metadata (@key(value))
            if (line.startsWith('@')) {
                const match = line.match(/@(\w+)\((.*?)\)/);
                if (match) result.metadata[match[1]] = match[2];
            }
            // 2. Graph Predicates ((S) -[P]-> (O))
            else if (line.startsWith('(')) {
                const match = line.match(/\((.*?)\)\s*-\[(.*?)\]->\s*\((.*?)\)/);
                if (match) result.graph.push({ subject: match[1], predicate: match[2], object: match[3] });
            }
            // 3. Logical Constraints (MUST [...] or NEVER [...])
            else if (line.startsWith('MUST') || line.startsWith('NEVER')) {
                const type = line.startsWith('MUST') ? 'MUST' : 'NEVER';
                const match = line.match(/\[(.*?)\]/);
                if (match) result.constraints.push({ type, value: match[1] });
            }
            // 4. Proofs (#key(value))
            else if (line.startsWith('#')) {
                const match = line.match(/#(\w+)\((.*?)\)/);
                if (match) result.proofs[match[1]] = match[2];
            }
        }

        return result;
    }

    /**
     * Validate a TOON string for structural integrity
     */
    static validate(toon: string): { valid: boolean; errors: string[] } {
        const errors: string[] = [];
        if (!toon) return { valid: false, errors: ['Empty manifold'] };

        const lines = toon.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        if (lines.length === 0) return { valid: false, errors: ['No content'] };

        for (const line of lines) {
            const isKnown = line.startsWith('@') || line.startsWith('(') ||
                line.startsWith('MUST') || line.startsWith('NEVER') ||
                line.startsWith('#') || line.startsWith('!') ||
                line.startsWith('//') || line.startsWith('{') || line.startsWith('}');

            if (!isKnown) {
                errors.push(`Unrecognized syntax: "${line.substring(0, 30)}..."`);
            }
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    /**
     * Check if a string is likely TOON
     */
    static isToon(text: string): boolean {
        return text.includes('@') && (text.includes('MUST') || text.includes('NEVER') || text.includes('-[')) || text.includes('manifold');
    }

    /**
     * Serialize a structured object back into TOON syntax
     */
    static stringify(obj: any): string {
        if (!obj) return '';
        let toon = '';

        // 1. Metadata
        if (obj.metadata && typeof obj.metadata === 'object') {
            for (const [key, val] of Object.entries(obj.metadata)) {
                if (val !== undefined && val !== null) {
                    toon += `@${key}(${val})\n`;
                }
            }
        }

        // 2. Graph
        if (Array.isArray(obj.graph)) {
            for (const rel of obj.graph) {
                if (rel && rel.subject && rel.predicate && rel.object) {
                    toon += `(${rel.subject}) -[${rel.predicate}]-> (${rel.object})\n`;
                }
            }
        }

        // 3. Constraints
        if (Array.isArray(obj.constraints)) {
            for (const c of obj.constraints) {
                if (c && c.type && c.value) {
                    toon += `${c.type} [${c.value}]\n`;
                }
            }
        }

        // 4. Proofs
        if (obj.proofs && typeof obj.proofs === 'object') {
            for (const [key, val] of Object.entries(obj.proofs)) {
                if (val !== undefined && val !== null) {
                    toon += `#${key}(${val})\n`;
                }
            }
        }

        return toon.trim();
    }
}
