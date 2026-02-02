# ⚡ Quickstart: Neural Bridge Omega

Stop building fragile RAG systems. Build **verified truth networks** in 5 lines of code.

## 1. Installation
```bash
npm install @neural-bridge/omega
```

## 2. The 5-Line Reality Check
Neural Bridge automates HDC math, SimHash searching, and Cryptographic verification so you don't have to.

```typescript
import { NeuralBridge } from '@neural-bridge/omega';

// 1. Initialize (Automatically connects to your Truth Vault)
const nb = NeuralBridge.init({ domain: 'legal' });

// 2. Remember (Ingests truth with 100% fidelity)
await nb.remember("User #456 is authorized for Level 3 access.");

// 3. Ask (Retrieves verified truth + cryptographic proof)
const result = await nb.ask("Can user 456 access sensitive data?");

// 4. Act with Certainty
console.log(`Truth: ${result.content} | Proof: ${result.proof_valid ? '✅ VERIFIED' : '❌ MOCK'}`);
```

## 3. Why this beats LangChain/RAG
| Feature | LangChain (RAG) | Neural Bridge (Omega) |
| :--- | :--- | :--- |
| **Retrieval** | Probability (Vector Search) | **Certainty (Semantic Hashing)** |
| **Truth** | "Best Guess" | **Cryptographic Proof** |
| **Friction** | Middle (Requires Chains) | **Zero (One-Line Ask)** |
| **Cost** | High (LLM-based re-ranking) | **O(1) (Post-Retrieved Logic)** |

## 🛡️ "Auto-Reality" Mode
If you are using our **Chrome Extension**, you don't even need to write code. Just enable **Auto-Verify** in the settings, and the extension will passively verify every AI answer you receive in real-time.

---
**Build the Bridge. Guard the Reality.** 🌌
