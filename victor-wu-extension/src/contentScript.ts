const trace: any[] = [];
let lastInputValueMap: { [selector: string]: string | undefined } = {};

function getSelector(el: HTMLElement): string {
  if (el.id) return `#${el.id}`;
  if (el.className && typeof el.className === 'string') {
    const className = el.className.trim().split(/\s+/).join('.');
    return `${el.tagName}.${className}`;
  }
  return el.tagName;
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

  if (e.type === 'input' || e.type === 'keydown' || e.type === 'keyup') {
    if (lastInputValueMap[selector] === value) return;
    lastInputValueMap[selector] = value;

    const event = {
      type: 'input',
      selector,
      value,
      timestamp: Date.now()
    };

    console.log('[Recorder] Input Event:', event);
    trace.push(event);
  } else {
    const event = {
      type: e.type,
      selector,
      timestamp: Date.now()
    };

    console.log('[Recorder] Click/Scroll Event:', event);
    trace.push(event);
  }

  chrome.storage.local.set({ actionTrace: trace }, () => {
    console.log('[Recorder] Trace updated in storage:', trace);
  });
}

function attachListeners() {
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
