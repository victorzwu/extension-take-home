import { h } from 'preact';
import { useState } from 'preact/hooks';

const Popup = () => {
  const [recording, setRecording] = useState(false);

  const toggleRecording = () => {
    setRecording(!recording);
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id! },
        func: () => window.dispatchEvent(new CustomEvent(
          recording ? 'STOP_RECORDING' : 'START_RECORDING'))
      });
    });
  };

  const downloadTrace = () => {
    chrome.storage.local.get(['actionTrace'], (res) => {
      const blob = new Blob([JSON.stringify(res.actionTrace || [])], { type: 'application/json' });
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