export const logger = {
    log: (...args: unknown[]) => console.log("[NeuralBridge]", ...args),
    error: (...args: unknown[]) => console.error("[NeuralBridge]", ...args),
    warn: (...args: unknown[]) => console.warn("[NeuralBridge]", ...args)
};
