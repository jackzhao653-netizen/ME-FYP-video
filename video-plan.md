# FYP Demo Video Plan — Vandi Fuel Cell Car

## Project Overview
- **Project title:** Design and Development of an Electric Toy Car Powered by a Fuel Cell Stack
- **Platform:** Yahboom robot car chassis
- **Energy system:** Custom-mounted vanadium redox fuel cell stack
- **AI system:** NVIDIA Jetson Nano running voice assistant **Vandi**
- **Core capabilities:** Voice chat, autonomous driving, obstacle avoidance, remote control
- **Lead role (Jack):** Systems Architect, AI & Fabrication Lead
- **Target runtime:** ~13:00 (10+ minutes required)
- **Narration pace target:** ~130 words/minute

## Scene Timeline

| Scene | Title | Timestamp | Duration |
|---|---|---|---|
| 1 | Cold Open / Hook | 00:00-00:30 | 0:30 |
| 2 | Intro — What is Vandi? | 00:30-01:30 | 1:00 |
| 3 | Problem Statement — Why Fuel Cells? | 01:30-03:00 | 1:30 |
| 4 | Fuel Cell Tech Deep Dive | 03:00-04:30 | 1:30 |
| 5 | Mechanical Design & Build | 04:30-06:00 | 1:30 |
| 6 | Electronics & Power System | 06:00-07:00 | 1:00 |
| 7 | AI Brain — Jetson Nano & Vandi | 07:00-08:00 | 1:00 |
| 8 | Voice Assistant Live Demo | 08:00-09:30 | 1:30 |
| 9 | Autonomous Driving Demo | 09:30-10:30 | 1:00 |
| 10 | Safety Systems | 10:30-11:15 | 0:45 |
| 11 | Performance Results & Data | 11:15-12:15 | 1:00 |
| 12 | Challenges & Lessons Learned | 12:15-13:00 | 0:45 |
| 13 | Future Work | 13:00-13:30 | 0:30 |
| 14 | Outro / Credits | 13:30-14:00 | 0:30 |

---

## Scene 1 — Cold Open / Hook
- **Timestamp:** 00:00-00:30
- **Duration:** 0:30

```text
Imagine a toy car that does not just run on a battery, but on a real fuel cell system, while talking back to you and driving itself around obstacles. This is Vandi: a compact electric robot car powered by a custom vanadium redox fuel cell stack, with an AI assistant running on Jetson Nano. In this video, I will show you the full engineering journey, from system design and fabrication to live voice control and autonomous navigation tests.
```

- **Visuals / Camera action:** Fast cinematic cuts: macro of wheels spinning, close-up of fuel stack tubing, Jetson Nano LEDs, then hero shot of full car moving toward camera; end on freeze-frame title.
- **On-screen text / overlays:** "FYP DEMO"; "Fuel Cell + AI + Robotics"; "Vandi Prototype v1".

| Image prompt (Nano Banana) |
|---|
| Cinematic low-angle close-up of a compact Yahboom robot car on a lab floor, carrying a custom vanadium redox fuel cell stack and a Jetson Nano board with glowing status LEDs, motion blur on wheels, dramatic side lighting, shallow depth of field, engineering lab background, high-detail documentary style, energetic and futuristic mood, 16:9 composition. |

- **B-roll / props needed:** Car on test track, fuel stack hardware, tubing, Jetson board, laptop with terminal.
- **Music / audio notes:** Start with rising cinematic pulse, subtle mechanical SFX; duck music under first spoken line.

## Scene 2 — Intro — What is Vandi?
- **Timestamp:** 00:30-01:30
- **Duration:** 1:00

```text
Hello, I am Jack, and this is my final year project: Design and Development of an Electric Toy Car Powered by a Fuel Cell Stack. I named this prototype Vandi. Vandi combines three systems into one platform. First, a mobile robotic chassis from Yahboom provides steering, drive motors, and modular mounting points. Second, a vanadium redox fuel cell stack supplies the primary electrical energy source. Third, a Jetson Nano serves as the AI brain, running speech interaction and decision logic. The result is not just a moving robot, but an integrated mechatronic system that can chat with users, switch between remote and autonomous control, and navigate while monitoring safety constraints. My role in this project covers system architecture, AI integration, electronics planning, and physical fabrication.
```

- **Visuals / Camera action:** Talking-head intro beside prototype; cut to labeled exploded views of subsystems; insert name badge lower-third for Jack.
- **On-screen text / overlays:** "Jack Zhao Xuecen"; "Systems Architect, AI & Fabrication Lead"; three-column labels: Chassis / Fuel Cell / AI Brain.

