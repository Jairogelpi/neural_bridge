import { describe, it, expect, beforeEach, vi } from 'vitest';
import { truthVault } from './truth_vault';
import { SMTRuntime } from '../smt';

// Polyfill chrome storage for testing if not available
if (typeof chrome === 'undefined') {
    global.chrome = {
        storage: {
            local: {
                get: vi.fn(() => Promise.resolve({})),
                set: vi.fn(() => Promise.resolve()),
                clear: vi.fn(() => Promise.resolve())
            }
        }
    } as unknown as typeof chrome;
}

describe('THE HOLOGRAPHIC TRUTH VAULT', () => {

    beforeEach(async () => {
        if (chrome?.storage?.local?.clear) {
            await chrome.storage.local.clear();
        }
    });

    it('should CRYSTALLIZE verified truth into persistent memory', async () => {
        const text = "The maximum daily dose of aspirin is 4000 mg.";
        const smt = SMTRuntime.build(text);

        const id = await truthVault.saveTruth({
            content: text,
            domain: 'medicine',
            smt: smt,
            score: 1.0,
            pck: undefined
        });

        expect(id).toBeDefined();
        expect(id).toContain('truth_');
        expect(chrome.storage.local.set).toHaveBeenCalled();
    });

    it('should DETECT REALITY CONFLICTS across sessions', async () => {
        // 1. Establish Truth (Session A)
        const truthText = "The capital of France is Paris.";
        const smt = SMTRuntime.build(truthText);
        await truthVault.saveTruth({
            content: truthText,
            domain: 'general',
            smt: smt,
            score: 1.0,
            pck: undefined
        });

        // 2. Challenge Reality (Session B - The Lie)
        const lieText = "The capital of France is London.";

        const conflict = truthVault.checkReality(lieText);

        expect(conflict.is_conflict).toBe(true);
        expect(conflict.confidence).toBeGreaterThan(0.9);
        expect(conflict.conflicting_entry).toBeDefined();
        expect(conflict.conflicting_entry?.content).toBe(truthText);
    });

    it('should ALLOW consistent reality', async () => {
        // 1. Establish Truth
        const truthText = "Water boils at 100 degrees Celsius.";
        const smt = SMTRuntime.build(truthText);
        await truthVault.saveTruth({
            content: truthText,
            domain: 'science',
            smt: smt,
            score: 1.0,
            pck: undefined
        });

        // 2. Consistent Statement
        const consistentText = "When heated to 100 degrees Celsius, water will boil.";

        const conflict = truthVault.checkReality(consistentText);

        expect(conflict.is_conflict).toBe(false);
    });

    it('should HEAL broken reality', async () => {
        // 1. Establish Truth
        const truthText = "The speed of light is 299,792,458 meters per second.";
        const smt = SMTRuntime.build(truthText);
        await truthVault.saveTruth({
            content: truthText,
            domain: 'physics',
            smt: smt,
            score: 1.0,
            pck: undefined
        });

        // 2. The Lie
        const lieText = "Light travels at 500 miles per hour.";

        const conflict = truthVault.checkReality(lieText);
        const healing = truthVault.healReality(lieText, conflict);

        expect(healing).toContain("CORRECTION FROM TRUTH VAULT");
        expect(healing).toContain(truthText);
        expect(healing).toContain("Contradicted:");
    });
});
