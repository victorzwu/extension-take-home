import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';

const Popup = () => {
  const [recording, setRecording] = useState(false);

  useEffect(() => {
    chrome.storage.local.get(['recording'], (res) => {
      setRecording(!!res.recording);
    });
  }, []);

  const toggleRecording = () => {
    const newState = !recording;
    setRecording(newState);
    chrome.storage.local.set({ recording: newState });
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (tab?.url && tab.url.startsWith('http')) {
        chrome.scripting.executeScript({
          target: { tabId: tab.id! },
          func: () => window.dispatchEvent(new CustomEvent(
            newState ? 'START_RECORDING' : 'STOP_RECORDING'))
        });
      } else {
        alert('Recording only works on standard web pages, not chrome:// or extension pages.');
      }
    });
  };

  const downloadTrace = () => {
    chrome.storage.local.get(['actionTrace'], (res) => {
      const originalTrace = res.actionTrace || [];
      const collapsedTrace: any[] = [];
  
      let lastInputEvent: any = null;
  
      for (let i = 0; i < originalTrace.length; i++) {
        const event = originalTrace[i];
  
        if (event.type === 'input') {
          if (
            lastInputEvent &&
            lastInputEvent.type === 'input' &&
            lastInputEvent.selector === event.selector
          ) {
            // Replace previous input event with current one (keep only latest input in a burst)
            lastInputEvent = { ...event };
          } else {
            // New input burst starts
            if (lastInputEvent) {
              collapsedTrace.push(lastInputEvent);
            }
            lastInputEvent = { ...event };
          }
        } else {
          // Push any pending input before adding non-input events
          if (lastInputEvent) {
            collapsedTrace.push(lastInputEvent);
            lastInputEvent = null;
          }
          collapsedTrace.push(event);
        }
      }
  
      // If there’s a final input left unpushed
      if (lastInputEvent) {
        collapsedTrace.push(lastInputEvent);
      }
  
      // Download collapsed trace
      const blob = new Blob([JSON.stringify(collapsedTrace, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'trace.json';
      a.click();
    });
  };

  return (
    <div class="p-4 text-center">
      <h2 class="text-lg font-bold mb-2">Action Recorder</h2>
      <button onClick={toggleRecording} class="bg-blue-500 text-white px-4 py-2 rounded mb-2">
        {recording ? 'Stop Recording' : 'Start Recording'}
      </button>
      <br />
      <button onClick={downloadTrace} class="bg-green-500 text-white px-4 py-2 rounded">
        Download Trace
      </button>
    </div>
  );
};

export default Popup;