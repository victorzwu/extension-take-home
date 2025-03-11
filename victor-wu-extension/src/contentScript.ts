const trace: any[] = [];
let lastInputValueMap: { [selector: string]: string | undefined } = {};
let lastInputFinalizedMap: { [selector: string]: boolean } = {};
let navigationCaptured = false;

function getSelector(el: HTMLElement): string {
  if (el.id) return `#${el.id}`;
  if (el.className && typeof el.className === 'string') {
    const className = el.className.trim().split(/\s+/).join('.');
    return `${el.tagName}.${className}`;
  }

  const parent = el.closest('button, div, span, a');
  if (parent && parent !== el) {
    const parentSelector = getSelector(parent as HTMLElement);
    return `${parentSelector} > ${el.tagName.toLowerCase()}`;
  }

  return el.tagName.toLowerCase(); // fallback
}

function recordEvent(e: Event) {
  const target = e.target as HTMLElement;
  const selector = getSelector(target);
  let value: string | undefined = undefined;

  if ((target as HTMLInputElement).value !== undefined) {
    value = (target as HTMLInputElement).value;
  } else if (target.isContentEditable) {
    value = target.textContent || '';
  }

  const timestamp = Date.now();

  if (e.type === 'input' || e.type === 'keydown' || e.type === 'keyup') {
    const isDuplicateValue = lastInputValueMap[selector] === value;
    const isFinalized = lastInputFinalizedMap[selector];

    if (!isDuplicateValue || !isFinalized) {
      trace.push({
        type: 'input',
        selector,
        value,
        timestamp
      });
      lastInputValueMap[selector] = value;
      lastInputFinalizedMap[selector] = true;
      console.log('[Recorder] Input event recorded:', { selector, value });
    } else {
      console.log('[Recorder] Skipped duplicate or finalized input:', { selector, value });
    }
  } else if (e.type === 'click') {
    const event = {
      type: 'click',
      selector,
      timestamp
    };
    trace.push(event);
    console.log('[Recorder] Click event:', event);

    // Reset finalized flags to allow new input recording
    Object.keys(lastInputFinalizedMap).forEach((sel) => {
      lastInputFinalizedMap[sel] = false;
    });
  }

  chrome.storage.local.set({ actionTrace: trace }, () => {
    console.log('[Recorder] Trace updated in storage:', trace);
  });
}

function attachListeners() {
  if (!navigationCaptured) {
    const navEvent = {
      type: 'navigation',
      url: window.location.href,
      timestamp: Date.now()
    };
    trace.unshift(navEvent);
    navigationCaptured = true;
    chrome.storage.local.set({ actionTrace: trace });
    console.log('[Recorder] Navigation event added & saved:', navEvent);
  }
  console.log('[Recorder] Attaching event listeners...');
  window.addEventListener('click', recordEvent);
  window.addEventListener('input', recordEvent);
  window.addEventListener('keydown', recordEvent);
  window.addEventListener('keyup', recordEvent);
  window.addEventListener('scroll', () => {
    const event = {
      type: 'scroll',
      scrollY: window.scrollY,
      timestamp: Date.now()
    };
    trace.push(event);
    chrome.storage.local.set({ actionTrace: trace });
    console.log('[Recorder] Scroll event captured:', event);
  });
}

chrome.storage.local.get(['recording'], (res) => {
  if (res.recording) {
    attachListeners();
  }
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes.recording?.newValue === true) {
    attachListeners();
  } else if (changes.recording?.newValue === false) {
    console.log('[Recorder] Recording stopped');
    window.removeEventListener('click', recordEvent);
    window.removeEventListener('input', recordEvent);
    window.removeEventListener('keydown', recordEvent);
    window.removeEventListener('keyup', recordEvent);
  }
});