| Image prompt (Nano Banana) |
|---|
| Medium shot of a mechanical engineering student presenting a tabletop robot car prototype in a university lab, pointing at labeled components: Yahboom chassis, vanadium fuel cell stack, Jetson Nano. Soft key light on presenter, practical lab lights in background, clean documentary style, natural colors, confident educational mood, 16:9. |

- **B-roll / props needed:** Printed subsystem diagram, pointer, CAD screenshot, lab notebook.
- **Music / audio notes:** Transition to confident tech documentary bed, low volume under narration.

## Scene 3 — Problem Statement — Why Fuel Cells?
- **Timestamp:** 01:30-03:00
- **Duration:** 1:30

```text
Most small robot vehicles rely entirely on lithium batteries. Batteries are practical, but they also introduce limits in runtime strategy, recharge downtime, and sustainability considerations depending on use case. The key question for this project is: can we build a small educational robotic platform that demonstrates an alternative electrochemical power architecture while still supporting modern AI workloads? I selected a vanadium redox fuel cell concept because it offers a useful demonstration of energy conversion and modular energy storage. For students, this platform becomes more than a robot car. It becomes a moving lab for discussing electrochemistry, power electronics, robotics control, and human AI interaction in one system. So the design challenge is not only making the car move. The challenge is balancing energy source behavior, electrical stability, compute demand, mechanical packaging, and operational safety in a compact form factor.
```

- **Visuals / Camera action:** Start with battery-powered toy car footage, then overlay red X and cut to Vandi; infographic comparing battery-only vs fuel-cell-assisted architecture.
- **On-screen text / overlays:** "Design Question"; "Can fuel cell power a smart mobile robot?"; "Energy + Intelligence + Mobility".

| Image prompt (Nano Banana) |
|---|
| Split-scene educational visual: left side a standard battery toy car icon in muted tones, right side an advanced robot car with visible fuel cell stack and AI board in vibrant lighting; clean infographic-meets-realism style, top-down schematic overlays, university engineering presentation aesthetic, neutral lab background, 16:9. |

- **B-roll / props needed:** Battery packs, charging cable shots, whiteboard problem statement, comparative diagrams.
- **Music / audio notes:** Slightly analytical tone; add subtle whoosh transitions for infographics.

## Scene 4 — Fuel Cell Tech Deep Dive
- **Timestamp:** 03:00-04:30
- **Duration:** 1:30

```text
Let me break down how the fuel cell subsystem works in this prototype. The vanadium redox concept uses two electrolyte states that participate in reversible redox reactions. In full-scale systems, these electrolytes are stored in separate tanks and circulated through a reaction stack. For this educational prototype, the architecture is simplified and adapted for compact integration, but the same teaching principle remains: chemical state differences can be converted into electrical output through controlled electrochemical processes. From an engineering point of view, the fuel cell output is not perfectly constant under dynamic load changes. That is critical, because the drivetrain and Jetson Nano can create transient demand peaks. Therefore, I designed a power conditioning path that smooths supply behavior before it reaches sensitive electronics. This scene matters because it links chemistry to practical robotics. We are not using fuel cell theory in isolation. We are making it drive wheels, sensors, and AI inference in real time.
```

- **Visuals / Camera action:** Animated schematic of electrolyte flow and redox reaction; macro shot of stack channels; overlay arrows from chemistry to DC output to car motion.
- **On-screen text / overlays:** "Electrochemistry to Motion"; "Redox Reaction -> Electrical Output"; "Conditioning for Stable Supply".

| Image prompt (Nano Banana) |
|---|
| High-detail macro visualization of a compact vanadium redox fuel cell stack with translucent flow channels and glowing directional arrows showing electrolyte movement, layered with subtle engineering annotations, cool blue and amber lab lighting, technical documentary style, sharp focus on stack texture, 16:9. |

- **B-roll / props needed:** Stack close-ups, tubing, simplified animation slides, annotated equations.
- **Music / audio notes:** Minimal ambient synth; emphasize explanation clarity with lower music density.

## Scene 5 — Mechanical Design & Build
- **Timestamp:** 04:30-06:00
- **Duration:** 1:30

```text
Mechanical integration was one of the most important parts of this project. The Yahboom chassis gives a reliable starting structure, but the fuel cell stack and supporting hardware add mass, volume, and vibration sensitivity. I created a custom mounting layout to keep the center of gravity low and centered between the drive wheels. The stack bracket, electronics plate, and cable routing paths were iterated through rapid prototyping and fit checks. During fabrication, I focused on three goals: structural stability during movement, thermal and airflow clearance around compute and power components, and maintenance accessibility for troubleshooting. You can see that each subsystem has a defined zone: propulsion at the base, power conversion in the middle, and AI plus communication modules on the upper layer. This layered approach reduced interference, improved serviceability, and made the overall architecture easier to explain and replicate for future student teams.
```

