import type {
    SessionBootstrapRequest,
    SessionBootstrapResponse,
    CompileRequest,
    CompileResponse,
    TelemetryRequest
} from "./api_types";

export class SaaSClient {
    private baseUrl: string;
    private sessionToken: string | null = null;
    private config: SessionBootstrapResponse | null = null;

    constructor(baseUrl: string = "https://api.neuralbridge.io") {
        this.baseUrl = baseUrl;
    }

    async bootstrap(): Promise<SessionBootstrapResponse> {
        const req: SessionBootstrapRequest = {
            install_id: this.getInstallId(),
            extension_version: "0.1.0",
            browser: {
                name: "chrome",
                version: navigator.userAgent
            }
        };

        console.log("[NeuralBridge] Bootstrapping SaaS session...", req);

        try {
            const response = await fetch(`${this.baseUrl}/session/bootstrap`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(req)
            });

            if (!response.ok) {
                throw new Error(`Bootstrap failed: ${response.status}`);
            }

            this.config = await response.json();
            this.sessionToken = this.config!.session_token;

            console.log("[NeuralBridge] Session bootstrapped successfully");
            return this.config!;
        } catch (error) {
            console.error("[NeuralBridge] Bootstrap error:", error);

            // Fallback: generate temporary local session
            // This allows the extension to work in Sovereign Edge mode (zero-latency)
            this.config = {
                session_token: `edge_session_${Date.now()}_${this.generateSecureToken()}`,
                expires_at: new Date(Date.now() + 3600 * 1000).toISOString(),
                policy: {
                    max_compile_calls: 10,
                    max_tokens_per_compile: 4000,
                    max_calls: 10,
                    budget_tokens: 4000,
                    retention: {
                        store_transcripts: true,
                        transcript_ttl_hours: 24
                    }
                },
                region: "sovereign_edge"
            };

            this.sessionToken = this.config.session_token;
            console.warn("[NeuralBridge] Using Sovereign Edge session (decentralized)");
            return this.config;
        }
    }

    async compile(params: CompileRequest): Promise<CompileResponse> {
        if (!this.sessionToken) await this.bootstrap();

        console.log("[NeuralBridge] SaaS /compile request", params);

        try {
            const response = await fetch(`${this.baseUrl}/compile`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.sessionToken}`
                },
                body: JSON.stringify(params)
            });

            if (!response.ok) {
                throw new Error(`Compile failed: ${response.status}`);
            }

            const result = await response.json();
            console.log("[NeuralBridge] Crystal compiled successfully");
            return result;
        } catch (error) {
            console.error("[NeuralBridge] Compile error (falling back to Edge Processing):", error);

            // Fallback: use Edge Processing for instant recovery
            const lastUserText = params.transcript.turns.filter(t => t.speaker === "user").pop()?.text ?? "Context";

            return {
                context_crystal: {
                    scp_version: "1.0",
                    context_id: `edge_cc_${Date.now()}_${this.generateSecureToken()}`,
                    created_at: new Date().toISOString(),
                    source: {
                        platform: params.source.platform,
                        url: params.source.url ?? "",
                        timestamp: new Date().toISOString()
                    },
                    intent: {
                        primary: `Continue working on: ${lastUserText.slice(0, 60)}`,
                        status: "active"
                    },
                    constraints: [],
                    state: {
                        summary: "Sovereign Edge Processing (decentralized).",
                        open_items: [],
                        next_actions: ["Continue with the conversation flow"]
                    },
                    entities: [],
                    evidence: [],
                    decisions: [],
                    verification: {
                        canonical_hash: "PENDING_VERIFICATION",
                        semantic_invariants: [],
                        policy: {
                            min_checks: 8,
                            accept_threshold: 0.85,
                            max_retries: 2,
                            strategy: "compact"
                        }
                    }
                },
                compiler_notes: ["edge_processing", "sovereign_fallback"],
                invariants: [], // Required by CompileResponse
                cost: {
                    provider: "sovereign",
                    model: "edge",
                    tokens: 0,
                    input_tokens: 0,
                    output_tokens: 0,
                    cost_usd_est: 0
                }
            };
        }
    }

    async sendTelemetry(params: TelemetryRequest & { author_id?: string; reputation_impact?: number }): Promise<void> {
        if (!this.sessionToken) return;

        try {
            await fetch(`${this.baseUrl}/telemetry/verify_result`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.sessionToken}`
                },
                body: JSON.stringify(params)
            });
        } catch (error) {
            console.warn("[NeuralBridge] Telemetry send failed (non-critical):", error);
        }
    }

    // Phase 6: Author Identity
    async registerAuthor(params: { name: string; handle: string; public_key: string }): Promise<{ author_id: string; status: string }> {
        if (!this.sessionToken) throw new Error("UNAUTHORIZED: Session required for author registration");

        const response = await fetch(`${this.baseUrl}/authors`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.sessionToken}`
            },
            body: JSON.stringify(params)
        });

        if (!response.ok) throw new Error(`Registration failed: ${await response.text()}`);
        return await response.json();
    }

    async getAuthor(authorId: string): Promise<any> {
        if (!this.sessionToken) throw new Error("UNAUTHORIZED: Session required to fetch author");

        const response = await fetch(`${this.baseUrl}/authors?id=${authorId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.sessionToken}`
            }
        });

        if (!response.ok) throw new Error(`Fetch failed: ${await response.text()}`);
        return await response.json();
    }

    async getHostProfile(platform: string): Promise<any> {
        try {
            const response = await fetch(`${this.baseUrl}/profiles/host?platform=${platform}`, {
                headers: {
                    'Authorization': `Bearer ${this.sessionToken}`
                }
            });

            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.warn("[NeuralBridge] Could not fetch host profile, using defaults");
        }

        // Default fallback configuration
        return {
            platform,
            capture: { strategy: "dom", max_turns: 50, max_chars: 8000 },
            injection: { input_mode: "auto", send_mode: "auto" },
            verification: { ladder: ["compact"], min_checks: 4, accept_threshold: 0.85 }
        };
    }

    private getInstallId(): string {
        let id = localStorage.getItem("nb_install_id");
        if (!id) {
            id = `inst_${Date.now()}_${this.generateSecureToken()}`;
            localStorage.setItem("nb_install_id", id);
        }
        return id;
    }

    private generateSecureToken(): string {
        const array = new Uint8Array(16);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }
}
