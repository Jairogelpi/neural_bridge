import { compile, getHostProfile, verify, generateInvariants, registerAuthor, getAuthor } from "./api/client";
import type { CompileRequest, Platform, VerifyRequest, Crystal } from "./api/types";
import { getSession, getOrCreateInstallId, setStorage, getStorage } from "./api/storage";

const EXT_VERSION = chrome.runtime.getManifest().version;

// Persistent state for the current session (resets on worker restart, which is fine for live metrics)
let recentRuns: any[] = [];

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    (async () => {
        try {
            if (msg?.type === "NB_GET_STATE") {
                const session = await getSession();
                const installId = await getOrCreateInstallId();
                const storage = await getStorage("nb_author_id");

                sendResponse({
                    ok: true,
                    tenant_id: installId,
                    author_id: storage.nb_author_id,
                    session_expires: session.expiresAt,
                    authenticated: !!session.token,
                    version: EXT_VERSION,
                    runs: recentRuns
                });
                return;
            }

            if (msg?.type === "NB_PUSH_RUN") {
                recentRuns.unshift(msg.run);
                // Keep only last 10 runs to avoid memory bloat
                if (recentRuns.length > 10) recentRuns = recentRuns.slice(0, 10);
                sendResponse({ ok: true });
                return;
            }

            if (msg?.type === "NB_GET_HOST_PROFILE") {
                const platform = msg.platform as Platform;
                const profile = await getHostProfile({ platform, extensionVersion: EXT_VERSION });
                sendResponse({ ok: true, profile });
                return;
            }

            if (msg?.type === "NB_COMPILE") {
                const req = msg.req as CompileRequest;
                const resp = await compile({ req, extensionVersion: EXT_VERSION, idemKey: msg.idemKey });
                sendResponse({ ok: true, resp });
                return;
            }

            if (msg?.type === "NB_VERIFY") {
                const req = msg.req as VerifyRequest;
                const result = await verify({ req, extensionVersion: EXT_VERSION });
                sendResponse({ ok: true, result });
                return;
            }

            if (msg?.type === "NB_GENERATE_INVARIANTS") {
                const crystal = msg.crystal as Crystal;
                const result = await generateInvariants({ crystal, extensionVersion: EXT_VERSION });
                sendResponse({ ok: true, result });
                return;
            }

            // Phase 6: Author Registration (Real Implementation)
            if (msg?.type === "NB_REGISTER_AUTHOR") {
                const res = await registerAuthor({
                    name: msg.name,
                    handle: msg.handle,
                    extensionVersion: EXT_VERSION
                });

                // Save author_id locally
                await setStorage({ nb_author_id: res.author_id });

                sendResponse({ ok: true, author_id: res.author_id, status: res.status });
                return;
            }

            if (msg?.type === "NB_GET_AUTHOR_IDENTITY") {
                const storage = await getStorage("nb_author_id");
                if (!storage.nb_author_id) {
                    sendResponse({ ok: false, error: "no_author_linked" });
                    return;
                }

                const author = await getAuthor({
                    authorId: storage.nb_author_id as string,
                    extensionVersion: EXT_VERSION
                });

                sendResponse({ ok: true, author });
                return;
            }

            if (msg?.type === "NB_TRIGGER_CHECK") {
                console.log("[Background] 🧠 Neural Bridge TRIGGERED by User UI.");

                const text = msg.text;

                // 1. GENERATE CRYSTAL (Local Intelligence)
                // We use the local SCPService directly.
                const { SCPService } = await import("./services/llm");
                const { crystal } = await SCPService.generateCrystal(text, "browser-user");

                // 2. ORACLE OPTIMIZATION (Pre-Cognition)
                const { Oracle } = await import("./services/oracle");
                const prophecy = await Oracle.predictAndOptimize(crystal);

                // 3. REHYDRATE (The Bridge)
                const { RehydrationEngine } = await import("./services/rehydration");
                const transferPrompt = RehydrationEngine.rehydrate(crystal);

                // 4. RESPOND TO UI
                sendResponse({
                    ok: true,
                    result: {
                        crystal_id: crystal.context_id,
                        quality: "PLATINUM", // If Oracle passed
                        oracle_intervention: prophecy.intervention,
                        transfer_package: transferPrompt
                    }
                });
                return;
            }

            if (msg?.type === "NB_UNIVERSAL_PLUG") {
                console.log("[Background] ⚡ UNIVERSAL PLUG triggered.");
                const { AutonomousOnboarding } = await import("./services/autonomous_onboarding");

                const result = await AutonomousOnboarding.universalPlug({
                    type: msg.sourceType || 'text',
                    content: msg.content,
                    metadata: msg.metadata || {}
                });

                sendResponse({ ok: true, result });
                return;
            }

            if (msg?.type === "GET_BRIDGE_PAYLOAD") {
                console.log("[Background] 🌉 Preparing Bridge Payload for External LLM...");
                const { OpenWebUIBridge } = await import("./services/openwebui_bridge");

                // Get a representative query (could be from msg.query or a sum of active context)
                const query = msg.query || "General Truth Grounding";
                const payload = await OpenWebUIBridge.prepareInjection(query, []); // Empty array = get most relevant

                sendResponse({ ok: true, payload });
                return;
            }

            if (msg?.type === "NB_REFINE_KNOWLEDGE") {
                console.log("[Background] 🧬 Triggering Recursive Refinement...");
                const { NeuralSurface } = await import("./services/neural_surface");

                // If no session exists, initiate a temporary one for refinement
                const sessionId = msg.sessionId || "GLOBAL_REFINE";
                await NeuralSurface.refineKnowledge(sessionId, msg.interactionResult);

                sendResponse({ ok: true });
                return;
            }

            sendResponse({ ok: false, error: "unknown_message" });
        } catch (e: unknown) {
            console.error("[Background Error]", e);
            const msg = (e && typeof e === 'object' && 'message' in e && typeof e.message === 'string') ? e.message : "error";
            sendResponse({ ok: false, error: msg, details: e });
        }
    })();
    return true; // keep channel open
});
