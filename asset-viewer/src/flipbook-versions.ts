export type FlipbookSceneV = {
  key: string;
  relativePath: string;
  caption: string;
  script: string;
  filmingNotes: string;
  audioPath?: string;
};

export type FlipbookVersion = {
  id: string;
  label: string;
  scenes: FlipbookSceneV[];
};

// V1: Documentary - Cinematic storytelling with emotional arc
const V1_DOCUMENTARY: FlipbookSceneV[] = [
  {
    key: 'crisis',
    relativePath: 'images/scene-01-cold-open.png',
    caption: 'The Clean Energy Crisis',
    script: 'Energy is the quiet bottleneck behind everything that moves. As transport and automation scale up, we keep hitting the same wall: heavy batteries, limited runtime, and long charging downtime. We wanted to ask a different question — what if a robot car could refuel instead of recharge, and do it cleanly? That question became our Final Year Project: Vandi — a fuel cell powered robot car with an AI assistant.',
    filmingNotes: 'Use `images/scene-01-cold-open.png` as the opener. Add quick B-roll overlays: traffic congestion, EV charging queues, and a simple animated stat card about transport emissions. Keep pacing fast (3–5 second cuts) and end on the project title: “Vandi”.'
  },
  {
    key: 'team-intro',
    relativePath: 'images/scene-02-intro.png',
    caption: 'Meet the Team',
    script: 'Vandi is an intersection of three worlds. Jack, Mechanical Engineering — chassis design, system integration, and the AI stack. Oscar, Biomedical Engineering — vanadium redox fuel cell chemistry and the electrochemical build. Bijoy, Electrical Engineering — power electronics, sensing, and motor control. Different disciplines, one shared goal: prove that clean energy and real robotics can live in the same machine.',
    filmingNotes: 'Use `images/scene-02-intro.png` as the visual bed. Add name/role lower-thirds. If you have any lab selfies or group shots in `extracted-docs/`, cut them in as quick flashes between introductions.'
  },
  {
    key: 'concept',
    relativePath: 'images/scene-03-problem.png',
    caption: 'The Vision Takes Shape',
    script: 'We set a clear target: build a small autonomous vehicle powered by a vanadium redox fuel cell, then give it an interface that feels human — voice commands, safety checks, and autonomous navigation. No vague “AI demo”, no simple RC car. A real system: power generation, power conversion, motor driving, and a software brain — all integrated into one platform we could test, measure, and improve.',
    filmingNotes: 'Use `images/scene-03-problem.png`. If you want extra cutaways, pull 1–2 “overview/architecture” style PPT slides from `extracted-docs/ppts/meeting1-*.png` or `extracted-docs/ppts/interim-*.png` for quick inserts while the script mentions integration.'
  },
  {
    key: 'fuel-cell-challenge',
    relativePath: 'images/scene-04-fuel-cell.png',
    caption: 'Oscar\'s Fuel Cell Journey',
    script: 'Oscar’s work started at the chemistry bench. In a vanadium redox system, you’re not just “building a battery” — you’re managing an electrochemical reactor. Electrolyte preparation, concentration control, membrane selection, sealing, and repeatability. Our benchmark was simple and unforgiving: a stable open-circuit voltage around 1.4 volts, using Nafion 117 as the membrane, and enough usable power to drive the rest of the robot through a conversion stage. Every test was a lesson: leaks, unstable voltage, and the reality that clean energy is still engineering-hard.',
    filmingNotes: 'Use `images/scene-04-fuel-cell.png`. Layer in close-ups: electrolyte mixing, a multimeter reading around 1.4V OCV, and hands assembling the cell. If you find clearer fuel-cell photos in `extracted-docs/ppts/meeting3-img-*.png`, swap them in as overlays.'
  },
  {
    key: 'circuits',
    relativePath: 'images/scene-06-electronics.png',
    caption: 'Bijoy\'s Power Challenge',
    script: 'A fuel cell gives us clean power — but not the voltage we need. Starting near 1.4 volts, we had to reach motor-level supply reliably, while keeping currents safe and measurable. Bijoy designed the power pathway: a DC-DC boost stage, current sensing, and motor driving through L298N drivers. This is where theory becomes noise, heat, and failure modes — so the design had to be robust enough to survive real load changes, startup surges, and the messy reality of a moving robot.',
    filmingNotes: 'Use `images/scene-06-electronics.png`. Capture macro shots of solder joints, current sensor wiring, and the L298N driver boards. If any circuit diagrams exist in `extracted-docs/ppts/meeting2-img-*.png`, use them as picture-in-picture during the “power pathway” explanation.'
  },
  {
    key: 'ai-brain',
    relativePath: 'images/scene-07-ai-brain.png',
    caption: 'Jack\'s AI Architecture',
    script: 'The “AI assistant” wasn’t a single model — it was an architecture. On the robot, ROS 2 Humble handled messaging and control. Whisper turned speech into text. An LLM layer interpreted intent, then ROS nodes translated that into safe motor commands. For perception, YOLOv5s ran on a Jetson Nano for lightweight, real-time detection. And to make it usable, a React dashboard exposed the system state — from command logs to sensor readings. The goal wasn’t just intelligence; it was a system that could be trusted.',
    filmingNotes: 'Use `images/scene-07-ai-brain.png`. Add screen recordings: `ros2 topic list`, node graph, and a Whisper transcription snippet. If you have a clean architecture slide in `extracted-docs/ppts/interim-*.png`, cut it in when you say “architecture”.'
  },
  {
    key: 'first-assembly',
    relativePath: 'images/scene-05-mechanical.png',
    caption: 'The First Assembly',
    script: 'Then came integration day — the moment everything stops being “a subsystem” and starts being one machine. Chassis, mounts, wiring routes, cable management, and the first time the fuel cell, boost converter, and Jetson all share the same space. When we powered on, we watched for the simplest signs of life: stable voltage, clean indicator LEDs, and motors that didn\'t brown out the system. It wasn\'t perfect — but it was real, and it was ours.',
    filmingNotes: 'Use `images/scene-05-mechanical.png`. Shoot a timelapse of assembly on a bench. Add a dramatic close-up of the first power-on: LED indicators, multimeter, and the team watching quietly before reacting.'
  },
  {
    key: 'voice-test',
    relativePath: 'images/scene-08-voice-demo.png',
    caption: 'First Words',
    script: 'The first time Vandi listened, it felt unreal. “Vandi, move forward.” Whisper transcribed the audio. The assistant parsed intent. ROS 2 published a velocity command. And the motors moved — not from a joystick, but from spoken language. In that moment, the project shifted from parts on a table to an interface you could talk to. It was the first glimpse of what we set out to build.',
    filmingNotes: 'Use `images/scene-08-voice-demo.png`. Record clean audio and show the on-screen transcript. Cut to the wheels moving and the team reacting. Keep this scene intimate and quiet, then let the motor sound sell the moment.'
  },
  {
    key: 'autonomous',
    relativePath: 'images/scene-09-auto-driving.png',
    caption: 'Autonomous Navigation',
    script: 'Voice control is powerful — but autonomy is the real test. With YOLOv5s running on the Jetson Nano, Vandi could detect features on a track and make steering decisions in real time. The loop was simple: camera in, detections out, steering command, repeat — but getting it stable meant tuning thresholds, handling bad frames, and respecting the limits of our power system. When it finally held a path without human input, it proved the platform could think and move on its own.',
    filmingNotes: 'Use `images/scene-09-auto-driving.png`. Show a split-screen: onboard view + external tracking shot. Overlay detection boxes briefly (2–3 seconds) so it reads as “real perception”, not a slideshow.'
  },
  {
    key: 'safety',
    relativePath: 'images/scene-10-safety.png',
    caption: 'Safety First',
    script: 'We treated safety as a feature, not an afterthought. Commands were validated before reaching the motors — anything unsafe was rejected. Oscar monitored cell voltage to avoid over-discharge and unstable operation. Bijoy enforced current limits to protect drivers and wiring. In a system that mixes chemistry, electronics, and autonomy, “fail safe” isn\'t a slogan — it\'s a requirement.',
    filmingNotes: 'Use `images/scene-10-safety.png`. Demo an intentionally dangerous prompt being rejected on-screen. Cut to quick inserts: voltage monitoring, current readout, and an emergency stop if available.'
  },
  {
    key: 'testing',
    relativePath: 'images/scene-11-results.png',
    caption: 'Rigorous Testing',
    script: 'From there, the project became measurement. Fuel cell curves, boost converter behavior under load, motor current profiles, voice-command latency, and autonomous stability. Not every test was a success — but each one narrowed uncertainty. We learned to log everything, to repeat runs, and to treat every failure as data. That\'s what turned Vandi from a prototype into a system we could explain and defend.',
    filmingNotes: 'Use `images/scene-11-results.png`. Add a montage rhythm: clip → chart → hands adjusting → clip. If you have clearer charts in `extracted-docs/ppts/interim-*.png` or `extracted-docs/ppts/meeting3-*.png`, overlay them for 1–2 beats each.'
  },
  {
    key: 'reflection',
    relativePath: 'extracted-docs/ppts/meeting1-21.png',
    caption: 'What We Learned',
    script: 'What surprised us most wasn\'t a specific algorithm or circuit — it was the collaboration. Mechanical constraints changed electrical routing. Electrical limits shaped software safety. Chemistry realities reshaped the whole power plan. We learned how to integrate, how to debug as a team, and how to keep moving when the first solution fails. We started as students with a concept. We ended with a robot we could power, command, and test.',
    filmingNotes: 'Use `extracted-docs/ppts/meeting1-21.png` as a “team / process” slide. If this slide isn\'t a good fit visually, pick another strong “summary/teamwork” slide from `extracted-docs/ppts/meeting1-*.png`. Optionally add short A-roll soundbites from each member (one sentence each) over B-roll.'
  },
  {
    key: 'future',
    relativePath: 'images/scene-14-outro.png',
    caption: 'The Road Ahead',
    script: 'Vandi is one robot — but the idea scales. Fuel-cell powered mobile systems that refuel quickly, run longer, and emit only water at the point of use. A voice interface that makes robotics more accessible. And an autonomy stack that can grow with better sensors and compute. This project proved a core truth: clean power and intelligent machines don\'t compete. Together, they define what comes next.',
    filmingNotes: 'Use `images/scene-14-outro.png`. Finish with a hero shot and slow music lift. End on a clean title card: “Vandi — Fuel Cell Powered Robot Car with AI Assistant”.'
  }
];

