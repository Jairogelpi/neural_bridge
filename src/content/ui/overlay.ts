// Neural Bridge Overlay UI
// Visual status indicator: 🟢 Success | 🟡 Warning | 🔴 Error

export type OverlayState = "idle" | "running" | "success" | "warning" | "error";

let root: HTMLDivElement | null = null;

function ensureRoot(): HTMLDivElement {
    if (root && document.contains(root)) return root;

    root = document.createElement("div");
    root.id = "nb-overlay-root";

    // Container styles
    Object.assign(root.style, {
        position: "fixed",
        top: "14px",
        right: "14px",
        zIndex: "999999",
        width: "320px",
        borderRadius: "14px",
        padding: "12px",
        fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        background: "rgba(20,20,22,0.82)",
        color: "white",
        transition: "opacity 0.3s ease, transform 0.3s ease",
        opacity: "0",
        transform: "translateY(-10px)",
    });

    root.innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;justify-content:space-between">
      <div style="display:flex;align-items:center;gap:10px">
        <div id="nb-dot" style="width:10px;height:10px;border-radius:999px;background:#9aa0a6;transition:background 0.3s"></div>
        <div>
          <div id="nb-title" style="font-weight:700;font-size:13px;letter-spacing:0.2px">Neural Bridge</div>
          <div id="nb-sub" style="opacity:0.85;font-size:12px;margin-top:2px">Idle</div>
        </div>
      </div>
      <button id="nb-close" style="border:0;background:transparent;color:white;opacity:0.7;cursor:pointer;font-size:16px;line-height:1;padding:4px 8px;border-radius:4px;transition:opacity 0.2s">×</button>
    </div>
    <div id="nb-body" style="margin-top:10px;font-size:12px;opacity:0.9;display:none;line-height:1.5"></div>
    <div id="nb-progress" style="display:none;margin-top:8px;height:3px;background:rgba(255,255,255,0.1);border-radius:2px;overflow:hidden">
      <div id="nb-progress-bar" style="height:100%;background:#fbbc04;width:0%;transition:width 0.3s"></div>
    </div>
  `;

    document.documentElement.appendChild(root);

    // Close button handler
    const close = root.querySelector<HTMLButtonElement>("#nb-close");
    close?.addEventListener("click", () => {
        hideOverlay();
    });
    close?.addEventListener("mouseenter", () => {
        close.style.opacity = "1";
    });
    close?.addEventListener("mouseleave", () => {
        close.style.opacity = "0.7";
    });

    // Animate in
    requestAnimationFrame(() => {
        if (root) {
            root.style.opacity = "1";
            root.style.transform = "translateY(0)";
        }
    });

    return root;
}

function setDot(color: string) {
    const r = ensureRoot();
    const dot = r.querySelector<HTMLDivElement>("#nb-dot");
    if (dot) dot.style.background = color;
}

function setText(title: string, sub: string, body?: string) {
    const r = ensureRoot();
    const t = r.querySelector<HTMLDivElement>("#nb-title");
    const s = r.querySelector<HTMLDivElement>("#nb-sub");
    const b = r.querySelector<HTMLDivElement>("#nb-body");
    if (t) t.textContent = title;
    if (s) s.textContent = sub;
    if (b) {
        if (body && body.trim()) {
            b.style.display = "block";
            b.textContent = body;
        } else {
            b.style.display = "none";
            b.textContent = "";
        }
    }
}

function setProgress(show: boolean, percent?: number) {
    const r = ensureRoot();
    const container = r.querySelector<HTMLDivElement>("#nb-progress");
    const bar = r.querySelector<HTMLDivElement>("#nb-progress-bar");
    if (container) {
        container.style.display = show ? "block" : "none";
    }
    if (bar && typeof percent === "number") {
        bar.style.width = `${Math.min(100, Math.max(0, percent))}%`;
    }
}

export function hideOverlay() {
    if (root) {
        root.style.opacity = "0";
        root.style.transform = "translateY(-10px)";
        setTimeout(() => {
            root?.remove();
            root = null;
        }, 300);
    }
}

export interface OverlayOptions {
    score?: number;
    msg?: string;
    detail?: string;
    progress?: number; // 0-100
    autoHide?: number; // ms
}

export function overlaySet(state: OverlayState, opts?: OverlayOptions) {
    const score = typeof opts?.score === "number" ? opts!.score : undefined;
    const scoreStr = score != null ? ` • ${(score * 100).toFixed(0)}%` : "";

    switch (state) {
        case "idle":
            setDot("#9aa0a6");
            setText("Neural Bridge", "Idle", "");
            setProgress(false);
            break;

        case "running":
            setDot("#fbbc04"); // amber
            setText("Neural Bridge", opts?.msg ?? "Bridging…", opts?.detail ?? "");
            setProgress(true, opts?.progress ?? 0);
            break;

        case "success":
            setDot("#34a853"); // green
            setText(
                "Neural Bridge",
                `🟢 Synced${scoreStr}`,
                opts?.detail ?? "Memory synchronized. Continue without re-explaining."
            );
            setProgress(false);
            break;

        case "warning":
            setDot("#fbbc04"); // amber
            setText(
                "Neural Bridge",
                `🟡 Retrying${scoreStr}`,
                opts?.detail ?? "Attempting verification with stronger prompt…"
            );
            setProgress(true, opts?.progress ?? 50);
            break;

        case "error":
            setDot("#ea4335"); // red
            setText(
                "Neural Bridge",
                `🔴 Failed${scoreStr}`,
                opts?.detail ?? opts?.msg ?? "Verification failed. Context may not be fully transferred."
            );
            setProgress(false);
            break;
    }

    // Auto-hide if specified
    if (opts?.autoHide && opts.autoHide > 0) {
        setTimeout(() => {
            if (state === "success" || state === "error") {
                hideOverlay();
            }
        }, opts.autoHide);
    }
}

// Quick helpers for common states
export const overlay = {
    show: () => ensureRoot(),
    hide: hideOverlay,
    idle: () => overlaySet("idle"),
    running: (msg?: string, progress?: number) => {
        const opts: OverlayOptions = {};
        if (msg !== undefined) opts.msg = msg;
        if (progress !== undefined) opts.progress = progress;
        overlaySet("running", opts);
    },
    success: (score?: number, detail?: string, autoHide?: number) => {
        const opts: OverlayOptions = {};
        if (score !== undefined) opts.score = score;
        if (detail !== undefined) opts.detail = detail;
        if (autoHide !== undefined) opts.autoHide = autoHide;
        overlaySet("success", opts);
    },
    warning: (score?: number, detail?: string, progress?: number) => {
        const opts: OverlayOptions = {};
        if (score !== undefined) opts.score = score;
        if (detail !== undefined) opts.detail = detail;
        if (progress !== undefined) opts.progress = progress;
        overlaySet("warning", opts);
    },
    error: (msg?: string, score?: number, autoHide?: number) => {
        const opts: OverlayOptions = {};
        if (msg !== undefined) opts.msg = msg;
        if (score !== undefined) opts.score = score;
        if (autoHide !== undefined) opts.autoHide = autoHide;
        overlaySet("error", opts);
    },
};
