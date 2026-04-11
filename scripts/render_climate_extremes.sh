#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ASSET_DIR="$ROOT_DIR/videos/climate-extremes"
SOURCE_DIR="$ASSET_DIR/source"
OUTPUT_FILE="$ASSET_DIR/climate-extremes-split-10s.mp4"

mkdir -p "$SOURCE_DIR"

DROUGHT_PAGE="https://www.pexels.com/video/scenic-drought-landscape-with-cracked-earth-36249169/"
FLOOD_PAGE="https://commons.wikimedia.org/wiki/File:%E5%BC%B7%E7%83%88%E9%A2%B1%E9%A2%A8%E2%80%9C%E5%B1%B1%E7%AB%B9%E2%80%9D%E8%A5%B2%E6%93%8A%E9%A6%99%E6%B8%AF_(%E7%B2%B5%E8%AA%9E).webm"

DROUGHT_VIDEO="$SOURCE_DIR/drought-source.mp4"
FLOOD_VIDEO="$SOURCE_DIR/hk-mangkhut-flood.webm"

if [[ ! -f "$DROUGHT_VIDEO" ]]; then
  yt-dlp \
    --extractor-args "generic:impersonate=chrome" \
    -f "b[ext=mp4]" \
    -o "$DROUGHT_VIDEO" \
    "$DROUGHT_PAGE"
fi

if [[ ! -f "$FLOOD_VIDEO" ]]; then
  yt-dlp \
    -f 0 \
    -o "$FLOOD_VIDEO" \
    "$FLOOD_PAGE"
fi

ffmpeg -y \
  -ss 4 -t 10 -i "$DROUGHT_VIDEO" \
  -ss 12 -t 10 -i "$FLOOD_VIDEO" \
  -filter_complex "\
    [0:v]crop=1280:1440:640:0,scale=960:1080,\
      setpts=PTS-STARTPTS,\
      eq=contrast=1.16:saturation=0.78:brightness=-0.02,\
      colorbalance=rs=0.10:gs=0.02:bs=-0.08:rm=0.05:gm=0.01:bm=-0.04,\
      vignette=PI/6,\
      drawbox=x=0:y=0:w=960:h=1080:color=#9e5d2f@0.10:t=fill[left];\
    [1:v]crop=280:240:190:120,scale=960:1080,fps=30,\
      setpts=PTS-STARTPTS,\
      tmix=frames=2:weights='1 1',\
      eq=contrast=1.12:saturation=0.92:brightness=-0.03,\
      colorbalance=rs=-0.03:gs=-0.01:bs=0.12:rm=-0.02:gm=0.01:bm=0.05,\
      drawbox=x=0:y=0:w=960:h=1080:color=#2c6785@0.08:t=fill[right];\
    [left][right]hstack=inputs=2[stack];\
    [stack]drawbox=x=958:y=0:w=4:h=1080:color=white@0.72:t=fill,\
      drawbox=x=954:y=0:w=12:h=1080:color=black@0.20:t=fill,\
      format=yuv420p[v]" \
  -map "[v]" \
  -t 10 \
  -r 30 \
  -c:v libx264 \
  -preset medium \
  -crf 18 \
  -movflags +faststart \
  "$OUTPUT_FILE"

echo "Created $OUTPUT_FILE"
