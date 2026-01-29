// Neural Bridge Mesh Service
// Handles real-time context sync across all LLM tabs

export interface MeshState {
    activeCrystal: string | null; // ID of current Crystal
    checkpoints: Record<string, string>; // name -> crystalJSON
    lastUpdated: number;
}

export interface MeshEvent {
    type: 'CRYSTAL_UPDATED' | 'CHECKPOINT_CREATED' | 'HOST_ACTIVE';
    crystalId?: string;
    host?: string;
    data?: any;
}

// Broadcast updates to all tabs
export function broadcastMeshUpdate(event: MeshEvent) {
    chrome.storage.local.set({
        'mesh_last_update': {
            ...event,
            timestamp: Date.now()
        }
    });
}

// Listen for updates from other tabs
export function onMeshUpdate(callback: (event: MeshEvent) => void) {
    chrome.storage.onChanged.addListener((changes, area) => {
        if (area === 'local' && changes.mesh_last_update) {
            callback(changes.mesh_last_update.newValue);
        }
    });
}

// Save a checkpoint (Branching)
export async function saveCheckpoint(name: string, crystalJSON: string) {
    const result = await chrome.storage.local.get(['mesh_checkpoints']);
    const checkpoints = result.mesh_checkpoints || {};
    checkpoints[name] = crystalJSON;
    await chrome.storage.local.set({ 'mesh_checkpoints': checkpoints });

    broadcastMeshUpdate({
        type: 'CHECKPOINT_CREATED',
        data: { name }
    });
}

// Proactive Hinting Logic
export function getProactiveHint(host: string, entities: any[], intents: any[]): string | null {
    // Logic to suggest switching models
    // e.g. If host is ChatGPT and intents include "coding" and entities include "React",
    // maybe suggest Claude for its better reasoning.

    if (host === 'chatgpt') {
        if (intents.some(i => i.type === 'build' || i.type === 'fix')) {
            return "🚀 Pro-tip: Claude 3.5 Sonnet is 20% more accurate for this coding task. Bridge now?";
        }
    }

    if (host === 'claude') {
        if (intents.some(i => i.type === 'plan' || i.type === 'research')) {
            return "💡 Analysis: GPT-4o has better real-time search for this topic. Bridge now?";
        }
    }

    return null;
}

export const MeshService = {
    broadcastMeshUpdate,
    onMeshUpdate,
    saveCheckpoint,
    getProactiveHint
};
