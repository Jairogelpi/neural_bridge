import 'dotenv/config';
import { SCPService } from './services/llm';
import { CrystalStatus } from './types/crystal_format';

/**
 * OMEGA ENGINE VERIFICATION: THE CHAOS CHALLENGE 🌀🧠
 * 
 * We feed the system a completely made-up, 'random' knowledge domain
 * and prove it can autonomously evolve an ontology for it.
 */
async function runChaosChallenge() {
    console.log("🚀 STARTING THE OMEGA ENGINE CHAOS CHALLENGE...");

    // A completely nonsensical, 'random' input
    const randomInput = `
        The Zerp-Blib energy in the 5th dimension depends on the fluctuation of Gribble-Coffee.
        To stabilize a Blib-Core, one must apply exactly 3 micro-sips of Espresso-Logic.
        Never cross the Zerp-Streams during a full Lunar-Latte.
    `;

    console.log("\n--- INPUT (TOTAL RANDOMNESS) ---");
    console.log(randomInput);

    console.log("\nInitiating Stochastic Adaptation Flow...");

    try {
        // This will trigger Fractal Compression -> Stochastic processChaos -> DomainEvolver.evolveDomain
        const { crystal } = await SCPService.generateCrystal(randomInput, 'openai/gpt-4o');

        console.log(`\n--- EVOLVED ONTOLOGY ---`);
        console.log(`Domain: ${(crystal as any).domain?.toUpperCase()}`);
        console.log(`Primary Intent: ${(crystal as any).intent?.primary}`);
        console.log("Evolved Axioms:");
        (crystal as any).constraints?.forEach((c: any) => console.log(`• [${c.rule}] ${c.value}`));

        console.log("\n--- VERIFICATION ---");
        if (crystal && (crystal as any).domain !== 'general' && (crystal as any).domain !== 'unknown_evolution') {
            console.log(`✅ SUCCESS: The Omega Engine autonomously evolved the "${(crystal as any).domain}" domain.`);
            console.log("✅ CHAOS MASTERED.");
        } else {
            console.error("❌ FAILED: The system fell back to a generic domain.");
        }

    } catch (error: any) {
        console.error("❌ Unexpected Error during Chaos Challenge:", error);
    }
}

runChaosChallenge().catch(console.error);
