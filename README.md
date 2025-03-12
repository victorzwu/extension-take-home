# Action Recorder Chrome Extension

This extension allows you to start and stop recording user actions with a single click. It captures clicks, keyboard inputs, scroll events, and navigation events in real-time. Before exporting, it automatically collapses duplicate input events for a cleaner trace. With one click, you can download the entire interaction trace. The extension dynamically updates its icon to reflect recording status.
---

## Screenshots

### Popup - Not Recording
![Screenshot 2025-03-11 at 4 53 25 PM](https://github.com/user-attachments/assets/f4e8f5dc-bd8e-46ce-917b-e5aa48d765b8)
### Popup - Recording Active
![Screenshot 2025-03-11 at 4 53 15 PM](https://github.com/user-attachments/assets/3c9c1b9c-7900-4490-bf91-4d8622f15b5d)
### Invalid Page Warning
![Screenshot 2025-03-11 at 4 52 55 PM](https://github.com/user-attachments/assets/02fe963c-5b2c-422d-9854-fa182c316582)


---

## 📁 Project Structure

```
extension-take-home/
├── README.md                 # Project description and instructions
├── replay.py                 # Puppeteer script to replay recorded actions
├── trace.json                # Example recorded trace
└── victor-wu-extension/      # Chrome Extension source
    ├── icons/                # Extension icon assets (checked/unchecked PNGs)
    ├── dist/                 # Vite build output (generated after build)
    ├── src/
    │   ├── contentScript.ts  # Injected script to record actions
    │   ├── popup.tsx         # UI logic of the extension popup
    │   ├── popup.html        # HTML for popup window
    ├── manifest.json         # Chrome extension manifest configuration
    └── vite.config.js        # Vite build configuration
```

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Build the extension

```bash
npm run build
```

### 3. Load into Chrome

- Open `chrome://extensions/`
- Enable **Developer Mode**
- Click **"Load unpacked"**
- Select the `dist/` folder

---

## 📄 Trace Format Example

```json
[
  {
    "timestamp": 1741729933891,
    "type": "navigation",
    "url": "https://chatgpt.com/"
  },
  {
    "selector": "#prompt-textarea",
    "timestamp": 1741729937052,
    "type": "input",
    "value": "First message"
  },
  {
    "selector": "BUTTON.flex.items-center.justify-center.rounded-full.transition-colors.hover:opacity-70.focus-visible:outline-none.focus-visible:outline-black.disabled:text-[#f4f4f4].disabled:hover:opacity-100.dark:focus-visible:outline-white.disabled:dark:bg-token-text-quaternary.dark:disabled:text-token-main-surface-secondary.bg-black.text-white.disabled:bg-[#D7D7D7].dark:bg-white.dark:text-black.h-9.w-9 > svg",
    "timestamp": 1741729938952,
    "type": "click"
  },
  {
    "selector": "P.placeholder",
    "timestamp": 1741729940866,
    "type": "click"
  },
  {
    "selector": "#prompt-textarea",
    "timestamp": 1741729945677,
    "type": "input",
    "value": "This is my second message!"
  },
  {
    "selector": "DIV.flex.gap-x-1.5",
    "timestamp": 1741729947508,
    "type": "click"
  },
  {
    "selector": "svg",
    "timestamp": 1741729948050,
    "type": "click"
  },
  {
    "selector": "P.placeholder",
    "timestamp": 1741729952455,
    "type": "click"
  },
  {
    "selector": "#prompt-textarea",
    "timestamp": 1741729956100,
    "type": "input",
    "value": "Wow, I'm good at this!"
  },
  {
    "selector": "svg",
    "timestamp": 1741729958304,
    "type": "click"
  },
  {
    "selector": "BUTTON.h-10.rounded-lg.px-2.text-token-text-secondary.focus-visible:bg-token-surface-hover.focus-visible:outline-0.enabled:hover:bg-token-surface-hover.disabled:text-token-text-quaternary",
    "timestamp": 1741729962147,
    "type": "click"
  },
  {
    "selector": "INPUT.w-full.border-none.bg-transparent.placeholder:text-token-text-tertiary.focus:border-transparent.focus:outline-none.focus:ring-0",
    "timestamp": 1741729964561,
    "type": "input",
    "value": "testing search"
  },
  {
    "selector": "DIV.truncate",
    "timestamp": 1741729966439,
    "type": "click"
  }
]
```
