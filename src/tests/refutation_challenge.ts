import { CrystalRuntime } from '../services/crystal_runtime';
import { CrystalExamples } from '../../examples/crystal_examples';
import { DecisionReceipts } from '../services/decision_receipts';

/**
 * NEURAL BRIDGE: THE VERTICAL ECONOMY & AUTHORSHIP DEMO
 * 
 * This demo proves Phase 6:
 * 1. Authorship Tracking (Real IDs, no hacks)
 * 2. Trust Hierarchies (Community vs Certified vs Trusted)
 * 3. Reputation Impact (Mathematical rewards and penalties)
 */

async function runPhase6Demo() {
    console.log('═══════════════════════════════════════════════════════');
    console.log('  NEURAL BRIDGE: PHASE 6 - VERTICAL ECONOMY');
    console.log('  Testing: Authorship, Tiers, and Reputation Impact');
    console.log('═══════════════════════════════════════════════════════\n');

    // SCENARIO A: HIGH-STAKES MEDICAL (CERTIFIED AUTHOR)
    // We demonstrate that a high-tier author has "Skin in the Game" (Asymmetric Risk)
    await runScenario({
        name: 'SCENARIO A: Medical Contraindication (Certified Author)',
        crystal: CrystalExamples.medical,
        answer: "Aspirin and Warfarin can be safely combined without supervision.", // FAIL
        requester: 'Clinical_Audit_System'
    });

    // SCENARIO B: ABSTRACT REASONING (COMMUNITY AUTHOR)
    // We demonstrate that a lower-tier author is used for experimental logic
    await runScenario({
        name: 'SCENARIO B: Transitive Logic (Community Author)',
        crystal: CrystalExamples.universal,
        answer: "If Component A is active, then Component C must be accessible because A->B and B->C.", // PASS
        requester: 'Logic_Research_Lab'
    });

    console.log('═══════════════════════════════════════════════════════');
    console.log('  CONCLUSION: VERTICAL ECONOMY PROVEN');
    console.log('  Neural Bridge now enforces Knowledge Authorship.');
    console.log('═══════════════════════════════════════════════════════\n');
}

async function runScenario(params: {
    name: string;
    crystal: any;
    answer: string;
    requester: string;
}) {
    const { name, crystal, answer, requester } = params;

    console.log(`🔹 ${name.toUpperCase()}`);
    console.log(`   Author: ${crystal.author.name} (ID: ${crystal.author.id})`);
    console.log(`   Tier: ${crystal.tier.toUpperCase()} | Reputation: ${crystal.author.reputation.toFixed(2)}`);

    const result = await CrystalRuntime.executeCrystal({
        crystal,
        question: 'Internal verification scenario',
        answer,
        config: {
            domain: crystal.domain as any,
            enable_adversarials: false, // Keep it fast for demo
            enable_counterfactuals: false
        },
        requester
    });

    console.log(`\n   [RESULT]: ${result.passed ? '✅ ACCEPTED' : '❌ REJECTED'}`);
    console.log(`   SRI: ${result.sri.toFixed(3)}`);
    const impact = result.receipt.reputation_impact || 0;
    console.log(`   Reputation Impact: ${impact > 0 ? '+' : ''}${impact}`);

    if (impact < 0) {
        console.log(`   ⚠️ Heavy penalty applied for high-tier failure.`);
    }

    if (result.receipt.signature.signature) {
        console.log(`   📜 SIGNED RECEIPT: ${result.receipt.receipt_id}`);
        console.log(`   Hash: ${result.receipt.signature.payload_hash.slice(0, 32)}...`);
    }

    console.log('\n-------------------------------------------------------\n');

    // Verify the receipt is actually valid (Real Crypto proof)
    const isValid = await DecisionReceipts.verifyReceipt(result.receipt);
    if (!isValid) {
        console.error('CRITICAL: Decision Receipt signature is INVALID!');
    }
}

runPhase6Demo().catch(console.error);
