// First-Order Logic Invariant System
// Based on Hoare Logic / Design by Contract principles

/**
 * Logical operators for invariant composition
 */
export type LogicalOperator = "AND" | "OR" | "NOT" | "IMPLIES" | "IFF";

/**
 * Quantifiers for invariant scope
 */
export type Quantifier = "FORALL" | "EXISTS" | "UNIQUE";

/**
 * Base predicate that can be evaluated
 */
export interface Predicate {
    id: string;
    name: string;
    arity: number; // Number of arguments
    domain: string; // What kind of things it applies to
    evaluate: (args: unknown[]) => boolean | Promise<boolean>;
}

/**
 * First-order logic formula
 */
export interface FOLFormula {
    type: "atomic" | "compound" | "quantified";
    predicate?: Predicate;
    args?: unknown[];
    operator?: LogicalOperator;
    operands?: FOLFormula[];
    quantifier?: Quantifier;
    variable?: string;
    scope?: FOLFormula;
}

/**
 * Invariant expressed in first-order logic
 */
export interface FOLInvariant {
    id: string;
    kind: "fact" | "constraint" | "boundary" | "state" | "objective" | "preference";
    formula: FOLFormula;
    naturalLanguage: string;
    weight: number;
    strict: boolean;
}

/**
 * Standard predicates for LLM verification
 */
export const StandardPredicates: Record<string, Predicate> = {
    // Existence predicates
    exists: {
        id: "exists",
        name: "EXISTS",
        arity: 2,
        domain: "knowledge",
        evaluate: (args) => {
            const [context, entity] = args as [string, string];
            return context.toLowerCase().includes(entity.toLowerCase());
        },
    },

    // Equality predicates
    equals: {
        id: "equals",
        name: "EQUALS",
        arity: 2,
        domain: "value",
        evaluate: (args) => {
            const [a, b] = args;
            return a === b;
        },
    },

    // Contains predicate
    contains: {
        id: "contains",
        name: "CONTAINS",
        arity: 2,
        domain: "set",
        evaluate: (args) => {
            const [set, element] = args as [unknown[], unknown];
            return Array.isArray(set) && set.includes(element);
        },
    },

    // Matches regex
    matches: {
        id: "matches",
        name: "MATCHES",
        arity: 2,
        domain: "text",
        evaluate: (args) => {
            const [text, pattern] = args as [string, string];
            try {
                return new RegExp(pattern, "i").test(text);
            } catch {
                return false;
            }
        },
    },

    // Greater than
    greaterThan: {
        id: "gt",
        name: "GREATER_THAN",
        arity: 2,
        domain: "number",
        evaluate: (args) => {
            const [a, b] = args as [number, number];
            return a > b;
        },
    },

    // Less than
    lessThan: {
        id: "lt",
        name: "LESS_THAN",
        arity: 2,
        domain: "number",
        evaluate: (args) => {
            const [a, b] = args as [number, number];
            return a < b;
        },
    },
};

/**
 * Build an atomic formula
 */
export function atomic(predicate: Predicate, ...args: unknown[]): FOLFormula {
    return { type: "atomic", predicate, args };
}

/**
 * Build a conjunction (AND)
 */
export function and(...formulas: FOLFormula[]): FOLFormula {
    return { type: "compound", operator: "AND", operands: formulas };
}

/**
 * Build a disjunction (OR)
 */
export function or(...formulas: FOLFormula[]): FOLFormula {
    return { type: "compound", operator: "OR", operands: formulas };
}

/**
 * Build a negation (NOT)
 */
export function not(formula: FOLFormula): FOLFormula {
    return { type: "compound", operator: "NOT", operands: [formula] };
}

/**
 * Build an implication (P → Q)
 */
export function implies(antecedent: FOLFormula, consequent: FOLFormula): FOLFormula {
    return { type: "compound", operator: "IMPLIES", operands: [antecedent, consequent] };
}

/**
 * Build a universal quantification (∀x. P(x))
 */
export function forall(variable: string, scope: FOLFormula): FOLFormula {
    return { type: "quantified", quantifier: "FORALL", variable, scope };
}