// V2: Problem-Solution - Academic structure
const V2_PROBLEM_SOLUTION: FlipbookSceneV[] = [
  {
    key: 'problem',
    relativePath: 'extracted-docs/ppts/interim-06.png',
    caption: 'Problem Statement',
    script: 'Mobile robots keep getting smarter, but their energy systems are still the bottleneck. Most small platforms rely on lithium batteries: you get a limited runtime, then you wait hours to recharge, and at end-of-life you have recycling and safety concerns. For continuous operation—like campus delivery, labs, or indoor logistics—downtime becomes the constraint. Our project, Vandi, asks a different question: can an autonomous robot be powered by a clean electrochemical source that can be refueled quickly, while still supporting modern AI features like voice commands and real-time perception?',
    filmingNotes: 'Use `extracted-docs/ppts/interim-06.png` (environment/sustainability background). Overlay 2–3 fast stat cards: “limited runtime”, “recharge downtime”, “battery end-of-life”. End on the title “Vandi: Fuel Cell Powered Robot Car with AI”.'
  },
  {
    key: 'literature',
    relativePath: 'extracted-docs/reports/pdf-pages/page-06.png',
    caption: 'Literature Review',
    script: 'In the literature, vanadium redox systems are attractive because the chemistry is reversible and the active species stays in solution, supporting long cycle life and fast “refueling” by replacing electrolyte. On the robotics side, ROS 2 Humble is a standard middleware for modular, real-time control—letting perception, planning, and motor control run as separate nodes. And for on-device AI, lightweight models like YOLOv5s can run real-time detection on embedded GPUs like Jetson Nano. Our approach builds directly on those ideas: clean electrochemistry for power, ROS 2 for architecture, and edge AI for autonomy and interaction.',
    filmingNotes: 'Use `extracted-docs/reports/pdf-pages/page-06.png` (report literature/background). Add quick callouts highlighting “VRFB”, “ROS 2”, and “edge AI on Jetson Nano”. If text is dense, zoom into key paragraphs and animate highlight boxes.'
  },
  {
    key: 'objectives',
    relativePath: 'extracted-docs/ppts/interim-09.png',
    caption: 'Project Objectives',
    script: 'We defined three measurable objectives. First, build a vanadium redox single-cell stack that consistently reaches about 1.4 volts open-circuit using a Nafion 117 membrane, and is mechanically stable with no leakage. Second, design the electronics to take that low-voltage source and drive a robot reliably—power management, sensing, and bidirectional motor control through an L298N stage. Third, deliver an AI interface that feels usable: voice commands transcribed by Whisper, intent parsing, safety checks, and autonomous navigation using a ROS 2 Humble stack with real-time vision on a Jetson Nano.',
    filmingNotes: 'Use `extracted-docs/ppts/interim-09.png` (fuel-cell objectives slide) and overlay your own 3-objective titles. On the “1.4V OCV / Nafion 117” line, briefly cut to a close-up photo of membrane if desired.'
  },
  {
    key: 'methodology',
    relativePath: 'extracted-docs/ppts/meeting2-img-067.png',
    caption: 'Design Methodology',
    script: 'We followed a modular systems engineering process with three parallel tracks: electrochemistry, electronics, and software. Each track had defined interfaces—voltage/current targets for the power chain, mechanical packaging constraints, and ROS 2 message contracts between nodes. We ran weekly integration checkpoints where we combined one layer at a time: first fuel cell characterization, then power conversion under load, then motor driving, and only then perception and voice control. That sequencing mattered, because it let us isolate failures—like voltage sag or noise coupling—before blaming “AI” or “chemistry” broadly.',
    filmingNotes: 'Use `extracted-docs/ppts/meeting2-img-067.png` (team workflow/integration flowchart). Animate the three lanes converging, then overlay a simple “Test → Fix → Repeat” loop.'
  },
  {
    key: 'fuel-cell-design',
    relativePath: 'images/scene-04-fuelcell.png',
    caption: 'Fuel Cell Subsystem',
    script: 'Oscar’s subsystem is a single-cell vanadium redox stack. The Nafion 117 membrane separates the two half-cells, allowing ionic transport while reducing crossover. Graphite felt electrodes increase effective surface area for the redox reactions. The performance benchmark we used throughout the project is open-circuit voltage: around 1.4 volts when the cell is healthy and properly assembled. In practice, getting that number reliably is an engineering problem—electrolyte concentration, sealing pressure, gasket integrity, and repeatable assembly all matter as much as the chemistry itself.',
    filmingNotes: 'Use `images/scene-04-fuelcell.png` as the base. For real documentation inserts, cut to: `extracted-docs/ppt-meeting2/img-020.jpg` (membrane close-up) and `extracted-docs/ppt-meeting2/img-026.jpg` (fuel cell stack hardware).'
  },
  {
    key: 'power-system',
    relativePath: 'extracted-docs/ppt-meeting2/img-068.png',
    caption: 'Power Management',
    script: 'Bijoy’s job was to make 1.4 volts usable. The power architecture starts with the fuel cell as the primary source, with a small lithium backup to handle transients and keep compute stable during mode switches. A boost conversion stage raises the low-voltage rail to the motor domain, and the L298N H-bridge provides bidirectional motor drive with PWM speed control. Current sensing lets us log power draw in real time and enforce limits, so the system can protect itself instead of brownout-resetting every time the robot accelerates.',
    filmingNotes: 'Use `extracted-docs/ppt-meeting2/img-068.png` (power block diagram). As picture-in-picture, add: `extracted-docs/ppt-meeting2/img-056.png` (PCB module) or any clear driver board macro shot if available.'
  },
  {
    key: 'mechanical',
    relativePath: 'extracted-docs/ppts/interim-13.png',
    caption: 'Mechanical Design',
    script: 'On the mechanical side, the chassis had to be compact, serviceable, and integration-friendly. We used a modular layout so the fuel cell stack, reservoirs, electronics, and Jetson Nano could be mounted and removed without rebuilding the whole platform. Weight distribution and wiring routes were planned from the start, because power electronics and fluid handling can’t be treated like an afterthought. The final design supports differential control, stable mounting points, and practical access for refueling and debugging during lab tests.',
    filmingNotes: 'Use `extracted-docs/ppts/interim-13.png` (CAD of Vandi). Add a quick cutaway to `extracted-docs/ppts/interim-14.png` showing parts-to-assembly progression.'
  },
  {
    key: 'ros-architecture',
    relativePath: 'extracted-docs/ppts/interim-10.png',
    caption: 'Software Architecture',
    script: 'The software stack is organized around ROS 2 Humble. We split the system into nodes: motor control, safety supervisor, vision inference, and the assistant interface. Voice input is transcribed with Whisper, then an intent layer converts natural language into structured commands, which are validated before becoming ROS velocity messages. For perception, the Jetson Nano runs YOLOv5s to detect track features and objects, feeding a control node that turns detections into steering actions. The key idea is separation of concerns: perception can fail without disabling safety, and voice can be turned off while autonomy still works.',
    filmingNotes: 'Use `extracted-docs/ppts/interim-10.png` (operational flow block diagram). For the assistant, optionally cut to `extracted-docs/interim-report/img-024.png` (voice pipeline) or `extracted-docs/interim-report/img-023.png` (chat UI screenshot).'
  },
  {
    key: 'voice-system',
    relativePath: 'extracted-docs/interim-report/img-023.png',
    caption: 'Voice Control Implementation',
    script: 'Our voice control pipeline is deliberately conservative. First, Whisper performs speech-to-text. Second, we extract intent—what action the user actually wants. Third, we run a safety validation step that checks for unsafe patterns and rejects commands that would exceed limits or disable protection. Only then do we publish ROS 2 actions to the motor controller. This design matters because “natural language” is ambiguous: we want the robot to feel conversational, but we also need predictable behavior. In demos, this is where you see the assistant say “I can’t do that” instead of blindly executing.',
    filmingNotes: 'Use `extracted-docs/interim-report/img-023.png` (AI assistant UI). For the safety layer, cut to `extracted-docs/interim-report/img-027.png` (safe patterns) and `extracted-docs/interim-report/img-028.png` (dangerous patterns) as quick inserts.'
  },
  {
    key: 'autonomous',
    relativePath: 'extracted-docs/interim-report/img-015.jpg',
    caption: 'Autonomous Navigation',
    script: 'For autonomy, the Jetson Nano runs YOLOv5s-based perception in a tight loop: camera frame in, detections out, then a control node converts those detections into steering and speed commands. We tuned control behavior using a simple feedback controller so the robot corrects toward the lane center while respecting speed limits and safety thresholds. The important point isn’t just that it “detects”—it’s that the perception output is stable enough to drive the robot smoothly, even when frames are noisy or lighting changes on the test track.',
    filmingNotes: 'Use `extracted-docs/interim-report/img-015.jpg` (inference screenshot with bounding boxes). For data collection context, add `extracted-docs/ppt-meeting3/img-026.png` (track photo) as a short cutaway.'
  },
  {
    key: 'integration',
    relativePath: 'extracted-docs/interim-report/img-005.jpg',
    caption: 'System Integration',
    script: 'Integration is where the real problems show up. Fuel cell output isn’t a perfect DC supply, so voltage sag and ripple have to be managed before compute and motors share the same rail. We also had packaging challenges: tubing routes, sealing surfaces, and cable strain relief—all under vibration. One of the most visible integration failures was leakage: a small seal issue can end an entire test session. That’s why we treated mechanical sealing, power conditioning, and software safety as one integrated reliability problem, not three separate tasks.',
    filmingNotes: 'Use `extracted-docs/interim-report/img-005.jpg` (leak/staining close-up) as the “integration pain” visual. Optionally follow with `extracted-docs/interim-report/img-006.jpg` (disassembled enclosure parts) to show iteration.'
  },
  {
    key: 'testing-protocol',
    relativePath: 'extracted-docs/ppt-meeting2/img-068.jpg',
    caption: 'Testing Protocol',
    script: 'We tested at three levels: component, subsystem, and full system. On the electrochemistry side, we recorded polarization curves to understand where voltage collapses under load and what limits current density. On the electronics side, we checked boost stability during motor transients and logged current draw. On the AI side, we validated perception and voice interactions in repeatable lab conditions, then re-tested under more realistic noise and lighting. The rule was simple: if we can’t measure it and repeat it, we don’t claim it works.',
    filmingNotes: 'Use `extracted-docs/ppt-meeting2/img-068.jpg` (test track photo) as the “system test” visual. For fuel cell characterization, cut in `extracted-docs/ppt-meeting2/img-001.png` (polarization curve plot).'
  },
  {
    key: 'results-power',
    relativePath: 'extracted-docs/ppt-meeting2/img-001.png',
    caption: 'Power System Results',
    script: 'On the fuel cell side, our baseline health metric is open-circuit voltage, and we targeted around 1.4 volts OCV with a Nafion 117 membrane. Under load, we evaluated performance using polarization curves—voltage and power density as a function of current density—to identify the operating region before the sharp drop-off at high current. These plots are what turn “it lights an LED” into engineering evidence: you can compare repeatability across runs, see how chemistry changes affect peak power, and decide what the power electronics must tolerate.',
    filmingNotes: 'Use `extracted-docs/ppt-meeting2/img-001.png` (polarization/performance plot). Add a small overlay label: “OCV ≈ 1.4 V (target)” and “operating region vs. limiting current”.'
  },
  {
    key: 'results-ai',
    relativePath: 'extracted-docs/interim-report/img-011.png',
    caption: 'AI System Results',
    script: 'For the AI stack, we evaluated both training quality and real-time usability. The YOLOv5s training curves show convergence of loss terms and improvements in precision, recall, and mAP across epochs—evidence that the model learned consistent features rather than memorizing noise. In deployment, what matters is responsiveness: the Jetson Nano has to run inference quickly enough that control feels continuous, and the voice stack has to respond fast enough that commands don’t feel delayed. This is why we report both metrics plots and live inference screenshots: one proves learning, the other proves integration.',
    filmingNotes: 'Use `extracted-docs/interim-report/img-011.png` (training metrics panel). Follow with a 1–2 second cut to `extracted-docs/interim-report/img-016.jpg` (real-time detection screenshot) to connect training → deployment.'
  },
  {
    key: 'discussion',
    relativePath: 'extracted-docs/ppts/interim-08.png',
    caption: 'Discussion',
    script: 'Overall, the results show feasibility: a fuel-cell-powered robot can be integrated with a modern AI software stack, but the constraints are real. Power density and voltage stability are still the limiting factors, which is why the electronics must include buffering and safe mode switching. On the AI side, perception can be robust, but voice accuracy drops as background noise increases—so safety validation and clear fallback behaviors are essential. The next engineering steps are straightforward: scale power by stacking cells, improve sealing and packaging for leak resistance, and harden the assistant with better noise handling and tighter ROS 2 state supervision.',
    filmingNotes: 'Use `extracted-docs/ppts/interim-08.png` (objectives/AI slide) as a discussion anchor. Add an on-screen “Future Work” list: “stack cells”, “better sealing”, “noise-robust voice”, “ROS 2 safety state machine”.'
  },
  {
    key: 'conclusion',
    relativePath: 'extracted-docs/ppts/interim-03.png',
    caption: 'Conclusion',
    script: 'Vandi demonstrates a complete interdisciplinary prototype: vanadium redox electrochemistry for clean power, an electronics layer that makes low-voltage output usable for motors and compute, and a ROS 2 Humble software stack that supports both voice interaction and autonomous behavior on embedded hardware. The project’s main contribution is not a single subsystem—it’s the integration strategy that keeps chemistry, electronics, and AI from fighting each other. With improved power scaling and packaging, this approach can evolve into longer-runtime, fast-refueling mobile robots that are easier to operate and safer to deploy.',
    filmingNotes: 'Use `extracted-docs/ppts/interim-03.png` (team/roles slide) as the closing “credit” visual. Optionally crossfade into `images/scene-14-outro.png` if you want a hero ending.'
  }
];

