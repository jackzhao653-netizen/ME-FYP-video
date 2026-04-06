# FYP Asset Summary

**Project:** Design and Development of an Electric Toy Car Powered by a Fuel Cell Stack  
**Lead:** ZHAO Xuecen (ME) — Systems Architect, AI & Fabrication  
**Institution:** HK PolyU FYP 2025–2026

## Asset Overview

- **Total useful assets:** 596
- **Deleted junk:** 627 (from 1,223 original files)
- **All assets cataloged** with visual content descriptions and searchable tags in `ASSET-CATALOG.md`

## Asset Categories

### 1. Images (`fyp-assets/images/`)
- **Scene renders:** 14 serious documentary-style scenes (scene-01 through scene-14)
- **Fun variant scenes:** 7 Vandi avatar scenes (partial set)
- **Source:** Generated via Gemini web UI (Veo)

### 2. Audio (`fyp-assets/audio/`)
- **Voiceovers:** 14 complete scene narrations (vo-scene-01.mp3 through vo-scene-14.mp3)
- **Generation method:** Chunked TTS via GPU-accelerated IMCG Sound
- **Status:** All 14 scenes complete

### 3. SVG Assets (`fyp-assets/svg/`)
- **Vandi profile set:** 12 emotion variants (happy, sad, thinking, excited, confused, etc.)
- **Diagrams:** Technical illustrations, thought clouds, magnifying glass
- **Total:** 57 SVG files

### 4. Extracted Documentation (`fyp-assets/extracted-docs/`)
- **PPT slide screenshots:** 924 files from 5 presentation decks
  - `ppt-2026-meeting1/` — Initial project proposal
  - `ppt-meeting2/` — Mid-term progress
  - `ppt-meeting2.5/` — Additional updates
  - `ppt-interim-final/` — Interim report presentation
  - `interim-report/` — Full interim report slides
- **Content types:** 
  - Fuel cell polarization curves
  - CAD renders (enclosures, assemblies)
  - Circuit diagrams (power architecture, state machines)
  - Lab photos (fuel cell stack, 3D prints, PCBs)
  - Team photos
  - AI/ML screenshots (YOLO training, object detection)
  - Gantt charts and timelines
  - System architecture diagrams

### 5. 3D Assets (`fyp-assets/Vandi3D/`)
- **Vandi character model:** 3D avatar for potential animation use

### 6. Reference Materials (`fyp-assets/reference/`)
- Original design references and inspiration materials

### 7. Legacy Assets (`fyp-assets/legacy/`)
- Archived/superseded materials kept for reference

## Flipbook Versions

Five complete video narrative versions exist in `asset-viewer/src/flipbook-versions.ts`:

### V0: Baseline (Placeholder)
- 14 scenes with placeholder SVG graphics
- Basic narrative structure established

### V1: Documentary (REFINED ✅)
- **Style:** Cinematic storytelling with emotional arc
- **Assets:** Real scene PNGs from `images/scene-*.png`
- **Scripts:** Detailed technical narration with filming notes
- **Status:** Production-ready with real assets

### V2: Educational
- **Style:** Clear, instructional tone for academic audiences
- **Assets:** Still using placeholder SVGs (needs refinement)

### V3: Promotional
- **Style:** Fast-paced, impact-focused for social media
- **Assets:** Still using placeholder SVGs (needs refinement)

### V4: Technical Deep-Dive
- **Style:** Engineering-focused with detailed explanations
- **Assets:** Still using placeholder SVGs (needs refinement)

### V5: Inspirational
- **Style:** Motivational narrative emphasizing innovation
- **Assets:** Still using placeholder SVGs (needs refinement)

## Key Technical Assets

### Power System
- Fuel cell polarization curves (voltage vs current density)
- Power architecture block diagrams (boost converter, battery backup)
- State machine diagrams (FuelCellMode ↔ BatteryMode transitions)
- Timeline charts (power management sequences)

### Mechanical Design
- CAD renders (transparent enclosures, internal assemblies)
- 3D-printed parts (plates, brackets, chassis components)
- Assembly photos (fuel cell stack, robot platform)

### Electronics
- Circuit diagrams (DC-DC boost, motor drivers, sensor interfaces)
- PCB photos (EMS BUS INTERFACE V3.1, custom boards)
- Wiring and integration shots

### AI/ML
- YOLO training screenshots (object detection datasets)
- System architecture diagrams (ROS 2, Whisper, LLM integration)
- Dashboard UI mockups (React interface)

### Team & Process
- Lab photos (chemistry bench, assembly workspace)
- Team photos (group shots, individual portraits)
- Gantt charts (project timeline by team member)
- Presentation slides (progress reports, deliverables)

## Asset Catalog Structure

The full `ASSET-CATALOG.md` (119KB) contains:
- **File-by-file descriptions** for all 596 assets
- **Searchable tags** (fuel-cell, CAD, circuit, YOLO, dashboard, etc.)
- **API path format** for programmatic access
- **Organized by source folder** (ppt-meeting1, ppt-meeting2, etc.)

## Usage Notes

### For Video Production
1. **V1 Documentary** is production-ready with real assets
2. **V2-V5** need asset refinement (replace placeholder SVGs with real images)
3. All voiceovers (14/14) are complete and ready to sync
4. Scene images are 1920x1080 or similar high-res formats

### For Asset Discovery
- Search `ASSET-CATALOG.md` for specific tags
- Use asset-viewer UI (http://localhost:5179) for visual browsing
- All paths are relative to `fyp-assets/` root

### For Documentation
- Extracted PPT slides provide comprehensive visual documentation
- Lab photos show real fabrication process
- Charts and diagrams support technical explanations

## Next Steps

1. **Refine V2-V5 flipbooks** — Replace placeholder SVGs with real assets from catalog
2. **Generate missing fun variant images** — Complete the 7/13 fun scene set
3. **Enhance V1 with Gemini Nano Banana** — Visual improvements for documentary version
4. **Export final videos** — Render complete sequences with voiceovers + music

---

**Last Updated:** 2026-03-13 04:24 AM (Asia/Shanghai)  
**Catalog Version:** 1.0 (596 assets)  
**Status:** Asset collection complete, V1 production-ready, V2-V5 need refinement