/**
 * Build an existential quantification (∃x. P(x))
 */
export function exists(variable: string, scope: FOLFormula): FOLFormula {
    return { type: "quantified", quantifier: "EXISTS", variable, scope };
}

/**
 * Evaluate a FOL formula
 */
export async function evaluateFormula(
    formula: FOLFormula,
    bindings: Record<string, unknown> = {}
): Promise<boolean> {
    switch (formula.type) {
        case "atomic": {
            if (!formula.predicate || !formula.args) return false;
            const resolvedArgs = formula.args.map((arg) => {
                if (typeof arg === "string" && arg.startsWith("$")) {
                    const varName = arg.slice(1);
                    return bindings[varName] ?? arg;
                }
                return arg;
            });
            return formula.predicate.evaluate(resolvedArgs);
        }

        case "compound": {
            if (!formula.operands) return false;
            switch (formula.operator) {
                case "AND":
                    for (const op of formula.operands) {
                        if (!(await evaluateFormula(op, bindings))) return false;
                    }
                    return true;

                case "OR":
                    for (const op of formula.operands) {
                        if (await evaluateFormula(op, bindings)) return true;
                    }
                    return false;

                case "NOT":
                    if (!formula.operands[0]) return false;
                    return !(await evaluateFormula(formula.operands[0], bindings));

                case "IMPLIES": {
                    // P → Q ≡ ¬P ∨ Q
                    if (!formula.operands[0] || !formula.operands[1]) return false;
                    const p = await evaluateFormula(formula.operands[0], bindings);
                    if (!p) return true; // false → anything is true
                    return await evaluateFormula(formula.operands[1], bindings);
                }

                default:
                    return false;
            }
        }

        case "quantified": {
            // Quantified formulas require a domain to iterate over
            // In practice, this would need domain-specific handling
            console.warn("Quantified formula evaluation not fully implemented");
            return formula.scope ? await evaluateFormula(formula.scope, bindings) : false;
        }

        default:
            return false;
    }
}

/**
 * Convert FOL formula to human-readable string
 */
export function formulaToString(formula: FOLFormula): string {
    switch (formula.type) {
        case "atomic": {
            const predName = formula.predicate?.name ?? "?";
            const argsStr = formula.args?.map(a => String(a)).join(", ") ?? "";
            return `${predName}(${argsStr})`;
        }

        case "compound":
            if (!formula.operands) return "?";
            switch (formula.operator) {
                case "AND":
                    return `(${formula.operands.map(formulaToString).join(" ∧ ")})`;
                case "OR":
                    return `(${formula.operands.map(formulaToString).join(" ∨ ")})`;
                case "NOT":
                    if (!formula.operands[0]) return "?";
                    return `¬${formulaToString(formula.operands[0])}`;
                case "IMPLIES":
                    if (!formula.operands[0] || !formula.operands[1]) return "?";
                    return `(${formulaToString(formula.operands[0])} → ${formulaToString(formula.operands[1])})`;
                default:
                    return "?";
            }

        case "quantified": {
            const q = formula.quantifier === "FORALL" ? "∀" : "∃";
            const scopeStr = formula.scope ? formulaToString(formula.scope) : "?";
            return `${q}${formula.variable}. ${scopeStr}`;
        }

        default:
            return "?";
    }
}

/**
 * Example: Build invariant "User's name is Alice"
 */
export function exampleFactInvariant(): FOLInvariant {
    return {
        id: "inv_name_alice",
        kind: "fact",
        formula: atomic(StandardPredicates.equals!, "$user_name", "Alice"),
        naturalLanguage: "The user's name is Alice",
        weight: 1.0,
        strict: true,
    };
}

/**
 * Example: Build constraint "All prices are in USD"
 */
export function exampleConstraintInvariant(): FOLInvariant {
    return {
        id: "inv_prices_usd",
        kind: "constraint",
        formula: forall("price", atomic(StandardPredicates.matches!, "$price", "\\$?[0-9]+\\.?[0-9]*")),
        naturalLanguage: "All prices should be in USD format",
        weight: 0.8,
        strict: false,
    };
}
