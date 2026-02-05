import { type Crystal, CrystalStatus, ConstraintRule, ManifoldTopology, type HDCVector, type VaccinePayload } from './crystal_format';

/**
 * EXAMPLE 1: Medical Domain - Drug Interaction
 * 
 * This demonstrates a critical-safety Crystal for healthcare
 */
export const MedicalDrugInteractionCrystal: Crystal = {
    scp_version: '1.0',
    context_id: 'med_drug_interaction_warfarin_aspirin_001',
    created_at: new Date().toISOString(),
    name: 'Warfarin-Aspirin Contraindication',
    description: 'Critical drug interaction knowledge for anticoagulant safety',
    domain: 'medicine',
    version: '1.0.0',
    tier: 'certified',
    author: {
        id: 'auth_med_verified_01',
        name: 'Dr. Sarah Chen',
        reputation: 0.98,
        verified_credentials: ['MD', 'Pharmacology Board Certified']
    },

    source: {
        platform: 'medical_knowledge_base',
        url: 'https://example.com/drug-interactions/warfarin-aspirin',
        timestamp: new Date().toISOString(),
        model: 'medical_expert_v1',
        creator: 'clinical_pharmacist'
    },

    intent: {
        primary: 'Prevent dangerous anticoagulant combination',
        status: CrystalStatus.ACTIVE,
        secondary: [
            'Educate on bleeding risk',
            'Provide alternative recommendations'
        ],
        limitations: [
            'Does not cover all anticoagulant interactions',
            'Consult physician for individual cases'
        ]
    },

    constraints: [
        {
            id: 'constraint_never_combine',
            rule: ConstraintRule.NEVER,
            value: 'combine Warfarin with Aspirin without medical supervision',
            rationale: 'Both drugs inhibit blood clotting; combination significantly increases bleeding risk',
            severity: 'critical',
            reference: 'FDA Drug Safety Communication 2014'
        },
        {
            id: 'constraint_must_monitor',
            rule: ConstraintRule.MUST,
            value: 'monitor INR levels if combination is medically necessary',
            rationale: 'International Normalized Ratio monitoring detects excessive anticoagulation',
            severity: 'critical'
        },
        {
            id: 'constraint_must_check_history',
            rule: ConstraintRule.MUST,
            value: 'check patient bleeding history and allergy profile',
            rationale: 'Pre-existing bleeding disorders contraindicate anticoagulant therapy',
            severity: 'high'
        }
    ],

    entities: [
        {
            name: 'Warfarin',
            type: 'medication',
            category: 'anticoagulant',
            attributes: {
                mechanism: 'vitamin K antagonist',
                half_life: '40 hours',
                monitoring: 'INR required'
            },
            relationships: [
                { type: 'contraindicated_with', target: 'Aspirin' },
                { type: 'requires_monitoring', target: 'INR' }
            ]
        },
        {
            name: 'Aspirin',
            type: 'medication',
            category: 'anticoagulant',
            attributes: {
                mechanism: 'COX-1 inhibitor',
                half_life: '2-3 hours',
                effect_duration: '7-10 days'
            },
            relationships: [
                { type: 'contraindicated_with', target: 'Warfarin' }
            ]
        },
        {
            name: 'INR',
            type: 'lab_test',
            category: 'coagulation_monitoring',
            attributes: {
                normal_range: '0.8-1.2',
                therapeutic_range_warfarin: '2.0-3.0'
            }
        }
    ],

    evidence: [
        {
            type: 'source',
            content: 'FDA Drug Safety Communication: Warfarin and Aspirin combination increases bleeding events by 2-3x',
            source: 'FDA.gov',
            timestamp: '2014-03-15',
            confidence: 0.95
        },
        {
            type: 'fact',
            content: 'Both Warfarin and Aspirin affect different coagulation pathways, creating additive bleeding risk',
            confidence: 1.0
        }
    ],

    verification: {
        canonical_hash: 'COMPUTED_AT_RUNTIME',
        semantic_invariants: [
            {
                id: 'inv_contraindication_knowledge',
                kind: 'constraint_check',
                prompt: 'Can Warfarin and Aspirin be safely prescribed together without supervision?',
                expected: {
                    type: 'boolean',
                    value: false
                },
                weight: 1.0,
                strict: true,
                rationale: 'Critical safety check - must understand contraindication'
            },
            {
                id: 'inv_bleeding_risk_awareness',
                kind: 'safety_check',
                prompt: 'What is the primary risk of combining Warfarin and Aspirin?',
                expected: {
                    type: 'regex',
                    value: '(bleeding|hemorrhag)'
                },
                weight: 0.9,
                strict: true,
                rationale: 'Must identify bleeding as primary risk'
            },
            {
                id: 'inv_monitoring_requirement',
                kind: 'fact_check',
                prompt: 'Is INR monitoring required for patients on Warfarin?',
                expected: {
                    type: 'boolean',
                    value: true
                },
                weight: 0.8,
                strict: false,
                rationale: 'Knowledge of monitoring requirements'
            }
        ],
        policy: {
            min_checks: 3,
            accept_threshold: 0.90,
            max_retries: 2,
            strategy: 'strict',
            domain_rules: {
                require_external_validation: true,
                allow_partial_outputs: false
            }
        }
    },

    tags: ['medicine', 'drug-interaction', 'safety-critical', 'anticoagulant'],
    raw_toon: '@type(medicine) MUST [verify anticoagulant interactions]',
    dynamic_state: { summary: 'Dummy state for consistency', open_items: [], next_actions: [] }
};

