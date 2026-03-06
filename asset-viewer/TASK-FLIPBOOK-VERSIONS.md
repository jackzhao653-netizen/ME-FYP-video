# Task: Create 4-5 Flipbook Storyboard Versions

## Context
This is the FYP (Final Year Project) Asset Viewer for a **Fuel Cell Powered Robot Car with AI Assistant** called "Vandi". We need to plan a **10-minute FYP presentation video**. The current flipbook has 8 scenes — we need 4-5 completely different storyboard versions, each with 15-20 scenes to fill ~10 minutes.

## Team Members
- **Jack (ME)** — Mechanical Engineering. Handles all mechanical design (chassis, CAD in SolidWorks), AI/digital systems (React UI, Flask backend, ROS 2, Jetson Nano, voice assistant, YOLOv5 autonomous driving, LLM integration)
- **Oscar (BME)** — Biomedical Engineering. Handles vanadium redox fuel cell chemistry, electrolyte preparation, OCV measurements, cell assembly, membrane selection
- **Bijoy (EEE)** — Electrical & Electronic Engineering. Handles circuit design, power management, DC-DC conversion, motor driver, battery backup, sensor integration

## What To Build

### 1. Modify `src/App.tsx` to support multiple flipbook versions
- Add a **version tab bar** inside the flipbook view (NOT a new top-level nav tab)
- When user clicks "Audio Flipbook" tab, they see the version tabs: e.g. "V1: Documentary", "V2: Problem-Solution", "V3: Day-in-the-Life", "V4: Technical Deep Dive", "V5: Pitch Style"
- Each version has its own `FlipbookScene[]` array with unique scenes
- **No audio** — remove `audioPath` from the new versions
- **Add a `script` field** to `FlipbookScene` type — this is the narration script text
- Display the script in a styled container below the image (not just the caption)
- Keep the existing V0 flipbook (original 8 scenes with audio) as a legacy option

### 2. Scene Data — Create 5 Versions
Each version should be 15-20 scenes, targeting ~30-40 seconds per scene for a 10-min video. Each scene needs:
- `key`: unique slug
- `relativePath`: path to an image (use existing `images/` assets, create new SVGs in `fyp-assets/svg/`, or reference Vandi profile SVGs)
- `caption`: one-line description
- `script`: full narration script (2-4 sentences, ~30-40 seconds when spoken)
- `filmingNotes`: brief notes on how to film/capture this (camera angles, screen recordings, lab footage, etc.)

#### Version Themes:
1. **V1: Documentary** — Cinematic storytelling. Opens with the problem (clean energy for robotics), introduces the team, shows the journey from concept to working prototype. Emotional arc.
2. **V2: Problem-Solution** — Academic/structured. Problem statement → Literature review → Design methodology → Each subsystem (fuel cell, power, AI) → Integration → Testing → Results → Future work. Classic FYP report structure as video.
3. **V3: Build Log / Day-in-the-Life** — Behind-the-scenes. Shows the actual building process, lab work, coding sessions, testing failures and fixes. Raw and authentic.
4. **V4: Technical Deep Dive** — Heavy on engineering details. Circuit diagrams, electrochemistry, ROS 2 architecture, neural network models. For engineering professors.
5. **V5: Pitch / Demo** — Fast-paced product demo style. Hook → quick overview → live demo → key differentiators → future vision. Like a startup pitch or product launch. Show don't tell.

### 3. Create SVG Placeholder Images
For scenes that don't have existing images, create simple SVGs in `/Users/jack/Documents/GitHub/ME-FYP-video/fyp-assets/svg/` with:
- Dark background (#0a0a0c or #15161a) to match the viewer's theme
- Cyan accent (#00e5ff) for text/icons
- Scene title and brief visual indicator
- Keep them simple — they're placeholders for real footage

Name them: `storyboard-v{version}-scene-{number}.svg`

### 4. Existing Assets You Can Reference
- Images: `images/scene-01-hook.png` through `scene-14-outro.png` (from the original flipbook), `images/Details03.jpg`
- Vandi SVGs: reference via the API path pattern, e.g. for the Vandi interactive viewer expressions
- Extracted docs: `extracted-docs/ppts/meeting1-01.png` through `meeting3-40.png` (PPT slide images showing diagrams, architecture, fuel cell data, etc.)
- Extracted report images: `extracted-docs/interim-report/img-*.png/jpg` and `extracted-docs/reports/pdf-images/img-*.png`

### 5. Technical Constraints
- The server resolves `/api/asset/{path}` relative to `fyp-assets/`
- For Vandi profile SVGs: use `/api/asset/vandi%20profile/filename.svg`
- The app uses React + TypeScript + Vite + Tailwind + Framer Motion
- Keep the existing `AudioFlipbook` component mostly intact — extend it
- The `FlipbookScene` type is defined inline, extend it with `script?: string` and `filmingNotes?: string`
- Style the script container with the same dark/cyan aesthetic as the rest of the app

### 6. Build & Verify
- After editing, run `cd /Users/jack/Documents/GitHub/ME-FYP-video/asset-viewer && npm run build` to verify no TypeScript errors
- The dev server runs on port 5173, the asset API on port 3457

## File Locations
- App source: `/Users/jack/Documents/GitHub/ME-FYP-video/asset-viewer/src/App.tsx`
- Types: `/Users/jack/Documents/GitHub/ME-FYP-video/asset-viewer/src/types.ts`
- SVG output dir: `/Users/jack/Documents/GitHub/ME-FYP-video/fyp-assets/svg/`
- Vandi profile SVGs: `/Users/jack/Documents/GitHub/ME-FYP-video/vandi profile/` and `/Users/jack/Documents/GitHub/ME-FYP-video/fyp-assets/vandi profile/`

## Quality Bar
- Scripts should sound natural when read aloud — professional but not robotic
- Each version should feel genuinely different in tone and structure
- Filming notes should be practical — what camera setup, what screen to record, what lab equipment to show
- The tab UI should look polished and match the existing design system
