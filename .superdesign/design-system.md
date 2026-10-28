# Last Light

A local storytelling desk for people who enjoy quiet ghost stories. Paste 3–24
short timestamped events. A local open-weight model writes three fictional scenes.
Every scene links to the event lines that inspired it. Nothing is executed from
the log. The page must keep observation and invention visibly distinct.

Primary style source: Superdesign library `cinematic-style` (Cinematic Style),
adapted to a practical night-watch desk. Keep spatial depth, quiet framing, and
large restrained typography. Omit its marketing sections, pricing, neon gradients,
rotating cube, and image dependencies because this is a working application.

Colors: midnight #111B29 background; slate #1C2B3D surfaces; mist #E4EDF4 primary
text; fog #AABBCB secondary text; moon #B8CDE5 accent; ember #F1BB77 active action.
Borders use fog at 25% opacity. No extra accent colors or gradients.

Type: Georgia display/story, system sans-serif controls/body, Consolas or system
monospace timestamps and small utility labels. Use installed fallback fonts only,
with no CDN or external font dependency. Display 64px desktop / 40px mobile; story
20px with 1.65 line height; body 16px; utility 12px. Sentence case.

Spacing: multiples of 8px; maximum width 1280px; desktop outer padding 48px,
mobile 20px. Buttons 44px high or taller. Radius 8px for inputs/panels. No big
shadows. Visible moon-colored keyboard focus. No mandatory animation, flashing,
sound, or background motion. Respect prefers-reduced-motion.

Single page: narrow header with Last Light wordmark and a local inference label.
Compact lead 'Every quiet house has a story.' A working split desk below: left
42% source log, right 58% story. On mobile stack source then story.

Left: 'The night log', subtitle explaining one event per line, textarea with six
sample events, Load sample button, event count, Quiet unease / Eerie suspense
radio choices, primary 'Write a ghost story' button. Privacy note: 'Your log goes
only to Ollama on this machine. Last Light does not save it.'

Right: 'The story', prominent 'Fiction, inspired by your log' label, initial empty
state explaining the next action, and a generated state with title, exactly three
scenes, small event-reference buttons, and Download story action. The signature
interaction: clicking an event reference brings its original log line into view
below the editor. Story prose uses warm ember sparingly in labels, not body text.

Source log example: 23:41 Hallway light switched off; 00:06 Motion in the empty
kitchen; 00:07 Temperature fell; 00:09 Radio switched on; 00:12 Door remained
closed; 00:13 Hallway light switched on. Label all samples as fictional.

Footnote: 'A ghost story, not an explanation. References show inspiration, not
evidence of a haunting.' A generated scene's reference IDs are validated, but
semantic correspondence is still model-generated.

No signup, dashboard charts, pricing, navigation sections, image generation,
framework dependencies, or invented status statistics.
