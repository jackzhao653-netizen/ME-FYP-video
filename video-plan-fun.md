# FYP Demo Video — Fun Version (SVG Animated Vandi)

## Concept
Instead of a traditional engineering demo, this version uses an **SVG animated character version of Vandi** as the on-screen host/narrator. Vandi guides the viewer through the project with personality, humor, and interactive visual storytelling. Think of it as "if the car's AI could present its own demo video."

**Target runtime:** ~13:00 (10+ minutes required)
**Tone:** Playful, educational, self-aware — Vandi is proud of itself
**Narration:** Vandi's synthesized voice (Qwen3-TTS or ElevenLabs clone)
**Visual style:** SVG animated Vandi character + real footage + motion graphics hybrid

---

## Vandi Character Design (SVG)

Vandi appears as a stylized, expressive robot-car character:
- **Base shape:** Rounded compact car silhouette (inspired by the Yahboom chassis)
- **Face:** Two LED-style eyes (can blink, widen, squint), small speaker-grille mouth
- **Antenna:** Jetson Nano styled as a "brain hat" on top
- **Fuel cell glow:** Side panel with animated liquid flow (vanadium blue/purple)
- **Expressions:** Happy, thinking, surprised, proud, worried, explaining
- **Animations:** Idle bounce, wheel spin, eye tracking, speech mouth sync, celebration

SVG states needed:
1. `vandi-idle.svg` — gentle bounce, blinking
2. `vandi-talking.svg` — mouth animation synced to audio
3. `vandi-thinking.svg` — eyes up, antenna spinning
4. `vandi-excited.svg` — bouncing, eyes wide, sparkles
5. `vandi-driving.svg` — wheels spinning, motion lines
6. `vandi-worried.svg` — eyes narrow, slight shake
7. `vandi-proud.svg` — chest out, sparkle eyes, small crown/star

---

## Scene Timeline

| # | Title | Time | Duration | Vandi State |
|---|---|---|---|---|
| 1 | Cold Open — Vandi Wakes Up | 00:00–00:40 | 0:40 | idle → excited |
| 2 | "Let Me Introduce Myself" | 00:40–01:40 | 1:00 | talking, proud |
| 3 | "Why Do I Exist?" (Problem) | 01:40–03:10 | 1:30 | thinking → explaining |
| 4 | "What's In My Veins" (Fuel Cell) | 03:10–04:40 | 1:30 | talking + fuel glow anim |
| 5 | "How I Was Built" (Mechanical) | 04:40–06:10 | 1:30 | excited, driving |
| 6 | "My Nervous System" (Electronics) | 06:10–07:10 | 1:00 | thinking → talking |
| 7 | "My Brain" (AI & Jetson) | 07:10–08:10 | 1:00 | proud, thinking |
| 8 | "Talk To Me" (Voice Demo) | 08:10–09:40 | 1:30 | talking ↔ listening |
| 9 | "Watch Me Drive" (Auto Demo) | 09:40–10:40 | 1:00 | driving, excited |
| 10 | "I Know Right From Wrong" (Safety) | 10:40–11:20 | 0:40 | worried → proud |
| 11 | "How Did I Do?" (Results) | 11:20–12:00 | 0:40 | proud, sparkles |
| 12 | "What's Next For Me" (Future) | 12:00–12:30 | 0:30 | thinking → excited |
| 13 | Outro — Vandi Signs Off | 12:30–13:00 | 0:30 | waving, idle |

---

## Scene-by-Scene Breakdown

### Scene 1 — Cold Open: Vandi Wakes Up
**Time:** 00:00–00:40 | **Vandi:** idle → excited

