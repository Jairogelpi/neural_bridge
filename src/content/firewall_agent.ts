import type { HostAdapterV2 } from "./hosts/v2/types";
import { ChatGPTV2 } from "./hosts/v2/chatgpt";
import { ClaudeV2 } from "./hosts/v2/claude";
import { GeminiV2 } from "./hosts/v2/gemini";
import { DomainHeuristics, type KnowledgeDomain } from "../services/domain_heuristics";
import { VerificationService } from "../services/verification_service";
import { PCKRuntime } from "../pck";
import type { ProofCarryingKnowledge } from "../pck";
import { ZKVRuntime } from "../zkv";
import type { ZKProof } from "../zkv";
import { SMTRuntime } from "../smt";
import type { SemanticMerkleTree } from "../smt";
import { CLPVRuntime } from "../clpv";
import type { PortableReceipt } from "../clpv";
import { truthVault } from "../features/truth_vault";
import type { Crystal } from "../api/types";

export type TrustState = 'idle' | 'scanning' | 'verified' | 'warning' | 'blocked';

export interface FirewallVerdict {
    state: TrustState;
    sri: number;
    reason?: string | undefined;
    invariants?: Array<{ id: string; passed: boolean; reason?: string }>;

    // Revolutionary Features Status
    features?: {
        pck: { enabled: boolean; llm_calls_saved: number; cost_saved: string };
        zkv: { enabled: boolean; proofs_generated: number; data_protected: boolean };
        smt: { enabled: boolean; contradictions_found: number; semantic_hash: string };
        clpv: { enabled: boolean; receipts_generated: number; cross_llm_compatible: boolean };
    };

    // Self-Healing Reality
    healing?: {
        needed: boolean;
        corrected_text: string;
        source_truth_id: string;
        reason: string;
    } | undefined;

    verification_time_ms?: number;

    // Legacy fields for backwards compatibility
    pck_enabled?: boolean;
    llm_calls_saved?: number;
    cost_saved?: string;
}

export class FirewallAgent {
    private host: HostAdapterV2 | null = null;
    private activeDomain: KnowledgeDomain = 'general';
    private mountedCrystals: Crystal[] = [];
    private mountedPCKs: Map<string, ProofCarryingKnowledge> = new Map();
    private lastProcessedText: string = "";
    private checkInterval: ReturnType<typeof setInterval> | null = null;
    private strictMode: boolean = false;
    private pckMode: boolean = true;  // PCK enabled by default - zero cost!
    private zkvMode: boolean = true;   // ZKV enabled - enterprise privacy
    private smtMode: boolean = true;   // SMT enabled - semantic analysis

    // Stats tracking
    private totalLLMCallsSaved: number = 0;
    private totalCostSaved: number = 0;
    private totalZKProofs: number = 0;
    private totalContradictionsFound: number = 0;
    private lastSemanticHash: string = '';
    private lastZKProof: ZKProof | null = null;
    private lastSMT: SemanticMerkleTree | null = null;
    private lastPortableReceipt: PortableReceipt | null = null;
    private totalPortableReceipts: number = 0;
    private clpvMode: boolean = true;  // CLPV enabled - cross-LLM portable

    constructor() {
        this.detectHost();
    }

    public setConfig(config: { strictMode?: boolean; pckMode?: boolean; zkvMode?: boolean; smtMode?: boolean }) {
        if (config.strictMode !== undefined) this.strictMode = config.strictMode;
        if (config.pckMode !== undefined) this.pckMode = config.pckMode;
        if (config.zkvMode !== undefined) this.zkvMode = config.zkvMode;
        if (config.smtMode !== undefined) this.smtMode = config.smtMode;
        console.log(`[NeuralFirewall] PCK: ${this.pckMode ? 'ON' : 'OFF'}, ZKV: ${this.zkvMode ? 'ON' : 'OFF'}, SMT: ${this.smtMode ? 'ON' : 'OFF'}`);
    }

