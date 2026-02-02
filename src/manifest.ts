export function buildManifest() {
    return {
        manifest_version: 3,
        name: "Neural Bridge",
        version: "2.0.0",
        description: "Semantic Continuity Protocol (SCP) bridge with verifiable context transfer.",
        action: {
            default_title: "Neural Bridge",
            default_popup: "src/ui/popup.html"
        },
        icons: {
            "16": "icons/icon16.png",
            "32": "icons/icon32.png",
            "48": "icons/icon48.png",
            "128": "icons/icon128.png"
        },
        background: {
            service_worker: "background/service_worker.js",
            type: "module"
        },
        permissions: [
            "storage",
            "activeTab",
            "scripting"
        ],
        host_permissions: [
            "https://chatgpt.com/*",
            "https://chat.openai.com/*",
            "https://gemini.google.com/*",
            "https://claude.ai/*"
        ],
        content_scripts: [
            {
                matches: [
                    "https://chatgpt.com/*",
                    "https://chat.openai.com/*",
                    "https://gemini.google.com/*",
                    "https://claude.ai/*"
                ],
                js: ["content/index.js"],
                run_at: "document_idle"
            },
            {
                matches: ["<all_urls>"],
                js: ["content/silent_monitor.js"],
                run_at: "document_start"
            }
        ]
    } as const;
}
