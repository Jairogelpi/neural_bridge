var a=Object.defineProperty;var c=(i,e,t)=>e in i?a(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t;var n=(i,e,t)=>c(i,typeof e!="symbol"?e+"":e,t);import"../assets/storage-CPEm3LFb.js";import"../assets/supabase-B0slLUQY.js";const o={chatgpt:{name:"ChatGPT",messageSelector:'[data-message-author-role="assistant"]',textSelector:".markdown",containerSelector:".text-token-text-primary"},claude:{name:"Claude",messageSelector:".font-claude-message",textSelector:".font-claude-message",containerSelector:".font-claude-message"}};class l{constructor(){n(this,"observer");n(this,"config",null);n(this,"processedNodes",new Set);this.detectPlatform(),this.observer=new MutationObserver(this.handleMutations.bind(this))}detectPlatform(){const e=window.location.hostname;e.includes("openai")||e.includes("chatgpt")?this.config=o.chatgpt||null:e.includes("claude")&&(this.config=o.claude||null),this.config&&(console.log(`[NeuralBridge] ⚔️ Conquering ${this.config.name} UI...`),this.start())}start(){this.observer.observe(document.body,{childList:!0,subtree:!0}),this.scanExisting()}handleMutations(e){if(this.config)for(const t of e)t.addedNodes.forEach(s=>{s instanceof HTMLElement&&s.querySelectorAll(this.config.messageSelector).forEach(r=>this.injectShield(r))})}scanExisting(){this.config&&document.querySelectorAll(this.config.messageSelector).forEach(e=>{this.injectShield(e)})}injectShield(e){if(this.processedNodes.has(e))return;this.processedNodes.add(e);const t=e.querySelector(this.config.containerSelector);if(!t)return;const s=document.createElement("div");s.className="nb-reality-shield-widget",s.innerHTML=`
            <div style="
                display: flex; 
                align-items: center; 
                gap: 6px; 
                background: rgba(0, 255, 149, 0.1); 
                border: 1px solid #00ff95; 
                border-radius: 6px; 
                padding: 4px 8px; 
                margin-top: 8px; 
                font-family: 'JetBrains Mono', monospace; 
                font-size: 11px;
                color: #00ff95;
                width: fit-content;
                cursor: pointer;
            ">
                <span>🛡️</span>
                <span>REALITY VERIFIED (v2.0)</span>
            </div>
        `,s.addEventListener("click",()=>{chrome.runtime.sendMessage({type:"NB_TRIGGER_CHECK",text:e.innerText})}),t.appendChild(s)}}new l;
//# sourceMappingURL=index.js.map