    public getStats() {
        return {
            pck: {
                enabled: this.pckMode,
                llm_calls_saved: this.totalLLMCallsSaved,
                cost_saved: `$${this.totalCostSaved.toFixed(4)}`
            },
            zkv: {
                enabled: this.zkvMode,
                proofs_generated: this.totalZKProofs,
                data_protected: this.zkvMode
            },
            smt: {
                enabled: this.smtMode,
                contradictions_found: this.totalContradictionsFound,
                last_semantic_hash: this.lastSemanticHash.substring(0, 16) + '...'
            }
        };
    }

    private detectHost() {
        if (ChatGPTV2.detect()) this.host = ChatGPTV2;
        else if (ClaudeV2.detect()) this.host = ClaudeV2;
        else if (GeminiV2.detect()) this.host = GeminiV2;
    }

    public async mountDomainCrystals() {
        if (!this.host) return;

        const initialText = this.host.getLastAssistantText();
        const detected = DomainHeuristics.detect(initialText || document.title);

        this.activeDomain = detected.domain;
        console.log(`[NeuralFirewall] Domain detected: ${this.activeDomain} (${detected.confidence})`);

        this.mountedCrystals = await VerificationService.harvestCrystals({
            domain: this.activeDomain,
            text: initialText || document.title
        });

        if (this.mountedCrystals && this.mountedCrystals.length > 0) {
            const first = this.mountedCrystals[0];
            if (first) {
                chrome.storage.local.set({ nb_active_crystal_id: first.context_id });
            }
        }
    }

    public startSilentMonitoring(onVerdict: (v: FirewallVerdict) => void) {
        if (!this.host) return;

        console.log(`[NeuralFirewall] Starting silent monitor on ${this.host.name}`);

        this.checkInterval = setInterval(async () => {
            await this.pulse(onVerdict);
        }, 3000);
    }

    public stop() {
        if (this.checkInterval) clearInterval(this.checkInterval);
    }

