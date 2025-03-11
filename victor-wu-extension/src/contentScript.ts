const trace: any[] = [];

function recordEvent(e: Event) {
  const target = e.target as HTMLElement;
  const selector = target?.tagName + (target.id ? `#${target.id}` : '') + (target.className ? `.${target.className.split(' ').join('.')}` : '');

  const event = {
    type: e.type,
    selector,
    value: (e.type === 'input' ? (target as HTMLInputElement).value : undefined),
    timestamp: Date.now()
  };

  trace.push(event);
  chrome.storage.local.set({ actionTrace: trace });
}

function attachListeners() {
  console.log('[Recorder] Attaching event listeners...');
  window.addEventListener('click', recordEvent);
  window.addEventListener('input', recordEvent);
  window.addEventListener('scroll', () => {
    trace.push({
      type: 'scroll',
      scrollY: window.scrollY,
      timestamp: Date.now()
    });
    chrome.storage.local.set({ actionTrace: trace });
  });
}

// Check if recording should start immediately (e.g., after navigation)
chrome.storage.local.get(['recording'], (res) => {
  if (res.recording) {
    attachListeners();
  }
});

// Listen to state changes (START/STOP events from popup)
chrome.storage.onChanged.addListener((changes) => {
  if (changes.recording?.newValue === true) {
    attachListeners();
  } else if (changes.recording?.newValue === false) {
    console.log('[Recorder] Recording stopped');
    window.removeEventListener('click', recordEvent);
    window.removeEventListener('input', recordEvent);
  }
});
