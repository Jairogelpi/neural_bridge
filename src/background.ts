import { compile, getHostProfile, verify, generateInvariants } from "./api/client";
import type { CompileRequest, Platform, VerifyRequest, Crystal } from "./api/types";

const EXT_VERSION = chrome.runtime.getManifest().version;

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    (async () => {
        try {
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

            sendResponse({ ok: false, error: "unknown_message" });
        } catch (e: any) {
            sendResponse({ ok: false, error: e?.message ?? "error", details: e });
        }
    })();
    return true; // keep channel open
});
