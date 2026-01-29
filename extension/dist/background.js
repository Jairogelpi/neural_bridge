const API_BASE = "http://localhost:8080";
chrome.runtime.onInstalled.addListener(() => {
  console.log("[Neural Bridge] Extension installed");
  chrome.storage.local.get(["installId"], (result) => {
    if (!result.installId) {
      const installId = generateUUID();
      chrome.storage.local.set({ installId });
      console.log("[Neural Bridge] Install ID:", installId);
    }
  });
});
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  handleMessage(message).then(sendResponse);
  return true;
});
async function handleMessage(message, _sender) {
  switch (message.action) {
    case "API_CALL":
      const res = await apiCall(message.data);
      if (!res.success && res.error?.includes("401")) {
        const boot = await bootstrapSession();
        if (boot.success) {
          return apiCall(message.data);
        }
      }
      return res;
    case "GET_TOKEN":
      return getToken();
    case "SET_TOKEN":
      return setToken(message.data);
    case "BOOTSTRAP_SESSION":
      return bootstrapSession();
    case "GET_INSTALL_ID":
      return getInstallId();
    case "OPENROUTER_CALL":
      return openRouterCall(message.data);
    case "OPENROUTER_MODELS":
      return fetchOpenRouterModels();
    default:
      return { success: false, error: "Unknown action" };
  }
}
async function apiCall(params) {
  try {
    const { apiToken } = await chrome.storage.local.get(["apiToken"]);
    const headers = {
      "Content-Type": "application/json"
    };
    if (apiToken) {
      headers["Authorization"] = `Bearer ${apiToken}`;
    }
    const response = await fetch(API_BASE + params.path, {
      method: params.method,
      headers,
      body: params.body ? JSON.stringify(params.body) : void 0
    });
    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: `API ${response.status}: ${errorText}` };
    }
    const data = await response.json();
    return { success: true, data };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}
async function getToken() {
  const { apiToken } = await chrome.storage.local.get(["apiToken"]);
  return { success: true, data: apiToken };
}
async function setToken(token) {
  await chrome.storage.local.set({ apiToken: token });
  return { success: true };
}
async function getInstallId() {
  const { installId } = await chrome.storage.local.get(["installId"]);
  return { success: true, data: installId };
}
async function bootstrapSession() {
  const { installId } = await chrome.storage.local.get(["installId"]);
  const res = await apiCall({
    method: "POST",
    path: "/v1/session/bootstrap",
    body: {
      install_id: installId,
      platform: "browser_extension",
      version: "1.0.0"
    }
  });
  if (res.success && res.data.session_token) {
    await setToken(res.data.session_token);
  }
  return res;
}
async function openRouterCall(params) {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${params.apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://neural-bridge.ai",
        "X-Title": "Neural Bridge SCP"
      },
      body: JSON.stringify(params.body)
    });
    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: `OpenRouter API ${response.status}: ${errorText}` };
    }
    const data = await response.json();
    return { success: true, data };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}
async function fetchOpenRouterModels() {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/models");
    if (!response.ok) {
      return { success: false, error: "Failed to fetch models" };
    }
    const data = await response.json();
    return { success: true, data };
  } catch (e) {
    return { success: false, error: String(e) };
  }
}
function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === "x" ? r : r & 3 | 8;
    return v.toString(16);
  });
}
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "neural-bridge-capture",
    title: "Capture with Neural Bridge",
    contexts: ["page"],
    documentUrlPatterns: [
      "https://chat.openai.com/*",
      "https://chatgpt.com/*",
      "https://gemini.google.com/*",
      "https://claude.ai/*"
    ]
  });
});
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "neural-bridge-capture" && tab?.id) {
    chrome.tabs.sendMessage(tab.id, { action: "CAPTURE_CONTEXT" });
  }
});
//# sourceMappingURL=background.js.map