// V3: Build Log - Behind-the-scenes journey
const V3_BUILD_LOG: FlipbookSceneV[] = [
  {
    key: 'day1',
    relativePath: 'svg/storyboard-v3-scene-01.svg',
    caption: 'Day 1: Kickoff',
    script: 'September 2025. Three strangers meet in the robotics lab. Jack brings CAD skills, Oscar knows chemistry, Bijoy understands circuits. We sketch ideas on a whiteboard. Someone says "fuel cells" and we all lean in. This could work.',
    filmingNotes: 'Raw footage: first meeting, whiteboard brainstorming, excited discussions'
  },
  {
    key: 'ordering',
    relativePath: 'svg/storyboard-v3-scene-02.svg',
    caption: 'Parts Arrive',
    script: 'Two weeks of waiting. Finally, boxes arrive. Nafion membrane from Sigma-Aldrich. Jetson Nano from NVIDIA. Motors, sensors, wires. We spread everything on the lab bench like kids on Christmas morning. Time to build.',
    filmingNotes: 'Unboxing footage, parts laid out, checking components against BOM'
  },
  {
    key: 'first-cell',
    relativePath: 'svg/storyboard-v3-scene-03.svg',
    caption: 'Oscar\'s First Cell',
    script: 'Oscar assembles the first fuel cell. Graphite felt, membrane, acrylic housing. He fills it with electrolyte, connects the multimeter. 0.3V. Not enough. He adjusts the concentration, tries again. 0.8V. Better. Third attempt: 1.4V. He pumps his fist.',
    filmingNotes: 'Time-lapse: Oscar working alone in lab, multiple attempts, breakthrough moment'
  },
  {
    key: 'wiring-chaos',
    relativePath: 'svg/storyboard-v3-scene-04.svg',
    caption: 'Wiring Nightmare',
    script: 'Bijoy stares at a rat\'s nest of wires. Red to positive, black to ground, but which ground? The motor driver smokes. He sighs, grabs a fresh one, starts over. This time with a proper wiring diagram. Slowly, methodically, it comes together.',
    filmingNotes: 'Real footage: messy breadboard, smoke incident, Bijoy\'s frustrated face, cleanup'
  },
  {
    key: 'code-debug',
    relativePath: 'svg/storyboard-v3-scene-05.svg',
    caption: 'Late Night Debugging',
    script: '2 AM. Jack hunts a bug. The robot turns left when commanded right. He adds print statements, checks motor polarity, reviews ROS node connections. Coffee number four. Finally spots it: swapped GPIO pins. One line fix. He laughs at the ceiling.',
    filmingNotes: 'Night footage: Jack alone with laptop, empty coffee cups, eureka moment'
  },
  {
    key: 'leak',
    relativePath: 'svg/storyboard-v3-scene-06.svg',
    caption: 'The Leak',
    script: 'Purple electrolyte pools under the fuel cell. Oscar\'s face falls. The membrane seal failed. He disassembles everything, cleans the mess, orders better gaskets. Three days lost. But that\'s engineering - two steps forward, one step back.',
    filmingNotes: 'Disaster footage: purple stain, cleanup, Oscar\'s reaction, ordering new parts'
  },
  {
    key: 'integration',
    relativePath: 'svg/storyboard-v3-scene-07.svg',
    caption: 'Integration Day',
    script: 'All three subsystems ready. We gather around the chassis. Fuel cell bolted down, circuits connected, Jetson mounted. Oscar activates the cell. Bijoy checks voltages. Jack launches ROS. Green lights everywhere. We hold our breath.',
    filmingNotes: 'Real-time: team working together, tension building, first power-on'
  },
  {
    key: 'first-move',
    relativePath: 'svg/storyboard-v3-scene-09.svg',
    caption: 'It Moves!',
    script: 'Jack types the command. Motors whir. Vandi rolls forward half a meter and stops. We erupt. High-fives all around. It actually works. Months of theory, weeks of building, hours of debugging - all worth it for this moment.',
    filmingNotes: 'Celebration footage: first successful movement, team reactions, pure joy'
  },
  {
    key: 'voice-fail',
    relativePath: 'svg/storyboard-v3-scene-10.svg',
    caption: 'Voice Control Fails',
    script: 'Jack: "Vandi, move forward." Nothing. Again: "Move forward." Still nothing. He checks the mic, restarts Flask, reviews logs. The Whisper model is timing out. He reduces the audio buffer size. Try again. "Move forward." Vandi moves. Finally.',
    filmingNotes: 'Troubleshooting montage: failed attempts, log analysis, successful retry'
  },
  {
    key: 'demo-day',
    relativePath: 'svg/storyboard-v3-scene-17.svg',
    caption: 'Demo Day Success',
    script: 'Professors gather. We\'re nervous. Jack gives the voice command. Vandi responds. Oscar explains the fuel cell chemistry. Bijoy walks through the power system. Autonomous mode: Vandi navigates the track flawlessly. Applause. We did it.',
    filmingNotes: 'Demo footage: presentation, live demo, professor questions, team presenting'
  }
];

