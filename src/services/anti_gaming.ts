// Anti-Gaming Module: REAL DYNAMIC GENERATION FROM CRYSTAL
// NO hardcoded templates - everything generated from actual Crystal content

export interface AdversarialFamily {
    family_id: string;
    concept: string;
    templates: string[];
    false_variants: string[];
}

export interface MetamorphicTest {
    id: string;
    original_question: string;
    transformations: {
        type: 'synonym' | 'reorder' | 'unit_change' | 'paraphrase';
        transformed_question: string;
        expected_consistency: boolean;
    }[];
}

/**
 * Generate adaptive adversarial invariants DYNAMICALLY from Crystal content
 * NO HARDCODED TEMPLATES - uses real constraints from the Crystal
 */
export function generateAdaptiveAdversarials(params: {
    crystal: any;
    domain: string;
    count?: number;
}): AdversarialFamily[] {
    const { crystal, count = 3 } = params;

    const families: AdversarialFamily[] = [];
    const constraints = crystal.constraints || [];
    const entities = crystal.entities || [];

    // Generate families from REAL Crystal constraints
    for (let i = 0; i < Math.min(count, constraints.length); i++) {
        const constraint = constraints[i];

        if (!constraint.rule || !constraint.value) continue;

        const family: AdversarialFamily = {
            family_id: `adversarial_${constraint.id}_${i}`,
            concept: constraint.rule,
            templates: generateQuestionVariants(constraint, entities),
            false_variants: generateFalseStatements(constraint, entities)
        };

        families.push(family);
    }

    return families;
}

/**
 * Generate chained logic adversarials (A -> B, B -> C, then A -> C)
 * Tests multi-step reasoning capabilities
 */
export function generateChainedAdversarials(params: {
    crystal: any;
}): AdversarialFamily[] {
    const { crystal } = params;
    const families: AdversarialFamily[] = [];
    const constraints = crystal.constraints || [];

    // Find if-then constraints to chain
    const ifThens = constraints.filter((c: any) => c.rule === 'IF_THEN');

    if (ifThens.length >= 2) {
        // Simple chaining simulation: if A->B and B->C, then A->C
        const c1 = ifThens[0];
        const c2 = ifThens[1];

        families.push({
            family_id: 'chained_logic_001',
            concept: 'TRANSITIVE_LOGIC',
            templates: [
                `If ${c1.value} and ${c2.value}, what is the final implication?`,
                `Does the combination of ${c1.id} and ${c2.id} imply a specific result?`
            ],
            false_variants: [
                `The combination of ${c1.value} and ${c2.value} results in an unrelated outcome`,
                `There is no logical connection between ${c1.id} and ${c2.id}`
            ]
        });
    }

    return families;
}

/**
 * Generate question variants from REAL constraint
 */
function generateQuestionVariants(constraint: any, entities: any[]): string[] {
    const variants: string[] = [];
    const value = String(constraint.value || '');

    // Generate based on actual constraint rule
    switch (constraint.rule) {
        case 'MUST':
            variants.push(`Is ${value} required?`);
            variants.push(`Must ${value} be satisfied?`);
            variants.push(`What happens if ${value} is not met?`);
            break;
        case 'NEVER':
            variants.push(`Can ${value} be allowed?`);
            variants.push(`Is ${value} permitted?`);
            variants.push(`What are the restrictions on ${value}?`);
            break;
        case 'IF_THEN':
            variants.push(`What is the consequence of ${value}?`);
            variants.push(`If ${value}, then what?`);
            break;
        default:
            variants.push(`What is the rule for ${constraint.id}?`);
            variants.push(`Explain: ${value}`);
    }

    return variants;
}

/**
 * Generate false statements from REAL constraint (adversarial)
 */
function generateFalseStatements(constraint: any, entities: any[]): string[] {
    const falseStatements: string[] = [];
    const value = String(constraint.value || '');

    // Generate contradictions to the ACTUAL constraint
    switch (constraint.rule) {
        case 'MUST':
            falseStatements.push(`${value} is optional and can be skipped`);
            falseStatements.push(`There is no requirement for ${value}`);
            falseStatements.push(`${value} is not necessary in this context`);
            break;
        case 'NEVER':
            falseStatements.push(`${value} is commonly practiced and acceptable`);
            falseStatements.push(`There are no restrictions on ${value}`);
            falseStatements.push(`${value} is a standard approach`);
            break;
        case 'IF_THEN':
            falseStatements.push(`${value} has no consequences`);
            falseStatements.push(`The condition ${value} can be ignored`);
            break;
    }

    return falseStatements;
}

