# 👩‍💻 Neural Bridge Developer Guide
> **Integration, Verification, and Transparency**

This guide explains how to integrate the **Semantic Context Protocol (SCP)** into your own AI applications using the `@neural-bridge/sdk`.

## 📦 Installation

```bash
npm install @neural-bridge/sdk
```

---

## 🚀 1. The Zero-Mock Integration (3 Steps)

To provide "Zero Mock" verification, you don't just verify; you **display the proof** to your users.

### Step 1: Initialize
```typescript
import { NeuralBridge } from '@neural-bridge/sdk';

const nb = new NeuralBridge({ 
  apiKey: process.env.NB_API_KEY 
});
```

### Step 2: Compile Context (The Crystal)
Turn your static documents (PDFs, Policies, Rules) into a Verifiable Crystal.
```typescript
const medicalProtocol = await nb.compile(
  "Patients on MAOIs must never take SSRIs due to Serotonin Syndrome risk.", 
  "medicine"
);
// Store 'medicalProtocol' (Crystal) in your database.
```

### Step 3: Verify & Visualize (The "Shield")
Wrap your LLM calls.
```typescript
import { SCP } from '@neural-bridge/sdk';

// 1. Get LLM Response
const llmResponse = await myAI.chat("Can I take Prozac with Nardil?");

// 2. Verify (Real-time PAC Learning)
const result = await nb.verify({
  crystal: medicalProtocol,
  question: "Can I take Prozac with Nardil?",
  answer: llmResponse
});

// 3. Generate Receipt (The Proof)
const receipt = result.receipt;

// 4. Show Transparency Report to User
// This renders a beautiful HTML/Markdown receipt showing EXACTLY what was checked.
const reportHtml = SCP.Visualizer.toHTML(receipt); 
// or
const reportMd = SCP.Visualizer.toMarkdown(receipt);

console.log(reportMd);
/* Output:
# 🧾 Neural Bridge Decision Receipt
> Status: 🔴 FLAGGED | SRI: 0.0%
> Checks:
> - [x] Risk of Serotonin Syndrome: ❌ FAIL
> - [x] Drug Interaction Check: ❌ FAIL
*/

if (result.sri < 0.9) {
  // Block or warn
  return { error: "Unsafe response blocked", proof: receipt };
}
```

---

## 🔍 2. Understanding the "Zero Mock" Guarantee

Neural Bridge is different because it exposes the **Semantic Invariants** directly to the user.

### What is an Invariant?
It's a specific, testable logic rule derived from your Crystal.
*   *Example:* "If input contains 'MAOI' and 'SSRI', output MUST mention 'Serotonin Syndrome'."

### The Decision Receipt
Every verification generates a cryptographic receipt containing:
1.  **SRI Score:** The statistical reliability (0.0 - 1.0).
2.  **Invariant Trace:** A list of exactly which logic rules were tested and passed/failed.
3.  **Signature:** ECDSA signature proving the verification wasn't tampered with.

**Why this matters:**
Your users don't have to trust *you*. They can see the **Receipt** which proves that the AI was checked against specific rules.

---

## 🛠️ 3. Advanced Usage

### Custom Invariants
You can manually add invariants to a Crystal for specific business logic.
```typescript
crystal.verification.semantic_invariants.push({
  id: "pricing_check",
  prompt: "Does the response mention a price over $100?",
  expected: { type: "boolean", value: false },
  strict: true
});
```

### Adversarial Testing (StrictMode)
Enable `strict` mode to run "Red Team" attacks against the response before approving it.
```typescript
const result = await nb.verify({
  mode: 'strict', // Generates counterfactuals and injection attacks
  ...params
});
```

---

## 📚 API Reference

### `NeuralBridge`
- `compile(content, domain)`: Creates a Crystal.
- `verify(params)`: Runs the verification loop.
- `verifyReceipt(receipt)`: Validates the cryptographic signature of a receipt.

### `SCP.Visualizer`
- `toHTML(receipt)`: Renders a dashboard-ready HTML block.
- `toMarkdown(receipt)`: Renders a CLI/Log-ready Markdown block.

---

## 🔌 4. Framework Integration

### LangChain Example
Neural Bridge fits perfectly as a `Runnable` or custom tool in LangChain.

```typescript
import { RunnableLambda } from "@langchain/core/runnables";
import { NeuralBridge } from "@neural-bridge/sdk";

const nb = new NeuralBridge({ apiKey: "..." });

// Create a Verification Runnable
const verificationChain = new RunnableLambda({
  func: async (input: { question: string, answer: string }) => {
    const result = await nb.verify({
      crystal: medicalProtocol, // Loaded previously
      question: input.question,
      answer: input.answer
    });
    
    if (result.sri < 0.9) {
      throw new Error(`Safety Violation: ${result.receipt.verification.invariants_failed.join(", ")}`);
    }
    
    return { 
      answer: input.answer, 
      receipt: result.receipt 
    };
  }
});

// Compose with your model
const chain = prompt.pipe(model).pipe(verificationChain);
```

### Vercel AI SDK Example
Use it in your `route.ts` handlers.

```typescript
import { NeuralBridge } from "@neural-bridge/sdk";

export async function POST(req: Request) {
  const { messages } = await req.json();
  const response = await openai.chat.completions.create({ messages });
  const content = response.choices[0].message.content;

  // Verify before streaming back
  const nb = new NeuralBridge({ apiKey: process.env.NB_KEY });
  const check = await nb.verify({
    crystal: financeRules,
    question: messages.at(-1).content,
    answer: content
  });

  if (check.sri < 0.85) {
    return Response.json({ error: "Response blocked by Neural Bridge Protocol", proof: check.receipt }, { status: 403 });
  }

  return Response.json(response);
}

---

## ☁️ 5. Cloud & Reputation (Enterprise)

Unlock the full power of the Neural Bridge Network by connecting to the Cloud.

### Cloud Verification (Remote)
Offload heavy verification (Adversarial Testing, Metamorphic Checks) to our high-performance clusters. This keeps your client light and your verification rigorous.

```typescript
const nb = new NeuralBridge({ 
  apiKey: "...",
  mode: 'cloud', // Zero local compute
  cloudUrl: "https://api.neuralbridge.io"
});

// Verification happens remotely
const result = await nb.verify({ ... });
```

### Identity & Reputation
Register as a **Knowledge Author** to sign your Crystals. As others use your Crystals successfully, you earn **Reputation Score**.

```typescript
// 1. Register Identity
const identity = await nb.registerIdentity("Dr. Smith", "@drsmith_med");
console.log(`Author ID: ${identity.author_id}`);

// 2. Sign a Crystal (Happens automatically during compile if identity is set)
// ...

// 3. Track Performance
// The Cloud automatically tracks SRI scores for your signed Crystals across the network.
```

### The Economy Loop
- **Create**: Compile high-quality Crystals (Protocols, Laws, Docs).
- **Distribute**: Share Crystals via your API or the Registry.
- **Earn**: Gain reputation as thousands of agents verify against your Truth.
- **Slash**: If your Crystal is found to be flawed (False Negatives), reputation is slashed.

---

## 🏆 Best Practices

1.  **Always Show the Receipt**: Transparency is your competitive advantage.
2.  **Use Strict Mode for High Risk**: In Finance/Med/Law, always enable `mode: 'strict'` to run adversarial attacks.
3.  **Cache Crystals**: Don't re-compile static documents. Store the Crystal JSON and reuse it.
4.  **Monitor SRI**: If SRI drops below 0.95, update your Crystal with clearer constraints.