// V4: Technical Deep Dive - For engineering professors
const V4_TECHNICAL: FlipbookSceneV[] = [
  {
    key: 'electrochemistry',
    relativePath: 'svg/storyboard-v4-scene-01.svg',
    caption: 'Vanadium Redox Chemistry',
    script: 'The vanadium redox system exploits four oxidation states: V2+/V3+ at the anode, VO2+/VO2+ at the cathode. Standard potential: 1.26V. Nernst equation predicts OCV of 1.4V at our concentrations. Nafion 117 membrane provides proton conductivity while preventing crossover.',
    filmingNotes: 'Animated chemical equations, Nernst equation derivation, membrane structure diagram'
  },
  {
    key: 'cell-design',
    relativePath: 'svg/storyboard-v4-scene-03.svg',
    caption: 'Cell Architecture',
    script: 'Single-cell design with 25 square centimeter active area. Graphite felt electrodes provide 0.5 square meters per gram surface area. Flow-through configuration at 50 milliliters per minute. Acrylic housing with PTFE gaskets. Target current density: 80 milliamps per square centimeter.',
    filmingNotes: 'CAD cross-section, material specifications, flow simulation visualization'
  },
  {
    key: 'power-topology',
    relativePath: 'svg/storyboard-v4-scene-04.svg',
    caption: 'Boost Converter Design',
    script: 'Synchronous boost topology using TPS61088. Input: 0.8-1.4V. Output: 12V regulated. Switching frequency: 1.2 MHz. Inductor: 4.7 microhenries. Output capacitor: 220 microfarads. Efficiency peaks at 85% at 1.5 watts. Thermal design handles 2 watts dissipation.',
    filmingNotes: 'Circuit schematic with component values, efficiency curve, thermal simulation'
  },
  {
    key: 'motor-control',
    relativePath: 'svg/storyboard-v4-scene-05.svg',
    caption: 'H-Bridge Motor Driver',
    script: 'L298N dual H-bridge provides bidirectional control for two motors. PWM frequency: 20 kHz. Current sensing via 0.5 ohm shunt resistors. Flyback diodes protect against inductive kickback. Thermal shutdown at 145 celsius. Maximum continuous current: 2 amps per channel.',
    filmingNotes: 'H-bridge operation animation, PWM waveforms, current sensing circuit'
  },
  {
    key: 'ros-architecture',
    relativePath: 'images/scene-03-arch.png',
    caption: 'ROS 2 Node Graph',
    script: 'Seven ROS 2 nodes communicate via DDS middleware. Motor controller node publishes at 50 Hz. Vision node processes frames at 15 Hz. Voice command node operates asynchronously. Parameter server maintains configuration. TF2 handles coordinate transforms. QoS profiles ensure reliable delivery.',
    filmingNotes: 'Animated node graph, message flow visualization, timing diagram'
  },
  {
    key: 'whisper-model',
    relativePath: 'svg/storyboard-v4-scene-06.svg',
    caption: 'Speech Recognition Pipeline',
    script: 'Whisper tiny model: 39 million parameters, 74 MB. Runs on CPU at 2.3x real-time. 16 kHz audio input, 480-sample chunks. Mel spectrogram preprocessing. Transformer encoder-decoder architecture. Beam search decoding with width 5. Average latency: 450 milliseconds.',
    filmingNotes: 'Model architecture diagram, spectrogram visualization, latency breakdown'
  },
  {
    key: 'yolo-architecture',
    relativePath: 'svg/storyboard-v4-scene-07.svg',
    caption: 'YOLOv5 Object Detection',
    script: 'YOLOv5s: 7.2 million parameters. CSPDarknet53 backbone. PANet neck. Three detection heads at different scales. Input: 640x640 RGB. Output: bounding boxes with class probabilities. Inference: 67 milliseconds on Jetson Nano. mAP: 37.4 on COCO dataset.',
    filmingNotes: 'Network architecture diagram, feature map visualization, detection examples'
  },
  {
    key: 'pid-control',
    relativePath: 'svg/storyboard-v4-scene-08.svg',
    caption: 'Lane Following Control',
    script: 'PID controller maintains lane center. Proportional gain: 0.8. Integral gain: 0.1. Derivative gain: 0.3. Error signal: lateral deviation in pixels. Output: steering angle. Update rate: 20 Hz. Tuned using Ziegler-Nichols method. Steady-state error: under 2 centimeters.',
    filmingNotes: 'PID equation, tuning process, response curves, error plots'
  },
  {
    key: 'power-analysis',
    relativePath: 'svg/storyboard-v4-scene-09.svg',
    caption: 'Power Budget Analysis',
    script: 'Total system power: 8.5 watts. Motors: 6 watts peak. Jetson Nano: 5 watts at 10W mode. Sensors: 0.5 watts. Fuel cell provides 1.8 watts. Boost converter efficiency: 85%. Battery backup handles transient loads. Runtime: 45 minutes continuous.',
    filmingNotes: 'Power distribution pie chart, load profiles over time, efficiency analysis'
  },
  {
    key: 'test-methodology',
    relativePath: 'svg/storyboard-v4-scene-11.svg',
    caption: 'Experimental Setup',
    script: 'Controlled test environment: 2-meter wide track, 50-meter length. High-speed camera at 120 FPS. Data acquisition at 100 Hz. Temperature monitoring. Voltage and current logging. Ten trials per configuration. Statistical analysis using Python scipy. Confidence interval: 95%.',
    filmingNotes: 'Test track layout, instrumentation setup, data collection system'
  },
  {
    key: 'results',
    relativePath: 'svg/storyboard-v4-scene-12.svg',
    caption: 'Performance Metrics',
    script: 'Fuel cell: 1.42V OCV, 1.8W peak, 58% system efficiency. Voice: 94% accuracy, 850ms latency. Autonomous: 96% lane accuracy, 15 FPS vision. Power: 85% converter efficiency. All specifications met or exceeded. Standard deviation within acceptable limits.',
    filmingNotes: 'Results tables, statistical plots, comparison with targets'
  },
  {
    key: 'future',
    relativePath: 'images/scene-14-outro.png',
    caption: 'Future Enhancements',
    script: 'Proposed improvements: stack multiple cells for 10 watts. Implement SLAM for mapping. Add LiDAR for 3D perception. Optimize neural networks for Jetson. Deploy on larger platform. Scale to commercial applications. The foundation is solid.',
    filmingNotes: 'Roadmap diagram, concept renders, potential applications'
  }
];

