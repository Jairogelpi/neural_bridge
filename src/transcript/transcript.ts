export interface Turn {
    speaker: "user" | "assistant" | "system";
    text: string;
    timestamp?: string;
}

export interface Transcript {
    transcript_id: string;
    source: {
        platform: "chatgpt" | "gemini" | "claude" | "other";
        url: string;
        timestamp: string;
    };
    turns: Turn[];
}
