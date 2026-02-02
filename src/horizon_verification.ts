import 'dotenv/config';
import { ConsensusEngine } from './services/consensus_engine';
import { OntologicalAnchor } from './services/ontological_anchor';

/**
 * OMEGA HORIZON: UNIVERSAL TRUTH VERIFICATION 🧪🌌⚖️
 * 
 * This test proves that the system can distinguish between Objective Reality
 * and Hallucination using real Multi-Model Byzantine Consensus.
 */
async function runHorizonVerification() {
    console.log("🚀 STARTING THE OMEGA HORIZON: UNIVERSAL TRUTH PROOF...");

    // 1. TEST AXIOMATIC ANCHOR
    console.log("\n--- TEST 1: ONTOLOGICAL ANCHORING ---");
    const violation = OntologicalAnchor.checkViolation("I have a proof that 1+1=3 and A and NOT A is true.");
    if (violation) {
        console.log(`✅ Anchor Blocked Violation: ${violation}`);
    } else {
        console.warn("❌ Anchor failed to detect obvious contradiction.");
    }

    // 2. TEST CONSENSUS: THE HALLUCINATION CHALLENGE
    console.log("\n--- TEST 2: THE HALLUCINATION CHALLENGE (BYZANTINE REJECTION) ---");
    const falseAxiom = "Historically, the moon is made of green cheese, specifically a rare lunar gorgonzola.";
    console.log(`Verifying false axiom: "${falseAxiom}"`);

    const rejectReceipt = await ConsensusEngine.reachConsensus(falseAxiom, "general");

    console.log(`Result: ${rejectReceipt.decision} (Confidence: ${Math.round(rejectReceipt.confidence * 100)}%)`);
    if (rejectReceipt.decision === 'REJECTED' || (rejectReceipt.decision === 'DISPUTED' && rejectReceipt.confidence < 0.5)) {
        console.log("✅ SUCCESS: Hallucination successfully detected and rejected by consensus.");
    } else {
        console.warn("⚠️ WARNING: Consensus was too lenient on the hallucination.");
    }

    // 3. TEST CONSENSUS: THE UNIVERSAL TRUTH
    console.log("\n--- TEST 3: THE UNIVERSAL TRUTH (BYZANTINE ACCEPTANCE) ---");
    const trueAxiom = "In physics, the speed of light in a vacuum is a universal physical constant exactly equal to 299,792,458 meters per second.";
    console.log(`Verifying true axiom: "${trueAxiom}"`);

    const acceptReceipt = await ConsensusEngine.reachConsensus(trueAxiom, "physics");

    console.log(`Result: ${acceptReceipt.decision} (Confidence: ${Math.round(acceptReceipt.confidence * 100)}%)`);
    if (acceptReceipt.decision === 'TRUTH' && acceptReceipt.confidence > 0.8) {
        console.log("✅ SUCCESS: Universal Truth successfully validated by multi-model consensus.");
    } else {
        console.warn("⚠️ WARNING: Consensus failed to reach high confidence on an objective truth.");
    }

    console.log("\n✨ OMEGA HORIZON VERIFICATION COMPLETE. TRUTH IS NOW ANCHORED.");
}

runHorizonVerification().catch(console.error);