// V5: Pitch/Demo - Fast-paced startup style
const V5_PITCH: FlipbookSceneV[] = [
  {
    key: 'hook',
    relativePath: 'svg/storyboard-v5-scene-02.svg',
    caption: 'The Hook',
    script: 'Watch this. "Vandi, navigate to the charging station." The robot responds instantly, plots a path, avoids obstacles, arrives in 30 seconds. Zero emissions. Powered by hydrogen. Welcome to the future of autonomous robotics.',
    filmingNotes: 'Dynamic opening: robot in action, fast cuts, energetic music'
  },
  {
    key: 'problem',
    relativePath: 'svg/storyboard-v5-scene-03.svg',
    caption: 'The Problem',
    script: 'Robots are everywhere - warehouses, hospitals, streets. But they all face the same bottleneck: batteries. Hours to charge, limited range, environmental waste. What if we could refuel in minutes with zero emissions? That\'s Vandi.',
    filmingNotes: 'Problem visualization: battery charging time-lapse, range anxiety, waste'
  },
  {
    key: 'solution',
    relativePath: 'svg/storyboard-v5-scene-04.svg',
    caption: 'Our Solution',
    script: 'Vandi combines three breakthrough technologies: vanadium redox fuel cells for clean power, edge AI for intelligent control, and natural language processing for human interaction. It\'s not just a robot. It\'s a platform for sustainable autonomy.',
    filmingNotes: 'Solution reveal: three-part graphic, technology highlights, platform concept'
  },
  {
    key: 'team',
    relativePath: 'images/scene-02-intro.png',
    caption: 'The Team',
    script: 'We\'re Jack, Oscar, and Bijoy - mechanical, biomedical, and electrical engineers from Hong Kong PolyU. We\'ve spent six months building this. Now we\'re ready to scale. Meet the team making clean robotics real.',
    filmingNotes: 'Quick team intro: names, roles, credentials, passion'
  },
  {
    key: 'demo-voice',
    relativePath: 'images/scene-08-voicedemo.png',
    caption: 'Voice Control Demo',
    script: 'Natural language control. No programming required. "Vandi, turn left." It turns. "Move forward slowly." It moves. "Stop." It stops. 94% accuracy. 850 millisecond response. Anyone can operate it.',
    filmingNotes: 'Live demo: various voice commands, smooth responses, user-friendly'
  },
  {
    key: 'demo-autonomous',
    relativePath: 'images/scene-09-autonomous.png',
    caption: 'Autonomous Navigation',
    script: 'Full autonomy. YOLOv5 vision at 15 frames per second. Real-time obstacle detection. Lane following with 96% accuracy. No human input needed. Just set the destination and watch it go.',
    filmingNotes: 'Autonomous demo: robot navigating complex path, avoiding obstacles'
  },
  {
    key: 'specs',
    relativePath: 'svg/storyboard-v5-scene-10.svg',
    caption: 'Key Specifications',
    script: 'The numbers: 1.8 watts from fuel cells. 45 minutes runtime. Refuel in 2 minutes. 12 volts to motors. 15 FPS vision processing. Sub-second voice response. All on a platform that weighs 3 kilograms.',
    filmingNotes: 'Specs overlay: clean graphics, key metrics highlighted, comparison chart'
  },
  {
    key: 'differentiators',
    relativePath: 'svg/storyboard-v5-scene-11.svg',
    caption: 'What Makes Us Different',
    script: 'Unlike battery robots, we refuel in minutes. Unlike hydrogen cars, we\'re affordable and scalable. Unlike traditional robots, we understand natural language. We\'re the only platform combining all three. That\'s our edge.',
    filmingNotes: 'Comparison matrix: Vandi vs competitors, unique value props'
  },
  {
    key: 'applications',
    relativePath: 'svg/storyboard-v5-scene-12.svg',
    caption: 'Market Applications',
    script: 'Warehouses need 24/7 operation. Hospitals need zero emissions. Delivery needs fast refueling. Our platform fits all three. The warehouse automation market alone is 30 billion dollars. We\'re positioned to capture it.',
    filmingNotes: 'Use case montage: warehouse, hospital, delivery scenarios'
  },
  {
    key: 'traction',
    relativePath: 'svg/storyboard-v5-scene-13.svg',
    caption: 'Early Traction',
    script: 'We\'ve demonstrated to three logistics companies. Two expressed interest in pilots. One university wants to license the technology. We\'re in talks with a Hong Kong accelerator. The market is ready.',
    filmingNotes: 'Traction metrics: logos, testimonials, partnership discussions'
  },
  {
    key: 'vision',
    relativePath: 'svg/storyboard-v5-scene-14.svg',
    caption: 'The Vision',
    script: 'Imagine fleets of Vandi robots in every warehouse, every hospital, every campus. Clean, intelligent, conversational. That\'s not science fiction. That\'s our roadmap. We\'re building the future of sustainable autonomy.',
    filmingNotes: 'Vision sequence: fleet visualization, global expansion, future scenarios'
  },
  {
    key: 'ask',
    relativePath: 'images/scene-14-outro.png',
    caption: 'Join Us',
    script: 'We\'re raising our seed round to scale production and expand the team. If you believe in clean energy robotics, if you want to be part of the solution, let\'s talk. The future is hydrogen. The future is Vandi.',
    filmingNotes: 'Call to action: contact info, QR code, team standing with Vandi'
  }
];

export const FLIPBOOK_VERSIONS: FlipbookVersion[] = [
  { id: 'documentary', label: 'V1: Documentary', scenes: V1_DOCUMENTARY },
  { id: 'problem-solution', label: 'V2: Problem-Solution', scenes: V2_PROBLEM_SOLUTION },
  { id: 'build-log', label: 'V3: Build Log', scenes: V3_BUILD_LOG },
  { id: 'technical', label: 'V4: Technical Deep Dive', scenes: V4_TECHNICAL },
  { id: 'pitch', label: 'V5: Pitch/Demo', scenes: V5_PITCH }
];
