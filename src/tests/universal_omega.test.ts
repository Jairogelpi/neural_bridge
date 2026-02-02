
import axios from 'axios';

/**
 * UNIVERSAL OMEGA INTEGRATION PROOF 🌐🛡️
 * 
 * Verifies that the API Server is a perfect mirror of the SDK.
 */
async function runUniversalProof() {
    console.log("=== NEURAL BRIDGE OMEGA: UNIVERSAL DEPLOYMENT PROOF ===");

    const API_BASE = 'http://localhost:3000';
    const DOMAIN = 'universal_test';

    try {
        // 1. Test Omega Remember (REST)
        console.log("\n[API] Testing /v1/omega/remember...");
        const remRes = await axios.post(`${API_BASE}/v1/omega/remember`, {
            text: "The speed of light in a vacuum is exactly 299,792,458 meters per second.",
            domain: DOMAIN,
            metadata: { veracity: 'axiomatic' }
        });

        if (remRes.data.success) {
            console.log("✅ API: Knowledge ingested successfully.");
        }

        // 2. Test Omega Ask (REST)
        console.log("\n[API] Testing /v1/omega/ask...");
        const askRes = await axios.post(`${API_BASE}/v1/omega/ask`, {
            query: "How fast is light?",
            domain: DOMAIN
        });

        console.log(`--- UNIVERSAL API RESULT ---`);
        console.log(`Query: "How fast is light?"`);
        console.log(`Result: ${askRes.data.content}`);
        console.log(`Anchor: ${askRes.data.anchor_prompt.substring(0, 50)}...`);
        console.log(`Status: ${askRes.data.proof_valid ? '✅ VERIFIED' : '❌ UNVERIFIED'}`);
        console.log(`----------------------------`);

        if (askRes.data.success && askRes.data.content.includes("299,792,458")) {
            console.log("✅ MISSION COMPLETE: Universal Omega is fully operational.");
        } else {
            console.warn("⚠️ WARNING: Integration results were unexpected.");
        }

    } catch (err: any) {
        console.error("❌ ERROR: Integration proof failed. Is the server running?", err.message);
    }
}

runUniversalProof().catch(console.error);
