import { initChatGPT } from "./hosts/chatgpt";
import { initGemini } from "./hosts/gemini";
import { initClaude } from "./hosts/claude";

export function routeHost(host: string) {
    if (host.endsWith("chatgpt.com") || host.endsWith("chat.openai.com")) return initChatGPT();
    if (host.endsWith("gemini.google.com")) return initGemini();
    if (host.endsWith("claude.ai")) return initClaude();
}
