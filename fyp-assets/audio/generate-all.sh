#!/bin/bash
set -e

OUTDIR="/Users/jack/Documents/GitHub/ME-FYP-video/fyp-assets/audio"
CHUNKDIR="$OUTDIR/chunks"
mkdir -p "$CHUNKDIR"

API="http://192.168.1.112:7863/api/tts/generate"

generate_chunk() {
  local outfile="$1"
  local text="$2"
  echo "  -> Generating: $outfile"
  echo "     Text: ${text:0:60}..."
  curl -s -o "$outfile" -X POST "$API" \
    -H "Content-Type: application/json" \
    -d "$(jq -n --arg t "$text" '{text:$t, language:"en", voice_description:"Clear narration voice, calm pacing, studio quality.", voice_name:"narrator", robot:false}')"
  
  local size=$(stat -f%z "$outfile" 2>/dev/null || stat -c%s "$outfile" 2>/dev/null)
  if [ "$size" -lt 1000 ]; then
    echo "  !! WARNING: $outfile is only ${size} bytes, retrying with shorter text..."
    # Split in half and try first half
    local half=$((${#text}/2))
    local split_point=$(echo "$text" | cut -c1-$half | grep -ob '\.' | tail -1 | cut -d: -f1)
    if [ -z "$split_point" ]; then
      split_point=$half
    fi
    curl -s -o "$outfile" -X POST "$API" \
      -H "Content-Type: application/json" \
      -d "$(jq -n --arg t "${text:0:$((split_point+1))}" '{text:$t, language:"en", voice_description:"Clear narration voice, calm pacing, studio quality.", voice_name:"narrator", robot:false}')"
    size=$(stat -f%z "$outfile" 2>/dev/null || stat -c%s "$outfile" 2>/dev/null)
    echo "  Retry result: ${size} bytes"
  fi
  echo "  OK: ${size} bytes"
}

concat_scene() {
  local scene_num="$1"
  shift
  local scene_file="$OUTDIR/vo-scene-${scene_num}.wav"
  local listfile="$CHUNKDIR/list-${scene_num}.txt"
  
  > "$listfile"
  for chunk in "$@"; do
    echo "file '$chunk'" >> "$listfile"
  done
  
  ffmpeg -y -f concat -safe 0 -i "$listfile" -c copy "$scene_file" 2>/dev/null
  local size=$(stat -f%z "$scene_file" 2>/dev/null || stat -c%s "$scene_file" 2>/dev/null)
  echo "==> vo-scene-${scene_num}.wav: ${size} bytes"
  
  # Cleanup chunks
  for chunk in "$@"; do
    rm -f "$chunk"
  done
  rm -f "$listfile"
}

echo "=========================================="
echo "SCENE 1 — Cold Open / Hook"
echo "=========================================="
generate_chunk "$CHUNKDIR/s01-c01.wav" "Imagine a toy car that does not just run on a battery, but on a real fuel cell system, while talking back to you and driving itself around obstacles."
generate_chunk "$CHUNKDIR/s01-c02.wav" "This is Vandi: a compact electric robot car powered by a custom vanadium redox fuel cell stack, with an AI assistant running on Jetson Nano."
generate_chunk "$CHUNKDIR/s01-c03.wav" "In this video, I will show you the full engineering journey, from system design and fabrication to live voice control and autonomous navigation tests."
concat_scene "01" "$CHUNKDIR/s01-c01.wav" "$CHUNKDIR/s01-c02.wav" "$CHUNKDIR/s01-c03.wav"

echo ""
echo "=========================================="
echo "SCENE 2 — Intro — What is Vandi?"
echo "=========================================="
generate_chunk "$CHUNKDIR/s02-c01.wav" "Hello, I am Jack, and this is my final year project: Design and Development of an Electric Toy Car Powered by a Fuel Cell Stack."
generate_chunk "$CHUNKDIR/s02-c02.wav" "I named this prototype Vandi. Vandi combines three systems into one platform."
generate_chunk "$CHUNKDIR/s02-c03.wav" "First, a mobile robotic chassis from Yahboom provides steering, drive motors, and modular mounting points."
generate_chunk "$CHUNKDIR/s02-c04.wav" "Second, a vanadium redox fuel cell stack supplies the primary electrical energy source."
generate_chunk "$CHUNKDIR/s02-c05.wav" "Third, a Jetson Nano serves as the AI brain, running speech interaction and decision logic."
generate_chunk "$CHUNKDIR/s02-c06.wav" "The result is not just a moving robot, but an integrated mechatronic system that can chat with users, switch between remote and autonomous control, and navigate while monitoring safety constraints."
generate_chunk "$CHUNKDIR/s02-c07.wav" "My role in this project covers system architecture, AI integration, electronics planning, and physical fabrication."
concat_scene "02" "$CHUNKDIR/s02-c01.wav" "$CHUNKDIR/s02-c02.wav" "$CHUNKDIR/s02-c03.wav" "$CHUNKDIR/s02-c04.wav" "$CHUNKDIR/s02-c05.wav" "$CHUNKDIR/s02-c06.wav" "$CHUNKDIR/s02-c07.wav"

echo ""
echo "=========================================="
echo "SCENE 3 — Problem Statement — Why Fuel Cells?"
echo "=========================================="
generate_chunk "$CHUNKDIR/s03-c01.wav" "Most small robot vehicles rely entirely on lithium batteries."
generate_chunk "$CHUNKDIR/s03-c02.wav" "Batteries are practical, but they also introduce limits in runtime strategy, recharge downtime, and sustainability considerations depending on use case."
generate_chunk "$CHUNKDIR/s03-c03.wav" "The key question for this project is: can we build a small educational robotic platform that demonstrates an alternative electrochemical power architecture while still supporting modern AI workloads?"
generate_chunk "$CHUNKDIR/s03-c04.wav" "I selected a vanadium redox fuel cell concept because it offers a useful demonstration of energy conversion and modular energy storage."
generate_chunk "$CHUNKDIR/s03-c05.wav" "For students, this platform becomes more than a robot car. It becomes a moving lab for discussing electrochemistry, power electronics, robotics control, and human AI interaction in one system."
generate_chunk "$CHUNKDIR/s03-c06.wav" "So the design challenge is not only making the car move."
generate_chunk "$CHUNKDIR/s03-c07.wav" "The challenge is balancing energy source behavior, electrical stability, compute demand, mechanical packaging, and operational safety in a compact form factor."
concat_scene "03" "$CHUNKDIR/s03-c01.wav" "$CHUNKDIR/s03-c02.wav" "$CHUNKDIR/s03-c03.wav" "$CHUNKDIR/s03-c04.wav" "$CHUNKDIR/s03-c05.wav" "$CHUNKDIR/s03-c06.wav" "$CHUNKDIR/s03-c07.wav"

echo ""
echo "=========================================="
echo "SCENE 4 — Fuel Cell Tech Deep Dive"
echo "=========================================="
generate_chunk "$CHUNKDIR/s04-c01.wav" "Let me break down how the fuel cell subsystem works in this prototype."
generate_chunk "$CHUNKDIR/s04-c02.wav" "The vanadium redox concept uses two electrolyte states that participate in reversible redox reactions."
generate_chunk "$CHUNKDIR/s04-c03.wav" "In full-scale systems, these electrolytes are stored in separate tanks and circulated through a reaction stack."
generate_chunk "$CHUNKDIR/s04-c04.wav" "For this educational prototype, the architecture is simplified and adapted for compact integration, but the same teaching principle remains."
generate_chunk "$CHUNKDIR/s04-c05.wav" "Chemical state differences can be converted into electrical output through controlled electrochemical processes."
generate_chunk "$CHUNKDIR/s04-c06.wav" "From an engineering point of view, the fuel cell output is not perfectly constant under dynamic load changes."
generate_chunk "$CHUNKDIR/s04-c07.wav" "That is critical, because the drivetrain and Jetson Nano can create transient demand peaks."
generate_chunk "$CHUNKDIR/s04-c08.wav" "Therefore, I designed a power conditioning path that smooths supply behavior before it reaches sensitive electronics."
generate_chunk "$CHUNKDIR/s04-c09.wav" "This scene matters because it links chemistry to practical robotics."
generate_chunk "$CHUNKDIR/s04-c10.wav" "We are not using fuel cell theory in isolation. We are making it drive wheels, sensors, and AI inference in real time."
concat_scene "04" "$CHUNKDIR/s04-c01.wav" "$CHUNKDIR/s04-c02.wav" "$CHUNKDIR/s04-c03.wav" "$CHUNKDIR/s04-c04.wav" "$CHUNKDIR/s04-c05.wav" "$CHUNKDIR/s04-c06.wav" "$CHUNKDIR/s04-c07.wav" "$CHUNKDIR/s04-c08.wav" "$CHUNKDIR/s04-c09.wav" "$CHUNKDIR/s04-c10.wav"

echo ""
echo "=========================================="
echo "SCENE 5 — Mechanical Design & Build"
echo "=========================================="
generate_chunk "$CHUNKDIR/s05-c01.wav" "Mechanical integration was one of the most important parts of this project."
generate_chunk "$CHUNKDIR/s05-c02.wav" "The Yahboom chassis gives a reliable starting structure, but the fuel cell stack and supporting hardware add mass, volume, and vibration sensitivity."
generate_chunk "$CHUNKDIR/s05-c03.wav" "I created a custom mounting layout to keep the center of gravity low and centered between the drive wheels."
generate_chunk "$CHUNKDIR/s05-c04.wav" "The stack bracket, electronics plate, and cable routing paths were iterated through rapid prototyping and fit checks."
generate_chunk "$CHUNKDIR/s05-c05.wav" "During fabrication, I focused on three goals: structural stability during movement, thermal and airflow clearance around compute and power components, and maintenance accessibility for troubleshooting."
generate_chunk "$CHUNKDIR/s05-c06.wav" "You can see that each subsystem has a defined zone: propulsion at the base, power conversion in the middle, and AI plus communication modules on the upper layer."
generate_chunk "$CHUNKDIR/s05-c07.wav" "This layered approach reduced interference, improved serviceability, and made the overall architecture easier to explain and replicate for future student teams."
concat_scene "05" "$CHUNKDIR/s05-c01.wav" "$CHUNKDIR/s05-c02.wav" "$CHUNKDIR/s05-c03.wav" "$CHUNKDIR/s05-c04.wav" "$CHUNKDIR/s05-c05.wav" "$CHUNKDIR/s05-c06.wav" "$CHUNKDIR/s05-c07.wav"

echo ""
echo "=========================================="
echo "SCENE 6 — Electronics & Power System"
echo "=========================================="
generate_chunk "$CHUNKDIR/s06-c01.wav" "Now let us look at the electrical architecture."
generate_chunk "$CHUNKDIR/s06-c02.wav" "The fuel cell output first enters the power conditioning stage, where regulation and filtering stabilize voltage before distribution."
generate_chunk "$CHUNKDIR/s06-c03.wav" "From there, separate rails feed the motor driver domain and the compute domain."
generate_chunk "$CHUNKDIR/s06-c04.wav" "Isolating these paths helps protect the Jetson Nano and sensor interfaces from motor noise and current spikes."
generate_chunk "$CHUNKDIR/s06-c05.wav" "I also implemented inline monitoring points so voltage and current can be observed during tests."
generate_chunk "$CHUNKDIR/s06-c06.wav" "Wiring decisions were documented to keep grounding strategy consistent and reduce troubleshooting time."
generate_chunk "$CHUNKDIR/s06-c07.wav" "In practical testing, this architecture improved startup reliability and reduced random resets compared to early prototypes."
generate_chunk "$CHUNKDIR/s06-c08.wav" "In short, electronics integration is the bridge between a promising energy concept and a robot that behaves reliably under real motion and AI workloads."
concat_scene "06" "$CHUNKDIR/s06-c01.wav" "$CHUNKDIR/s06-c02.wav" "$CHUNKDIR/s06-c03.wav" "$CHUNKDIR/s06-c04.wav" "$CHUNKDIR/s06-c05.wav" "$CHUNKDIR/s06-c06.wav" "$CHUNKDIR/s06-c07.wav" "$CHUNKDIR/s06-c08.wav"

echo ""
echo "=========================================="
echo "SCENE 7 — AI Brain — Jetson Nano & Vandi"
echo "=========================================="
generate_chunk "$CHUNKDIR/s07-c01.wav" "At the intelligence layer, Jetson Nano runs Vandi, the onboard voice assistant and decision coordinator."
generate_chunk "$CHUNKDIR/s07-c02.wav" "Vandi is designed to parse user commands, return spoken responses, and trigger control actions through software modules connected to motion and sensing interfaces."
generate_chunk "$CHUNKDIR/s07-c03.wav" "The software stack is organized so perception, dialogue, and control remain modular."
generate_chunk "$CHUNKDIR/s07-c04.wav" "That means I can improve one capability without rebuilding the entire system."
generate_chunk "$CHUNKDIR/s07-c05.wav" "For example, voice intent classification can be updated independently of motor control logic."
generate_chunk "$CHUNKDIR/s07-c06.wav" "The Nano provides enough compute for this educational scope while keeping integration practical on a small platform."
generate_chunk "$CHUNKDIR/s07-c07.wav" "What makes Vandi valuable is not only speech output; it is the system-level role of turning human instructions into safe, trackable robot behaviors."
concat_scene "07" "$CHUNKDIR/s07-c01.wav" "$CHUNKDIR/s07-c02.wav" "$CHUNKDIR/s07-c03.wav" "$CHUNKDIR/s07-c04.wav" "$CHUNKDIR/s07-c05.wav" "$CHUNKDIR/s07-c06.wav" "$CHUNKDIR/s07-c07.wav"

echo ""
echo "=========================================="
echo "SCENE 8 — Voice Assistant Live Demo"
echo "=========================================="
generate_chunk "$CHUNKDIR/s08-c01.wav" "Now I will demonstrate live voice interaction with Vandi."
generate_chunk "$CHUNKDIR/s08-c02.wav" "I will issue commands naturally, and Vandi will respond and execute linked behaviors."
generate_chunk "$CHUNKDIR/s08-c03.wav" "Vandi, introduce yourself. Vandi replies with system status and greeting."
generate_chunk "$CHUNKDIR/s08-c04.wav" "Next command: move forward slowly for two meters. The car begins controlled motion."
generate_chunk "$CHUNKDIR/s08-c05.wav" "Next: stop and rotate right thirty degrees. Motion controller executes and confirms completion."
generate_chunk "$CHUNKDIR/s08-c06.wav" "Next: what is your current power state? Vandi reports measured voltage and operating mode."
generate_chunk "$CHUNKDIR/s08-c07.wav" "This sequence shows three things: speech understanding, command-to-control translation, and feedback transparency."
generate_chunk "$CHUNKDIR/s08-c08.wav" "To make this robust, I tuned command grammar, added confirmation responses for safety-critical actions, and built fallback behavior when confidence scores are low."
generate_chunk "$CHUNKDIR/s08-c09.wav" "In the final system, voice is not a gimmick. It is a practical interface layer that makes the robot easier to operate, demonstrate, and extend for educational applications."
concat_scene "08" "$CHUNKDIR/s08-c01.wav" "$CHUNKDIR/s08-c02.wav" "$CHUNKDIR/s08-c03.wav" "$CHUNKDIR/s08-c04.wav" "$CHUNKDIR/s08-c05.wav" "$CHUNKDIR/s08-c06.wav" "$CHUNKDIR/s08-c07.wav" "$CHUNKDIR/s08-c08.wav" "$CHUNKDIR/s08-c09.wav"

echo ""
echo "=========================================="
echo "SCENE 9 — Autonomous Driving Demo"
echo "=========================================="
generate_chunk "$CHUNKDIR/s09-c01.wav" "In autonomous mode, Vandi follows a predefined navigation routine while actively avoiding obstacles."
generate_chunk "$CHUNKDIR/s09-c02.wav" "The robot reads distance data, adjusts steering, and regulates speed to maintain stable movement through the test course."
generate_chunk "$CHUNKDIR/s09-c03.wav" "I configured this demo track to include narrow passages and sudden obstacles, which are common stress cases for small mobile platforms."
generate_chunk "$CHUNKDIR/s09-c04.wav" "As you watch, notice that behavior is not just binary stop or go."
generate_chunk "$CHUNKDIR/s09-c05.wav" "The controller blends slowdown, reroute, and recovery actions to keep progress smooth."
generate_chunk "$CHUNKDIR/s09-c06.wav" "This demonstrates that the project is not limited to voice interaction; it also supports independent operation with real-time sensing and control."
concat_scene "09" "$CHUNKDIR/s09-c01.wav" "$CHUNKDIR/s09-c02.wav" "$CHUNKDIR/s09-c03.wav" "$CHUNKDIR/s09-c04.wav" "$CHUNKDIR/s09-c05.wav" "$CHUNKDIR/s09-c06.wav"

echo ""
echo "=========================================="
echo "SCENE 10 — Safety Systems"
echo "=========================================="
generate_chunk "$CHUNKDIR/s10-c01.wav" "Safety is built into both hardware and software layers."
generate_chunk "$CHUNKDIR/s10-c02.wav" "On hardware, I included protected power routing and emergency stop behavior through control gating."
generate_chunk "$CHUNKDIR/s10-c03.wav" "On software, command validation, confidence thresholds, and motion timeout checks prevent unsafe execution."
generate_chunk "$CHUNKDIR/s10-c04.wav" "If Vandi receives an ambiguous instruction, it asks for confirmation rather than acting blindly."
generate_chunk "$CHUNKDIR/s10-c05.wav" "During autonomous operation, sensor faults trigger conservative fallback behavior."
generate_chunk "$CHUNKDIR/s10-c06.wav" "These safeguards are essential because reliable engineering means predictable failure handling, not only successful nominal operation."
concat_scene "10" "$CHUNKDIR/s10-c01.wav" "$CHUNKDIR/s10-c02.wav" "$CHUNKDIR/s10-c03.wav" "$CHUNKDIR/s10-c04.wav" "$CHUNKDIR/s10-c05.wav" "$CHUNKDIR/s10-c06.wav"

echo ""
echo "=========================================="
echo "SCENE 11 — Performance Results & Data"
echo "=========================================="
generate_chunk "$CHUNKDIR/s11-c01.wav" "To evaluate performance, I recorded key metrics across repeated trials."
generate_chunk "$CHUNKDIR/s11-c02.wav" "The dataset includes startup stability, command response latency, obstacle avoidance success rate, and power behavior under mixed workloads."
generate_chunk "$CHUNKDIR/s11-c03.wav" "Compared with early integration builds, the final prototype shows improved control consistency and fewer reset events during peak demand."
generate_chunk "$CHUNKDIR/s11-c04.wav" "Voice command execution remains responsive for demonstration use, and autonomous navigation completes the target course with repeatable behavior under controlled lab conditions."
generate_chunk "$CHUNKDIR/s11-c05.wav" "These results show that the architecture is not only conceptually interesting, but experimentally functional."
concat_scene "11" "$CHUNKDIR/s11-c01.wav" "$CHUNKDIR/s11-c02.wav" "$CHUNKDIR/s11-c03.wav" "$CHUNKDIR/s11-c04.wav" "$CHUNKDIR/s11-c05.wav"

echo ""
echo "=========================================="
echo "SCENE 12 — Challenges & Lessons Learned"
echo "=========================================="
generate_chunk "$CHUNKDIR/s12-c01.wav" "The biggest challenge was integration, not any single subsystem."
generate_chunk "$CHUNKDIR/s12-c02.wav" "Mechanical packaging, transient power behavior, and AI workload timing all affected each other."
generate_chunk "$CHUNKDIR/s12-c03.wav" "Early prototypes exposed issues like unstable mounting, noisy wiring paths, and inconsistent control responses under load."
generate_chunk "$CHUNKDIR/s12-c04.wav" "The key lesson is to iterate system-wide and test under realistic operating conditions early."
generate_chunk "$CHUNKDIR/s12-c05.wav" "Another lesson is to design for observability: when you can measure voltage, latency, and controller state, debugging becomes faster and decisions become evidence-based."
concat_scene "12" "$CHUNKDIR/s12-c01.wav" "$CHUNKDIR/s12-c02.wav" "$CHUNKDIR/s12-c03.wav" "$CHUNKDIR/s12-c04.wav" "$CHUNKDIR/s12-c05.wav"

echo ""
echo "=========================================="
echo "SCENE 13 — Future Work"
echo "=========================================="
generate_chunk "$CHUNKDIR/s13-c01.wav" "Future work will focus on three directions."
generate_chunk "$CHUNKDIR/s13-c02.wav" "First, improve energy management with smarter load scheduling and deeper fuel cell diagnostics."
generate_chunk "$CHUNKDIR/s13-c03.wav" "Second, expand autonomous intelligence with richer perception and adaptive planning."
generate_chunk "$CHUNKDIR/s13-c04.wav" "Third, package Vandi as a reproducible educational platform, including build guides and modular software templates."
generate_chunk "$CHUNKDIR/s13-c05.wav" "The goal is to turn this prototype into a practical learning system for sustainable robotics."
concat_scene "13" "$CHUNKDIR/s13-c01.wav" "$CHUNKDIR/s13-c02.wav" "$CHUNKDIR/s13-c03.wav" "$CHUNKDIR/s13-c04.wav" "$CHUNKDIR/s13-c05.wav"

echo ""
echo "=========================================="
echo "SCENE 14 — Outro / Credits"
echo "=========================================="
generate_chunk "$CHUNKDIR/s14-c01.wav" "Thank you for watching this demonstration of Vandi, my fuel-cell-powered AI robot car project."
generate_chunk "$CHUNKDIR/s14-c02.wav" "This work combines mechanical design, electrochemical energy systems, embedded computing, and intelligent control into one integrated platform."
generate_chunk "$CHUNKDIR/s14-c03.wav" "I hope this prototype shows how sustainable energy concepts and practical robotics can be developed together in an educational context."
generate_chunk "$CHUNKDIR/s14-c04.wav" "I am Jack, and this has been my final year project demonstration."
concat_scene "14" "$CHUNKDIR/s14-c01.wav" "$CHUNKDIR/s14-c02.wav" "$CHUNKDIR/s14-c03.wav" "$CHUNKDIR/s14-c04.wav"

echo ""
echo "=========================================="
echo "ALL DONE — Final file listing:"
echo "=========================================="
ls -la "$OUTDIR"/vo-scene-*.wav

# Cleanup chunks dir if empty
rmdir "$CHUNKDIR" 2>/dev/null || true
