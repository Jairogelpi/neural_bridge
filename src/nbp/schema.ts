/**
 * NBP Schema Builder
 * 
 * A lightweight, fluent API to define Crystals.
 * Usage:
 *   const MyPolicy = DefineCrystal.named('ISO 27001')
 *     .must('encrypt_data_at_rest')
 *     .never('store_passwords_plaintext')
 *     .build();
 */

import { Crystal, CrystalConstraint, ConstraintRule } from './types';
import crypto from 'crypto';

export class CrystalBuilder {
    private crystal: Partial<Crystal>;
    private constraints: CrystalConstraint[] = [];

    constructor(name: string) {
        this.crystal = {
            nbp_version: '1.0',
            id: `cryst_${crypto.randomBytes(4).toString('hex')}`,
            created_at: new Date().toISOString(),
            name,
            constraints: []
        };
    }

    /**
     * Define a mandatory requirement
     */
    public must(value: string, rationale: string = 'Mandatory requirement'): this {
        this.addConstraint(ConstraintRule.MUST, value, rationale);
        return this;
    }

    /**
     * Define a prohibition
     */
    public never(value: string, rationale: string = 'Prohibited action'): this {
        this.addConstraint(ConstraintRule.NEVER, value, rationale);
        return this;
    }

    /**
     * Define a conditional requirement
     */
    public if(condition: string, thenRequirement: string): this {
        this.addConstraint(ConstraintRule.IF_THEN, `${condition} => ${thenRequirement}`, 'Conditional requirement');
        return this;
    }

    public domain(domain: string): this {
        this.crystal.domain = domain;
        return this;
    }

    public description(desc: string): this {
        this.crystal.description = desc;
        return this;
    }

    /**
     * Finalize and build the Crystal structure
     */
    public build(): Crystal {
        return {
            ...this.crystal as Crystal,
            constraints: this.constraints
        };
    }

    private addConstraint(rule: ConstraintRule, value: string, rationale: string) {
        this.constraints.push({
            id: `rule_${this.constraints.length + 1}`,
            rule,
            value,
            rationale,
            severity: 'high'
        });
    }
}

export const DefineCrystal = {
    named: (name: string) => new CrystalBuilder(name)
};
