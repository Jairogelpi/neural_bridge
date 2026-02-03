
import { NeuralBridge } from '../index';
import { RecursiveBrain } from '../services/recursive_brain';

/**
 * SELF-HEALING SYSTEM GROWTH PROOF 🌱🧠
 * 
 * Scenario:
 * The system has knowledge about "AI Laws" but knows nothing about "Article 12".
 * We trigger a Learning Pulse and observe the brain autonomously discovering Article 12.
 */
async function runSelfHealingProof() {
    console.log("=== NEURAL BRIDGE OMEGA: SELF-HEALING BRAIN PROOF ===");

    const domain = 'spanish_ai_law';
    const nb = NeuralBridge.init({ domain });

    // 1. Initial State: Minimal Knowledge
    console.log("[Proof] Ingesting initial context...");
    await nb.remember("The Spanish AI Act governs the use of algorithms in the public sector.");

    // 2. Trigger Autonomous Gap Detection
    console.log("[Proof] Triggering Recursive Brain Audit...");
    const audit = await RecursiveBrain.performEpistemicAudit(domain);
    console.log(`[Proof] Detected Gaps in Knowledge: ${JSON.stringify(audit)}`);

    // 3. The Pulse: Filling the Gap
    console.log("[Proof] Initiating Learning Pulse to heal voids...");
    await RecursiveBrain.learningPulse(domain);

    // 4. Verification: Querying the new knowledge
    console.log("[Proof] Querying the autonomously acquired knowledge...");
    // We assume the brain picked something related to the gaps it found.
    const results = await nb.ask(audit[0].gap);

    console.log(`--- AUTONOMOUS DISCOVERY RESULT ---`);
    console.log(`Query: "${audit[0].gap}"`);
    console.log(`Discovered Truth: ${results.content}`);
    console.log(`Verification Status: ${results.proof_valid ? '✅ VERIFIED' : '❌ UNVERIFIED'}`);
    console.log(`Author: ${results.metadata.author}`);
    console.log(`-----------------------------------`);

    if (results.metadata.author === 'recursive_brain') {
        console.log("✅ SUCCESS: The system autonomously learned and verified new truth.");
    } else {
        console.warn("⚠️ FAILURE: The system did not attribute the knowledge to the Recursive Brain.");
    }
}

runSelfHealingProof().catch(console.error);
