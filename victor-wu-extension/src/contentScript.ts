const trace: any[] = [];

const recordEvent = (e: Event) => {
  const target = e.target as HTMLElement;
  const selector = target?.tagName + (target.id ? `#${target.id}` : '') + (target.className ? `.${target.className.split(' ').join('.')}` : '');

  const event = {
    type: e.type,
    selector,
    timestamp: Date.now()
  };
  trace.push(event);
  chrome.storage.local.set({ actionTrace: trace });
};

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