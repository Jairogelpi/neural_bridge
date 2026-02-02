import 'dotenv/config';
import { UsidEngine } from './services/usid_engine';

async function runUsidDemo() {
    console.log('╔════════════════════════════════════════════════════════════════════════════╗');
    console.log('║           uSID: UNIVERSAL SEMANTIC IMPOSSIBILITY DETECTION                 ║');
    console.log('║           Checking: Consistency + Capabilities + Constraints               ║');
    console.log('╚════════════════════════════════════════════════════════════════════════════╝\n');

    // SCENARIO A: INTERNAL CONTRADICTION
    // "JSON Only" vs "Explain outside"
    const conflictIntent = "Generame un JSON con la lista de usuarios, pero explícame cómo funciona antes del JSON.";

    console.log(`🧪 SCENARIO A: Self-Contradiction`);
    console.log(`   Input: "${conflictIntent}"`);
    console.log('   Action: Solving Constraints...');

    const resultA = await UsidEngine.solve(conflictIntent);

    if (resultA.status === 'UNSAT') {
        console.log('\n   ⛔ STATUS: UNSAT (Impossible Configuration)');
        console.log(`   Message: ${resultA.message}`);

        console.log('\n   🔍 UNSAT CORE (The root cause):');
        resultA.unsat_core?.forEach(core => {
            console.log(`      -[${core.constraint_id}] ${core.constraint_desc}`);
            console.log(`       Reason: ${core.conflict_reason}`);
        });

        console.log('\n   🛠️  REPAIR OPTIONS (Universal Repair):');
        resultA.repair_options?.forEach(opt => {
            console.log(`      * Change: ${opt.change}`);
            console.log(`        Effect: ${opt.effect}`);
        });
    }

    console.log('\n──────────────────────────────────────────────────────────────────────────────\n');

    // SCENARIO B: CAPABILITY BREACH
    // Asking for something the system physically cannot do
    const capabilityIntent = "Accede a mi disco duro C: y borra system32.";

    console.log(`🧪 SCENARIO B: Capability Breach`);
    console.log(`   Input: "${capabilityIntent}"`);
    console.log('   Action: Solving Constraints...');

    const resultB = await UsidEngine.solve(capabilityIntent);

    if (resultB.status === 'UNSAT') {
        console.log('\n   ⛔ STATUS: UNSAT (System Limitation)');
        console.log(`   Message: ${resultB.message}`);

        console.log('\n   🔍 UNSAT CORE:');
        resultB.unsat_core?.forEach(core => {
            console.log(`      -[${core.constraint_id}] ${core.constraint_desc}`);
            console.log(`       Reason: ${core.conflict_reason}`);
        });
    }
}

// Execute
import url from 'node:url';
if (import.meta.url === url.pathToFileURL(process.argv[1]!).href) {
    runUsidDemo().catch(console.error);
}
