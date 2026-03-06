#!/bin/bash
set -e

OUTDIR="/Users/jack/Documents/GitHub/ME-FYP-video/fyp-assets/audio"
CHUNKDIR="$OUTDIR/chunks"
mkdir -p "$CHUNKDIR"

API="http://192.168.1.112:7863/api/tts/generate"

generate_chunk() {
  local outfile="$1"
  local text="$2"
  echo "  -> Generating: $(basename $outfile)"
  echo "     Text: ${text:0:60}..."
  curl -s -o "$outfile" -X POST "$API" \
    -H "Content-Type: application/json" \
    -d "$(jq -n --arg t "$text" '{text:$t, language:"en", voice_description:"Clear narration voice, calm pacing, studio quality.", voice_name:"narrator", robot:false}')"
  
  local size=$(stat -f%z "$outfile" 2>/dev/null || stat -c%s "$outfile" 2>/dev/null)
  if [ "$size" -lt 1000 ]; then
    echo "  !! WARNING: only ${size} bytes, retrying..."
    sleep 2
    curl -s -o "$outfile" -X POST "$API" \
      -H "Content-Type: application/json" \
      -d "$(jq -n --arg t "$text" '{text:$t, language:"en", voice_description:"Clear narration voice, calm pacing, studio quality.", voice_name:"narrator", robot:false}')"
    size=$(stat -f%z "$outfile" 2>/dev/null || stat -c%s "$outfile" 2>/dev/null)
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
  for chunk in "$@"; do rm -f "$chunk"; done
  rm -f "$listfile"
}

# ============ SCENE 8 (resume: chunks 1-7 exist, need 8-9) ============
echo "=========================================="
echo "SCENE 8 — Voice Assistant Live Demo (resuming)"
echo "=========================================="
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

rmdir "$CHUNKDIR" 2>/dev/null || true
