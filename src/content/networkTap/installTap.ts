// Network Tap Installation
// Hooks fetch/XHR in MAIN world to capture responses

const TAP_FLAG = "__NB_TAP_INSTALLED__";

export async function installNetworkTap(): Promise<void> {
  // Avoid double install
  const win = window as unknown as { [TAP_FLAG]?: boolean };
  if (win[TAP_FLAG]) return;
  win[TAP_FLAG] = true;

  const script = document.createElement("script");
  script.textContent = `
(() => {
  if (window.__NB_FETCH_TAP__) return;
  window.__NB_FETCH_TAP__ = { last: null };

  function post(kind, payload) {
    window.postMessage({ source: "NEURAL_BRIDGE_TAP", kind, payload }, "*");
  }

  // Fetch hook
  const origFetch = window.fetch;
  window.fetch = async (...args) => {
    const res = await origFetch(...args);
    try {
      const clone = res.clone();
      const ct = clone.headers.get("content-type") || "";
      if (ct.includes("application/json") || ct.includes("text/event-stream") || ct.includes("text/plain")) {
        const txt = await clone.text();
        window.__NB_FETCH_TAP__.last = txt;
        post("fetch", { url: String(args[0]), status: res.status, text: txt.slice(0, 200000) });
      }
    } catch (e) {
      // Silently ignore errors
    }
    return res;
  };

  // XHR hook
  const OrigXHR = window.XMLHttpRequest;
  function XHR() {
    const xhr = new OrigXHR();
    xhr.addEventListener("load", function() {
      try {
        const txt = xhr.responseText;
        window.__NB_FETCH_TAP__.last = txt;
        post("xhr", { url: xhr.responseURL, status: xhr.status, text: (txt || "").slice(0, 200000) });
      } catch (e) {
        // Silently ignore errors
      }
    });
    return xhr;
  }
  window.XMLHttpRequest = XHR;
})();
`;

  (document.documentElement || document.head).appendChild(script);
  script.remove();
}