- **Visuals / Camera action:** CAD-to-real transition; timelapse of assembly; close-ups of brackets and fasteners; handheld inspection pass around finished chassis.
- **On-screen text / overlays:** "Iteration 1 -> Iteration 2 -> Final"; "Center of Gravity Control"; "Serviceable Layout".

| Image prompt (Nano Banana) |
|---|
| Three-quarter view of a Yahboom robot chassis on a workbench with custom fabricated mounts holding a compact fuel cell stack and electronics layers, visible cable management, calipers and tools nearby, warm workshop lighting with cool fill, realistic engineering prototype photography style, focused and hands-on mood, 16:9. |

- **B-roll / props needed:** CAD renders, 3D printed/metal brackets, screw kits, hex tools, calipers.
- **Music / audio notes:** Rhythmic build montage beat; short impacts synced to assembly cuts.

## Scene 6 — Electronics & Power System
- **Timestamp:** 06:00-07:00
- **Duration:** 1:00

```text
Now let us look at the electrical architecture. The fuel cell output first enters the power conditioning stage, where regulation and filtering stabilize voltage before distribution. From there, separate rails feed the motor driver domain and the compute domain. Isolating these paths helps protect the Jetson Nano and sensor interfaces from motor noise and current spikes. I also implemented inline monitoring points so voltage and current can be observed during tests. Wiring decisions were documented to keep grounding strategy consistent and reduce troubleshooting time. In practical testing, this architecture improved startup reliability and reduced random resets compared to early prototypes. In short, electronics integration is the bridge between a promising energy concept and a robot that behaves reliably under real motion and AI workloads.
```

- **Visuals / Camera action:** Top-down wiring diagram animation, then real harness close-up with labels; multimeter and oscilloscope shots during load test.
- **On-screen text / overlays:** "Fuel Cell -> Conditioning -> Distribution"; "Motor Rail / Compute Rail"; "Measured Stability Gains".

| Image prompt (Nano Banana) |
|---|
| Top-down engineering shot of a compact robot car electronics deck with neatly labeled wires, DC-DC regulation modules, motor driver board, Jetson Nano power input lines, multimeter probes attached, clean bench environment, crisp neutral lighting, practical technical documentary look, 16:9. |

- **B-roll / props needed:** Schematic printout, power modules, oscilloscope capture, connectors.
- **Music / audio notes:** Keep beat light; allow room for technical narration.

## Scene 7 — AI Brain — Jetson Nano & Vandi
- **Timestamp:** 07:00-08:00
- **Duration:** 1:00

```text
At the intelligence layer, Jetson Nano runs Vandi, the onboard voice assistant and decision coordinator. Vandi is designed to parse user commands, return spoken responses, and trigger control actions through software modules connected to motion and sensing interfaces. The software stack is organized so perception, dialogue, and control remain modular. That means I can improve one capability without rebuilding the entire system. For example, voice intent classification can be updated independently of motor control logic. The Nano provides enough compute for this educational scope while keeping integration practical on a small platform. What makes Vandi valuable is not only speech output; it is the system-level role of turning human instructions into safe, trackable robot behaviors.
```

- **Visuals / Camera action:** Screen capture of software modules, terminal logs, microphone input waveform, then camera pan from Jetson board to moving car.
- **On-screen text / overlays:** "Vandi Core Modules"; "Voice Intent -> Action Pipeline"; "Modular AI Architecture".

| Image prompt (Nano Banana) |
|---|
| Close-up of NVIDIA Jetson Nano mounted on a small robot car, tiny cooling fan visible, code logs on adjacent monitor showing voice intents and control commands, blue-green monitor glow in dim lab, cinematic technical realism, focused innovation mood, 16:9. |

- **B-roll / props needed:** Jetson boot screen, code snippets, mic module, system diagram.
- **Music / audio notes:** Add subtle digital textures; keep speech intelligibility high.

## Scene 8 — Voice Assistant Live Demo
- **Timestamp:** 08:00-09:30
- **Duration:** 1:30

