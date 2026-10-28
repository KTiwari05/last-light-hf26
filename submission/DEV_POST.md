---
title: "Last Light: a ghost story from the things a house records"
published: true
tags: devchallenge, hf26challenge
ai_disclosure_level: fully_autonomous
---

*This is a submission for the [Hacktoberfest Open-Source AI Challenge
Week 4: Ghost in the Machine](https://dev.to/challenges/hacktoberfest-week4-2026-10-26).*

## What I Built

A hallway light switches off. A motion sensor notices the empty kitchen. A radio
wakes up with no station selected. Those are six lines in a log. Put them beside
one another, and they begin to suggest a story.

**Last Light** is a local writing desk that makes that suggestion explicit. Paste
3–24 short events, choose Quiet unease or Eerie suspense, and Qwen3 4B writes a
three-scene ghost story. Each scene has event links that open the original lines
that inspired it. A text download keeps the story and source log together.

This is my spooky interpretation of Ghost in the Machine: the machine supplies
the observations, and an open-weight model supplies the ghost. The interface keeps
those two layers visible. It calls the result fiction and leaves the original
events unchanged.

The project was started on October 27, during the Week 4 window. It is a new
repository, separate from the previous weekly entries. It does not connect to a
smart-home account, collect sensor data, read files automatically, or run commands
from the pasted text. The bundled night log is fictional.

## Demo

[Watch the 69-second browser walkthrough](https://github.com/KTiwari05/last-light-hf26/blob/main/submission/demo/last-light-walkthrough.webm).

![Last Light showing a ghost story beside its original night log](https://raw.githubusercontent.com/KTiwari05/last-light-hf26/main/submission/demo/desktop.png)

The recording shows a real local-model story, following its event references,
downloading the story and original log, and changing the input so the previous
story disappears. Generation waiting happens before recording and is omitted.
It is an unedited silent browser recording of the local app, without a hosted
inference service or canned model result.

[Desktop](https://github.com/KTiwari05/last-light-hf26/blob/main/submission/demo/desktop.png) and
[mobile screenshots](https://github.com/KTiwari05/last-light-hf26/blob/main/submission/demo/mobile.png) are included. The source instructions let a judge run the same
workflow without creating an account.

## Code

[Source, setup instructions, tests, and evidence on GitHub](https://github.com/KTiwari05/last-light-hf26).

The application is MIT licensed. Run it with Python 3.11+ and Ollama:

```powershell
ollama pull qwen3:4b
```

Keep Ollama running, then start the app from its project directory:

```powershell
python server.py
```

Open the local address printed by the server. No Python or JavaScript application
packages need to be installed. Model weights are downloaded separately and retain
their upstream license.

## How I Built It

The page is plain HTML, CSS, and JavaScript. A Python standard-library server
numbers the event lines, then sends them to local Ollama's `/api/chat` endpoint.
Qwen3 4B generates the title, story scenes, and the IDs of their inspiring events.
The [Ollama structured-output API](https://docs.ollama.com/capabilities/structured-outputs)
constrains the reply to a JSON schema.

```text
Pasted night log → numbered original events → local Qwen3 4B
                                              ↓
                                   three fictional scenes
                                              ↓
                             structure and event-ID checks
                                              ↓
                              story beside the source log
                                              ↓
                                   portable text download
```

The model does the central creative work. There is no stored story substituted
when inference fails. Connection errors, incomplete replies, and invalid event
references produce an error message and restore the writing controls.

The server requires three scenes and validates the returned text and event IDs.
If a six-event log comes back with a reference to event 99, it rejects the result.
Those checks say nothing about literary quality, and an existing event ID can
still be a weak match for a scene.

That distinction showed up in a real reply. The original front-door event said
the door was closed. The generated story later described it as ajar. For a
fiction generator, inventing a development can be part of the story. Presenting
that sentence as an explanation of the log would be misleading. The page and
download therefore say that references show inspiration rather than evidence.

The interface follows an [approved Superdesign
draft](https://p.superdesign.dev/draft/17e1844c-617e-4a0a-aec6-93bddcb51496), explored with Gemini Flash
using its Cinematic Style prompt. The implementation replaces the draft's CDN
scripts with local CSS and JavaScript. It also removes its invented runtime
status and version labels. The dark writing desk, serif story text, and small
event-reference controls remain.

Fourteen automated tests passed. They check input limits, event order, reply
shape, invalid reference types and ranges, malformed and truncated responses,
local HTTP behavior, inference failures, and concurrent-generation rejection.
Model calls in those tests are mocked. Separate real runs covered both mood
choices. Browser checks exercise inference and the complete reading/export flow.

The first measured real sample took **134.67 seconds** on this computer using CPU
inference. The 375-pixel layout fits without horizontal overflow. Browser checks
also covered visible keyboard focus, literal rendering of HTML-like input and
model text, error recovery, and clearing the old story when the log or mood changes.
These checks are recorded in the [verification record](https://github.com/KTiwari05/last-light-hf26/blob/main/submission/VERIFICATION.md); they are not a broad
quality or security benchmark.

## Why Does Open Innovation Matter?

The open weights do the story generation on the same machine as the app. The
server sends the supplied log only to local Ollama, with system HTTP proxies
disabled for that request. Last Light itself has no cloud inference, analytics,
database, browser storage, or automatic log saving. Downloading a story is an
explicit action.

That gives this small creative tool a useful property: a person's home log does
not need to become a hosted model request. After downloading the software and
weights, the application has no external network dependency. Physical
network-disconnected operation has not been independently tested.

The prompt, schema, and validation code are inspectable. They can be changed
without asking a provider to add a feature. The exported text remains readable
without either Ollama or the application. A closed API could generate a ghost
story too; the reason for using open pieces here is control over the processing
and a small workflow that can be kept locally.

The tradeoff is waiting for CPU inference and accepting the small model's limits.
Open weights do not guarantee better fiction, faithful references, or a good
twist. I have not tested this with readers or measured whether the eerie mood
feels different enough from the quiet one.

## My Agent Session

Codex implemented the app, ran the checks, and drafted this article under my
instruction. I approved the interface direction. This article was authored and published autonomously under my instruction to complete and submit Week 4, with AI involvement disclosed.
No public agent-session transcript is linked. The repository's verification files
and fictional fixtures provide the evidence instead.

## Prize Categories

This submission enters the overall challenge. It uses Qwen and Ollama and does not
claim a partner prize category.

