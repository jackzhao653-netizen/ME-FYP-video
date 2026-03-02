# Asset Viewer Frontend

Create a TypeScript React (Vite) frontend that visualizes all assets in the `../v2-assets/` directory.

## Requirements

### Asset Types to Display
- **Videos** (`.mp4`): Embedded video player with controls
- **Images** (`.png`, `.jpg`): Inline display
- **SVGs** (`.svg`): Inline SVG rendering
- **Audio** (`.mp3`, `.wav`): Audio player with waveform visualization
- **Voiceover audio**: Special treatment — show editable script + voice prompt

### Prompt Display
- For AI-generated assets (videos, sound effects, pictures), show the **generation prompt** underneath
- Prompts are stored in `../v2-assets/prompts/prompts.json` — a JSON file mapping asset paths to their prompts
- Format: `{ "videos/geometric-series-1080p.mp4": { "type": "manim", "prompt": "...", "script": "..." }, ... }`
- For voiceovers, show both the **script text** and the **voice description prompt**, both editable
- Editable fields should save back to prompts.json via the dev server API

### Auto-Refresh
- Poll the asset directory every 3 seconds for new files
- When new content appears, add it to the view without full page reload
- Show a "New content detected" toast notification

### Prompt Storage
- `../v2-assets/prompts/prompts.json` is the single source of truth
- Create it if it doesn't exist
- The frontend needs a small Express backend (or Vite middleware) to:
  - GET /api/assets — scan v2-assets/ and return file list with metadata
  - GET /api/prompts — return prompts.json
  - PUT /api/prompts — update prompts.json
  - GET /api/asset/:path — serve asset files

### Layout
- Grid/card layout, grouped by type (Videos, Images, SVGs, Audio, Voiceovers)
- Each card shows: thumbnail/preview, filename, prompt (if exists), edit button
- Dark theme matching IMCG style (#0f172a background, cyan/green accents)
- Responsive

### Asset Paths to Include
```
v2-assets/
├── videos/          # .mp4 files — show video player
├── images/          # .png, .jpg — show inline
├── svg/             # .svg — render inline
├── audio/           # .wav, .mp3 — voiceover audio with script
├── sounds/          # .mp3 — sound effects
├── logos/           # .svg, .png — logo assets
└── prompts/         # prompts.json — prompt storage
```

### Tech Stack
- React 18+ with TypeScript
- Vite for dev server
- Express backend (separate or Vite plugin) for API
- Tailwind CSS for styling
- No heavy dependencies — keep it lean

Run with: `npm run dev` (starts both Vite + Express API)

When completely finished, run: `openclaw system event --text "Done: Asset viewer frontend created" --mode now`
