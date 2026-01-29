export interface LLMCall {
    prompt: string;
    maxTokens: number;
    temperature: number; // should be 0
}

export interface LLMResponse {
    text: string;
    usedTokens?: number;
}

export interface LLMClient {
    name: string;
    call(req: LLMCall): Promise<LLMResponse>;
}
