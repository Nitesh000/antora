# The Coding Ant: logo sting (Remotion)

A 7-second monochrome logo animation for **The Coding Ant**, rendered at **3840×2160, 60 fps**. The black and white versions have a **transparent background**, so you can drop them over anything.

## What happens (60 fps frames)

| Frames | Beat |
|---|---|
| 0–47 | A block cursor fades in at centre and types `</>`; the row re-centres after each key. |
| 48–70 | `<` and `/>` slide apart to frame the logo; the cursor collapses into the centre. |
| 58–124 | **Pixel compile:** about 1,150 square cells, sampled from the logo, assemble from the centre outward. |
| 128–152 | **Scanline snap:** a glowing line sweeps down and the cells resolve into the crisp vector logo. |
| 152–170 | The logo settles with a small pulse; the brackets blur away. |
| 166–200 | The antennae flick (damped spring) and the eyes blink. |
| 214–282 | The logo slides left into the lockup; `the` fades in and **Coding Ant** types out with the cursor. |
| 282–420 | Hold with a blinking cursor; a second antenna flick (330) and blink (372). Ends on the held lockup. |

All timings live in the `T` object at the top of `src/AntIntro.tsx`.

## Render on your machine

Requirements: Node 18+ and ffmpeg (ffmpeg is only needed for the MP4 previews).

```bash
cd the-coding-ant-intro
npm install
npm run studio   # optional: preview and scrub in the browser
bash render.sh   # renders everything into out/
```

Outputs in `out/`:

| File | Use |
|---|---|
| `the-coding-ant_white_alpha_4k.mov` | White logo, **transparent** (ProRes 4444 + alpha), for dark footage |
| `the-coding-ant_black_alpha_4k.mov` | Black logo, **transparent** (ProRes 4444 + alpha), for light footage |
| `the-coding-ant_white-on-black_4k.mp4` | Preview / ready-to-use on black |
| `the-coding-ant_black-on-white_4k.mp4` | Preview / ready-to-use on white |

Premiere Pro, DaVinci Resolve and Final Cut all read ProRes 4444 alpha natively. Put the `.mov` on a track above your footage.

Single renders:

```bash
npx remotion render src/index.ts AntIntro-White out/white.mov --codec=prores --prores-profile=4444 --pixel-format=yuva444p10le --image-format=png
npx remotion render src/index.ts AntIntro-White-OnBlack out/white-on-black.mp4 --codec=h264 --crf=14
```

Want WebM with alpha (for web) instead? Use `--codec=vp9 --pixel-format=yuva420p --image-format=png`.

## Customise

- **Colours / background:** `ink` (`white` | `black`) and `bg` (`transparent` | `black` | `white`) props in `src/Root.tsx`.
- **Smoother logo:** set `logoStyle: "smooth"` for a curve-smoothed trace. The default `original` is a faithful, crisp trace of your PNG, stair-step edges included.
- **Timing:** edit `T` in `src/AntIntro.tsx`. Duration is `DURATION` (420 frames = 7 s).
- **Wordmark:** `Wordmark` in `src/AntIntro.tsx`. The font is JetBrains Mono, bundled in `public/fonts/` under the OFL licence.

## Re-tracing the logo

`src/logo.json` holds:
- the vector paths (head with eye holes, plus each antenna separately so they can rotate about their base);
- the pixel grid used by the compile effect.

It was generated from the logo PNG with:

```bash
pip install numpy scipy pillow potracer
python3 scripts/vectorize.py assets/logo.png src/logo.json 1         # faithful
python3 scripts/vectorize.py assets/logo.png src/logo_smooth.json 6  # smoothed
```

The antenna/head split constants (`SEAM`, `BLOCK`) in the script are tuned to this logo.