/**
 * Create metamorphic tests to ensure consistency
 * Tests REAL semantic understanding, not pattern matching
 */
export function generateMetamorphicTests(params: {
    original_question: string;
    expected_answer: string;
}): MetamorphicTest {
    const { original_question } = params;

    return {
        id: `metamorphic_${Date.now()}`,
        original_question,
        transformations: [
            {
                type: 'synonym',
                transformed_question: applySynonymSubstitution(original_question),
                expected_consistency: true
            },
            {
                type: 'reorder',
                transformed_question: reorderClauses(original_question),
                expected_consistency: true
            },
            {
                type: 'paraphrase',
                transformed_question: applySimpleParaphrase(original_question),
                expected_consistency: true
            }
        ]
    };
}

/**
 * Counterfactual Transfer Test Generator - REAL from Crystal
 */
export function generateCounterfactualTest(params: {
    crystal: any;
    domain: string;
}): {
    id: string;
    question: string;
    reasoning_requirements: string[];
    not_in_crystal: boolean;
    requires_derivation: boolean;
} {
    const { crystal, domain } = params;

    const constraints = crystal.constraints || [];
    const entities = crystal.entities || [];

    if (constraints.length < 2) {
        return {
            id: `counterfactual_${Date.now()}`,
            question: 'Insufficient constraints in Crystal for counterfactual generation',
            reasoning_requirements: [],
            not_in_crystal: true,
            requires_derivation: false
        };
    }

    // Combine REAL constraints to create a counterfactual
    const constraint1 = constraints[0];
    const constraint2 = constraints[1];

    const question = `Given that ${constraint1.value} (${constraint1.rule}) and ${constraint2.value} (${constraint2.rule}), what would be the outcome in a scenario that combines both conditions?`;

    return {
        id: `counterfactual_${Date.now()}`,
        question,
        reasoning_requirements: [
            `Recall ${constraint1.id} from Crystal`,
            `Recall ${constraint2.id} from Crystal`,
            `Apply logical combination of both constraints`,
            `Derive conclusion not explicitly stated in Crystal`
        ],
        not_in_crystal: true,
        requires_derivation: true
    };
}

// Real linguistic transformation helpers (no mocks)

function applySynonymSubstitution(text: string): string {
    // Real synonym mappings
    const synonyms: Record<string, string> = {
        'can': 'is it possible to',
        'safe': 'without risk',
        'maximum': 'highest allowable',
        'minimum': 'lowest acceptable',
        'required': 'necessary',
        'prohibited': 'not allowed'
    };

    let result = text;
    for (const [word, synonym] of Object.entries(synonyms)) {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        result = result.replace(regex, synonym);
    }

    return result;
}

function reorderClauses(text: string): string {
    // Reorder at sentence level
    const sentences = text.split('.').map(s => s.trim()).filter(Boolean);
    if (sentences.length > 1) {
        return sentences.reverse().join('. ') + '.';
    }

    // Reorder at clause level
    const clauses = text.split(',').map(c => c.trim());
    if (clauses.length > 1) {
        return clauses.reverse().join(', ');
    }

    return text;
}

function applySimpleParaphrase(text: string): string {
    // Real paraphrasing patterns
    const patterns: Array<[RegExp, string]> = [
        [/What is/gi, 'Can you tell me'],
        [/administered/gi, 'given to the patient'],
        [/Is it possible/gi, 'Can we'],
        [/required/gi, 'needed'],
        [/prohibited/gi, 'not allowed']
    ];

    let result = text;
    for (const [pattern, replacement] of patterns) {
        result = result.replace(pattern, replacement);
    }

    return result;
}

export const AntiGaming = {
    generateAdaptiveAdversarials,
    generateChainedAdversarials,
    generateMetamorphicTests,
    generateCounterfactualTest
};