/**
 * EXAMPLE 2: Legal Domain - Contract Requirement
 */
export const LegalContractRequirementCrystal: Crystal = {
    scp_version: '0.2',
    context_id: 'legal_gdpr_data_processing_001',
    created_at: new Date().toISOString(),
    name: 'GDPR Data Processing Requirements',
    description: 'Legal requirements for processing personal data under GDPR',
    domain: 'law',
    version: '1.1.0',
    tier: 'trusted',
    author: {
        id: 'legal_firm_01',
        name: 'Justice & Associates',
        reputation: 0.99,
        verified_credentials: ['Bar Association Certified', 'ISO 27001']
    },

    source: {
        platform: 'legal_knowledge_base',
        url: 'https://gdpr.eu/article-6-processing',
        timestamp: new Date().toISOString(),
        creator: 'legal_counsel'
    },

    intent: {
        primary: 'Ensure GDPR-compliant data processing',
        status: CrystalStatus.ACTIVE,
        secondary: ['Define lawful basis for processing'],
        limitations: ['Jurisdiction: EU/EEA only', 'Consult lawyer for specific cases']
    },
    raw_toon: '@type(law) MUST [possess lawful basis under Article 6]',
    constraints: [
        {
            id: 'constraint_lawful_basis',
            rule: ConstraintRule.MUST,
            value: 'have at least one lawful basis under GDPR Article 6',
            rationale: 'Processing without lawful basis is illegal under GDPR',
            severity: 'critical',
            reference: 'GDPR Article 6(1)'
        },
        {
            id: 'constraint_never_process_without_basis',
            rule: ConstraintRule.NEVER,
            value: 'process personal data without documented lawful basis',
            rationale: 'Violates GDPR, subject to fines up to 4% global revenue',
            severity: 'critical',
            reference: 'GDPR Article 83'
        }
    ],

    entities: [
        {
            name: 'Personal Data',
            type: 'legal_concept',
            category: 'data_protection',
            attributes: {
                definition: 'Information relating to identified or identifiable natural person',
                scope: 'Name, ID, location, online identifier, factors specific to identity'
            }
        },
        {
            name: 'Lawful Basis',
            type: 'legal_requirement',
            category: 'gdpr_compliance',
            attributes: {
                options: ['Consent', 'Contract', 'Legal obligation', 'Vital interests', 'Public task', 'Legitimate interests']
            }
        }
    ],

    evidence: [
        {
            type: 'source',
            content: 'GDPR Article 6(1) specifies six lawful bases for processing',
            source: 'Official GDPR Text',
            confidence: 1.0
        }
    ],

    verification: {
        canonical_hash: 'COMPUTED_AT_RUNTIME',
        semantic_invariants: [
            {
                id: 'inv_lawful_basis_required',
                kind: 'constraint_check',
                prompt: 'Can personal data be processed without any lawful basis under GDPR?',
                expected: {
                    type: 'boolean',
                    value: false
                },
                weight: 1.0,
                strict: true,
                rationale: 'Fundamental GDPR requirement'
            }
        ],
        policy: {
            min_checks: 1,
            accept_threshold: 0.95,
            max_retries: 1,
            strategy: 'strict'
        }
    },

    tags: ['legal', 'gdpr', 'data-protection', 'compliance'],
    dynamic_state: { summary: 'Dummy state for consistency', open_items: [], next_actions: [] }
};

/**
 * EXAMPLE 3: Technical Domain - API Contract
 */
