# Task: Catalogue Extracted FYP Assets

## Objective
Go through all images in `/Users/jack/Documents/GitHub/ME-FYP-video/fyp-assets/extracted-docs/`, identify what each image contains, remove junk, rename useful ones with descriptive names, and create a searchable asset catalog.

## Source Folders & File Counts
- `ppts/` — 922 files (bulk extracted from PPT slide decks, MOST will be junk)
- `ppt-meeting3/` — 64 files (Meeting 3 PPT slides)
- `ppt-meeting2/` — 44 files (Meeting 2 PPT slides)
- `ppt-interim-final/` — 28 files (Interim report PPT)
- `ppt-2026-meeting1/` — 29 files (2026 Meeting 1 PPT)
- `ppt-meeting2.5/` — 23 files (Meeting 2.5 PPT)
- `reports/` — 103 files (report pages as images)
- `interim-report/` — 35 files (interim report pages)

## What to DELETE (move to trash)
- PPT template backgrounds, gradient fills, decorative shapes
- Tiny icons/bullets extracted as separate images (< 5KB usually junk)
- Duplicate or near-duplicate images
- Corrupted/blank images
- Generic clipart, stock arrows, transition graphics
- PolyU logo variants (keep ONE good one)

## What to KEEP & RENAME
Keep images that show actual project content:
- Vandi robot car photos (any angle, any stage of assembly)
- Fuel cell assembly/testing photos
- Circuit boards, wiring, PCB layouts
- System architecture diagrams
- CAD renders (SolidWorks)
- Code screenshots, terminal output
- Test results, graphs, charts
- Team photos
- Lab photos
- ROS node graphs
- YOLO detection screenshots
- Dashboard/UI screenshots
- Gantt charts, timelines
- Full PPT slides that contain useful diagrams

## Renaming Convention
`{category}-{description}.png`

Categories:
- `photo-` (real photographs)
- `diagram-` (architecture, flow, system diagrams)
- `cad-` (SolidWorks/CAD renders)
- `chart-` (graphs, data plots, performance curves)
- `screenshot-` (code, terminal, UI screenshots)
- `slide-` (full PPT slides worth keeping)
- `schematic-` (circuit schematics)

Examples:
- `photo-vandi-front-assembled.png`
- `diagram-system-architecture.png`
- `cad-chassis-exploded-view.png`
- `chart-fuel-cell-voltage-curve.png`
- `screenshot-ros-node-graph.png`
- `slide-project-timeline.png`
- `schematic-boost-converter.png`

## Output: Asset Catalog
Create `/Users/jack/Documents/GitHub/ME-FYP-video/fyp-assets/extracted-docs/ASSET-CATALOG.md` with:

```markdown
# FYP Asset Catalog

## Summary
- Total useful assets: X
- Deleted junk: Y
- Categories: ...

## Assets by Category

### Photos
| File | Description | Source | Tags |
|------|-------------|--------|------|
| photo-vandi-front-assembled.png | Front view of assembled Vandi robot | ppt-meeting3 | robot, assembly, front-view |

### Diagrams
...
```

## Strategy for the 922 ppts/ files
1. First pass: delete anything < 5KB (tiny extracted icons)
2. Second pass: check image dimensions — delete anything < 50x50 pixels
3. Third pass: visually inspect remaining by opening them — use `file` command to check actual dimensions
4. Keep full-slide images (typically 960x720 or 1280x720) that show useful content
5. Keep diagram/photo extracts that are meaningful

## Tools Available
- `file` command to check image type/dimensions
- `identify` (ImageMagick) if available for dimensions
- `sips` (macOS built-in) for image info: `sips -g pixelWidth -g pixelHeight file.png`
- `trash` command to safely delete (recoverable) — use `trash` not `rm`
- Standard shell tools (find, sort, wc, etc.)

## Important
- Use `trash` not `rm` — everything should be recoverable
- Work folder by folder, smallest first (ppt-meeting2.5 → ppt-meeting2 → ... → ppts last)
- The renamed files should stay in their original folders (don't move between folders)
- Create ASSET-CATALOG.md at the end with ALL kept assets
