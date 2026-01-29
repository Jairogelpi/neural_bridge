# Neural Bridge: The Semantic Context Protocol (SCP)
> **Reference Implementation & SDK**

Neural Bridge is the official reference implementation of the **Semantic Context Protocol (SCP)**, a standard for creating verifiable, deterministic, and portable knowledge containers ("Crystals") for Large Language Models.

It transforms AI from a "Black Box" into a verifiable system using cryptographic proofs and semantic invariants.

## 📚 The Protocol
- **[SCP Specification](./PROTOCOL_SPEC.md)**: The formal rules for Crystal structure, SRI metrics, and verification handshakes.
- **[Crystal Format](./src/types/crystal_format.ts)**: The JSON schema for universal knowledge transfer.

## 🛠️ The SDK
Developers can use Neural Bridge to add verification to their own AI apps:
```typescript
import { NeuralBridge } from '@neural-bridge/sdk';

const nb = new NeuralBridge({ apiKey: '...' });
const result = await nb.verify({
  crystal: myMedicalProtocol,
  question: "Can I take X with Y?",
  answer: llmResponse
});

if (result.sri < 0.9) {
  console.warn("Unsafe response blocked!");
}
```

## 📦 Components
1. **Core SDK (`src/sdk.ts`)**: The portable verification engine.
2. **Browser Extension**: Client-side implementation for ChatGPT/Claude/Gemini users.
3. **API Server (`server/`)**: Enterprise gateway for high-volume verification.

## Project Structure
- `core/`: SCP standard implementation.
- `src/sdk.ts`: Public SDK entry point.
- `src/services/`: Verification logic (Runtime, LLM, Attestation).
- `src/types/`: Crystal Format specifications.
- `server/`: Go backend for API/SaaS deployment.

## Quick Start
1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the Ultimate Proof (verify the tech works):
   ```bash
   npm run ultimate
   ```

## CI/CD
Run the full verification suite:
```bash
npm run ci
```
