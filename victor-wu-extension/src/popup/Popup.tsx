import { h } from "preact";
import { useState, useEffect } from "preact/hooks";
import "./popup.css";

const Popup = () => {
  const [recording, setRecording] = useState(false);

  useEffect(() => {
    chrome.storage.local.get(["recording"], (res) => {
      setRecording(!!res.recording);
    });
  }, []);

  const toggleRecording = () => {
    const newState = !recording;
    setRecording(newState);
    chrome.storage.local.set({ recording: newState });

    chrome.action.setIcon({
      path: newState
        ? {
            16: "icons/checked-16.png",
            48: "icons/checked-48.png",
            128: "icons/checked-128.png",
          }
        : {
            16: "icons/unchecked-16.png",
            48: "icons/unchecked-48.png",
            128: "icons/unchecked-128.png",
          },
    });

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (tab?.url && tab.url.startsWith("http")) {
        chrome.scripting.executeScript({
          target: { tabId: tab.id! },
          func: () =>
            window.dispatchEvent(
              new CustomEvent(newState ? "START_RECORDING" : "STOP_RECORDING")
            ),
        });
      } else {
        alert(
          "Recording only works on standard web pages, not chrome:// or extension pages."
        );
      }
    });
  };

  const downloadTrace = () => {
    chrome.storage.local.get(["actionTrace"], (res) => {
      const originalTrace = res.actionTrace || [];
      const collapsedTrace: any[] = [];

      let lastInputEvent: any = null;

      for (let i = 0; i < originalTrace.length; i++) {
        const event = originalTrace[i];
        if (event.type === "input") {
          if (
            lastInputEvent &&
            lastInputEvent.type === "input" &&
            lastInputEvent.selector === event.selector
          ) {
            lastInputEvent = { ...event };
          } else {
            if (lastInputEvent) collapsedTrace.push(lastInputEvent);
            lastInputEvent = { ...event };
          }
        } else {
          if (lastInputEvent) collapsedTrace.push(lastInputEvent);
          lastInputEvent = null;
          collapsedTrace.push(event);
        }
      }

      if (lastInputEvent) collapsedTrace.push(lastInputEvent);

      const blob = new Blob([JSON.stringify(collapsedTrace, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "trace.json";
      a.click();
    });
  };

  return (
    <div class="popup-container">
      <h2>Victor Wu Recorder</h2>
      <button class={recording ? "recording" : "start"} onClick={toggleRecording}>
        {recording ? "Stop Recording" : "Start Recording"}
      </button>
      <button class="download" onClick={downloadTrace}>
        Download Trace
      </button>
      <div class="note">
        Start recording actions on a webpage and export them as a JSON file.
      </div>
      <div class="footer">
        <a href="https://github.com/victorzwu/extension-take-home" target="_blank" rel="noreferrer">
          View Source on GitHub
        </a>
      </div>
    </div>
  );
};

export default Popup;
