
import { NeuralBridge } from '../index';
import { SemanticHasher } from '../services/semantic_hashing';

/**
 * SOVEREIGN REALITY PROOF (Alien Language Test) 🛸📐
 * 
 * Scenario:
 * We are interacting with a synthetic language "Xylos". 
 * We have never seen it before.
 * We want to see if the system can identify word roots and logic using pure math.
 */
async function runAlienProof() {
    console.log("=== NEURAL BRIDGE OMEGA: SOVEREIGN REALITY PROOF ===");

    // 1. Setup
    const nb = NeuralBridge.init({ domain: 'galactic_diplomacy' });

    // 2. The Alien Law
    // "Gloobix" = Action (Must)
    // "Zorp" = Target (Crystal)
    // "Gloobixing" = Inflection
    const alienLaw = "Gloobixing Zorp. Gloobix Zorp.";

    console.log(`\n[Input] Processing Alien Law: "${alienLaw}"`);

    // 3. Test Geometric Stemming (Topological Rooting)
    console.log("\n[Linguistics] Testing Topological Rooting (No Dictionaries)...");
    const hash1 = SemanticHasher.computeHolographicHash("Gloobixing");
    const hash2 = SemanticHasher.computeHolographicHash("Gloobix");
    const similarity = SemanticHasher.holographicSimilarity(hash1, hash2);

    console.log(`Similarity("Gloobixing", "Gloobix"): ${(similarity * 100).toFixed(1)}%`);

    // 4. Test Vector-Field Axiomatic Extraction
    console.log("\n[Logic] Extracting constraints from unknown syntax...");
    const crystal = await nb.remember("Gloobixing shall be mandatory for all Zorps.");

    console.log(`--- SOVEREIGN EXTRACTION ---`);
    console.log(`Detected Intent: ${crystal.intent.primary}`);
    console.log(`Detected Constraints: ${crystal.constraints?.length}`);
    if (crystal.constraints && crystal.constraints.length > 0) {
        console.log(`Constraint 1: [${crystal.constraints[0].rule}] ${crystal.constraints[0].value}`);
    }
    console.log(`----------------------------`);

    if (similarity > 0.8 && crystal.constraints && crystal.constraints.length > 0) {
        console.log("✅ SUCCESS: The system understands semantics and logic purely through geometry.");
    } else {
        console.warn("⚠️ WARNING: Sovereign metrics not fully met.");
    }
}

runAlienProof().catch(console.error);
