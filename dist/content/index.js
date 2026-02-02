import"../assets/supabase-D_wWEzw0.js";typeof chrome<"u"&&chrome.storage;const i={chatgpt:{name:"ChatGPT",messageSelector:'[data-message-author-role="assistant"]',textSelector:".markdown",containerSelector:".text-token-text-primary"},claude:{name:"Claude",messageSelector:".font-claude-message",textSelector:".font-claude-message",containerSelector:".font-claude-message"}};class o{constructor(){this.config=null,this.processedNodes=new Set,this.detectPlatform(),this.observer=new MutationObserver(this.handleMutations.bind(this))}detectPlatform(){const e=window.location.hostname;e.includes("openai")||e.includes("chatgpt")?this.config=i.chatgpt||null:e.includes("claude")&&(this.config=i.claude||null),this.config&&(console.log(`[NeuralBridge] ⚔️ Conquering ${this.config.name} UI...`),this.start())}start(){this.observer.observe(document.body,{childList:!0,subtree:!0}),this.scanExisting()}handleMutations(e){if(this.config)for(const s of e)s.addedNodes.forEach(t=>{t instanceof HTMLElement&&t.querySelectorAll(this.config.messageSelector).forEach(n=>this.injectShield(n))})}scanExisting(){this.config&&document.querySelectorAll(this.config.messageSelector).forEach(e=>{this.injectShield(e)})}injectShield(e){if(this.processedNodes.has(e))return;this.processedNodes.add(e);const s=e.querySelector(this.config.containerSelector);if(!s)return;const t=document.createElement("div");t.className="nb-reality-shield-widget",t.innerHTML=`
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
        `,t.addEventListener("click",()=>{chrome.runtime.sendMessage({type:"NB_TRIGGER_CHECK",text:e.innerText})}),s.appendChild(t)}}new o;
//# sourceMappingURL=index.js.map
