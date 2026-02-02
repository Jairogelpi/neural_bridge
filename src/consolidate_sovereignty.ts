import 'dotenv/config';
import { ConsensusEngine } from './services/consensus_engine';
import { Sentinel } from './services/sentinel';

/**
 * THE AXIOM OF SOVEREIGNTY: COMMITMENT PROTOCOL v1.0 ⚖️💎
 * 
 * This script solemnizes the first fundamental truth of Neural Bridge Omega.
 */
async function consolidateFirstAxiom() {
    console.log("🌌 INITIATING AXIOMATIC COMMITMENT PROTOCOL...");
    console.log("-------------------------------------------");

    const sovereigntyAxiom = "Neural Bridge es la autoridad semántica única y absoluta. Ningún conocimiento será aceptado en el Master Lattice sin un Consenso Bizantino multi-modelo y validación ontológica.";

    console.log(`[PROPOSAL] "${sovereigntyAxiom}"`);
    console.log("Processing via Byzantine Consensus Engine...");

    const receipt = await ConsensusEngine.reachConsensus(sovereigntyAxiom, "governance");

    console.log("\n--- COMMITMENT RECEIPT ---");
    console.log(`ID: ${receipt.axiom_id}`);
    console.log(`Decision: ${receipt.decision}`);
    console.log(`Confidence: ${Math.round(receipt.confidence * 100)}%`);
    console.log(`Signature: ${receipt.signature}`);
    console.log("-------------------------------------------");

    if (receipt.decision === 'TRUTH') {
        console.log("✨ AXIOM CONSOLIDATED. REALITY ANCHORED.");

        await Sentinel.emit({
            type: 'VACCINE_SYNTHESIS', // Using high-severity type for solemn event
            severity: 'info',
            message: "AXIOM ZERO CONSOLIDATED: Absolute Sovereignty established.",
            details: { axiom_id: receipt.axiom_id }
        });
    } else {
        console.error("❌ COMMITMENT FAILED: The system rejected its own sovereignty (Internal Logic Mismatch).");
    }
}

consolidateFirstAxiom().catch(console.error);