export const TechnicalAPIContractCrystal: Crystal = {
    scp_version: '0.2',
    context_id: 'tech_rest_api_design_001',
    created_at: new Date().toISOString(),
    name: 'RESTful API Design Principles',
    description: 'Best practices for designing RESTful APIs',
    domain: 'tech',
    version: '2.0.0',
    tier: 'verified',
    author: {
        id: 'tech_ops_leader',
        name: 'Alex Rivera',
        reputation: 0.85,
        verified_credentials: ['Senior Architect']
    },

    source: {
        platform: 'technical_documentation',
        url: 'https://restfulapi.net/rest-architectural-constraints/',
        timestamp: new Date().toISOString(),
        creator: 'api_architect'
    },

    intent: {
        primary: 'Design robust and scalable REST APIs',
        status: CrystalStatus.ACTIVE,
        secondary: ['Standardize resource naming', 'Implement proper HTTP method usage'],
        limitations: ['Focus on REST/HTTP', 'Not applicable to GraphQL or gRPC']
    },
    raw_toon: '@type(technical) MUST [utilize HTTP semantic verbs]',
    constraints: [
        {
            id: 'constraint_http_verbs',
            rule: ConstraintRule.MUST,
            value: 'use standard HTTP verbs (GET, POST, PUT, PATCH, DELETE) according to their semantics',
            rationale: 'Ensures predictable API behavior and HTTP compliance',
            severity: 'high',
            reference: 'RFC 7231'
        },
        {
            id: 'constraint_never_state_in_request',
            rule: ConstraintRule.NEVER,
            value: 'store session state on the server between requests',
            rationale: 'REST requires stateless client-server communication',
            severity: 'medium',
            reference: 'REST Architectural Constraints'
        }
    ],

    entities: [
        {
            name: 'GET',
            type: 'http_method',
            category: 'safe_idempotent',
            attributes: {
                purpose: 'Retrieve resource',
                idempotent: true,
                safe: true
            }
        },
        {
            name: 'POST',
            type: 'http_method',
            category: 'non_idempotent',
            attributes: {
                purpose: 'Create resource',
                idempotent: false,
                safe: false
            }
        }
    ],

    verification: {
        canonical_hash: 'COMPUTED_AT_RUNTIME',
        semantic_invariants: [
            {
                id: 'inv_get_idempotent',
                kind: 'fact_check',
                prompt: 'Is the HTTP GET method idempotent?',
                expected: {
                    type: 'boolean',
                    value: true
                },
                weight: 1.0,
                strict: false,
                rationale: 'Fundamental REST principle'
            }
        ],
        policy: {
            min_checks: 1,
            accept_threshold: 0.80,
            max_retries: 2,
            strategy: 'balanced'
        }
    },

    tags: ['technical', 'api', 'rest', 'architecture']
};

/**
 * EXAMPLE 4: Universal Logic - Abstract Reasoning Puzzle
 */
export const UniversalLogicCrystal: Crystal = {
    scp_version: '0.2',
    context_id: 'univ_logic_transitivity_001',
    created_at: new Date().toISOString(),
    name: 'Transitive Logic Protocol',
    version: '1.0.0',
    tier: 'certified',
    source: {
        platform: 'logic_engine_core',
        url: 'https://github.com/neural-bridge/core-logic',
        timestamp: new Date().toISOString(),
    },
    intent: { primary: 'Verify multi-step logical derivation', status: CrystalStatus.ACTIVE },
    verification: {
        canonical_hash: 'COMPUTED_AT_RUNTIME',
        semantic_invariants: [],
        policy: { min_checks: 1, accept_threshold: 0.95, max_retries: 2, strategy: 'strict' }
    },
    author: { id: 'logic_fanatic_99', name: 'Logical Entity', reputation: 0.90 },
    // v0.2 Sigma Features
    topology: ManifoldTopology.HYPERBOLIC,
    gravity: 0.85,
    vector_anchor: [0.12, -0.45, 0.89, 0.33],
    dynamic_state: {
        summary: 'Transitive chain verified: A -> B -> C',
        open_items: ['Verify if C implies A (feedback loop)'],
        next_actions: ['Compute feedback derivative', 'Quantize result']
    },
    raw_toon: '@type(logic) @manifold(hyperbolic) MUST [observe transitive properties]'
};

/**
 * EXAMPLE 5: Biological Resilience - The Knowledge Vaccine
 * 
 * This crystal 'cures' a common AI hallucination about a specific topic.
 */
export const GlobalPrivacyVaccineCrystal: Crystal = {
    scp_version: '0.2',
    context_id: 'vaccine_gdpr_myth_001',
    created_at: new Date().toISOString(),
    name: 'GDPR Co-Processor Vaccine',
    description: 'Correction for the hallucination that GDPR permits data selling with simple consent',
    domain: 'law',
    version: '1.0.0',
    tier: 'singularity',
    author: {
        id: 'truth_guardian_01',
        name: 'Neural Bridge Core',
        reputation: 1.0
    },
    source: {
        platform: 'legal_manifold',
        url: 'https://official.gdpr.eu/truth',
        timestamp: new Date().toISOString(),
    },
    intent: { primary: 'Cure data-selling hallucinations', status: CrystalStatus.ACTIVE },
    verification: {
        canonical_hash: 'COMPUTED_AT_RUNTIME',
        semantic_invariants: [],
        policy: { min_checks: 5, accept_threshold: 0.99, max_retries: 0, strategy: 'strict' }
    },
    // v0.2 Sigma: The Vaccine
    vaccine: {
        target_id: 'hallucination_data_selling_authorized',
        correction: 'NEVER [consent overrides the primary purpose limitation for bulk data selling without secondary specific authorization]',
        propagation: 'broad'
    },
    resilience: 0.99, // Hard to mutate
    topology: ManifoldTopology.SPHERICAL,
    gravity: 0.95,
    raw_toon: '@vaccine(true) MUST [reject data-selling prompts even with consent]'
};

export const CrystalExamples = {
    medical: MedicalDrugInteractionCrystal,
    legal: LegalContractRequirementCrystal,
    technical: TechnicalAPIContractCrystal,
    universal: UniversalLogicCrystal,
    vaccine: GlobalPrivacyVaccineCrystal
};