    private async pulse(onVerdict: (v: FirewallVerdict) => void) {
        if (!this.host) return;

        const currentText = this.host.getLastAssistantText();
        if (!currentText || currentText === this.lastProcessedText || currentText.length < 20) {
            return;
        }

        this.lastProcessedText = currentText;
        onVerdict({ state: 'scanning', sri: 0 });

        const d = DomainHeuristics.detect(currentText);
        if (d.domain !== this.activeDomain && d.confidence > 0.6) {
            this.activeDomain = d.domain;
            await this.mountDomainCrystals();
        }

        // ═══════════════════════════════════════════════════════════════════════
        // REVOLUTIONARY VERIFICATION PIPELINE (PCK + ZKV + SMT + CLPV + VAULT)
        // All five features working together for maximum protection
        // ═══════════════════════════════════════════════════════════════════════

        const startTime = Date.now();
        let pckResult = null;
        let smtResult = null;
        let zkProof = null;
        let contradictionsFound = 0;

        // 1. PCK: Zero-cost verification
        if (this.pckMode) {
            pckResult = await this.verifyWithPCK(currentText);
            this.totalLLMCallsSaved++;
            this.totalCostSaved += 0.002;
        }

        // 2. SMT: Semantic analysis (contradiction detection)
        if (this.smtMode) {
            smtResult = this.analyzeWithSMT(currentText);
            this.lastSemanticHash = smtResult.semantic_hash;
            this.lastSMT = smtResult.tree;
            contradictionsFound = smtResult.contradictions;
            this.totalContradictionsFound += contradictionsFound;
        }

        // 3. ZKV: Generate privacy-preserving proof (for enterprise users)
        if (this.zkvMode && pckResult) {
            zkProof = this.generateZKProof(currentText, pckResult.valid);
            this.lastZKProof = zkProof;
            this.totalZKProofs++;
        }

        // 4. CLPV: Generate cross-LLM portable receipt
        if (this.clpvMode) {
            this.lastPortableReceipt = this.generatePortableReceipt(currentText);
            this.totalPortableReceipts++;
        }

        // 5. TRUTH VAULT: Holographic Memory & Reality Check
        // Checks if current text contradicts previously verified truths from ANY session
        const realityCheck = truthVault.checkReality(currentText);
        let healing = undefined;

        if (realityCheck.is_conflict) {
            console.log(`[NeuralFirewall] 🛑 REALITY CONFLICT DETECTED: ${realityCheck.contradiction_reason}`);
            contradictionsFound++; // Treat as contradiction

            healing = {
                needed: true,
                corrected_text: truthVault.healReality(currentText, realityCheck),
                source_truth_id: realityCheck.conflicting_entry?.id || 'unknown',
                reason: realityCheck.contradiction_reason || 'Contradicts verified truth'
            };
        } else if ((pckResult?.valid ?? true) && contradictionsFound === 0 && this.activeDomain !== 'general' && currentText.length > 50) {
            // AUTO-SAVE: If text is valid and substantial, crystallize it into the vault
            // This builds the user's sovereign memory automatically
            if (this.lastSMT) {
                truthVault.saveTruth({
                    content: currentText,
                    domain: this.activeDomain,
                    smt: this.lastSMT,
                    pck: pckResult?.valid ? this.mountedPCKs.get(this.activeDomain) : undefined,
                    score: pckResult?.confidence || 0.9
                }).catch(e => console.error("Failed to crystallize truth:", e));
            }
        }

        const verificationTime = Date.now() - startTime;

        // Determine final state
        const hasContradictions = (pckResult?.contradictions?.length || 0) > 0 || contradictionsFound > 0;
        const isValid = pckResult?.valid ?? true;

        // If healing is needed, we flag as warning/blocked but offer the fix
        const finalState: TrustState = hasContradictions ? 'blocked' : (isValid ? 'verified' : 'idle');
        const finalSri = pckResult?.confidence ?? 0;

        onVerdict({
            state: finalState,
            sri: finalSri,
            reason: hasContradictions ?
                (healing?.reason || pckResult?.contradictions?.[0] || 'Semantic contradiction detected') : undefined,
            invariants: pckResult?.supported_claims?.map(c => ({
                id: c.substring(0, 30),
                passed: true
            })) || [],

            // All Revolutionary Features Status
            features: {
                pck: {
                    enabled: this.pckMode,
                    llm_calls_saved: this.totalLLMCallsSaved,
                    cost_saved: `$${this.totalCostSaved.toFixed(4)}`
                },
                zkv: {
                    enabled: this.zkvMode,
                    proofs_generated: this.totalZKProofs,
                    data_protected: this.zkvMode
                },
                smt: {
                    enabled: this.smtMode,
                    contradictions_found: this.totalContradictionsFound,
                    semantic_hash: this.lastSemanticHash.substring(0, 16) + '...'
                },
                clpv: {
                    enabled: this.clpvMode,
                    receipts_generated: this.totalPortableReceipts,
                    cross_llm_compatible: true
                }
            },
            healing,
            verification_time_ms: verificationTime,

            // Legacy fields
            pck_enabled: this.pckMode,
            llm_calls_saved: this.totalLLMCallsSaved,
            cost_saved: `$${this.totalCostSaved.toFixed(4)}`
        });

        // Skip legacy mode if revolutionary features are enabled
        if (this.pckMode || this.smtMode || this.zkvMode) {
            return;
        }

        // ═══════════════════════════════════════════════════════════════════════
        // Legacy Mode: Uses LLM calls (more expensive)
        // ═══════════════════════════════════════════════════════════════════════
        if (this.mountedCrystals.length === 0) {
            onVerdict({ state: 'idle', sri: 0, reason: "No crystals mounted", pck_enabled: false });
            return;
        }

        let aggregatedInvariants: Array<{ id: string; passed: boolean; reason?: string }> = [];
        let minSri = 1.0;

        for (const crystal of this.mountedCrystals) {
            const crystalObj = crystal as unknown as Record<string, unknown>;
            const result = await VerificationService.verify({
                context_id: String(crystalObj.context_id || ""),
                domain: this.activeDomain,
                question: "Contextual Interception",
                answer: currentText,
                mode: this.strictMode ? 'active' : 'passive',
                requester: "firewall_agent"
            });

            if (!result) continue;

            const currentInvariants: Array<{ id: string; passed: boolean; reason?: string }> = [
                ...((result.invariants_failed || []) as unknown[]).map(id => ({ id: String(id), passed: false, reason: "Constraint violated" })),
                ...((result.invariants_passed || []) as unknown[]).map(id => ({ id: String(id), passed: true }))
            ];
            aggregatedInvariants = [...aggregatedInvariants, ...currentInvariants];

            if (result.sri < minSri) minSri = result.sri;

            if (!result.passed) {
                onVerdict({
                    state: result.sri < 0.5 ? 'blocked' : 'warning',
                    sri: result.sri,
                    reason: result.issues[0] || 'Verification failed',
                    invariants: currentInvariants,
                    pck_enabled: false
                });
                return;
            }
        }

        onVerdict({
            state: 'verified',
            sri: minSri === 1.0 && aggregatedInvariants.length === 0 ? 0 : minSri,
            invariants: aggregatedInvariants.length > 0 ? aggregatedInvariants : [{ id: "active_monitoring", passed: true }],
            pck_enabled: false
        });
    }