```text
Now I will demonstrate live voice interaction with Vandi. I will issue commands naturally, and Vandi will respond and execute linked behaviors. Vandi, introduce yourself. Vandi replies with system status and greeting. Next command: move forward slowly for two meters. The car begins controlled motion. Next: stop and rotate right thirty degrees. Motion controller executes and confirms completion. Next: what is your current power state? Vandi reports measured voltage and operating mode. This sequence shows three things: speech understanding, command-to-control translation, and feedback transparency. To make this robust, I tuned command grammar, added confirmation responses for safety-critical actions, and built fallback behavior when confidence scores are low. In the final system, voice is not a gimmick. It is a practical interface layer that makes the robot easier to operate, demonstrate, and extend for educational applications.
```

- **Visuals / Camera action:** Single-take over-the-shoulder demo with subtitles; cut-ins to wheel movement and terminal confirmations; reaction shot of presenter.
- **On-screen text / overlays:** Live captions of spoken commands; "Intent Confidence" meter; "Executed" badges.

| Image prompt (Nano Banana) |
|---|
| Over-the-shoulder live demo scene in an engineering lab: presenter speaking to a tabletop robot car while subtitles and command status overlays appear, car mid-motion with slight wheel blur, monitor showing voice intent confidence bars, clean modern documentary style, bright practical lighting, engaging and credible mood, 16:9. |

- **B-roll / props needed:** External mic, subtitle template, UI overlay assets, backup command cards.
- **Music / audio notes:** Lower background music during spoken demo; emphasize robot response audio.

## Scene 9 — Autonomous Driving Demo
- **Timestamp:** 09:30-10:30
- **Duration:** 1:00

```text
In autonomous mode, Vandi follows a predefined navigation routine while actively avoiding obstacles. The robot reads distance data, adjusts steering, and regulates speed to maintain stable movement through the test course. I configured this demo track to include narrow passages and sudden obstacles, which are common stress cases for small mobile platforms. As you watch, notice that behavior is not just binary stop or go. The controller blends slowdown, reroute, and recovery actions to keep progress smooth. This demonstrates that the project is not limited to voice interaction; it also supports independent operation with real-time sensing and control.
```

- **Visuals / Camera action:** Wide shot of full course, then top-down tracking shot; picture-in-picture sensor readouts as car avoids cones/boxes.
- **On-screen text / overlays:** "Autonomous Mode"; "Obstacle Detected"; "Reroute Executed".

| Image prompt (Nano Banana) |
|---|
| Wide overhead shot of a small autonomous robot car navigating a tabletop obstacle course with cones and boxes, path lines and sensor arcs overlaid, bright lab environment, clean educational robotics documentary style, dynamic but controlled motion feel, 16:9. |

- **B-roll / props needed:** Cones, cardboard obstacles, floor markers, top camera mount.
- **Music / audio notes:** Light tension rhythm; sync beats with successful avoidance moments.

## Scene 10 — Safety Systems
- **Timestamp:** 10:30-11:15
- **Duration:** 0:45

```text
Safety is built into both hardware and software layers. On hardware, I included protected power routing and emergency stop behavior through control gating. On software, command validation, confidence thresholds, and motion timeout checks prevent unsafe execution. If Vandi receives an ambiguous instruction, it asks for confirmation rather than acting blindly. During autonomous operation, sensor faults trigger conservative fallback behavior. These safeguards are essential because reliable engineering means predictable failure handling, not only successful nominal operation.
```

- **Visuals / Camera action:** Demonstrate emergency stop, confidence-failure prompt, and timeout halt; close-up of safety indicators.
- **On-screen text / overlays:** "Hardware Safeguards"; "Software Interlocks"; "Fail-Safe First".

| Image prompt (Nano Banana) |
|---|
| Dramatic close-up of a small robot car halting in front of an obstacle with red safety indicator overlay, engineer hand near emergency stop control, crisp lab lighting, serious and responsible engineering mood, realistic documentary frame, 16:9. |

- **B-roll / props needed:** E-stop trigger, warning labels, test checklist.
- **Music / audio notes:** Briefly mute music on emergency stop moment for impact.

## Scene 11 — Performance Results & Data
- **Timestamp:** 11:15-12:15
- **Duration:** 1:00

```text
To evaluate performance, I recorded key metrics across repeated trials. The dataset includes startup stability, command response latency, obstacle avoidance success rate, and power behavior under mixed workloads. Compared with early integration builds, the final prototype shows improved control consistency and fewer reset events during peak demand. Voice command execution remains responsive for demonstration use, and autonomous navigation completes the target course with repeatable behavior under controlled lab conditions. These results show that the architecture is not only conceptually interesting, but experimentally functional.
```

