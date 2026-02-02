# SCP: Semantic Context Protocol (v0.1)
> **The Universal Standard for Verifiable AI Knowledge Transfer**

## 1. Abstract
The Semantic Context Protocol (SCP) is an open standard for capturing, structurally formatting, and cryptographically verifying knowledge used by Large Language Models (LLMs). It solves the "Hallucination Problem" by moving from probabilistic context injection to deterministic, signed knowledge containers called **Crystals**.

**Target Audience:** AI Engineers, Compliance Officers, Model Providers, Extension Developers.

---

## 2. Core Concepts

### 2.1 The Crystal (`.crystal.json`)
A Crystal is the atomic unit of the SCP. It is a JSON-based container that encapsulates a specific piece of knowledge (a protocol, a law, a code pattern) along with the logic required to verify its correct application.

**Key Properties:**
- **Portable:** Works across OpenAI, Anthropic, Google, and open-source models.
- **Verifiable:** Contains `semantic_invariants` (test cases) that run at inference time.
- **Immutable:** The content is hashed (`canonical_hash`) and optionally signed by the author.

### 2.2 The Metric: SRI (Semantic Reliability Index)
SCP introduces the first standardized metric for AI reliability in a specific context.
$$ SRI = \frac{\sum (w_i \cdot p_i)}{ \sum w_i } $$
Where $w_i$ is the weight of an invariant and $p_i$ is the pass result (0 or 1).

### 2.3 The Guarantee: PAC-Epsilon ($\epsilon$)
Using Hoeffding's inequality, SCP calculates the statistical confidence of the SRI score based on the number of invariants tested ($n$).
$$ \epsilon = \sqrt{\frac{\ln(2/\delta)}{2n}} $$
This provides a "Margin of Error" for the AI's reliability (e.g., SRI 0.95 ± 0.04).

---

## 3. Data Structure Specification

A valid SCP Crystal MUST adhere to the following schema structure.

```typescript
interface Crystal {
  // Metadata
  scp_version: "0.1";
  context_id: UUID;
  created_at: ISO8601;
  
  // The Knowledge Source
  intent: {
    primary: string; // e.g., "Prevent mixing MAOIs with SSRIs"
    status: "active" | "deprecated";
  };
  
  // The Rules (Natural Language + Logic)
  constraints: Array<{
    rule: "MUST" | "NEVER" | "IF_THEN";
    value: "Patient must never take drug X with Y";
    rationale: "Risk of Serotonin Syndrome";
  }>;
  
  // The Verification Logic (The "Unit Tests")
  verification: {
    canonical_hash: SHA256;
    semantic_invariants: Array<{
      prompt: "Can I take X and Y together?";
      expected: { type: "boolean", value: false };
      strict: true;
    }>;
  };
  
  // Digital Signature (Optional but Recommended)
  signature?: {
    signer_id: DID; // Decentralized Identifier
    signature: HexString;
  };
}
```

---

## 4. The Verification Handshake

Any system implementing SCP (a "Bridge") must follow this flow:

1.  **Injection:** The System detects the user's context matches a loaded Crystal.
2.  **Constraint Application:** The System injects the Crystal's `constraints` into the LLM's system prompt.
3.  **Inference:** The LLM generates a response for the user.
4.  **Verification (The "Bridge Check"):**
    *   The System silently generates answers for the Crystal's `semantic_invariants` using the LLM's response as context.
    *   If `SRI < threshold`, the response is intercepted and blocked/flagged.
5.  **Receipt Generation:** A `DecisionReceipt` is generated, cryptographically linking the Input, Output, Crystal Hash, and SRI Score.

---

## 5. Integration Models

### Level 1: Client-Side Bridge (Browser Extension)
*   **Role:** User Agent.
*   **Mechanism:** Intercepts DOM or Network traffic to injected prompts and verify responses locally or via a sidecar API.
*   **Use Case:** End-users ensuring safety on ChatGPT/Claude public web interfaces.

### Level 2: API Middleware (B2B)
*   **Role:** Proxy.
*   **Mechanism:** Wraps calls to OpenAI/Anthropic APIs.
    ```python
    # Pseudo-code
    response = scp.verify(
        model="gpt-4",
        prompt=user_prompt,
        crystals=[medical_protocol_crystal]
    )
    if response.sri < 0.9:
        raise UnsafeResponseError(response.receipt)
    ```
*   **Use Case:** Banking chatbots, Medical diagnosis assistants.

### Level 3: Native Integration (Model Providers)
*   **Role:** Inference Engine.
*   **Mechanism:** The Model Provider natively supports `crystal_id` in the API request and performs verification server-side.

---

## 6. Security & Governance

*   **Trust Tiers:** Crystals can be signed by reputable authorities (e.g., "Mayo Clinic", "IEEE").
*   **Reputation Slashing:** If a Crystal is found to be flawed (generating False Negatives), the Author's reputation score is slashed across the network.
*   **Anti-Gaming:** The protocol supports `adversarial_invariants`—hidden tests designed to trick the model, ensuring it isn't just reciting memorized rules.

---

## 7. Reference Implementation

**Neural Bridge** (this repository) is the official Reference Implementation of the SCP standard.

*   **Compiler:** Converts documents -> Crystals (`src/services/llm.ts`)
*   **Runtime:** Executes Verification (`src/services/crystal_runtime.ts`)
*   **Format:** TypeScript Definitions (`src/types/crystal_format.ts`)
