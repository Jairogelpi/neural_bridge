// Host Adapter V2 Types
// Robust, multi-path DOM interaction with fallbacks

export type HostName = "chatgpt" | "gemini" | "claude" | "unknown";

export interface InputHandle {
    kind: "textarea" | "contenteditable";
    el: HTMLElement;
    setText(text: string): void;
    getText(): string;
    focus(): void;
}

export interface HostAdapterV2 {
    name: HostName;
    detect(): boolean;

    // UI paths
    findInput(): InputHandle | null;
    clickSend(): boolean;

    // Reading paths
    findAssistantMessages(): HTMLElement[];
    getLastAssistantText(): string;

    // Smarter waiting
    waitForAssistantTurn(opts?: { timeoutMs?: number }): Promise<string>;

    // Network tap (optional)
    enableNetworkTap?(): Promise<void>;
    popLastNetworkAnswer?(): string | null;

    // Diagnostics
    debugSnapshot(): HostDebugSnapshot;
}

export interface HostDebugSnapshot {
    host: HostName;
    url: string;
    inputKind?: string | null;
    lastAssistantLen?: number;
    assistantCount?: number;
}
