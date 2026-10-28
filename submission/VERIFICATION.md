# Verification — October 27, 2026

## Passed

- `python -m unittest discover -s tests -v`: 14 tests. Input limits and order,
  invalid schema/text/reference IDs, local Ollama transport, inference failures,
  truncated responses, HTTP health/status codes, origin/Host checks, project-file
  denial, and concurrent-generation rejection. Model calls in these tests are mocked.
- `node --check static/app.js`: syntax passed.
- Actual local server returned HTTP 200 for `/`, `/style.css`, `/app.js`, and
  `/api/health`.
- Real `qwen3:4b` generation, thinking disabled, via local Ollama: three scenes,
  existing source IDs, and explicit fiction flag. First run took 134.67 seconds;
  its full result is in `real-generation.json`.
- A second real generation completed through the browser and `/api/story` with
  HTTP 200. Both real runs used Quiet unease. The two stories were different;
  the browser version is in `demo/sample-story.txt`.
- Browser source links focused and highlighted the correct original event on
  desktop and mobile. Download contained the fiction label, all three scenes,
  reference IDs, and all six original events.
- Editing the log cleared the previous story and disabled the download. A
  one-line log showed validation without starting another inference request.
- Desktop 1440px and mobile 375px layouts were captured and visually inspected.
  The mobile document had no horizontal overflow. See `demo/desktop.png` and
  `demo/mobile.png`.
- Separate mocked browser checks passed: Eerie suspense payload, mood-change
  invalidation, literal rendering of HTML-like model/log text, 502 error message
  and restored controls, sample restoration, and visible keyboard focus.
- Mock routes were removed after browser checks. The mocked 502 deliberately
  caused one browser resource-error console entry. There were no console errors
  in the real successful generation before that check.
- Follow-up real Eerie suspense generation returned HTTP 200 with three scenes
  titled "The Clockwork Echo". Its complete response is retained in
  `real-eerie-generation.json`. Both mood choices now have real inference checks.
- A 69.4-second, 1440x1000, 15 fps VP8/WebM silent browser walkthrough was recorded
  from that real Eerie suspense result. It shows event navigation, a verified text
  download, editing that clears the old story, and restoring the sample. The
  recording begins after generation and omits inference waiting. FFmpeg decoded
  frames from the start, middle, and end; those frames were visually inspected.
  The video is unedited, with the original browser action timing preserved.
- The Eerie suspense text export was checked against the real response: all three
  scene texts, the fiction label, and original event lines are present.
- The local DEV draft contains all five required template sections and both tags.
  It remains unpublished, with explicit placeholders for public source/demo links.

The ephemeral browser scripts, snapshots, and downloads are in ignored
`output/playwright/` and `.playwright-cli/` directories. Curated screenshots and
the real sample output are retained under `submission/demo/`.

## Limits and remaining work

- Source-ID validation checks existence and shape, not whether the story makes
  semantic sense. The model invented door movements, dialogue, and atmospheric
  details. That is expected fiction and must not be called factual analysis.
- No large-scale quality evaluation, deliberate three-minute timeout, or physical
  network-disconnection test was performed.
- No public repository, hosted demo, DEV publication, Week 4
  registration, or challenge submission was made. No badge or prize is assumed.
- The challenge page's published deadline and the event API timestamp differ by
  one day. See `BRIEF.md`; target the earlier timestamp for finishing.

The local app and Ollama were left running for review at http://127.0.0.1:8767.

## October 28 release assessment

All 14 unit/HTTP tests and JavaScript syntax check rerun successfully. Public README, LICENSE, desktop/mobile images, and video SHA-256 match local files. Source and demo published to https://github.com/KTiwari05/last-light-hf26. No application code changed. Real inference and browser checks above are October 27 evidence and were not rerun. DEV publication was blocked by approval policy; this is not a submitted entry. See STATUS.md and ASSESSMENT.md for current state.
