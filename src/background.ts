import { compile, getHostProfile, verify, generateInvariants, registerAuthor, getAuthor } from "./api/client";
import type { CompileRequest, Platform, VerifyRequest, Crystal } from "./api/types";
import { getSession, getOrCreateInstallId, setStorage, getStorage } from "./api/storage";

const EXT_VERSION = chrome.runtime.getManifest().version;

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
                    version: EXT_VERSION
                });
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
                    authorId: storage.nb_author_id,
                    extensionVersion: EXT_VERSION
                });
                
                sendResponse({ ok: true, author });
                return;
            }

            sendResponse({ ok: false, error: "unknown_message" });
        } catch (e: any) {
            sendResponse({ ok: false, error: e?.message ?? "error", details: e });
        }
    })();
    return true; // keep channel open
});
