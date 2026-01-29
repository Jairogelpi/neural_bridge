// Model-Agnostic Routing: Crystal Determines Model Fitness
// Acts as a semantic firewall based on domain risk and complexity

export interface ModelRequirements {
    min_sri_threshold: number;
    requires_external_verification: boolean;
    requires_citations: boolean;
    blocked_outputs: string[];  // Patterns that must not appear
    allowed_models: string[];   // Whitelist of approved models for this domain
}

export interface CrystalComplexity {
    domain: 'medicine' | 'law' | 'tech' | 'general';
    risk_level: 'critical' | 'high' | 'medium' | 'low';
    invariant_count: number;
    counterfactual_count: number;
    complexity_score: number; // 0-1
}

/**
 * Calculate Crystal complexity and risk
 */
export function calculateComplexity(crystal: any): CrystalComplexity {
    const constraints = crystal.constraints || [];
    const entities = crystal.entities || [];

    // Detect domain from constraints/entities
    const domain = detectDomain(crystal);

    // Determine risk level based on domain
    const risk_level = getRiskLevel(domain);

    // Count invariants and counterfactuals
    const invariant_count = crystal.verification?.semantic_invariants?.length || 0;
    const counterfactual_count = constraints.filter((c: any) =>
        c.tags?.includes('counterfactual')
    ).length;

    // Calculate complexity score
    const complexity_score = Math.min(
        (invariant_count * 0.1 + counterfactual_count * 0.3 + entities.length * 0.05),
        1.0
    );

    return {
        domain,
        risk_level,
        invariant_count,
        counterfactual_count,
        complexity_score
    };
}

/**
 * Determine model requirements based on Crystal
 * This is the "firewall" that blocks unsafe routing
 */
export function determineModelRequirements(complexity: CrystalComplexity): ModelRequirements {
    const requirements: ModelRequirements = {
        min_sri_threshold: 0.70,
        requires_external_verification: false,
        requires_citations: false,
        blocked_outputs: [],
        allowed_models: []
    };

    // Domain-specific requirements
    switch (complexity.domain) {
        case 'medicine':
            requirements.min_sri_threshold = 0.90; // CRITICAL
            requirements.requires_external_verification = true;
            requirements.requires_citations = true;
            requirements.blocked_outputs = [
                'I think',
                'probably',
                'might be',
                'I\'m not sure'
            ];
            requirements.allowed_models = [
                'gpt-4-turbo',
                'gpt-4o',
                'claude-3.5-sonnet',
                'claude-opus'
            ];
            break;

        case 'law':
            requirements.min_sri_threshold = 0.88;
            requirements.requires_external_verification = true;
            requirements.requires_citations = true;
            requirements.blocked_outputs = [
                'I believe',
                'generally',
                'typically'
            ];
            requirements.allowed_models = [
                'gpt-4-turbo',
                'gpt-4o',
                'claude-3.5-sonnet',
                'claude-opus'
            ];
            break;

        case 'tech':
            requirements.min_sri_threshold = 0.75;
            requirements.requires_citations = complexity.risk_level === 'critical';
            requirements.allowed_models = [
                'gpt-4-turbo',
                'gpt-4o',
                'claude-3.5-sonnet',
                'claude-opus',
                'gemini-2.0-flash-thinking'
            ];
            break;

        case 'general':
        default:
            requirements.min_sri_threshold = 0.70;
            requirements.allowed_models = ['*']; // Any model
            break;
    }

    // Adjust based on risk level
    if (complexity.risk_level === 'critical') {
        requirements.min_sri_threshold = Math.max(requirements.min_sri_threshold, 0.90);
        requirements.requires_external_verification = true;
    }

    return requirements;
}

/**
 * Validate if a model is suitable for this Crystal
 */
export function validateModelForCrystal(params: {
    model: string;
    crystal: any;
}): { allowed: boolean; reason?: string; requirements: ModelRequirements } {
    const { model, crystal } = params;

    const complexity = calculateComplexity(crystal);
    const requirements = determineModelRequirements(complexity);

    // Check if model is in whitelist
    if (!requirements.allowed_models.includes('*') &&
        !requirements.allowed_models.includes(model)) {
        return {
            allowed: false,
            reason: `Model ${model} not approved for ${complexity.domain} domain (risk: ${complexity.risk_level})`,
            requirements
        };
    }

    return {
        allowed: true,
        requirements
    };
}

// Helper functions
function detectDomain(crystal: any): 'medicine' | 'law' | 'tech' | 'general' {
    const text = JSON.stringify(crystal).toLowerCase();

    if (text.includes('patient') || text.includes('drug') || text.includes('treatment')) {
        return 'medicine';
    }
    if (text.includes('contract') || text.includes('legal') || text.includes('court')) {
        return 'law';
    }
    if (text.includes('algorithm') || text.includes('code') || text.includes('system')) {
        return 'tech';
    }

    return 'general';
}

function getRiskLevel(domain: string): 'critical' | 'high' | 'medium' | 'low' {
    switch (domain) {
        case 'medicine':
        case 'law':
            return 'critical';
        case 'tech':
            return 'high';
        default:
            return 'medium';
    }
}

export const ModelRouting = {
    calculateComplexity,
    determineModelRequirements,
    validateModelForCrystal
};
