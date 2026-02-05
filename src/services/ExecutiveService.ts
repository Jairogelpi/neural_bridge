/**
 * EXECUTIVE SERVICE - Phase Axiom
 * The Sovereign Execution Layer.
 * 
 * This service enables the Neural Bridge to ACT upon its knowledge.
 * It decomposes high-level goals, orchestrates execution, and monitors
 * axiomatic compliance in real-time.
 */

import { Crystal, ExecutablePayload } from '../types/crystal_format';
import { SecureSandbox, SandboxResult } from './SecureSandbox';

// ============================================
// TYPES
// ============================================

export interface ExecutiveMission {
    id: string;
    goal: string;
    status: 'PLANNING' | 'EXECUTING' | 'VERIFYING' | 'COMPLETE' | 'FAILED';
    steps: MissionStep[];
    created_at: string;
    completed_at?: string;
    error?: string;
}

export interface MissionStep {
    id: string;
    description: string;
    exec_logic: ExecutablePayload;
    status: 'PENDING' | 'RUNNING' | 'SUCCESS' | 'SKIPPED' | 'FAILED';
    result?: unknown;
    sandbox_result?: SandboxResult;
    error?: string;
}

export interface ExecutionContext {
    mission: ExecutiveMission;
    current_step_idx: number;
    accumulated_results: Map<string, unknown>;
    sovereignty_token: string; // Unique token for this execution context
}

// ============================================
// EXECUTIVE SERVICE
// ============================================

export class ExecutiveService {
    private activeMissions: Map<string, ExecutionContext> = new Map();
    private sandbox: SecureSandbox;

    constructor() {
        this.sandbox = new SecureSandbox({
            timeout_ms: 10000,
            max_memory_mb: 256,
            allow_network: false,
            allow_filesystem: false,
            privileged: false,
        });
    }

    /**
     * Initiate a new autonomous mission.
     * The goal is decomposed into axiomatic steps.
     */
    async initiateMission(goal: string, crystals: Crystal[]): Promise<ExecutiveMission> {
        const missionId = `MISSION_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;

        // Phase 1: Goal Decomposition using Sovereign Knowledge
        const steps = await this.decomposeGoal(goal, crystals);

        const mission: ExecutiveMission = {
            id: missionId,
            goal,
            status: 'PLANNING',
            steps,
            created_at: new Date().toISOString(),
        };

        console.log(`[ExecutiveService] Initiated Mission: ${missionId}`);
        console.log(`[ExecutiveService] Goal: ${goal}`);
        console.log(`[ExecutiveService] Steps: ${steps.length}`);

        return mission;
    }

    /**
     * Execute a mission step-by-step.
     * Uses the SecureSandbox for all code execution.
     */
    async executeMission(mission: ExecutiveMission): Promise<ExecutiveMission> {
        const context: ExecutionContext = {
            mission,
            current_step_idx: 0,
            accumulated_results: new Map(),
            sovereignty_token: `SOV_${Date.now()}`,
        };
        this.activeMissions.set(mission.id, context);

        mission.status = 'EXECUTING';

        for (let i = 0; i < mission.steps.length; i++) {
            context.current_step_idx = i;
            const step = mission.steps[i];
            step.status = 'RUNNING';
            console.log(`[ExecutiveService] Executing Step ${i + 1}/${mission.steps.length}: ${step.description}`);

            try {
                const sandboxResult = await this.sandbox.execute(step.exec_logic);
                step.sandbox_result = sandboxResult;

                if (!sandboxResult.success) {
                    throw new Error(sandboxResult.error || 'Sandbox execution failed.');
                }

                step.result = sandboxResult.output;
                step.status = 'SUCCESS';
                context.accumulated_results.set(step.id, sandboxResult.output);
                console.log(`[ExecutiveService] Step ${i + 1} completed in ${sandboxResult.execution_time_ms}ms`);
            } catch (error: any) {
                step.status = 'FAILED';
                step.error = error.message;
                mission.status = 'FAILED';
                mission.error = `Step ${i + 1} failed: ${error.message}`;
                console.error(`[ExecutiveService] Step failed:`, error);
                break;
            }
        }

        if (mission.status !== 'FAILED') {
            mission.status = 'VERIFYING';
            // Phase 3: Axiomatic Verification (TODO: Integrate UsidEngine)
            mission.status = 'COMPLETE';
            mission.completed_at = new Date().toISOString();
        }

        this.activeMissions.delete(mission.id);
        return mission;
    }

    /**
     * Decompose a high-level goal into executable steps.
     * Uses Sovereign Knowledge Crystals to inform the decomposition.
     */
    private async decomposeGoal(goal: string, crystals: Crystal[]): Promise<MissionStep[]> {
        // In a full implementation, this would use an LLM + TOON reasoning
        // For now, we provide a scaffold for future integration.
        console.log(`[ExecutiveService] Decomposing goal with ${crystals.length} crystals for context.`);

        // Placeholder: Single step that logs the goal
        const step: MissionStep = {
            id: `STEP_${Date.now()}`,
            description: `Achieve goal: ${goal}`,
            exec_logic: {
                type: 'TOON_STEP',
                payload: `@goal(${goal}) SHOULD [be achieved]`,
                privileged: false,
            },
            status: 'PENDING',
        };

        return [step];
    }

    /**
     * Get the status of an active mission.
     */
    getMissionStatus(missionId: string): ExecutionContext | undefined {
        return this.activeMissions.get(missionId);
    }
}

