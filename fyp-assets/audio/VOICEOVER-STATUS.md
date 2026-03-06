# Voiceover Generation Status

**Last attempt:** 2026-03-04 06:57 GMT+8
**Status:** ❌ BLOCKED — IMCG Sound app unreachable

## What Happened

The Gradio TTS app at `http://10.14.0.2:7863` is not responding (connection timeout after 5s). The host at `10.14.0.2` appears to be offline or the app is not running.

## What's Ready

- ✅ All 14 narration scripts extracted (see `narration-scripts.md` in this directory)
- ✅ Output directory created: `fyp-assets/audio/`
- ✅ Naming convention defined: `vo-scene-01.wav` through `vo-scene-14.wav`

## To Generate Voiceovers

### Option A: IMCG Sound App (preferred)
1. Ensure the PC at `10.14.0.2` is powered on and on the same network
2. Start the Gradio app on port 7863
3. Re-run this task or use the app manually with the scripts in `narration-scripts.md`
4. Settings: professional male narrator, ~130 wpm, documentary/educational style

### Option B: Gradio API (programmatic)
Once the app is reachable, check for API access:
```bash
curl http://10.14.0.2:7863/info
curl http://10.14.0.2:7863/api/
```
Then use Python `gradio_client` or direct API calls to batch-generate all 14 scenes.

### Option C: Alternative TTS
If the IMCG Sound app remains unavailable, consider:
- ElevenLabs API (high quality, paid)
- edge-tts (free, Microsoft voices, `pip install edge-tts`)
- Coqui TTS (local, open source)

## Scene List & Durations

| Scene | Duration | Word Count (approx) |
|-------|----------|-------------------|
| 1 — Cold Open / Hook | 0:30 | ~70 |
| 2 — Intro — What is Vandi? | 1:00 | ~130 |
| 3 — Problem Statement | 1:30 | ~185 |
| 4 — Fuel Cell Deep Dive | 1:30 | ~185 |
| 5 — Mechanical Design & Build | 1:30 | ~175 |
| 6 — Electronics & Power System | 1:00 | ~125 |
| 7 — AI Brain — Jetson Nano & Vandi | 1:00 | ~125 |
| 8 — Voice Assistant Live Demo | 1:30 | ~185 |
| 9 — Autonomous Driving Demo | 1:00 | ~115 |
| 10 — Safety Systems | 0:45 | ~90 |
| 11 — Performance Results & Data | 1:00 | ~115 |
| 12 — Challenges & Lessons Learned | 0:45 | ~95 |
| 13 — Future Work | 0:30 | ~65 |
| 14 — Outro / Credits | 0:30 | ~70 |
| **Total** | **~14:00** | **~1,820** |
