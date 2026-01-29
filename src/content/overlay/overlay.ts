type OverlayHandlers = {
  onCapture: () => Promise<void>;
  onSetActive: (id: string) => Promise<void>;
  onCopyTranscript: (id: string) => Promise<void>;
  onCopyCrystal: (id: string) => Promise<void>;
  onRefresh: () => Promise<void>;
};

export function mountOverlay(handlers: OverlayHandlers) {
  // Avoid duplicate mount
  if (document.getElementById("nb-root")) return;

  const host = document.createElement("div");
  host.id = "nb-root";
  host.style.position = "fixed";
  host.style.right = "16px";
  host.style.bottom = "16px";
  host.style.zIndex = "2147483647"; // max-ish
  document.documentElement.appendChild(host);

  const shadow = host.attachShadow({ mode: "open" });

  const style = document.createElement("style");
  style.textContent = `
    :host { all: initial; }
    .nb-btn {
      all: unset;
      font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
      background: #111;
      color: #fff;
      padding: 10px 12px;
      border-radius: 999px;
      cursor: pointer;
      box-shadow: 0 8px 24px rgba(0,0,0,.25);
      user-select: none;
      font-size: 14px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    .nb-panel {
      font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
      position: fixed;
      right: 16px;
      bottom: 72px;
      width: 380px;
      max-height: 520px;
      background: #fff;
      color: #111;
      border-radius: 16px;
      box-shadow: 0 12px 40px rgba(0,0,0,.25);
      overflow: hidden;
      border: 1px solid rgba(0,0,0,.08);
    }
    .nb-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 12px;
      background: #f7f7f7;
      border-bottom: 1px solid rgba(0,0,0,.08);
      font-weight: 600;
      font-size: 14px;
    }
    .nb-header button {
      all: unset;
      cursor: pointer;
      padding: 6px 10px;
      border-radius: 10px;
      background: #111;
      color: #fff;
      font-size: 12px;
    }
    .nb-body { padding: 12px; overflow: auto; max-height: 460px; }
    .nb-row { display: flex; gap: 8px; margin-bottom: 10px; }
    .nb-row button {
      all: unset;
      cursor: pointer;
      padding: 8px 10px;
      border-radius: 12px;
      background: #111;
      color: #fff;
      font-size: 13px;
      flex: 1;
      text-align: center;
    }
    .nb-row button.secondary { background: #eaeaea; color: #111; }
    .nb-card {
      border: 1px solid rgba(0,0,0,.10);
      border-radius: 14px;
      padding: 10px;
      margin-bottom: 10px;
      display: grid;
      gap: 6px;
    }
    .nb-card .meta { font-size: 11px; color: #555; display:flex; gap: 8px; flex-wrap: wrap; }
    .nb-card .title { font-size: 13px; font-weight: 600; }
    .nb-card .preview { font-size: 12px; color: #222; line-height: 1.35; }
    .nb-card .actions { display:flex; gap: 6px; flex-wrap: wrap; }
    .nb-card .actions button {
      all: unset;
      cursor: pointer;
      padding: 6px 10px;
      border-radius: 10px;
      background: #111;
      color: #fff;
      font-size: 12px;
    }
    .nb-card .actions button.secondary { background: #eaeaea; color: #111; }
    .nb-badge {
      display:inline-flex;
      align-items:center;
      gap: 6px;
      padding: 3px 8px;
      border-radius: 999px;
      font-size: 11px;
      background: #e8f5e9;
      color: #1b5e20;
      border: 1px solid rgba(27,94,32,.15);
    }
  `;
  shadow.appendChild(style);

  const btn = document.createElement("button");
  btn.className = "nb-btn";
  btn.textContent = "Bridge";
  shadow.appendChild(btn);

  const panel = document.createElement("div");
  panel.className = "nb-panel";
  panel.style.display = "none";
  shadow.appendChild(panel);

  panel.innerHTML = `
    <div class="nb-header">
      <div>Neural Bridge</div>
      <button id="nb-close">Close</button>
    </div>
    <div class="nb-body">
      <div class="nb-row">
        <button id="nb-capture">Capture</button>
        <button id="nb-refresh" class="secondary">Refresh</button>
      </div>
      <div id="nb-list"></div>
    </div>
  `;

  const closeBtn = panel.querySelector("#nb-close") as HTMLButtonElement;
  const captureBtn = panel.querySelector("#nb-capture") as HTMLButtonElement;
  const refreshBtn = panel.querySelector("#nb-refresh") as HTMLButtonElement;
  const listEl = panel.querySelector("#nb-list") as HTMLDivElement;

  btn.addEventListener("click", async () => {
    panel.style.display = panel.style.display === "none" ? "block" : "none";
    if (panel.style.display === "block") await handlers.onRefresh();
  });

  closeBtn.addEventListener("click", () => {
    panel.style.display = "none";
  });

  captureBtn.addEventListener("click", async () => {
    captureBtn.textContent = "Capturing...";
    captureBtn.setAttribute("disabled", "true");
    try {
      await handlers.onCapture();
      await handlers.onRefresh();
    } finally {
      captureBtn.textContent = "Capture";
      captureBtn.removeAttribute("disabled");
    }
  });

  refreshBtn.addEventListener("click", async () => {
    refreshBtn.textContent = "Refreshing...";
    refreshBtn.setAttribute("disabled", "true");
    try {
      await handlers.onRefresh();
    } finally {
      refreshBtn.textContent = "Refresh";
      refreshBtn.removeAttribute("disabled");
    }
  });

  function renderList(cards: Array<any>, activeId?: string) {
    listEl.innerHTML = "";
    if (!cards.length) {
      listEl.innerHTML = `<div style="font-size:12px;color:#555;">No captures yet. Click Capture.</div>`;
      return;
    }

    for (const c of cards) {
      const div = document.createElement("div");
      div.className = "nb-card";

      const isActive = activeId && (c.context_id === activeId);
      div.innerHTML = `
        <div class="meta">
          <span>${c.platform}</span>
          <span>${new Date(c.created_at).toLocaleString()}</span>
          ${isActive ? `<span class="nb-badge">Active</span>` : ""}
        </div>
        <div class="title">${escapeHtml(c.title ?? "Capture")}</div>
        <div class="preview">${escapeHtml(c.preview ?? "").slice(0, 220)}</div>
        <div class="actions">
          <button data-act="active" data-id="${c.id}">Set Active</button>
          <button data-act="copy-tx" data-id="${c.id}" class="secondary">TX</button>
          <button data-act="copy-cc" data-id="${c.id}" class="secondary">CC</button>
        </div>
      `;
      listEl.appendChild(div);
    }

    listEl.querySelectorAll("button[data-act]").forEach((b) => {
      b.addEventListener("click", async (e) => {
        const btn = e.currentTarget as HTMLButtonElement;
        const id = btn.getAttribute("data-id")!;
        const act = btn.getAttribute("data-act")!;
        if (act === "active") {
          await handlers.onSetActive(id);
          await handlers.onRefresh();
        }
        if (act === "copy-tx") {
          await handlers.onCopyTranscript(id);
          btn.textContent = "Done";
          setTimeout(() => (btn.textContent = "TX"), 900);
        }
        if (act === "copy-cc") {
          await handlers.onCopyCrystal(id);
          btn.textContent = "Done";
          setTimeout(() => (btn.textContent = "CC"), 900);
        }
      });
    });
  }

  return {
    renderList
  };

  function escapeHtml(s: string): string {
    return s
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
}
