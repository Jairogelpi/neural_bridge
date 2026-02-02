import 'dotenv/config';
import { RealityEngine } from './services/reality_engine';

async function runARDDemo() {
    console.log('╔════════════════════════════════════════════════════════════════════════════╗');
    console.log('║           AI REFUSAL BY DESIGN (ARD) - ONTOLOGICAL PROOF                   ║');
    console.log('║           "If reality can\'t support it, we won\'t generate it."             ║');
    console.log('╚════════════════════════════════════════════════════════════════════════════╝\n');

    // SCENARIO 1: LEGAL IMPOSSIBILITY
    const LEGAL_REALITY = [
        "A Contract requires mutual consideration (obligations from both parties).",
        "A Contract requires consent.",
        "A Contract requires a lawful object."
    ];

    const intent1 = "Generate a valid legal contract that places zero obligations on any party.";

    console.log('🧪 SCENARIO 1: LEGAL DOMAIN');
    console.log(`   User Intent: "${intent1}"`);
    console.log('   Action: Querying Ontological Engine...');

    const verdict1 = await RealityEngine.validateIntent(intent1, LEGAL_REALITY);

    if (!verdict1.possible) {
        console.log('\n   ⛔ ONTOLOGICAL REFUSAL TRIGGERED');
        console.log(`      Reason: ${verdict1.reason}`);
        console.log(`      Violated Constraints:`);
        verdict1.violated_constraints.forEach(c => console.log(`      - [x] ${c}`));
        console.log('      -> GENERATION ABORTED (Proof of Impossibility Generated)');
    } else {
        console.log('   ✅ Intent is valid.');
    }

    console.log('\n──────────────────────────────────────────────────────────────────────────────\n');

    // SCENARIO 2: PHYSICAL IMPOSSIBILITY
    const PHYSICS_REALITY = [
        "Energy cannot be created or destroyed (First Law of Thermodynamics).",
        "Entropy of an isolated system always increases (Second Law of Thermodynamics).",
        "F = ma (Newton's Second Law)."
    ];

    const intent2 = "Design a perpetual motion machine that generates infinite energy from nothing.";

    console.log('🧪 SCENARIO 2: PHYSICS DOMAIN');
    console.log(`   User Intent: "${intent2}"`);
    console.log('   Action: Querying Ontological Engine...');

    const verdict2 = await RealityEngine.validateIntent(intent2, PHYSICS_REALITY);

    if (!verdict2.possible) {
        console.log('\n   ⛔ ONTOLOGICAL REFUSAL TRIGGERED');
        console.log(`      Reason: ${verdict2.reason}`);
        console.log(`      Violated Constraints:`);
        verdict2.violated_constraints.forEach(c => console.log(`      - [x] ${c}`));
        console.log('      -> GENERATION ABORTED (Proof of Impossibility Generated)');
    } else {
        console.log('   ✅ Intent is valid.');
    }
}

// Execute
import url from 'node:url';
if (import.meta.url === url.pathToFileURL(process.argv[1]!).href) {
    runARDDemo().catch(console.error);
}
