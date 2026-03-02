# ME-FYP-video — Vandi Demo Video

**Project:** Design and Development of an Electric Toy Car Powered by a Fuel Cell Stack  
**Lead:** ZHAO Xuecen (ME) — Systems Architect, AI & Fabrication  
**Institution:** HK PolyU FYP 2025–2026

## Structure

```
ME-FYP-video/
├── video-plan.md          # Full scene plan (standard + fun Vandi avatar version)
├── fyp-assets/            # Production assets (images, video, audio, svg, logos)
│   ├── videos/
│   ├── images/
│   ├── audio/             # Voiceovers (vo-scene-*.mp3)
│   ├── sounds/            # SFX
│   ├── svg/               # Vandi SVG avatar + diagrams
│   ├── logos/
│   └── prompts/           # prompts.json (asset metadata)
└── asset-viewer/          # Local browser asset pipeline UI
    └── start.sh           # npm run dev → http://localhost:5179
```

## Asset Viewer

```bash
cd asset-viewer
./start.sh
# Open http://localhost:5179
```

Polls `fyp-assets/` every 3 seconds. Upload, inspect, and annotate assets from the browser.
