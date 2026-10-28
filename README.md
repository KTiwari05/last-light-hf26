# Last Light

**Every quiet house has a story.** Paste a short night log and let a local
open-weight model turn ordinary events into three scenes of ghost fiction.
Follow each scene's event links to see the original lines that inspired it.

[Watch the 69-second local browser walkthrough](submission/demo/last-light-walkthrough.webm).
It begins with a real Eerie suspense result and shows source links, text export,
and an input change clearing the story. Generation waiting is omitted.

Built fresh on October 27, 2026 for [Hacktoberfest Week 4: Ghost in the
Machine](https://dev.to/challenges/hacktoberfest-week4-2026-10-26).

## Run locally

Requires Python 3.11+ and [Ollama](https://ollama.com). No Python or JavaScript
packages are needed. Downloading Ollama and the model requires internet access.

```powershell
ollama pull qwen3:4b
ollama serve
```

If Ollama is already running, leave that instance running instead. In another
terminal, from this project directory:

```powershell
python server.py
```

Open http://127.0.0.1:8767. Stop the app with Ctrl+C. A different port is supported
with `python server.py --port 8768`.

1. Try the clearly labelled fictional sample, or paste 3–24 events, one per line.
2. Choose Quiet unease or Eerie suspense, then click **Write a ghost story**.
3. Follow an event link to focus the original line below the editor.
4. Download a text file containing the fiction label, story, and original log.

Keep each line within 240 characters and the log within 6,000 characters.
Timestamps are optional; the app preserves line order, including across midnight.
Editing the log or changing the mood clears the previous story and download.

The first real sample generation took about 135 seconds on this machine using
CPU inference. Generation has a three-minute server timeout. Speed and story
quality vary with hardware and model load; a timeout returns an actionable error.

## How it works

Plain HTML, CSS, and JavaScript talk to a Python standard-library HTTP server,
bound to 127.0.0.1. The server sends numbered event lines and the selected mood to
local Ollama's `/api/chat` endpoint with `qwen3:4b`, thinking disabled, and a JSON
schema. It validates three scenes and checks every source ID against the supplied
log before returning the result. The page renders model and log text as text,
without interpreting HTML. Only one generation runs at a time.

The UI follows the [approved Superdesign
draft](https://p.superdesign.dev/draft/17e1844c-617e-4a0a-aec6-93bddcb51496),
adapted to working controls and local CSS. Its CDN scripts and static sample story
are not runtime dependencies. Design exploration used Superdesign's Cinematic
Style prompt and Gemini Flash. Implementation was AI-assisted using Codex.

## Privacy and limits

Last Light sends the log only to Ollama at `127.0.0.1:11434`, ignoring HTTP proxy
settings. It has no cloud inference, analytics, database, browser storage, or
automatic file writes. A downloaded story is saved only when requested. This
describes Last Light's own behavior; Ollama and your browser are separate software.
After installation and model download, the app has no external network dependency.
Network-disconnected operation has not been independently tested.

**The story is fiction, not an explanation of the log.** References identify the
model's claimed inspiration, not evidence of a haunting or proof that the prose
matches the source. A valid ID can still be semantically weak. The model may
invent events, people, dialogue, or details. No log text is executed as a command,
and no files or device sensors are read automatically.

This is a local development app, not an internet-facing service. It provides no
accounts, hosting, or remote Ollama configuration. Code is MIT licensed; the model
and Ollama retain their respective licenses.

## Verify

```powershell
python -m unittest discover -s tests -v
node --check static/app.js
```

Node is optional and only needed for the JavaScript syntax check. Unit/HTTP tests
mock model calls; they do not prove real inference quality. The separately saved
`submission/real-generation.json` records a real run on fictional input.

See [the prepared submission article](submission/DEV_POST.md),
[verification record](submission/VERIFICATION.md), and
[challenge brief](submission/BRIEF.md) for the work, evidence, and conflicting
deadline metadata. Public source and the video demo are published. The requirement assessment is
in [ASSESSMENT.md](submission/ASSESSMENT.md). [Week 4 submission](https://dev.to/ktiwari05/last-light-a-ghost-story-from-the-things-a-house-records-3cfm) is published. See
[receipt.md](submission/receipt.md) for verification and the remaining DEV disclosure
metadata issue. No prize category or award is claimed.
