# Neural Bridge Extension

Chrome extension for the Semantic Context Protocol (SCP).

## Features

- 📥 **Capture Context** - Extract conversation context as Crystal
- 📤 **Inject & Transfer** - Send Crystal to another LLM
- ✅ **Verify Transfer** - Test invariants to confirm fidelity
- 🔄 **Works across ChatGPT, Claude, Gemini**

## Installation

### Development

```bash
cd extension
npm install
npm run build
```

### Load in Chrome

1. Open `chrome://extensions`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `extension` folder

## Usage

### Capture Context (Step 1)

1. Have a conversation with ChatGPT (or Claude/Gemini)
2. Click the Neural Bridge extension icon
3. Click "⚡ Capture Context"
4. Click "📋 Copy to Clipboard"

### Inject & Verify (Step 2)

1. Open Claude (or another LLM)
2. Click the Neural Bridge extension icon
3. Switch to "📤 Inject" mode
4. Click "📋 Paste from Clipboard"
5. Click "🚀 Transfer & Verify"

### Result

- ✅ **ACCEPT** - Context successfully transferred
- ❌ **FAIL** - Verification failed, try again

## File Structure

```
extension/
├── manifest.json       # Chrome MV3 manifest
├── popup/
│   ├── popup.html     # Popup UI
│   └── popup.ts       # Popup logic
├── content.ts         # Content script (runs on LLM pages)
├── background.ts      # Service worker
├── content.css        # Injected styles
├── vite.config.ts     # Build config
└── icons/             # Extension icons
```

## Supported Hosts

| Host | Status |
|------|--------|
| ChatGPT (chat.openai.com) | ✅ |
| ChatGPT (chatgpt.com) | ✅ |
| Claude (claude.ai) | ✅ |
| Gemini (gemini.google.com) | ✅ |

## SCP Protocol

This extension implements the Semantic Context Protocol (SCP) v1.0.

See `/docs/RFC_SCP.md` for full specification.
