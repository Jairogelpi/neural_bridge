/**
 * Cloud Bridge Service
 * Connects the SDK to the Neural Bridge SaaS API.
 * Enables: Remote Verification, Shared Crystals, Reputation, and heavy-duty Compilation.
 */

import { Crystal } from "../types/crystal_format";
import { DecisionReceipt } from "./decision_receipts";

export interface CloudConfig {
    apiKey: string;
    baseUrl?: string;
}

export class CloudBridge {
    private baseUrl: string;
    private apiKey: string;

    constructor(config: CloudConfig) {
        this.baseUrl = config.baseUrl || "https://api.neuralbridge.io";
        this.apiKey = config.apiKey;
    }

    private async request<T>(endpoint: string, method: string, body?: unknown): Promise<T> {
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${this.apiKey}`,
            "X-Client-Version": "0.1.0"
        };

        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method,
            headers,
            body: body ? JSON.stringify(body) : null
        });

        if (!response.ok) {
            let errorMsg = response.statusText;
            try {
                const err = await response.json();
                errorMsg = err.error || err.message || errorMsg;
            } catch { }
            throw new Error(`Neural Bridge Cloud Error (${response.status}): ${errorMsg}`);
        }

        return response.json();
    }

    /**
     * Offload compilation to the cloud.
     * Useful for weak client devices or when using enterprise PDF parsing pipelines.
     */
    async compile(content: string, domain: string = "general"): Promise<Crystal> {
        const res = await this.request<{ context_crystal: Crystal }>("/v1/compile", "POST", {
            transcript: {
                turns: [{ speaker: "user", text: content }] // Wrap content as transcript
            },
            compile_policy: { mode: "auto" }
        });
        return res.context_crystal;
    }

    /**
     * Remote Verification.
     * No local LLM required. Zero-knowledge proof returned.
     */
    async verify(params: {
        crystal: Crystal;
        question: string;
        answer: string;
    }): Promise<{ passed: boolean; sri: number; receipt: DecisionReceipt }> {
        const res = await this.request<any>("/v1/verify", "POST", {
            context_id: params.crystal.context_id,
            invariants: params.crystal.verification.semantic_invariants,
            llm_response: params.answer,
            question: params.question, // Optional extension to API
            threshold: 0.85
        });

        return {
            passed: res.passed,
            sri: res.score,
            receipt: res.receipt
        };
    }

    /**
     * Register a new Knowledge Author identity.
     */
    async registerAuthor(name: string, handle: string, publicKey: string) {
        return this.request("/v1/authors", "POST", { name, handle, public_key: publicKey });
    }

    /**
     * Send telemetry for reputation tracking.
     */
    async reportResult(receipt: DecisionReceipt) {
        const crystalId = receipt.crystal_refs[0]?.crystal_id;
        if (!crystalId) return; // Cannot report without ID

        return this.request("/v1/telemetry/verify_result", "POST", {
            context_id: crystalId,
            decision: receipt.verification.sri >= 0.85 ? "ACCEPT" : "FAIL",
            score: receipt.verification.sri,
            receipt: receipt
        });
    }
}