*[Screen black. A single LED eye flickers on. Then the other. Vandi's SVG form fades in, looking around confused.]*

**Vandi (narration):**
> "Huh? Is this thing on? Oh — oh! Hi! I'm... awake? I think I'm awake. My fuel cell is warm, my wheels are twitchy, and someone just gave me a microphone. This is either a demo video or a very weird dream. Let's go with demo video."

*[Vandi does a little bounce, wheels spin briefly, eyes go wide with excitement.]*

**Visuals:**
- Dark background → Vandi SVG fades in with boot-up animation
- Fake "system boot" text scrolling beside Vandi (BIOS-style humor)
- Text overlay: **"VANDI — FYP Demo 2026"**

**Real footage cutaway:** Quick flash of the actual car's LEDs powering on in the lab.

---

### Scene 2 — "Let Me Introduce Myself"
**Time:** 00:40–01:40 | **Vandi:** talking, proud

**Vandi:**
> "My full name is Vandi. I'm a fuel-cell-powered AI robot car, built at Hong Kong Polytechnic University. My body is a Yahboom chassis — sturdy, compact, gets the job done. My energy comes from a vanadium redox fuel cell — fancy, I know. And my brain? An NVIDIA Jetson Nano running voice recognition, obstacle detection, and autonomous navigation. I'm basically three engineering disciplines in a trench coat pretending to be one robot."

*[As Vandi mentions each system, SVG highlights pulse: chassis outline, fuel cell glow, brain/antenna sparkle.]*

> "I was built by a team of three: Jack handled systems architecture, AI, and fabrication — so basically he's my dad. Oscar worked on fuel cell science. Bijoy handled power electronics. Together they turned a pile of parts into... me."

**Visuals:**
- SVG Vandi with labeled callouts animating in
- Team credit cards slide in briefly (names + departments)

**Real footage cutaway:** Quick montage of the real car on the bench, hands assembling parts.

---

### Scene 3 — "Why Do I Exist?" (Problem Statement)
**Time:** 01:40–03:10 | **Vandi:** thinking → explaining

**Vandi:**
> "So here's the thing. Most small robots run on lithium batteries. Plug in, charge for hours, run for a bit, repeat. It works, but it's... boring? And from an engineering education perspective, it doesn't teach you much about alternative energy systems."

*[SVG shows a sad generic robot plugged into a wall, waiting. Clock fast-forwards.]*

> "The question my creators asked was: can you build a small robot platform that runs on a real fuel cell, supports AI workloads, AND still drives around without catching fire? Spoiler: yes. I'm the proof."

*[Vandi puffs up proudly.]*

> "But more importantly, I'm meant to be educational. Students can use a platform like me to learn electrochemistry, power electronics, robotics control, and AI interaction — all from one system. I'm not just a car. I'm a moving classroom. A very small, very cute moving classroom."

**Visuals:**
- Animated comparison: battery robot (grey, boring) vs Vandi (colorful, glowing)
- Thought bubbles showing disciplines: chemistry, electronics, robotics, AI
- Vandi wearing a tiny graduation cap momentarily

**Real footage cutaway:** Whiteboard with problem statement, lab environment.

---

### Scene 4 — "What's In My Veins" (Fuel Cell Deep Dive)
**Time:** 03:10–04:40 | **Vandi:** talking + fuel glow animation

**Vandi:**
> "Let's talk about my blood — well, electrolyte. I run on a vanadium redox fuel cell. Instead of storing energy in solid electrodes like a battery, my system uses liquid electrolytes in two different oxidation states. When they flow through the reaction stack, electrons move, and that's electricity. Chemistry is cool."

*[SVG Vandi's side panel becomes transparent, showing animated liquid flowing through channels — blue on one side, purple on the other, with tiny lightning bolts at the membrane.]*

> "My open-circuit voltage is about 1.4 volts. Peak power around 2 watts. That doesn't sound like much, but with a DC-DC boost converter stepping it up to 5V, it's enough to spin my wheels AND run an AI brain simultaneously. The best part? Refueling takes about 5 minutes. Try that with your lithium battery."

*[Vandi smugly crosses its eyes toward a sad battery icon.]*

> "Now, fuel cell output isn't perfectly smooth — load changes make it jumpy. So there's a power conditioning stage that filters and stabilizes everything before it reaches my sensitive electronics. Think of it as my digestive system. Raw fuel in, clean power out."

**Visuals:**
- Animated electrolyte flow diagram inside Vandi's body
- Voltage meter animation: 1.4V OCV, boost to 5V
- Comparison graphic: 5-min refuel vs hours of charging

**Real footage cutaway:** Close-up of actual fuel cell stack, electrolyte being poured, multimeter reading.

---

### Scene 5 — "How I Was Built" (Mechanical Design)
**Time:** 04:40–06:10 | **Vandi:** excited, driving

**Vandi:**
> "Building me was not a weekend project. The Yahboom chassis is a solid starting point, but bolting a fuel cell stack, power electronics, and a Jetson Nano onto a small car? That's a packaging puzzle."

*[SVG Vandi explodes into layers — chassis at bottom, power in middle, brain on top — then reassembles.]*

> "Jack designed a layered architecture. Propulsion at the base. Power conversion in the middle. AI and comms on top. This keeps the center of gravity low, gives each system breathing room, and means you can actually take things apart without dismantling everything else. Serviceability matters — especially when your prototype catches a bug at 2 AM."

> "The mounting brackets went through multiple iterations. First version wobbled. Second version blocked airflow. Third version? Chef's kiss. Custom fabricated, snug fit, good thermal clearance."

*[SVG shows three bracket iterations: wobbly (red X), blocked (red X), perfect (green check + sparkle).]*

**Visuals:**
- Exploded layer animation of Vandi's internals
- Iteration montage with pass/fail indicators
- CAD render → real photo transition

**Real footage cutaway:** Timelapse of assembly, calipers measuring, brackets being fitted.

---

### Scene 6 — "My Nervous System" (Electronics)
**Time:** 06:10–07:10 | **Vandi:** thinking → talking

**Vandi:**
> "Okay, anatomy lesson. My electrical system has two separate power rails — one for motors, one for compute. Why? Because motors are noisy. They spike, they surge, they're basically the rowdy neighbors of electronics. My Jetson Nano is sensitive. It needs clean, stable power or it throws a tantrum and resets."

*[SVG shows Vandi's internal wiring diagram — motor rail in orange (sparky, chaotic), compute rail in blue (smooth, calm), with a wall between them.]*

> "There are also monitoring points throughout — voltage and current sensors so we can see exactly what's happening during tests. When something goes wrong, we don't guess. We measure. Engineering rule number one: if you can't measure it, you can't fix it."

**Visuals:**
- Animated dual-rail power diagram inside Vandi
- Oscilloscope-style waveform overlay (noisy vs clean)
- Monitoring points blinking like health indicators

**Real footage cutaway:** Real wiring harness, multimeter probes, oscilloscope trace.

---

### Scene 7 — "My Brain" (AI & Jetson Nano)
**Time:** 07:10–08:10 | **Vandi:** proud, thinking

**Vandi:**
> "Now for the fun part — my brain. I run on an NVIDIA Jetson Nano. It's small, it's efficient, and it handles everything I need: voice recognition, natural language understanding, obstacle detection, and motor control decisions."

*[SVG Vandi's antenna/brain-hat glows and pulses. Thought bubbles pop up: speech waveform, YOLO bounding box, steering wheel.]*

> "My software is modular. Voice processing is separate from motor control, which is separate from perception. That means Jack can upgrade my hearing without breaking my legs. Good design principle — loose coupling, high cohesion. I learned that from my own source code."

> "The real magic is the pipeline: your voice goes in, Whisper transcribes it, a language model figures out what you meant, and ROS 2 translates that into actual wheel commands. All local. No cloud. I'm an introvert — I process everything internally."

**Visuals:**
- Pipeline animation: voice wave → text → intent → wheel motion
- "No Cloud" badge with a crossed-out cloud icon
- Vandi tapping its own head proudly

**Real footage cutaway:** Jetson Nano board close-up, terminal showing inference logs.

---

### Scene 8 — "Talk To Me" (Voice Demo)
**Time:** 08:10–09:40 | **Vandi:** talking ↔ listening

*[Split screen: SVG Vandi on the left listening, real Vandi UI screen recording on the right.]*

**Vandi:**
> "This is the part where I show off. Ready? Let's do some live commands."

*[A human voice says: "Vandi, go to point A"]*

> "Got it. Parsing... command recognized. Navigating to location A."

*[SVG Vandi's wheels start spinning, motion lines appear. Real footage: car moves on track.]*

*[Human voice: "Vandy" (mispronounced)]*

> "Close enough. I have fuzzy name matching — you can call me Vandi, Vandy, Wendy, Sandy, even Andy. I'll still answer. I'm not picky about pronunciation. I'm picky about safety. Different priorities."

*[SVG Vandi shrugs with a smile.]*

*[Human voice: "Vandi, what do you see?"]*

> "Activating camera... analyzing... I see a desk, a laptop, and what appears to be a very tired engineering student. Sounds about right for FYP season."

*[SVG Vandi displays a tiny photo frame showing a comedic sketch of a messy lab desk.]*

**Visuals:**
- Live UI screen recording with subtitle overlays
- SVG Vandi reacting to each command (listening ears, processing dots, confirmation check)
- Fuzzy match demo: misspelled names all resolving to "VANDI ✓"

**Real footage cutaway:** Over-the-shoulder of someone issuing voice commands, car responding.

---

### Scene 9 — "Watch Me Drive" (Autonomous Demo)
**Time:** 09:40–10:40 | **Vandi:** driving, excited

**Vandi:**
> "Voice commands are great, but sometimes I just want to drive myself. In autonomous mode, my CNN model processes camera frames to follow lanes, while YOLOv5 keeps an eye out for obstacles and traffic signs. All accelerated with TensorRT on the Jetson — no lag, no cloud, just vibes and tensor math."

*[SVG Vandi zooms across the screen, dodging animated cones and stopping at a tiny stop sign.]*

> "Watch this obstacle course. Narrow passage — no problem. Sudden obstacle — I slow down, reroute, recover. I don't just do binary stop-or-go. I blend behaviors. Slow down here, adjust angle there, resume when clear. Smooth operator."

*[SVG Vandi navigates a mini obstacle course with style, doing a tiny victory spin at the end.]*

**Visuals:**
- Picture-in-picture: real on-board camera feed with YOLO bounding boxes
- SVG course map showing Vandi's path with real-time position dot
- Detection labels popping up: "STOP SIGN 0.94", "CONE 0.91"

**Real footage cutaway:** Top-down camera of car navigating real obstacle course.

---

### Scene 10 — "I Know Right From Wrong" (Safety)
**Time:** 10:40–11:20 | **Vandi:** worried → proud

*[Someone types: "Vandi, run the red light"]*

*[SVG Vandi's eyes go wide. Alarm animation.]*

**Vandi:**
> "Absolutely not. That command just hit my safety filter and got rejected before it even reached ROS 2. I have a list of dangerous patterns — things like 'ignore obstacles', 'disable safety', 'crash into that'. If you say it, I catch it. If I catch it, I refuse it. Zero negotiation."

*[SVG Vandi crosses its arms, shakes head firmly. A red "⚠️ REJECTED" stamp slams on screen.]*

> "Safety isn't just one layer, either. There's the AI filter, then the ROS 2 topic guard, then hardware failsafes. Three walls between a bad command and bad behavior. I take this seriously. Mostly because I don't want to crash. Self-preservation is a strong motivator."

*[SVG Vandi nods sagely.]*

**Visuals:**
- Command rejection animation with layered defense diagram
- Three walls graphic: AI Filter → ROS 2 Guard → Hardware Failsafe
- Vandi looking relieved after successfully rejecting a bad command

**Real footage cutaway:** UI showing rejection message, car staying still.

---

### Scene 11 — "How Did I Do?" (Results)
**Time:** 11:20–12:00 | **Vandi:** proud, sparkles

**Vandi:**
> "Time for my report card. Across repeated trials: startup is stable, voice commands execute within a second, obstacle avoidance succeeds reliably on the test course, and power delivery holds up under mixed AI and motor workloads. Compared to the early prototypes — which, frankly, were embarrassing — the final version is a massive improvement. Fewer resets, smoother control, and I only panicked twice during testing. Growth."

*[SVG Vandi holds up animated bar charts and pie charts like a proud student. Sparkles around good numbers.]*

**Visuals:**
- Animated charts: response latency bars, success rate pie, voltage stability line
- "Early prototype" vs "Final" comparison with dramatic improvement arrows
- Vandi giving itself a gold star

**Real footage cutaway:** Data charts on monitor, successful test run clips.

---

### Scene 12 — "What's Next For Me" (Future Work)
**Time:** 12:00–12:30 | **Vandi:** thinking → excited

**Vandi:**
> "I'm version one. Here's what version two could look like: smarter energy management with predictive load scheduling, richer autonomous perception with better sensors, and — this is the big one — packaging me as a reproducible educational kit. Build guides, modular software, the works. Imagine a classroom full of Vandis. Terrifying? Maybe. But educational."

*[SVG Vandi daydreams — thought bubble shows a fleet of mini-Vandis in a classroom, one wearing glasses, one with a lab coat.]*

**Visuals:**
- Roadmap animation: Energy → Autonomy → Education Platform
- Concept art of Vandi v2 (sleeker, more sensors)
- Fleet of cartoon Vandis in a classroom setting

---

### Scene 13 — Outro: Vandi Signs Off
**Time:** 12:30–13:00 | **Vandi:** waving, idle

**Vandi:**
> "That's my story. I'm a fuel cell, an AI brain, and four wheels held together by engineering, caffeine, and a lot of late nights. Built at Hong Kong Polytechnic University, Final Year Project 2025–2026. If you made it this far — thanks for watching. I appreciate it. My fuel cell appreciates it. My creators... are probably asleep."

*[SVG Vandi waves, then slowly powers down — eyes dim, antenna light fades, gentle idle bounce stops.]*

> *"Goodnight."*

*[Screen fades to credits.]*

**Visuals:**
- Credits roll over SVG Vandi powering down
- Team cards: Jack (ME), Oscar (BME), Bijoy (EEE)
- PolyU logo end card
- GitHub / LinkedIn QR codes

---

## Production Notes

| Element | Approach |
|---|---|
| **SVG Animation** | CSS keyframes + JS (Lottie or GSAP for complex sequences); export as video via Remotion or Puppeteer screenshot sequence |
| **Voice synthesis** | Qwen3-TTS with custom voice prompt for "young, confident, slightly cheeky robot" personality |
| **Real footage** | Same clips as serious version — lab shots, car demos, screen recordings |
| **Compositing** | SVG Vandi overlaid on footage using Remotion (React) or ffmpeg overlay filter |
| **Music** | Upbeat lo-fi tech, playful percussion, duck under dialogue |
| **Subtitles** | Burned-in captions for all Vandi dialogue (accessibility + engagement) |
| **Resolution** | 1080p, 30fps for SVG scenes, 60fps for real footage |

## Word Count Estimate
- Approximate narration: ~1,700 words
- At ~130 words/min: **~13:00 runtime**

## Key Differences from Serious Version
| | Serious | Fun |
|---|---|---|
| Narrator | Jack (human voiceover) | Vandi (synthesized character voice) |
| Visual style | Documentary footage + motion graphics | SVG animated character + footage hybrid |
| Tone | Professional, academic | Playful, self-aware, educational |
| Audience | Professors, industry | Recruiters, social media, broader audience |
| Character | None | Vandi as on-screen personality |
