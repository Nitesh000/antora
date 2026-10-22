#!/usr/bin/env bash
# Renders "The Coding Ant" logo sting at 3840x2160, 60 fps.
#   out/the-coding-ant_white_alpha_4k.mov   white logo, transparent (ProRes 4444 + alpha)
#   out/the-coding-ant_black_alpha_4k.mov   black logo, transparent (ProRes 4444 + alpha)
#   out/the-coding-ant_white-on-black_4k.mp4 / _black-on-white_4k.mp4   H.264 previews
# Usage: bash render.sh            (optional: BROWSER=/path/to/chrome bash render.sh)
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p out

EXTRA=()
if [[ -n "${BROWSER:-}" ]]; then EXTRA+=(--browser-executable="$BROWSER"); fi

alpha() { # composition id, output file
  npx remotion render src/index.ts "$1" "out/$2" \
    --codec=prores --prores-profile=4444 --pixel-format=yuva444p10le --image-format=png \
    "${EXTRA[@]}"
}

alpha AntIntro-White the-coding-ant_white_alpha_4k.mov
alpha AntIntro-Black the-coding-ant_black_alpha_4k.mov

# previews: composite the alpha renders over solid colour (much faster than re-rendering)
preview() { # alpha file, background colour, output file
  ffmpeg -y -v error -f lavfi -i "color=c=$2:s=3840x2160:r=60" -i "out/$1" \
    -filter_complex "[0][1]overlay=shortest=1,format=yuv420p" \
    -c:v libx264 -crf 14 -preset slow -movflags +faststart "out/$3"
}

if command -v ffmpeg >/dev/null; then
  preview the-coding-ant_white_alpha_4k.mov black the-coding-ant_white-on-black_4k.mp4
  preview the-coding-ant_black_alpha_4k.mov white the-coding-ant_black-on-white_4k.mp4
else
  echo "ffmpeg not found: skipping MP4 previews (or render AntIntro-White-OnBlack / AntIntro-Black-OnWhite directly)"
fi

ls -lh out
