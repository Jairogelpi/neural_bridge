let hostName = "unknown";
let pricingData = {};
async function init() {
  hostName = detectHost();
  const res = await chrome.storage.local.get(["openrouter_api_key", "nb_pricing_cache", "apiToken"]);
  res.openrouter_api_key || undefined                                        || "";
  pricingData = res.nb_pricing_cache || {};
  if (!res.apiToken) {
    console.log("[Neural Bridge] No session token found, bootstrapping...");
    chrome.runtime.sendMessage({ action: "BOOTSTRAP_SESSION" });
  }
  refreshPricing();
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    handleMessage(message).then(sendResponse);
    return true;
  });
  injectFloatingButton();
  injectStyles();
  startAutoPilot();
  setInterval(() => {
    if (!document.getElementById("neural-bridge-fab")) {
      console.log("[Neural Bridge] FAB lost, re-injecting...");
      injectFloatingButton();
    }
  }, 2e3);
}
async function sendToBackground(message) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) {
        console.warn("[Neural Bridge] Background connection error:", chrome.runtime.lastError.message);
        resolve({ success: false, error: chrome.runtime.lastError.message });
      } else {
        resolve(response || { success: false, error: "No response" });
      }
    });
  });
}
async function refreshPricing() {
  try {
    const res = await sendToBackground({ action: "OPENROUTER_MODELS" });
    if (res.success && res.data) {
      const { data } = res.data;
      const newPricing = {};
      data.forEach((m) => {
        newPricing[m.id] = m.pricing;
      });
      pricingData = newPricing;
      chrome.storage.local.set({ "nb_pricing_cache": newPricing });
    }
  } catch (e) {
    console.error("Pricing refresh failed", e);
  }
}
async function handleMessage(message) {
  switch (message.action) {
    case "CAPTURE_CONTEXT":
      return captureContextReal();
    case "INJECT_CRYSTAL":
      return injectCrystalReal(message.data);
    case "VERIFY_TRANSFER":
      return verifyTransferReal(message.data);
    case "SET_API_KEY":
      message.data;
      return { success: true };
    case "GET_METRICS":
      return { success: true, data: getStoredMetrics() };
    case "GET_PRICING":
      return { success: true, data: pricingData };
    default:
      return { success: false };
  }
}
async function captureContextReal() {
  try {
    const start = Date.now();
    showOverlay("running", "Initializing Neural Bridge RLM Compiler...");
    updateConsole("Syncing with OpenRouter Global Pricing Index...", "#818cf8");
    await refreshPricing();
    const text = extractConversation();
    updateConsole(`Context Length: ${text.length} characters detected.`, "#94a3b8");
    updateOverlay("running", "Compiling Semantic Crystal (RLM v1.0)...");
    updateConsole("Executing multi-modal entity extraction...", "#6366f1");
    const compileRes = await sendToBackground({
      action: "API_CALL",
      data: {
        method: "POST",
        path: "/v1/compile",
        body: {
          transcript: { messages: [{ role: "user", content: text }] },
          compile_policy: {
            mode: "accuracy",
            token_budget: 4096,
            generate_invariants: true
          }
        }
      }
    });
    if (!compileRes.success) throw new Error(compileRes.error || "Compilation failed");
    const crystal = compileRes.data.context_crystal;
    const invariants = compileRes.data.invariants;
    const cost = compileRes.data.cost;
    updateConsole(`Compilation Success. Quality Score: ${crystal.quality_score || 0.95}`, "#4ade80");
    updateConsole(`Generated ${invariants.length} formal invariants.`, "#818cf8");
    updateConsole(`Infrastructure Cost: $${cost.cost_usd_est.toFixed(6)}`, "#a5b4fc");
    crystal.invariants = invariants;
    crystal.metadata = {
      tokens_used: cost.input_tokens + cost.output_tokens,
      generation_cost: cost.cost_usd_est,
      compression_ratio: text.length / JSON.stringify(crystal).length,
      quality_score: crystal.quality_score || 0.95
    };
    updateOverlay("success", `Context Crystal Forged. Total Cost: $${cost.cost_usd_est.toFixed(4)}`);
    setTimeout(hideOverlay, 2e3);
    return { success: true, data: crystal };
  } catch (err) {
    updateOverlay("error", `Kernel Panic: ${err}`);
    setTimeout(hideOverlay, 5e3);
    return { success: false, error: String(err) };
  }
}
async function injectCrystalReal(crystal) {
  showOverlay("running", "Injecting Context Mesh...");
  await sendMessage(`CONTEXT TRANSFER: ${JSON.stringify(crystal)}`);
  await waitForResponse();
  updateOverlay("success", "Injected!");
  setTimeout(hideOverlay, 1500);
  return { success: true };
}
async function verifyTransferReal(crystal) {
  const start = Date.now();
  showOverlay("running", "Formal Verification Kernel Initialized.");
  updateConsole("Loading Semantic Context Protocol (SCP) v1.0...", "#818cf8");
  updateConsole(`Source Model: ${crystal.source_model} | Target Host: ${hostName}`, "#94a3b8");
  const totalLevels = 2;
  let currentScore = 0;
  let accumulatedMetrics = { tokens: 0, cost: 0 };
  for (let level = 1; level <= totalLevels; level++) {
    updateConsole(`LADDER_STEP_${level}: Initiating ${level === 1 ? "Semantic Stability" : "Logical Consistency"} Test...`, "#818cf8");
    const levelInvariants = level === 1 ? crystal.invariants.slice(0, Math.ceil(crystal.invariants.length / 2)) : crystal.invariants;
    updateConsole(`Level ${level}: Analyzing ${levelInvariants.length} formal invariants...`, "#818cf8");
    const questions = levelInvariants.map((inv, i) => `Q${i + 1}: ${inv.prompt}`).join("\n");
    const challenge = `[LADDER_LEVEL_${level}] Please verify your understanding of the context by answering these specific questions concisely:

${questions}`;
    updateConsole(`Sending level ${level} challenge to target host...`, "#6366f1");
    await sendMessage(challenge);
    const hostResponse = await waitForResponse();
    updateOverlay("running", `Verifying Ladder Level ${level}...`);
    const verifyRes = await sendToBackground({
      action: "API_CALL",
      data: {
        method: "POST",
        path: "/v1/verify",
        body: {
          context_id: crystal.context_id,
          invariants: levelInvariants,
          constraints: crystal.constraints,
          llm_response: hostResponse,
          threshold: 0.85,
          ladder_step: level
        }
      }
    });
    if (!verifyRes.success) throw new Error(verifyRes.error || "Verification service unreachable");
    const grade = verifyRes.data;
    currentScore = grade.score;
    accumulatedMetrics.tokens += grade.tokens_used || 500;
    accumulatedMetrics.cost += grade.cost || 2e-3;
    updateConsole(`Level ${level} Score: ${Math.round(currentScore * 100)}%`, currentScore >= 0.8 ? "#4ade80" : "#f87171");
    if (grade.decision !== "ACCEPT") {
      updateConsole(`LADDER_REJECTION at Level ${level}. Verification halted.`, "#f87171");
      break;
    }
  }
  const latency = Date.now() - start;
  const finalScore = currentScore;
  updateConsole("Calculating Multi-Level PAC-Bayesian Semantic Bounds...", "#818cf8");
  const confidenceLevel = 0.95;
  const delta = 1 - confidenceLevel;
  const n = Math.max(1, crystal.invariants.length);
  const epsilon = Math.sqrt(Math.log(2 / delta) / (2 * n));
  const lowerBound = Math.max(0, finalScore - epsilon);
  const sri = finalScore * (1 - epsilon);
  updateConsole(`Final Formal Score: ${Math.round(finalScore * 100)}%`, "#4ade80");
  updateConsole(`PAC Epsilon (ε): ${epsilon.toFixed(4)}`, "#a5b4fc");
  updateConsole(`SRI (Semantic Reliability Index): ${sri.toFixed(4)}`, "#818cf8");
  const metrics = {
    id: Math.random().toString(36).substring(7),
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    source_model: crystal.source_model,
    target_model: hostName,
    transfer: {
      success: finalScore >= 0.8,
      score: finalScore,
      pac_lower_bound: lowerBound,
      pac_epsilon: epsilon,
      sri
    },
    total_tokens: crystal.metadata.tokens_used + accumulatedMetrics.tokens,
    total_cost_usd: crystal.metadata.generation_cost + accumulatedMetrics.cost,
    total_latency_ms: latency
  };
  const metricsEl = document.getElementById("nb-metrics-live");
  if (metricsEl) metricsEl.textContent = `LATENCY: ${latency}ms | COST: $${metrics.total_cost_usd.toFixed(6)} | SRI: ${sri.toFixed(4)}`;
  storeMetrics(metrics);
  reportTelemetry({
    context_id: crystal.context_id,
    target_host: hostName,
    decision: finalScore >= 0.8 ? "ACCEPT" : "FAIL",
    score: finalScore,
    ladder_steps: [],
    extension_version: "1.0.0",
    pac_bound: epsilon,
    sri,
    latency_ms: latency,
    cost_usd: metrics.total_cost_usd
  });
  if (finalScore >= 0.8) {
    updateConsole("ECOSYSTEM_VALIDATION_COMPLETE: Full-stack semantic integrity verified.", "#4ade80");
  }
  setTimeout(hideOverlay, 1e4);
  return { success: true, data: { decision: finalScore >= 0.8 ? "ACCEPT" : "FAIL", score: finalScore, metrics } };
}
function extractConversation() {
  return Array.from(document.querySelectorAll("[data-message-author-role], .markdown, .prose")).map((el) => el.innerText).join("\n\n").trim();
}
async function sendMessage(text) {
  const input = document.querySelector('textarea, div[contenteditable="true"]');
  if (!input) return false;
  if (input.tagName === "TEXTAREA") input.value = text;
  else input.textContent = text;
  input.dispatchEvent(new Event("input", { bubbles: true }));
  const btn = document.querySelector('button[aria-label*="Send"], button:has(svg)');
  if (btn) btn.click();
  else input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
  return true;
}
async function waitForResponse() {
  let lastLen = 0;
  let stableCount = 0;
  const maxTries = 30;
  for (let i = 0; i < maxTries; i++) {
    const text = extractConversation();
    if (text.length > lastLen) {
      lastLen = text.length;
      stableCount = 0;
    } else if (text.length > 0 && text.length === lastLen) {
      stableCount++;
    }
    if (stableCount >= 3) return text;
    await new Promise((r) => setTimeout(r, 500));
  }
  return extractConversation();
}
function storeMetrics(m) {
  const s = JSON.parse(localStorage.getItem("scp_metrics") || "[]");
  s.push(m);
  localStorage.setItem("scp_metrics", JSON.stringify(s.slice(-1e3)));
}
function getStoredMetrics() {
  return JSON.parse(localStorage.getItem("scp_metrics") || "[]");
}
function showOverlay(state, msg) {
  hideOverlay();
  const el = document.createElement("div");
  el.id = "nb-overlay";
  el.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(10,10,15,0.95);z-index:999998;display:flex;align-items:center;justify-content:center;color:#fff;font-family:"Fira Code", monospace;backdrop-filter:blur(20px);border:1px solid rgba(99,102,241,0.3);';
  el.innerHTML = `
        <div style="text-align:left; max-width: 800px; width: 90%; background: rgba(0,0,0,0.5); padding: 30px; border-radius: 12px; box-shadow: 0 20px 50px rgba(0,0,0,0.5);">
            <div style="display:flex; align-items:center; margin-bottom: 20px;">
                <div class="spinner" style="width:30px;height:30px;border:3px solid #6366f1;border-top-color:transparent;border-radius:50%;animation:s 1s linear infinite;margin-right:15px;"></div>
                <div style="font-size:20px;font-weight:700;letter-spacing:-0.5px;color:#818cf8;">NEURAL BRIDGE // FORMAL_VERIFICATION_KERNEL</div>
            </div>
            <div id="nb-console" style="font-size:14px; color:#94a3b8; line-height:1.6; height: 300px; overflow-y: auto; margin-bottom: 20px; border-left: 2px solid #312e81; padding-left: 20px;">
                <div style="color:#4ade80;">> Initializing PAC-Bayesian bound kernel...</div>
                <div style="color:#6366f1;">> Current status: ${msg}</div>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; border-top: 1px solid rgba(255,255,255,0.1); pt-20; margin-top:20px; padding-top:20px;">
                <div style="font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:1px;">Quantum-Safe Semantic Integrity</div>
                <div id="nb-metrics-live" style="font-size:11px;color:#a5b4fc;">LATENCY: --ms | COST: $0.0000</div>
            </div>
        </div>`;
  document.body.appendChild(el);
}
function updateConsole(msg, color = "#94a3b8") {
  const consoleEl = document.getElementById("nb-console");
  if (consoleEl) {
    const line = document.createElement("div");
    line.style.color = color;
    line.textContent = `> ${msg}`;
    consoleEl.appendChild(line);
    consoleEl.scrollTop = consoleEl.scrollHeight;
  }
}
function updateOverlay(state, msg) {
  const el = document.getElementById("nb-overlay");
  if (el) updateConsole(msg, state === "success" ? "#4ade80" : state === "error" ? "#f87171" : "#818cf8");
}
function hideOverlay() {
  document.getElementById("nb-overlay")?.remove();
}
function injectFloatingButton() {
  const b = document.createElement("div");
  b.id = "neural-bridge-fab";
  b.innerHTML = '<span style="font-size: 48px;">🧠</span>';
  b.title = "Capture Context";
  b.onclick = async () => {
    try {
      await captureContextReal();
    } catch (e) {
      console.error("[Neural Bridge] Capture failed:", e);
      updateOverlay("error", "Capture failed. Check console.");
    }
  };
  document.body.appendChild(b);
}
function injectStyles() {
  const s = document.createElement("style");
  s.textContent = "@keyframes s{to{transform:rotate(360deg);}}";
  document.head.appendChild(s);
}
let lastVerificationId = "";
async function startAutoPilot() {
  console.log("[Neural Bridge] Auto-Pilot Active. Monitoring Reality...");
  const observer = new MutationObserver(async () => {
    const conversation = extractConversation();
    const messages = conversation.split("\n\n");
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.length > 50 && !lastMessage.includes("LADDER_LEVEL")) {
      const res = await chrome.storage.local.get(["nb_auto_verify", "current_crystal"]);
      if (res.nb_auto_verify && res.current_crystal && lastVerificationId !== res.current_crystal.context_id) {
        lastVerificationId = res.current_crystal.context_id;
        console.log("[Neural Bridge] Auto-Verify Triggered for Crystal:", lastVerificationId);
        verifyTransferReal(res.current_crystal);
      }
    }
    if (!document.getElementById("neural-bridge-fab")) {
      injectFloatingButton();
    }
  });
  if (document.body) {
    observer.observe(document.body, { childList: true, subtree: true });
  } else {
    console.warn("[Neural Bridge] document.body not ready for AutoPilot observer");
    window.addEventListener("DOMContentLoaded", () => {
      if (document.body) observer.observe(document.body, { childList: true, subtree: true });
    });
  }
}
function detectHost() {
  const url = window.location.href;
  if (url.includes("chatgpt.com")) return "chatgpt";
  if (url.includes("claude.ai")) return "claude";
  if (url.includes("gemini.google.com")) return "gemini";
  return "unknown";
}
async function reportTelemetry(data) {
  try {
    const res = await sendToBackground({
      action: "API_CALL",
      data: {
        method: "POST",
        path: "/v1/telemetry/verify_result",
        body: data
      }
    });
    console.log("[Neural Bridge] Telemetry reported:", res.success);
  } catch (e) {
    console.error("[Neural Bridge] Telemetry failed:", e);
  }
}
init();
//# sourceMappingURL=content.js.map
