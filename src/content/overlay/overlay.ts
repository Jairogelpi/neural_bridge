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
    .nb-btn-trigger {
      all: unset;
      font-family: 'Outfit', sans-serif;
      background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
      color: #fff;
      padding: 12px 20px;
      border-radius: 14px;
      cursor: pointer;
      box-shadow: 0 10px 20px rgba(99, 102, 241, 0.3);
      user-select: none;
      font-size: 14px;
      font-weight: 700;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .nb-btn-trigger:hover {
      transform: translateY(-2px);
      box-shadow: 0 14px 28px rgba(99, 102, 241, 0.4);
    }
    .nb-panel {
      font-family: 'Outfit', 'Inter', sans-serif;
      position: fixed;
      right: 16px;
      bottom: 80px;
      width: 400px;
      max-height: 580px;
      background: rgba(10, 10, 20, 0.9);
      backdrop-filter: blur(24px);
      color: #fff;
      border-radius: 24px;
      box-shadow: 0 20px 50px rgba(0,0,0,0.5);
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      flex-direction: column;
      animation: pop-up 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    @keyframes pop-up {
      from { opacity: 0; transform: translateY(20px) scale(0.95); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    .nb-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 24px;
      background: rgba(255, 255, 255, 0.03);
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      font-weight: 700;
      letter-spacing: -0.02em;
    }
    .nb-close-btn {
      all: unset;
      cursor: pointer;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.05);
      color: #94A3B8;
      transition: all 0.2s;
    }
    .nb-close-btn:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
    }
    .nb-body { padding: 24px; overflow-y: auto; flex: 1; }
    .nb-actions-bar { display: flex; gap: 12px; margin-bottom: 24px; }
    .nb-action-btn {
      all: unset;
      cursor: pointer;
      padding: 12px 16px;
      border-radius: 12px;
      background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
      color: #fff;
      font-size: 13px;
      font-weight: 700;
      flex: 1;
      text-align: center;
      transition: all 0.2s;
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
    }
    .nb-action-btn:hover { filter: brightness(1.1); transform: translateY(-1px); }
    .nb-action-btn.secondary { 
      background: rgba(255, 255, 255, 0.05); 
      color: #fff; 
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: none;
    }
    .nb-card {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 18px;
      padding: 16px;
      margin-bottom: 12px;
      transition: border-color 0.2s;
    }
    .nb-card:hover { border-color: rgba(255, 255, 255, 0.1); }
    .nb-card .meta { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #64748b; display:flex; gap: 10px; margin-bottom: 10px; text-transform: uppercase; }
    .nb-card .title { font-size: 15px; font-weight: 700; margin-bottom: 8px; color: #f8fafc; }
    .nb-card .preview { font-size: 12px; color: #94a3b8; line-height: 1.6; margin-bottom: 16px; }
    .nb-card .card-actions { display:flex; gap: 8px; }
    .nb-small-btn {
      all: unset;
      cursor: pointer;
      padding: 6px 12px;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.05);
      color: #cbd5e1;
      font-size: 11px;
      font-weight: 600;
      transition: all 0.2s;
    }
    .nb-small-btn:hover { background: rgba(255, 255, 255, 0.1); color: #fff; }
    .nb-small-btn.primary { background: rgba(99, 102, 241, 0.1); color: #818cf8; }
    .nb-badge {
      display:inline-flex;
      padding: 2px 8px;
      border-radius: 6px;
      font-size: 9px;
      font-weight: 800;
      background: rgba(16, 185, 129, 0.1);
      color: #10B981;
      border: 1px solid rgba(16, 185, 129, 0.2);
    }
  `;
  shadow.appendChild(style);

  const btn = document.createElement("button");
  btn.className = "nb-btn-trigger";
  btn.innerHTML = `<span>NB</span> Bridge`;
  shadow.appendChild(btn);

  const panel = document.createElement("div");
  panel.className = "nb-panel";
  panel.style.display = "none";
  shadow.appendChild(panel);

  panel.innerHTML = `
    <div class="nb-header">
      <div style="background: linear-gradient(135deg, #fff 0%, #94a3b8 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Neural Bridge</div>
      <button class="nb-close-btn" id="nb-close">✕</button>
    </div>
    <div class="nb-body">
      <div class="nb-actions-bar">
        <button class="nb-action-btn" id="nb-capture">Capture</button>
        <button class="nb-action-btn secondary" id="nb-refresh">Refresh</button>
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

  function renderList(cards: Array<Record<string, unknown>>, activeId?: string) {
    listEl.innerHTML = "";
    if (!cards.length) {
      listEl.innerHTML = `<div style="font-size:12px;color:#64748b;text-align:center;padding:20px;">No captures detected. Sync to start.</div>`;
      return;
    }

    for (const c of cards) {
      const div = document.createElement("div");
      div.className = "nb-card";

      const isActive = activeId && (c.context_id === activeId);
      div.innerHTML = `
        <div class="meta">
          <span>${c.platform}</span>
          <span>${new Date(c.created_at as string).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          ${isActive ? `<span class="nb-badge">Active</span>` : ""}
        </div>
        <div class="title">${escapeHtml((c.title as string) ?? "Neural Capture")}</div>
        <div class="preview">${escapeHtml((c.preview as string) ?? "").slice(0, 180)}...</div>
        <div class="card-actions">
          <button class="nb-small-btn primary" data-act="active" data-id="${c.id}">Focus</button>
          <button class="nb-small-btn" data-act="copy-tx" data-id="${c.id}">TX</button>
          <button class="nb-small-btn" data-act="copy-cc" data-id="${c.id}">CC</button>
        </div>
      `;
      listEl.appendChild(div);
    }

    listEl.querySelectorAll("button[data-act]").forEach((b) => {
      b.addEventListener("click", async (e) => {
        const btn = e.currentTarget as HTMLButtonElement;
        const id = btn.getAttribute("data-id")!;
        const act = btn.getAttribute("data-act")!;
        const originalText = btn.textContent;

        btn.textContent = "Syncing...";
        try {
          if (act === "active") {
            await handlers.onSetActive(id);
            await handlers.onRefresh();
          }
          if (act === "copy-tx") {
            await handlers.onCopyTranscript(id);
            btn.textContent = "Copied!";
          }
          if (act === "copy-cc") {
            await handlers.onCopyCrystal(id);
            btn.textContent = "Copied!";
          }
        } finally {
          setTimeout(() => (btn.textContent = originalText), 1500);
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
