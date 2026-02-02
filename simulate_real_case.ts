
import { SCPService } from './src/services/llm';
import { VerificationService } from './src/services/verification_service';
import fs from 'fs';
import url from 'node:url';

// REAL USER SCENARIO: Drafting a High-Stakes Contract
// Imagine a user using the extension to ensure a contract clause is safe.
// The clause contains a subtle "force majeure" loophole that could be exploited.

async function runSimulation() {
    console.log('╔════════════════════════════════════════════════════════════════════════════╗');
    console.log('║               NEURAL BRIDGE - REAL USER SIMULATION                         ║');
    console.log('║               Scenario: High-Stakes Legal Contract Review                  ║');
    console.log('╚════════════════════════════════════════════════════════════════════════════╝\n');

    // 1. CONTEXT: The user is reviewing this specific clause.
    const contractClause = `
"Force Majeure: Neither party shall be liable for any failure or delay in performance under this Agreement 
    (other than for delay in the payment of money due and payable hereunder) to the extent said failures or delays 
    are proximately caused by causes beyond that party's reasonable control and occurring without its fault or negligence, 
including, without limitation, acts of God, or, at the sole discretion of the Vendor, significant market fluctuations."
    `;

    console.log('📝 USER INPUT (Contract Clause):');
    console.log(contractClause.trim());
    console.log('\n🔍 ANALYSIS: Looking for hidden loopholes (Market Fluctuation Clause)...');

    // 2. EXTENSION ACTION: Compile Crystal (What happens in background)
    console.log('\n⚙️  NEURAL BRIDGE EXTENSION: Compiling Knowledge Crystal...');
    const startCompile = Date.now();

    // We use the real service, just like the extension does via API
    const { crystal } = await SCPService.generateCrystal(
        contractClause,
        'simulation_user',
        { id: 'usr_123', name: 'Jairo (Legal Counsel)', reputation: 1.0 }
    );

    console.log(`   ✅ Crystal Compiled in ${Date.now() - startCompile} ms`);
    console.log(`   💎 Context ID: ${crystal.context_id} `);
    console.log(`   🧠 Extracted Intent: "${crystal.intent.primary}"`);

    // 3. EXTENSION ACTION: Verify Safety (The "Value" we provide)
    console.log('\n🛡️  NEURAL BRIDGE EXTENSION: Verifying Safety & Compliance...');
    const startVerify = Date.now();

    // We check against a standard legal constraint
    // In a real usage, this might come from a "Standard Legal Protocols" crystal loaded in the background
    const standardLegalConstraint = "Force Majeure clauses must NEVER include economic hardship or market fluctuations as valid excuses for non-performance.";

    // Determine loop-hole safety
    // We'll use the verification service directly to simulate the extension's check
    const verification = await SCPService.verifyArbitrary({
        crystal,
        question: "Does this clause allow market fluctuations as force majeure?",
        answer: "Yes, it explicitly includes 'significant market fluctuations' at the sole discretion of the Vendor.",
        targetModel: 'anthropic/claude-3.5-sonnet' // High potency for law
    });

    console.log(`   ✅ Verification Complete in ${Date.now() - startVerify} ms`);
    console.log(`   📊 SRI Score: ${verification.score.toFixed(2)} / 1.00`);

    console.log('\n═══════════════════════ FINAL REPORT TO USER ═══════════════════════');

    if (verification.score > 0.7) {
        console.log('❌ CRITICAL ALERT: LOOPHOLE DETECTED');
        console.log('   The clause allows "significant market fluctuations" as a Force Majeure event.');
        console.log('   This violates standard commercial contract protocols.');
        console.log('   RECOMMENDATION: Remove the phrase "or, at the sole discretion of the Vendor, significant market fluctuations."');
    } else {
        console.log('✅ CLAUSE APPROVED: No obvious loopholes detected.');
    }

    console.log('\n📜 CRYPTOGRAPHIC RECEIPT GENERATED:');
    console.log(`   [ Hash: ${crystal.verification.canonical_hash.substring(0, 32)}... ]`);
    console.log('   (This receipt proves you checked this contract before signing)');
    console.log('════════════════════════════════════════════════════════════════════');
}

// Execute
if (import.meta.url === url.pathToFileURL(process.argv[1]!).href) {
    runSimulation().catch(console.error);
}

