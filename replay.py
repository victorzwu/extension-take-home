# replay.py — Replays recorded browser actions from trace.json
import asyncio
from pyppeteer import launch
import json

async def replay_actions(trace_file: str):
    with open(trace_file, 'r') as f:
        trace = json.load(f)

    browser = await launch(headless=False, args=['--start-maximized'])
    page = await browser.newPage()
    await page.setViewport({'width': 1280, 'height': 800})

    # Optional: handle navigation
    if trace and trace[0]['type'] == 'navigation':
        print(f"Navigating to {trace[0]['url']}...")
        await page.goto(trace[0]['url'])
        trace = trace[1:]
    else:
        print("No navigation event found. Starting from blank page.")

    for event in trace:
        try:
            if event['type'] == 'click':
                print(f"Clicking: {event['selector']}")
                await page.click(event['selector'])

            elif event['type'] == 'input':
                print(f"Typing in: {event['selector']} — '{event.get('value', '')}'")
                await page.focus(event['selector'])
                await page.evaluate(f"document.querySelector('{event['selector']}').innerText = ''")
                await page.type(event['selector'], event.get('value', ''))

            elif event['type'] == 'scroll':
                print(f"Scrolling to Y: {event['scrollY']}")
                await page.evaluate(f"window.scrollTo(0, {event['scrollY']})")

            await asyncio.sleep(1)  # Optional delay for realism

        except Exception as e:
            print(f"[ERROR] Failed to perform {event['type']} on {event['selector']}: {e}")

    print("✅ Replay finished")
    await browser.close()

if __name__ == '__main__':
    import sys
    if len(sys.argv) != 2:
        print("Usage: python replay.py trace.json")
    else:
        asyncio.run(replay_actions(sys.argv[1]))