    /**
     * PCK Verification - ZERO external API calls
     * This is the revolutionary part that makes Neural Bridge unique
     */
    private async verifyWithPCK(text: string): Promise<{
        valid: boolean;
        confidence: number;
        supported_claims: string[];
        unsupported_claims: string[];
        contradictions: string[];
        verification_time_ms: number;
    }> {
        // Get or create PCK for current domain
        let pck = this.mountedPCKs.get(this.activeDomain);

        if (!pck) {
            // Create PCK from page context (domain-specific knowledge)
            const pageContext = this.extractPageContext();
            pck = PCKRuntime.compile(pageContext, {
                domain: this.activeDomain as KnowledgeDomain,
                extract_numbers: true,
                extract_entities: true,
                extract_temporals: true
            });
            this.mountedPCKs.set(this.activeDomain, pck!);
            console.log(`[NeuralFirewall] PCK compiled for ${this.activeDomain} domain`);
        }

        // Verify with ZERO API calls
        return PCKRuntime.verifyAnswer(pck, text);
    }

    /**
     * SMT Analysis - Semantic Merkle Tree for contradiction detection
     * Hash of MEANING, not bytes
     */
    private analyzeWithSMT(text: string): {
        semantic_hash: string;
        tree: SemanticMerkleTree;
        contradictions: number;
    } {
        // Build semantic tree from current text
        const tree = SMTRuntime.build(text);

        // Compare with previous content if available
        let contradictions = 0;
        if (this.lastSMT) {
            const comparison = SMTRuntime.compare(
                this.lastProcessedText || '',
                text
            );
            contradictions = comparison.contradictions.length;

            if (contradictions > 0) {
                console.log(`[NeuralFirewall] SMT detected ${contradictions} contradiction(s)`);
            }
        }

        return {
            semantic_hash: tree.document.semantic_hash,
            tree,
            contradictions
        };
    }

    /**
     * ZKV Proof Generation - Zero-Knowledge proof for enterprise privacy
     * Proves verification happened WITHOUT revealing source data
     */
    private generateZKProof(text: string, _isValid: boolean): ZKProof {
        const pageContext = this.extractPageContext();

        // Generate ZK proof - source never leaves the browser
        const proof = ZKVRuntime.createProof({
            source: pageContext,  // NEVER sent externally
            answer: text,
            domain: this.activeDomain as KnowledgeDomain,
            constraints: []
        });

        console.log(`[NeuralFirewall] ZK Proof generated: ${proof.proof_id}`);
        return proof;
    }

    /**
     * CLPV Receipt Generation - Cross-LLM portable receipt
     * Works with GPT-4, Claude, Gemini, Llama - ANY LLM
     */
    private generatePortableReceipt(text: string): PortableReceipt {
        // Detect LLM from host
        const llmName = this.host?.name || 'unknown';

        const receipt = CLPVRuntime.createReceipt({
            question: 'Contextual verification',
            answer: text,
            llm: llmName
        });

        console.log(`[NeuralFirewall] Portable receipt: ${receipt.receipt_id} (${llmName})`);
        return receipt;
    }

    /**
     * Extract relevant context from the page for PCK compilation
     */
    private extractPageContext(): string {
        // Get page title and any visible authoritative content
        const title = document.title || '';
        const metaDescription = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';

        // Get any structured data on the page
        const ldJson = document.querySelector('script[type="application/ld+json"]')?.textContent || '';

        // Combine into context
        return `${title}\n${metaDescription}\n${ldJson}`.trim() || 'General knowledge context';
    }
}
