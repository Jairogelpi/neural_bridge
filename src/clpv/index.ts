/**
 * Cross-LLM Portable Verification (CLPV) Module
 * 
 * Verification receipts that work with ANY LLM:
 * - GPT-4, Claude, Gemini, Llama, Mistral, etc.
 * - Verification is INDEPENDENT of the model
 */

export { 
    CLPVRuntime,
    PortableReceiptGenerator,
    CrossLLMVerifier,
    LLMDetector,
    type PortableReceipt,
    type CrossVerificationResult,
    type LLMIdentifier,
    type LLMProvider
} from './cross_llm_verification';