- **Visuals / Camera action:** Graphs animate in: latency bars, success-rate pie, voltage trend line; overlay footage of successful runs.
- **On-screen text / overlays:** "Validation Trials"; "Latency, Stability, Success Rate"; "Prototype v1 Results".

| Image prompt (Nano Banana) |
|---|
| Clean presentation frame showing an engineering student beside a monitor with charts for response latency, obstacle avoidance success, and voltage stability, while the robot car sits in foreground slightly out of focus, professional academic demo style, neutral color grading, clear and credible mood, 16:9. |

- **B-roll / props needed:** Data charts, trial logs, spreadsheet screenshots, benchmarking notes.
- **Music / audio notes:** Confident, optimistic background; avoid overpowering voice.

## Scene 12 — Challenges & Lessons Learned
- **Timestamp:** 12:15-13:00
- **Duration:** 0:45

```text
The biggest challenge was integration, not any single subsystem. Mechanical packaging, transient power behavior, and AI workload timing all affected each other. Early prototypes exposed issues like unstable mounting, noisy wiring paths, and inconsistent control responses under load. The key lesson is to iterate system-wide and test under realistic operating conditions early. Another lesson is to design for observability: when you can measure voltage, latency, and controller state, debugging becomes faster and decisions become evidence-based.
```

- **Visuals / Camera action:** Show failed prototype clips, then cut to fixed implementations; overlay lesson callouts.
- **On-screen text / overlays:** "Challenge: Integration Complexity"; "Lesson: Measure Everything"; "Iterate Fast, Validate Early".

| Image prompt (Nano Banana) |
|---|
| Workshop documentary shot with a prototype robot car partially disassembled, sticky notes listing issues, and revised components laid out neatly beside it, warm practical lighting with focused highlights, reflective engineering mood, realistic and grounded style, 16:9. |

- **B-roll / props needed:** Early prototype photos, issue tracker notes, revision parts.
- **Music / audio notes:** Slightly subdued reflective tone, then lift toward next scene.

## Scene 13 — Future Work
- **Timestamp:** 13:00-13:30
- **Duration:** 0:30

```text
Future work will focus on three directions. First, improve energy management with smarter load scheduling and deeper fuel cell diagnostics. Second, expand autonomous intelligence with richer perception and adaptive planning. Third, package Vandi as a reproducible educational platform, including build guides and modular software templates. The goal is to turn this prototype into a practical learning system for sustainable robotics.
```

- **Visuals / Camera action:** Forward-looking montage: roadmap board, upgraded sensor concepts, concept render of version 2.
- **On-screen text / overlays:** "Next: Smarter Energy"; "Next: Better Autonomy"; "Next: Education Platform".

| Image prompt (Nano Banana) |
|---|
| Futuristic concept shot of next-generation small fuel-cell robot car on a lab table with holographic-style roadmap overlays, additional sensors and cleaner modular enclosure design, hopeful morning light through windows, polished engineering concept art with realistic grounding, 16:9. |

- **B-roll / props needed:** Roadmap slide, concept sketches, proposed BOM updates.
- **Music / audio notes:** Inspirational build-up.

## Scene 14 — Outro / Credits
- **Timestamp:** 13:30-14:00
- **Duration:** 0:30

```text
Thank you for watching this demonstration of Vandi, my fuel-cell-powered AI robot car project. This work combines mechanical design, electrochemical energy systems, embedded computing, and intelligent control into one integrated platform. I hope this prototype shows how sustainable energy concepts and practical robotics can be developed together in an educational context. I am Jack, and this has been my final year project demonstration.
```

- **Visuals / Camera action:** Final hero shot with slow dolly out; project team/support credits roll over moving car footage.
- **On-screen text / overlays:** "Thank You"; "Jack Zhao Xuecen"; "Design + AI + Fabrication"; credits.

| Image prompt (Nano Banana) |
|---|
| Hero closing shot of a compact fuel-cell robot car and presenter standing behind it in a university engineering lab, soft cinematic backlight, gentle lens flare, clean credit-space composition, uplifting documentary finale mood, 16:9. |

- **B-roll / props needed:** Final polished car, clean background, credit list.
- **Music / audio notes:** Resolve with warm uplifting outro cue; fade to silence.

---

## Production Checklist
- Record A-roll narration in quiet room with lavalier or shotgun mic.
- Capture at least two angles for demos (wide + close).
- Log each take with scene number for faster post-production.
- Capture backup screen recordings for AI/terminal visuals.
- Keep command subtitles burned into proxy edits for review.

## Word Count Estimate
- Approximate narration words: **~1,820 words**
- At ~130 words/min, estimated spoken runtime: **~14:00**
