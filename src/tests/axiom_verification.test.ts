/**
 * Phase Axiom - Vitest Verification Suite
 * 
 * Tests the complete autonomous execution flow:
 * 1. Goal Initiation
 * 2. Goal Decomposition  
 * 3. Secure Sandbox Execution
 * 4. Result Verification
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ExecutiveService } from '../services/ExecutiveService';
import { SecureSandbox } from '../services/SecureSandbox';
import type { Crystal, ExecutablePayload } from '../types/crystal_format';

// ============================================
// MOCK DATA
// ============================================

const createMockCrystal = (): Crystal => ({
    scp_version: '0.2-sigma',
    context_id: `CRYSTAL_TEST_${Date.now()}`,
    created_at: new Date().toISOString(),
    version: '1.0.0',
    tier: 'verified',
    source: {
        type: 'synthetic',
        url: 'test://internal',
        scraped_at: new Date().toISOString(),
        extraction_method: 'test',
    },
    intent: {
        raw_query: 'Test crystal for Phase Axiom verification',
        semantic_intent: 'TESTING',
        keywords: ['test', 'axiom', 'verification'],
    },
    verification: {
        canonical_hash: 'TEST_HASH_001',
        semantic_invariants: [],
        policy: {
            min_checks: 1,
            accept_threshold: 0.5,
            max_retries: 1,
            strategy: 'lazy',
        },
    },
    raw_toon: '@test(axiom) SHOULD [verify execution]',
    author: {
        id: 'test_system',
        name: 'Test Harness',
        reputation: 100,
    },
    exec_logic: {
        type: 'TOON_STEP',
        payload: '@goal(test) SHOULD [complete]',
        privileged: false,
    },
    capabilities: ['test', 'verification'],
});

// ============================================
// EXECUTIVE SERVICE TESTS
// ============================================

describe('Phase Axiom: Executive Service', () => {
    let service: ExecutiveService;

    beforeEach(() => {
        service = new ExecutiveService();
    });

    it('should initiate a mission with PLANNING status', async () => {
        const mission = await service.initiateMission(
            'Test goal for verification',
            [createMockCrystal()]
        );

        expect(mission).toBeDefined();
        expect(mission.id).toMatch(/^MISSION_/);
        expect(mission.status).toBe('PLANNING');
        expect(mission.goal).toBe('Test goal for verification');
        expect(mission.steps.length).toBeGreaterThan(0);
    });

    it('should execute a mission and complete successfully', async () => {
        const mission = await service.initiateMission(
            'Execute TOON logic in sandbox',
            [createMockCrystal()]
        );

        const completed = await service.executeMission(mission);

        expect(completed.status).toBe('COMPLETE');
        expect(completed.completed_at).toBeDefined();

        for (const step of completed.steps) {
            expect(step.status).toBe('SUCCESS');
            expect(step.sandbox_result).toBeDefined();
            expect(step.sandbox_result?.success).toBe(true);
        }
    });

    it('should track execution time in sandbox results', async () => {
        const mission = await service.initiateMission(
            'Track execution metrics',
            [createMockCrystal()]
        );

        const completed = await service.executeMission(mission);

        for (const step of completed.steps) {
            expect(step.sandbox_result?.execution_time_ms).toBeGreaterThanOrEqual(0);
            expect(step.sandbox_result?.resource_usage).toBeDefined();
        }
    });
});

// ============================================
// SECURE SANDBOX TESTS
// ============================================

describe('Phase Axiom: Secure Sandbox', () => {
    let sandbox: SecureSandbox;

    beforeEach(() => {
        sandbox = new SecureSandbox({
            timeout_ms: 5000,
            max_memory_mb: 128,
            allow_network: false,
            allow_filesystem: false,
            privileged: false,
        });
    });

    it('should execute TOON_STEP payloads successfully', async () => {
        const payload: ExecutablePayload = {
            type: 'TOON_STEP',
            payload: '@test(sandbox) SHOULD [execute safely]',
            privileged: false,
        };

        const result = await sandbox.execute(payload);

        expect(result.success).toBe(true);
        expect(result.output).toBeDefined();
        expect(result.execution_time_ms).toBeGreaterThanOrEqual(0);
    });

    it('should deny privileged payloads when not configured', async () => {
        const payload: ExecutablePayload = {
            type: 'SHELL_CMD',
            payload: 'echo "test"',
            privileged: true,
        };

        const result = await sandbox.execute(payload);

        expect(result.success).toBe(false);
        expect(result.error).toContain('PRIVILEGE_DENIED');
    });

    it('should block network requests when not allowed', async () => {
        const payload: ExecutablePayload = {
            type: 'API_CALL',
            payload: 'https://example.com/api',
            privileged: false,
        };

        const result = await sandbox.execute(payload);

        expect(result.success).toBe(false);
        expect(result.error).toContain('NETWORK_BLOCKED');
    });

    it('should block filesystem access when not allowed', async () => {
        const payload: ExecutablePayload = {
            type: 'SHELL_CMD',
            payload: 'ls -la',
            privileged: false,
        };

        const result = await sandbox.execute(payload);

        expect(result.success).toBe(false);
        expect(result.error).toContain('FILESYSTEM_BLOCKED');
    });

    it('should parse TOON logic and extract intents', async () => {
        const payload: ExecutablePayload = {
            type: 'TOON_STEP',
            payload: '@goal(summarize) @action(process) SHOULD [complete]',
            privileged: false,
        };

        const result = await sandbox.execute(payload);

        expect(result.success).toBe(true);
        const output = result.output as { parsed_intents: Array<{ type: string; value: string }> };
        expect(output.parsed_intents).toBeDefined();
        expect(output.parsed_intents.length).toBe(2);
    });
});

// ============================================
// INTEGRATION TEST
// ============================================

describe('Phase Axiom: End-to-End Integration', () => {
    it('should complete a full autonomous mission lifecycle', async () => {
        const service = new ExecutiveService();
        const crystals = [createMockCrystal(), createMockCrystal()];

        // 1. Initiate
        const mission = await service.initiateMission(
            'Complete end-to-end verification',
            crystals
        );
        expect(mission.status).toBe('PLANNING');

        // 2. Execute
        const completed = await service.executeMission(mission);
        expect(completed.status).toBe('COMPLETE');

        // 3. Verify all steps passed
        const allStepsPassed = completed.steps.every(s => s.status === 'SUCCESS');
        expect(allStepsPassed).toBe(true);

        // 4. Verify timestamps
        expect(new Date(completed.created_at).getTime()).toBeLessThanOrEqual(
            new Date(completed.completed_at!).getTime()
        );
    });
});
