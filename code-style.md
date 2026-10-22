# code-style: Motion-Graphics Explainer Style Guide (for Claude Code + Remotion)

This guide tells Claude Code how to make a **system-design / tech explainer video** in the "code-style" look. That look is a dark, cinematic, glass-and-neon motion-graphics style with lots of diagrams.

The guide comes from a frame-by-frame analysis of a reference video ("How Uber Tracks", 11:36, 1280×720, 29.97 fps). Every frame was checked at 2 fps, about 150 transitions were measured at 30 fps, and pixel values were sampled.

All pixel values are in a **1280×720 design space**. All timings are in **frames at 30 fps** (`f`).

> **Read this whole file before writing any code.** Sections 1–3 tell you what to do. Sections 4–12 define the look. Section 13 has the code recipes. Section 14 is the final checklist.

---

## 0. Contents

1. [Inputs, outputs and workflow](#1-inputs-outputs-and-workflow)
2. [Style DNA: the 15 rules](#2-style-dna-the-15-rules)
3. [Turning the voiceover into scenes (beat sheet)](#3-turning-the-voiceover-into-scenes-beat-sheet)
4. [Canvas and technical settings](#4-canvas-and-technical-settings)
5. [Colour system](#5-colour-system)
6. [Background, texture and atmosphere](#6-background-texture-and-atmosphere)
7. [Typography](#7-typography)
8. [Layout and composition](#8-layout-and-composition)
9. [Element library (visual specs)](#9-element-library-visual-specs)
10. [Motion language](#10-motion-language)
11. [Transitions](#11-transitions)
12. [Pacing and rhythm](#12-pacing-and-rhythm)
13. [Sound effects (AI-placed)](#13-sound-effects-ai-placed)
14. [Narrative structure template](#14-narrative-structure-template)
15. [Scene recipe catalogue](#15-scene-recipe-catalogue)
16. [Remotion implementation recipes](#16-remotion-implementation-recipes)
17. [QA checklist](#17-qa-checklist)
18. [Appendix: reference video timeline](#18-appendix-reference-video-timeline)

---

## 1. Inputs, outputs and workflow

### Inputs

| Input | Notes |
|---|---|
| **Voiceover audio file** | The user supplies this (e.g. `public/voiceover.mp3`). The VO drives **all** timing. |
| Topic / script (optional) | If there is no script, the transcript of the VO is the script. |
| Brand logo (optional) | Used as the small top-right watermark and in the intro/outro sting. If none is given, leave the slot empty. |
| SFX files | The user downloads these from **Epidemic Sound** into `public/sfx/` (see §13). If files are missing, still write the cue list and use the file names from §13. |

### Outputs

- A Remotion project that renders the **video plus the voiceover plus AI-placed sound effects**.
- **Do not add music, ambience beds from your own picks, or any "background" audio.** The user adds music and background sound themselves in their editor.
- Also export a **separate SFX-only audio stem** and a **cue sheet** (CSV/JSON with time, cue name and file), so the user can rebalance in their editor.

### Workflow (do these in order)

1. **Probe the audio.** Get its duration with `ffprobe`. The composition length is the VO length plus about 2 s of tail.
2. **Transcribe with word-level timestamps.** Use whisper / whisper.cpp, or `@remotion/install-whisper-cpp` + `transcribe()`. Save the result as `src/data/transcript.json` (words with `start`/`end` in seconds).
3. **Write a beat sheet** (`src/data/beats.ts`), as described in §3.
   - Split the transcript into **scenes** (one idea each, typically 6–30 s).
   - Within each scene, mark **beats**: the exact word where each element must appear or change state.
   - Convert times to frames: `Math.round(sec * 30)`.
4. **Plan the visual for each scene** using the recipe catalogue in §15 and the narrative template in §14. Pick the hero object, how it persists into the next scene, the spotlight mode (top or bottom), and the accent colour.
5. **Build the shared primitives first** (§16): Stage, Spotlight, GlassCard, Unfold, BlurIn, WipeText, Typewriter, Words, Highlight, Strike, Connector, Stream, Camera, Push. Then build the scenes.
6. **Place SFX cues** from the beat sheet using the event→sound map in §13.
7. **Render, review stills at every beat, and fix** against the QA checklist (§17).

---

## 2. Style DNA: the 15 rules

1. **Dark stage, one light.** Use a flat near-black `#030005` with **one** soft, static, neutral-white elliptical glow. The glow sits at the top edge for diagrams and at the bottom edge for "object on a stage" shots. Never add grain, vignette, particles in the background, or a grid.
2. **Dark glass cards.** Cards use a diagonal gradient from `#2D2C33` to near-black, a 1 px light rim on the **top and left only**, and **no drop shadow**.
3. **One colour = one meaning** for the whole video.
   - Red: problem, scale, hot, failure.
   - Cyan: normal data path, point lookup, location.
   - Purple: range, dispatch, geo-index.
   - Amber: history, analytics.
   - Green: durable, available, success.
   - Blue/pink: actor A and actor B.
4. **Accents glow; neutrals don't.** Every accent line, dot, icon and keyword gets a colour-matched glow (drop-shadow 4–10 px at 30–60%).
5. **One keyword per line is coloured.** Everything else is white or grey.
6. **Everything enters through blur.** Text uses blur 8→0 plus a rise of 8 px over 7 f. Cards are born as a **thin bright vertical sliver** that widens.
7. **Fast in, slow settle; quick exits.** Entrances are expo-out, 5–18 f. Repositions are cubic in-out, 14–27 f. Exits are linear fades, 5–9 f. There are no bouncy springs; at most about 5% overshoot.
8. **Continuity over cuts.** One hero object (map, DB, pin, title, road) stays on screen across beats and morphs, moves or gets new elements built around it. Hard cuts are reserved for real-world b-roll (screenshots, recordings).
9. **Section changes are vertical pushes.** The old scene slides **up** and out, the new one rises from below, with vertical motion blur. Big pushes add a white light-bloom flash.
10. **The camera is alive.** Use slow drift during holds (scale 1.00→1.03), 3D tilts (rotateX up to 25°, rotateY ±8–30°), whip-pans with directional motion blur, and push-ins on the thing being discussed.
11. **Long holds stay alive.** During any hold, something loops: marching dashes, flowing data dots, a breathing pin ring (47 f), moving cars, rows ticking, a spinning globe. The frame is never fully frozen for more than about 5 s.
12. **Narration-locked reveals.** Elements appear exactly on the spoken word, not on a fixed stagger. Only small siblings (pins, dots, phones) use fixed micro-staggers of 1–2 f.
13. **Lots of empty space.** 30–60% of the frame is empty background. Content is centred on x = 640 with at least 60 px side margins.
14. **Real-world proof inserts.** Real UI screenshots, blog posts and maps appear either full-bleed (hard cut) or tilted in 3D (rotateX ≈10°) with a highlighter, followed by a zoom-through back into the diagram.
15. **Typography stack.** Inter (SF Pro look) for headlines and narration, Poppins for cards and tags, JetBrains Mono for data, and Courier Prime Bold with a metallic gradient for "typed" section titles.

---

## 3. Turning the voiceover into scenes (beat sheet)

### Scene segmentation rules

- A new **scene** starts when the narration moves to a new idea, component or question.
  - In the reference the median scene length is about **9 s** and the mean about **13 s**.
  - Long explanatory scenes run 20–40 s; that is fine if they have beats.
- A **beat** is any spoken noun, number or claim that has (or should get) a visual.
  - Median gap between beats is **3.9 s** (interquartile range 2.5–6.7 s).
  - Never go more than about **6 s** without a new visual event, a camera move, or at least a highlight pulse.
- Reveal on the **first frame of the word's `start`**, or 2–3 frames before for big entrances so they peak on the word.
- Things that should land with a word:
  - **Numbers** ("5 million", "100 milliseconds"): big red stat, counter, or tag.
  - **Named components** ("Redis", "Kalman filter"): a card or icon unfolds.
  - **Relations** ("writes to", "reads from"): a dashed connector draws on.
  - **Contrast words** ("but", "instead", "the problem is"): a red state change, strike-through, or colour morph to red.
  - **Questions** ("so how do we…?"): a big translucent "?" glyph behind the content, or a typed monospace title.
  - **Lists** ("validate, dedupe, sample"): items reveal one per spoken item, each on its word.

### Beat sheet format (`src/data/beats.ts`)

```ts
export const SCENES = [
  {
    id: "pings",
    from: 4497, // frame where the scene starts (on the push)
    dur: 900,
    spot: "top", // "top" | "bottom" | "none"
    accent: "red",
    hero: "Drivers→Stores flow", // persists from / into neighbours
    enter: "push", // push | crossfade | morph | zoomThrough | cut | dipBlack
    beats: {
      // frame offsets inside the scene, taken from word timestamps
      title: 2, // "five million pings..."
      strike: 330, // "...that's five million WRITES"
      pipe: 656, // "so we put a pipeline in front"
      validate: 720,
      dedupe: 735,
      sample: 780,
    },
  },
  // ...
];
```

---

## 4. Canvas and technical settings

| Setting | Value |
|---|---|
| Design space | **1280×720**. Author every px value in this space. |
| Render size | 1920×1080 (scale the 1280×720 stage by 1.5 with `transform: scale()`); 3840×2160 also works. |
| FPS | **30** (the reference is 29.97) |
| Duration | VO length + about 60 f tail |
| Codec | H.264 (crf ≈ 16–18) for the video; WAV for the SFX stem |
| Safe area | Keep content 60 px or more from the left and right edges and 80 px or more from the top and bottom, except full-bleed images, the road, and whips |
| Watermark slot | Top-right box at **x 1194–1262, y 14–69** (about 68×55). Static, about 50% opacity, never animated. Hidden during the intro sting, white full-bleed inserts, and the outro. |

---

## 5. Colour system

### 5.1 Neutrals

| Token | Hex | Use |
|---|---|---|
| `bg` | **#030005** (or #020005) | the entire background; flat |
| `bgPure` | #000000 | outro only |
| `white` | #FFFFFF | titles, card titles |
| `offWhite` | #F0F0F5 | small UI labels ("SHARD 0") |
| `narration` | #C7C4C9 | typed narration sentences |
| `text2` | #BABBC2 / #CFCFD4 | subtitles, bold part of footers, "← SOURCE" lines |
| `text3` | #999AA0 | mono data rows |
| `muted` | #7D8189 / #7F8087 | footers, captions |
| `monoGrey` | #A8A2A9 | mono field labels (`drive_id`) |
| `cardHi` | #2D2C33 | card fill, top-left |
| `cardMid` | #202129 / #23242B | card fill, middle |
| `cardLo` | #0B0B0E (to #111217) | card fill, bottom-right |
| `rim` | rgba(255,255,255,0.10–0.16); on the top edge up to #59585F | 1 px top/left rim |
| `tablePanel` | #100D13, border #3A3A40, header rule #5A5A60, row rule #1E1E24 | data tables |
| `road` | #221F27, centre dashes #9A979F | road ribbon |

### 5.2 Semantic accents (fixed meanings for the whole video)

| Meaning | Main | Variants | Where |
|---|---|---|---|
| **Problem / scale / hot / failure** | **#FF4144** | #FF3F38 (stat), #EF161C / #FF0008 (strike, "="), #ED5D6C (keywords), #E5485A (tags), dark numerals #641115 | "5,000,000 / sec", "=", strike-throughs, Redis/HOT·TTL, GPS noise, failed arrows, question keywords |
| **Normal data path / point / location** | **#68C3E5** | #34D6F7 (title keyword), #71E2FD (flow dots), #6DD1EA (stat text), #47C8DE | "POINT · sub-second", data dots, connectors to readers, "Real trick" |
| **Pin / primary actor** | **#3EB9FE** | pin gradient #4AD5FE → #3CBEFC → #2585FF | location pins, User A, doc icon |
| **Range / dispatch / geo-index** | **#9B4CD1** | #9D47F0, #9328EE (keyword), #8A5CF0 (hex stroke), #B441FD (k-label), dark fill #12061E | "RANGE · <100ms", H3 hexes, matching |
| **History / analytics** | **#EDD850** | #F7D93D (tag), #FED502 (icon), #C8A060 (dashes) | "HISTORY · …", Analytics |
| **Durable / available / success** | **#4FD287** | #49C399, #8FE38A (tag), #5BD016 → #163605 (badge), #2ECC5A (snap line) | "DURABLE", Cassandra, AVAILABLE, success arrow |
| **Locked / reserved** | **#FF9A1A** glow | fill #844907 → #A45500, text #FEE7B6 | RESERVED badge |
| **Secondary actor** | **#FF5EC0** | #FD38AC | User B |
| **Smoothing / filter** | **#49C0C5** | title gradient #B1FBFF → #3CC5CC | Kalman line |
| **Recap highlighter** | **#279498** | | teal marker box |
| **Interview / brand tag** | **#BC72DD** | gradient #EA87EC → #AD6BD1 | "System Design Interview" |
| **Neon outro** | core #FCC8FF | glow #A855F7 → #7A30D5 → #3D1376 | outro frames |

**Rules**

- Each component keeps its colour across the whole video: its tag line, its connector dashes and its icon all match.
  - Example: Rider Map is cyan everywhere, Dispatch is purple, Analytics is amber.
- Use **at most 2 accents per frame**, plus red when something is going wrong.
- State changes are colour changes. Interpolate over 10 f (`interpolateColors` or `hue-rotate`):
  - blue → red means "now it's a problem";
  - red → grey means "neutral storage";
  - red particles → teal particles means "fixed".

---

## 6. Background, texture and atmosphere

### Base and spotlight

- **Base:** a flat `#030005` fill with zero noise. The measured pixel standard deviation is 0. **Never add grain, dither, noise, vignette, light leaks, lens dirt, chromatic aberration, or background particles.**
- **Spotlight:** one neutral-white radial glow, **static within a scene**. It changes only at scene changes, where it crossfades or switches between top and bottom.

| Mode | Use for | CSS (1280×720 stage) | Visible peak |
|---|---|---|---|
| **Top / "ceiling"** | diagrams, tables, cards, hex grids, titles | `radial-gradient(ellipse 625px 300px at 640px -40px, rgba(255,255,255,.13) 0%, rgba(255,255,255,.08) 35%, rgba(255,255,255,.03) 65%, transparent 100%)` | about #1D1C1F at the top edge; fades by y ≈ 250–350 |
| **Bottom / "floor"** | an object on a stage: phone, DB, car, users, logo, maps, road, recap cards, question cards | `radial-gradient(ellipse 750px 550px at 640px 800px, rgba(255,255,255,.30) 0%, rgba(255,255,255,.17) 25%, rgba(255,255,255,.07) 50%, rgba(255,255,255,.02) 75%, transparent 100%)` | about #201D23 at the bottom edge (up to #2C292F); fades by y ≈ 330–400 |
| **None** | dramatic close-ups (zoom on car, "Small Scale" DB intro), outro | — | — |

- Scale the alpha by scene from **0.3× to 1×**. Recaps and endings use the brightest glow.

### Other atmosphere devices (all used sparingly)

- **Light bloom flash** on big section pushes. The frame washes toward #777–#8A8A8A from the spotlight side, peaks about 10 f in, and decays over about 16 f. After the bloom, the spotlight can switch between top and bottom.
- **Giant translucent background glyphs** act as depth layers behind content: a huge "1", a "?", or a map-pin silhouette.
  - Size 180–520 px.
  - Colour: dark red #641115 on problem scenes, or dark grey #1A1A1E.
  - Bottom faded by a gradient mask.
  - Fade in over about 8 f.
- **Glossy floor reflection** under hero objects: a mirrored copy at about 15% opacity that fades to 0 over about 65 px. Used under a phone mockup.
- **Inner floor glow** inside icon tiles (a white radial at 25% at the bottom edge) and **under-glows** under icons (blue #1C3D5A under a doc tile; red #FF3040 at 25%, blur 20, under failure cards).
- **Motion blur** on every fast move (see §10.6).
- **Depth-of-field blur** of 2–3 px on unfocused cards in 3D focus pulls.

---

## 7. Typography

### 7.1 Font stack (Google Fonts via `@remotion/google-fonts`)

| Role | Font | Weights | Stands in for |
|---|---|---|---|
| Headlines, narration, node labels, pills | **Inter** (tracking −0.01em) | 400 / 500 / 600 / 700 / 900 | SF Pro Display |
| Card titles, tag lines, bullets, recap labels, footers, chips | **Poppins** | 400 / 500 / 600 | Poppins |
| Data rows, table, SQL, badges | **JetBrains Mono** | 400 / 500 / 700 | SF Mono |
| "Typed" section titles and field labels | **Courier Prime** | 700 (titles) / 400 (labels) | Courier New |

### 7.2 Type scale (px at 720p)

| Element | Font | Size | Weight | Colour / effect |
|---|---|---|---|---|
| Hero stat ("5,000,000 / sec") | Inter | 56 | 600 | #FF3F38 |
| Big headline ("5M Pings = 5M Writes") | Inter | 50–66 | 600 | white; operator "=" in red |
| Single-word hero label ("Storage", "Hexagon") | Inter | 60–64 | 600 | white |
| Section headline ("Raw **GPS** is Noisy", "Where do all those locations actually **live**") | Inter | 38–50 | 400, with the keyword in 600 or an accent colour | white |
| Section label with gradient ("Kalman filter", "Map Matching") | Inter | 44–46 | 600–700 | vertical gradient (#B1FBFF→#3CC5CC teal; #D6F8E8→#4F9070 mint) + 8 px glow |
| Section title, blur-wave ("**Real trick** that makes the whole design work") | Inter | 36 | 400 | white; first words #34D6F7 |
| Typed metallic title ("find nearby drivers") | Courier Prime | 64 (≈39 px per character) | 700 | gradient #FCF9FD → #676468 + drop-shadow 0 3 2 rgba(0,0,0,.85); optional white glow pulse |
| Brand wordmark-style heading ("H3") | Inter | ≈118 (cap 85) | 900 | purple gradient #7A3294 → #512264, fading to transparent at the bottom (reflection mask) + bloom |
| Narration sentence (typed) | Inter | 30 (line-height 50) | 400 | #C7C4C9; max width ≈620 px |
| Sub-note | Inter | 26 | 400 | #82E2E8 + glow |
| Counter ("5 Sec") | Inter | 80 (unit at 0.55×) | 600 | white |
| Card title (large cards) | Poppins / Inter | 26–34 | 600 | white |
| Card subtitle | Inter | 15–22 | 400 | #CFCFD4 |
| **Tag line** ("POINT · sub-second") | Poppins | 18 | 500 | lane accent; **UPPERCASE word · lowercase detail** |
| Source line ("← REDIS · H3 cell + neighbors") | Poppins | 18 | 400 | #CFCFD4 |
| Card footer ("last few pings per driver · **fast · cheap**") | Poppins | 16 | 400 + 600 | #7D8189 + bold part #BABBC2 / white |
| Data rows ("● d_4192 · 37.77,-122.41") | JetBrains Mono | 13–14 | 400 | #999AA0–#C9C9CC; bullet dot in the lane colour |
| Table header | JetBrains Mono | 20 | 700, UPPERCASE, +0.04em | white |
| Table cells | JetBrains Mono | 22 | 500 | #E8E8E8 |
| SQL | JetBrains Mono | 20 | 400 | keywords #4C7EC7, identifiers #E0E0E0 |
| Mono pill ("HOT · TTL", "DURABLE") | JetBrains Mono | 13 | 500 | accent text + 1 px accent border, radius 5, padding 4×10 |
| Micro caps label ("DRIVER APP") | Inter | 13 | 500, +2.5 px tracking | #9AA3AD |
| Node label ("Dispatcher", "User A") | Inter | 20–22 | 600 | white |
| Pill text ("Request Ride", "Which Database?") | Inter | 17–22 | 400 | #E0E0E0–#E6E6E6 |
| Bullets (with sparkle icon) | Poppins | 26 | 500 | #FAFAFA; 48 px row pitch |
| Recap card label | Poppins | 17 | 600 | dim #5B5A5F → lit white |
| Question card text | Inter | 24 (line-height 38) | 600 | white; risky phrase #ED5D6C |
| Number badge | Inter | 34 | 600 | white on a 56×56 glass square |
| Grid/diagram caption | Poppins | 20 | 400 | #B7B5BD; keyword phrase in 600 + accent |

### 7.3 Emphasis rules

- **One** emphasised word or phrase per line. Emphasise it with one of:
  - an accent colour (most common);
  - a heavier weight in the same white ("Raw **GPS** is Noisy");
  - a marker box behind it (§10.3);
  - a white glow;
  - a strike-through (for the wrong idea).
- Never underline. The only exception is the brush-underline swipe on interview questions.
- Operators and alarming numbers are red ("=", "5,000,000 / sec").
- Use middle dots `·` as separators ("Filtered · Partitioned · Indexed").

---

## 8. Layout and composition

### General rules

- **Centre discipline.** Hero elements sit on x = 640. Vertical centre is about y = 350–365.
- **Negative space.** 30–60% of the frame stays empty.
- **Side margins** are at least 60–68 px (≈5.3%). Right-side card stacks keep about 125 px from the right edge.

### Standard compositions

| Composition | Geometry (1280×720) |
|---|---|
| **Single hero object** | Object centred, 220–450 px; label 30–45 px below it (or above). |
| **Source → 3 readers (fan-out)** | Source tile 105×105 at x 275–380 (left third). 3 cards of 225×90 at x 795–1020, centred at y 182 / 360 / 537 (178 px pitch). Dashed connectors run from the source's right edge to each card's left edge. |
| **Pin + stores (left source, right stack)** | Pin at x ≈185 (14.5%). Cards 510×245 at x 645–1155, with about 135 px vertical gap. The right 40% of the frame is used. |
| **Left card ↔ right card flow** | Side cards 217×183 at x 68–285 and 995–1213, centred at y ≈360. Headline at y ≈190–225. Particle band 60 px tall between them. Middle box (pipeline) at x 400–870. |
| **Row of N siblings** | Equal cards, gutter 32–43 px, row centred. Examples: 5 shards of 135×140 at pitch 167.5; 4 recap cards of 247×175 at pitch 290 (y 278–453). |
| **Table hero** | Table 72% wide (x 182–1107). When it feeds cards: table at the top (y 168–370), cards row at y 467–560, connectors from (640, 372). |
| **Vs comparison** | Two icons at x ≈338 and ≈936 (26% / 73%), labels at y ≈460. |
| **Duel / race** | Actor cards 185×190 at x 113–298 and 985–1170 (symmetric about 640). Contested object at the centre. Badge 152×42 centred above it. |
| **Typed title + grid** | Title at y ≈345 while typing. It then rises to y ≈185 (over 18 f), and later to y ≈108, to make room. |
| **Question cards** | Heading at the top-left (x 213, y 100). Two 408×214 cards at x 212 and 660 (40 px gutter). A third 540×152 card centred below at y 455. |
| **Caption line** | Baseline y ≈598–615 (83–85%), centred. |
| **Headline** | y ≈95–225 (13–31%), centred. |

---

## 9. Element library (visual specs)

### Glass card (default container)

- **Fill:** `linear-gradient(135deg, #2D2C33 0%, #202129 38%, #0B0B0E 100%)`.
- **Rim:** `box-shadow: inset 1px 1px 0 rgba(255,255,255,.14)`, so only the top and left edges get a rim.
- **Sheen:** `radial-gradient(ellipse 60% 70% at 0% 0%, rgba(255,255,255,.06), transparent 70%)` plus an optional faint 30° diagonal streak at +6–10 luma.
- **No drop shadow.**
- **Radius by size:** large side cards 18–20 px; data/glass cards 14–16 px; small cards (shards, recap, user) 8–12 px; question cards 6–8 px.
- **Padding:** 24–25 px. Icons 56–64 px; small icons 36–46 px. Icon-to-text gap 22 px.

### Variants

- **3D data card:** the same card wrapped in `perspective(1200px) rotateY(-8deg) rotateX(3deg)`, with a slow drift of a few px over the hold.
- **Navy state card** (status outcomes, e.g. "No new trips"):
  - Size 213×141, radius 10. Fill #1C2530 → #1A1D24. Border 1 px rgba(120,160,200,.25).
  - The failure version has a red under-glow.
  - Contains a skeleton row: a radius-6 #283039 panel, a glyph, and 3 grey bars (#5A6370, 3 px tall, widths 90/80/60).
- **Navy glass panel over imagery:** rgba(8,22,38,.75), 1.5 px #3C86C0 border, radius 8, cyan glow 8 px at 30%.
- **Highlighted card:** 1.5 px accent border plus a 10 px accent outer glow (used when "both users request").
- **Index card:** fill #05101A, 1.5 px #368198 border, cyan outer glow 6–10 px.

### Data and diagram elements

- **Dashed connector:**
  - 1.5–2.5 px wide; dash 6–10, gap 5–8; round caps; colour-matched glow of 3 px.
  - Draws on from the source over 8–14 f, then **marches** toward the target at about 40–60 px/s.
  - Arrowhead is optional (filled triangle about 12 px).
  - Shapes: a straight fan-out, an elbow with a 12–30 px corner radius, or a smooth S/arc.
  - A tree connector draws from the centre outward: stem, then bus, then branches.
- **Flowing data dots** on connectors: r ≈ 4 px, a bright core and a 10 px glow, spaced about 77 px, flowing at about 150 px/s. Mixed red and cyan dots mean "some data is stale".
- **Particle stream** (between two cards): about 40 dots of 2–3 px with a 4 px glow, in a 60 px band with random lateral jitter, at about 350 px/s.
  - Red #C24B4F means naive or overloaded; teal #9BDBD4 means healthy.
  - In the pin→store version, the dots travel in clusters of 3–4 at about 250 px/s, one cluster every 0.5 s.
- **Light streaks:** horizontal lines, 1–2 px × 40–250 px, gradient tail → bright head (#A45764 → #FF6B7A), moving at 1200–1800 px/s behind a "scale" stat.
- **Data table:** panel #100D13, radius 14, 1 px #3A3A40 border, mono text. The first data row is highlighted at 5% white.
- **SQL chip:** radius 10, #1E1E22 fill, 2 lines of mono.
- **DB cylinder (flat):** 3 stacked discs, the top ellipse lighter.
  - Blue #BCD1E1 / #6F9BBD / #3F6D8F.
  - Grey #CFCFCF / #959595 / #6A6A6A.
  - Red when overloaded.
- **DB cylinder (glossy 3D):** elliptical cap with ry ≈ 15% of width, 4 px dark gaps between discs, 1.5 px light rims, 12 px soft glow. Colour by role:
  - grey #4F5773 (highlight #CAD7F8);
  - writes #903848 / #F2CEDC with a "+" badge;
  - state #5A4994 / #E2D4FE with "≈";
  - serving #188374 / #AEF9EC with "»".
- **Silver DB (authoritative):** top #E0E0E0, body fading to dark, soft white glow, label in 2-line caps below.
- **Pipeline box:** navy #061F4A, 2 px light-blue top and bottom rims (#7FA0D0), **left and right ends feathered** to transparent. Stage icons are thin white line icons that animate (a check draws; dots merge and split; a waveform scrolls).
- **Location pin:**
  - Teardrop, about 85×110 (56×80 small), with a vertical gradient #4AD5FE → #3CBEFC → #2585FF and a dark hole r ≈ 18.
  - A cyan ring ellipse (≈56×16, #46D0E0 + glow) under the tip **breathes on a 47 f sine**.
  - Satellite pins are 40–55 px, desaturated teal #266986, at 60% opacity.
- **Hex grid (H3):**
  - Flat-top hexes, 1.5 px strokes. Inactive: stroke #19161C, fill #03000A.
  - Centre cell: cyan stroke #5CBCD6 with fill #03151A.
  - Neighbour ring: purple stroke with fill #12061E; when active, a glowing purple fill (#3A1660 + 10 px bloom).
  - Driver dots are 7 px, #B7B5C1.
- **k-ring:** 3 concentric hexes (308 / 220 / 136 px wide), 1.5 px #8A5CF0. The active ring is at 100% with glow; others at 35%.
- **Globe:** an orthographic sphere tiled with hexes. Ocean #8A8A96, land #646464, lines #15151C. Spins at about 80°/s. No atmosphere glow.
- **Badge pill:** 152×42, radius 21. The text rolls between states (§10.4).
- **Tag pill outline:** red #A82B2D–#D0505C, 1 px, radius 4–6.
- **Sparkle bullet:** 4-point concave star, about 16–28 px, #5AA0BB with a cyan glow.
- **Number badge:** 56×56 glass square, radius 8, white numeral at 34 px.
- **Clock:** white circle with a 6 px stroke, r ≈ 68, 12 ticks; the minute hand turns once per 3 s.
- **Road ribbon:**
  - An S-curve bleeding off both edges, from the left at y ≈585 up to the right at y ≈100. Width 44 px, flat #221F27.
  - Centre dashes: 12 px long, 2 px thick, 14 px gaps, #9A979F.
  - A white top-down car sprite (about 52×26) loops along it at 560–600 px/s, about every 3 s, rotated to the tangent.
- **GPS noise dots:** r = 7, #FE3B3A, with a 6 px red glow, scattered ±40–60 px around the road.
- **Smoothed line:** 2–3 px #49C0C5 with a teal glow. The snapped line is #2ECC5A.

### Imagery and assets (sourced, not drawn)

- Real UI screenshots (light map cards, price cards), product photos (a car render), official logos (Redis, Cassandra, brand wordmarks), and **3D glossy icon sets** (pins, globes, monitors, people, tags).
- AI-generated cinematic stills or clips for "real world" scenes, e.g. a night airport with flat 2D overlays composited on top.
- Store these in `public/assets/`. If an asset is missing, draw a clean vector stand-in in the same palette. Never leave a placeholder box.
- **Light UI on dark:** map or UI screenshot cards keep their light colours (#E9EAEF map) with radius ≈22 px and no border. A white pill badge (radius 16) with the brand name sits above the top-left corner.

---

## 10. Motion language

### 10.1 Easing and spring presets (30 fps)

| Name | Definition | Use |
|---|---|---|
| `enter` | `Easing.bezier(0.16, 1, 0.3, 1)` (≈ expo-out) | entrances, wipes, line draws, pops without overshoot |
| `move` | `Easing.bezier(0.65, 0, 0.35, 1)` (cubic in-out) | repositions, camera moves, title rises |
| `exit` | `Easing.in(Easing.poly(4))` | push-out, collapse |
| `flip` spring | `{stiffness: 200, damping: 20, mass: 1}` (~7 f, about 5% overshoot) | card unfold / flip |
| `rise` spring | `{stiffness: 60, damping: 15, mass: 1}` (~25 f, critically damped) | the incoming scene on a push |
| `pop` spring | `{stiffness: 180, damping: 14, mass: 0.8}` (small overshoot) | pins, hex pop, hero map card |

### 10.2 Durations cheat-sheet

| Action | Frames |
|---|---|
| Text blur-in | 4–8 (default 7) |
| Text exit (drift up + blur) | 4–12 (default 6) |
| Card unfold | 6–12 to full width, then content fades in 6 f later over 10 f |
| Connector draw | 8–14 |
| Line/path draw (road, smoothing line) | 14–16 |
| Wipe reveal (word / label) | 5–16; whole headline about 46 |
| Pop-in (pins, dots, icons) | 5–8 |
| Fade out (exit) | 5–9, linear |
| Reposition / camera move | 14–27 |
| Whip pan | 5–7 (11 for a reverse whip) |
| Push transition | 18–21 for the out; about 25 to settle the in |
| Colour/state morph | about 10 |
| Highlight pulse | 6 up, hold about 1 s, 6 down |

### 10.3 Entrances (signature moves, most used first)

1. **Blur-in:** opacity 0→1, `blur(8px)`→0, translateY +8→0, 7 f, `enter`. This is the default for every text element and small icon.
2. **Sliver unfold:**
   - The element appears as a 2–6 px **bright** vertical line at its own centre x.
   - Optional stage 1: it grows to full height in about 5 f.
   - It then widens with scaleX 0→1 on the `flip` spring while a 6 px blur clears.
   - Content (icon, title, sublines) fades in 6 f later over 10 f, **in order**: icon, then title +4–6 f, then sublines +3 f each.
   - Used for **cards, pills, badges, pipeline boxes and question cards**. Siblings in one group unfold together, or 8–12 f apart.
3. **3D flip-in:** rotateY ±90°→0 with `perspective: 800px`, 9 f. Use it for actor/user cards and shards. Exit is the reverse.
4. **Soft wipe reveal:**
   - A left-to-right mask with an 18–80 px feather moves across the text; the text itself does not move.
   - Labels take 5–16 f. A long headline takes about 46 f, with the leading words at intermediate grey ("written in light").
5. **Typewriter (no cursor, characters appear instantly):**
   - Metallic titles: **3 f/char**.
   - Narration sentences: **1 f/char**.
   - Short labels: 2 f/char.
   - Text is left-anchored at its final centred position.
6. **Word rise:** each word moves translateY +70→0 and fades in over 8 f, 5 f apart. Use it for punchy captions ("Partition by **geography**").
7. **Blur wave:** each word goes blur 10→0 over 5 f, 3 f apart, with no movement. Use it for section titles.
8. **Pop:** scale 0→1 over 5–8 f with no or minimal overshoot, plus an opacity jump within 2 f.
   - Pins, dots and phones use a 1–2 f stagger in reading order.
   - The hero card can pop from 15% scale with a −12° rotation using the `pop` spring and motion blur.
9. **Seed-line grow:** a 2 px line grows to full height (5 f), then opens horizontally into the box (8 f).
10. **Grow from a dot:** a clock, ring or badge scales from a point (11 f). Exit is the reverse.
11. **Rise into place:** a DB or object rises about 40 px while fading and brightening from dark (8–12 f). It can appear "lights on": it starts dark grey and brightens over about 10 f.
12. **Slide + blur:** a card enters from beyond the frame edge (about 400 px) with motion blur, opacity 0.3→1, 17 f `enter`. Chips slide about 20 px with blur 8→0 over 5 f, 20 f apart.

### 10.4 State changes (instead of new scenes)

- **Colour morph:** hue-rotate or interpolate the fill over about 10 f (blue→purple→magenta→red; red→grey with saturation dropping). Text swaps inside persistent cards take 10 f (old fades out over 4 f, new fades in over 6 f).
- **Highlight pulse:** the card scales 1→1.06 (6 f), holds, and returns (6 f) while its title brightens. Emphasised nodes can go up to 1.25–1.3× with a 20 px accent glow, staggered 4 f, and snap back together in 3–4 f.
- **Marker box:**
  - A coloured box behind a word wipes in from the left (4–7 f) and holds.
  - Either it stays (keywords), or it **retracts by its left edge sliding right** (4 f) and jumps to the next word (recap line, about 0.6 s per word).
  - Colours: teal #279498 for recaps, purple #5A1A8A at about 70% for k-values, amber #A0782A for "by ETA", red #C0303A at about 70% for problem subtitles, dark #2A2A2A on white screenshots.
- **Strike-through:** a 2–3 px line with glow draws left→right over 16 f in `move`, extending about 6 px past the text. The struck text dims to 80% or takes a slight pink tint. Red #FF0008 for problems; pink #FF6B8A for "wrong metric".
- **Badge birth and state roll:**
  - Birth: a thin bright bar (4×30 px) widens to a pill over 9 f. The fill starts bright with a 12 px glow and **cools to dark over about 30 f**.
  - State change: a 5 f vertical slot-roll of the text, with 1-frame colour glitches (e.g. brown, then a green flash, then orange), then a new glow blooms and settles over about 10 f.
- **Alarm flash:** a colour overlay (#FE6832, multiply) toggles on and off **every frame for 4 frames**, holds for about 0.8 s, then fades over 5 f.
- **Success / failure on arrows:** an arrow fills green from left to right over 9 f (success), or turns red in 3 f (rejected). Both revert after about 1.5 s.
- **Neighbour chase:** cells light one after another, 6 f apart (each: fade in 4 f, hold 4, fade out 8).
- **Power-up:** scale 1→2.2 with a big halo over 20 f, then return over 12 f.
- **Glitch flicker:** rays or lines toggle every 1–3 f for about 14 f when returning from a 3D move.
- **Stepped counter:** hard digit swaps every **6 f**, no tween.
- **Snap:** dots scale to 0 (4 f) as the smooth line turns into the snapped line (5 f). The edge glow decays over about 1.5 s.
- **Dim / lit:** inactive siblings sit at icon 0.2 and label #5B5A5F; they light up (5 f crossfade) on their spoken word.

### 10.5 Camera

- Wrap each scene in a camera layer: `perspective(1200px) translate() scale() rotateX() rotateY()` around (640, 360).
- **Hold drift:** scale 1.00 → 1.03 linearly across a hold (1–2% on short holds). Push-ins on a topic: 1.1–1.15× over 15 f.
- **Reframe as content grows:** when new cards are added, zoom out 4–8% and pan so the composition stays balanced (14–16 f, `move`).
- **3D tilt-in** of a hero card: rotateX 0→25° with scale 1→1.35 and up 40 px (8 f), held for seconds, then untilted.
- **Whip-pan:** translate 300–600 px plus rotateY 15–20° over 5–7 f with `enter`, with heavy directional blur. The reverse whip takes about 11 f.
- **3D yaw comparison:** the plane rotates rotateY about ±30° over 14 f so one side recedes and the other comes forward. The snap back is fast (6 f) and followed by a glitch flicker.
- **Focus pull on a card group:** rotateY ±12°, rotateX 3°, slight scale-up over 10 f. The focused card is sharp, the others get a 2–3 px blur, and the group drifts about 1°/s. Re-aim on each spoken item.
- **Zoom on a moving object:** about 1.55× over 18 f (`move`). The object **freezes** during the zoom while a tag appears; zoom out takes 27 f and the object resumes.
- **Two-step pull-back:** two 15 f ease-out pull-backs about 2 s apart, also removing a 3D tilt.
- **Collapse into the hero:** all elements rush toward the hero object (pin) with radial motion blur and fade over 10 f, while the hero moves and scales 1.2×.

### 10.6 Motion blur

- Every move faster than about 20 px/frame gets **directional** blur along its axis. Use an SVG `feGaussianBlur stdDeviation="x y"` with the value from velocity × 0.35, capped at 20–24.
- Whips smear about 40 px horizontally. Pushes smear vertically.
- `@remotion/motion-blur` `<CameraMotionBlur>` also works, but it is expensive; use it only for whips.

### 10.7 Ambient loops (required during holds)

| Loop | Spec |
|---|---|
| Marching dashes | strokeDashoffset −1.5 px/frame on every visible connector |
| Flowing data dots | about 150 px/s along connectors |
| Pin ring | sine breathing, **47 f** period, opacity 0.15–1, scale 0.85–1.1 |
| Particle streams | continuous, seeded |
| Data rows | Hot store: about every 2 s a new row fades in at the bottom (8 f), the top row blurs out (10 f), rows shift up 19–29 px (8 f). Durable store: rows append with a green highlight bar fading over 0.7 s. |
| Vehicles | cars drive along streets at 20–40 px/s (map) or loop the road every 3 s |
| Rotation | globe spin; clock hands |
| Icon micro-animations | check orbiting dot; dedupe dot split/merge every 0.8 s; waveform scroll |
| Ring breathing | k-rings brighten inner → outer every 1.5 s |
| Camera drift | 1–3% over the hold |

---

## 11. Transitions

| Transition | When | Spec |
|---|---|---|
| **Vertical push** (default section change) | new topic | Out: translateY 0 → −720 px, `exit` (quart-in), 18–21 f (up to 34 f for a slow push). In: from +360–720 px on the `rise` spring, about 25 f. Vertical motion blur on both. |
| **Push + light bloom** | big chapter change | Push (out up, or down for variety) plus a white radial bloom from the spotlight side peaking about 10 f in and decaying over about 16 f; the spotlight can switch between top and bottom. About 27–42 f total. The new hero then draws or rises on. |
| **Element persistence** | same topic, next beat | No transition. The hero stays; others fade out (6 f) and new ones build in. Titles rise to make room (18–21 f, `move`). |
| **Morph** | an object becomes the next concept | e.g. doc → app tile; data dot → pin; hex blob → pin; cluster → icon; globe → flat grid. 10–15 f, with a crossfade between the shapes. |
| **Collapse into hero** | wrapping up a diagram | Elements rush into the hero with radial blur (10 f); the hero carries into the next scene. |
| **Zoom-through crossfade** | out of a screenshot or b-roll | The outgoing layer scales up about 1.3× and darkens; the incoming layer scales 1.3 → 1.0. Same direction, 18 f. |
| **Crossfade** | photo/AI b-roll ↔ diagram | 8–10 f linear; can add a slight push-in on the incoming shot. |
| **Crossfade + lateral slide** | returning to an earlier diagram | The incoming diagram slides in from about +60 px while fading in, 20 f. |
| **Fade out → fade/scale in** | small reset | Fade 5–14 f, 1–3 empty frames, then the new hero fades and scales 0.92 → 1 (9 f). |
| **Dip to black** | leaving a cinematic shot | Out 4 f, black 1 f, in 3 f. |
| **Hard cut** | real-world b-roll (screen recording, blog), brand sting | 0 f. B-roll is full-bleed, edge to edge. Time-lapse scrolling in jumps of 1–3 f. |
| **Mosaic block wipe** | swapping content inside a map card | Irregular rectangular blocks reveal the new image, 9 f (rare). |
| **Whip-pan** | moving sideways to a related panel | 5–7 f with blur and rotateY. |
| **Collapse to chip** | into the outro | Everything shrinks into a small glowing chip (about 30 px) and vanishes in 15 f; the background goes to pure black. |

**Distribution in the reference:** about 52 scene-level changes in 11.6 minutes, almost all animated. Use hard cuts for **at most 3–5 moments**: proof inserts and the brand sting.

---

## 12. Pacing and rhythm

**Measured stats**

- The frame is fully still 53% of the time.
- About **37 motion onsets per minute**.
- Idle holds: median 1.3 s, max about 5.6 s.
- Motion bursts: median 0.5 s.
- Beats: median **3.9 s** apart.
- Scenes: median about 9 s, mean about 13 s.

**Rules**

- **Burst then hold.** Build a scene with a quick cluster of reveals (each 0.3–1 s, all on spoken words), then hold while the VO explains, with ambient loops running.
- **Cold open is dense.** In the first 25–30 s something changes every **1.5–3 s**: pop, tilt, counter, pins, routes, whip, "?".
- **Explanatory sections** have a new reveal every **3–6 s**. Long holds of 10–30 s are allowed only with ambient loops **and** a small beat (highlight pulse, colour flash, "?" glyph) every 3–4 s.
- **Fixed micro-staggers** apply only to many small siblings (1–2 f). Larger items (cards, list items) follow the VO; group unfolds happen at the same time or 8–12 f apart.
- Entrances are short (4–18 f) and exits shorter (4–9 f). Exits happen **just before** the next topic's first word.
- Spend about 0.5 s on a scene change (push), and land the new hero by the first content word.
- **End with a recap.**
  - A row of dim cards lights up one by one on each spoken point.
  - A one-line "A · B · C · D · E" recap gets a word-by-word highlighter (about 0.6 s per word).
  - Then interview / "think about it" question cards with focus pulls.
  - Then the brand outro (about 8 s).
  - End on a held frame, **with no fade to black**.

---

## 13. Sound effects (AI-placed)

**Scope**

- Claude places **SFX only**: UI pops, whooshes, ticks, typing, data blips, impacts, risers, glitches and short loops tied to on-screen motion.
- **Do not add music or background ambience.** The user adds those.
- Provide a **mute switch** for the SFX track and render a **separate SFX stem** (`npx remotion render Main out/sfx.wav --codec=wav` with video layers hidden, or a dedicated audio-only composition).

### 13.1 Folder and naming

Put files in `public/sfx/` using these canonical names. Numbered variants rotate so repeats don't sound copy-pasted.

```
public/sfx/
  whoosh_soft_01..03.wav   whoosh_big_01..02.wav   whip_01..02.wav   swish_up_01.wav
  pop_ui_01..03.wav        pop_soft_01..02.wav     click_ui_01..02.wav
  tick_01..02.wav          blip_data_01..03.wav    typing_mech_short.wav
  zip_line_01..02.wav      card_flip_01..02.wav    shimmer_01.wav
  marker_swipe_01..02.wav  pen_scratch_01.wav      ui_error_01.wav  ui_success_ding_01.wav
  alarm_blip_01.wav        impact_soft_01..02.wav  riser_short_01.wav
  glitch_short_01..02.wav  magnet_snap_01.wav      power_up_01.wav  power_down_01.wav
  thud_low_01.wav          sparkle_01..02.wav      neon_flicker_on_01.wav
  bed_data_stream_loop.wav bed_electric_hum_loop.wav clock_tick_loop.wav
```

### 13.2 Event → SFX map

| Visual event | Cue | Epidemic Sound search terms | Vol (0–1) | Lead (frames before visual) |
|---|---|---|---|---|
| Vertical push / scene change | `whoosh` | "whoosh soft", "swoosh transition", "air swish" | 0.45 | 4 |
| Push + light bloom / chapter change | `whooshBig` + `riser` ending on the bloom peak | "cinematic whoosh", "riser short", "reverse swell" | 0.55 / 0.35 | 6 / riser end at peak |
| Whip-pan, camera whip, fast reframe | `whip` | "whip pan", "fast whoosh" | 0.5 | 2 |
| Title rises / small move | `swishUp` | "light swish", "ui swipe" | 0.35 | 3 |
| Card / pill / badge unfold | `pop` (or `flip` for 3D flips) | "ui pop", "bubble pop soft", "card flip" | 0.35 | 0–1 |
| Pins, dots, phones popping in (staggered) | `popSoft` ×N (thin to max 6, 2–3 f apart) | "pop small", "pin drop", "notification pop" | 0.25 | 0 |
| Text blur-in (titles) | `popSoft` or none (small labels stay silent) | "ui tick soft" | 0.2 | 0 |
| Typewriter | `typing` trimmed to the typing length | "mechanical keyboard typing short" | 0.3 | 0 |
| Connector draw | `zip` | "zip swipe", "line draw", "electric zip" | 0.3 | 1 |
| Data dots / particle flow (hold) | `bedData` loop | "data stream loop", "digital processing loop" | 0.06 | 0 |
| Counter steps / clock ticks | `tick` per step | "clock tick", "digital tick" | 0.2 | 0 |
| Neighbour chase / list blips | `blip` per item, rising pitch if possible | "digital blip", "ui beep" | 0.18 | 0 |
| Marker highlight / underline swipe | `marker` | "marker swipe", "highlighter" | 0.3 | 0 |
| Strike-through | `scratch` | "pen scratch", "cross out" | 0.35 | 0 |
| Turns red / error / rejected | `error` | "ui error", "denied beep", "low buzz" | 0.35 | 0 |
| Success / green / confirm / lit card | `success` (soft) | "ui confirm", "positive ding" | 0.25–0.35 | 0 |
| Alarm flash (4-frame flicker) | `alarm` | "alarm blip", "warning beep" | 0.3 | 0 |
| Big stat / hero reveal / brand hit | `impact` | "soft impact", "sub hit", "cinematic boom soft" | 0.5 | 0 |
| Glow-up / power-up / pipeline appears | `powerUp` | "power up", "energy charge" | 0.3 | 2 |
| Power-down / collapse | `powerDown` | "power down blip" | 0.25 | 0 |
| Glitch flicker / slot roll / scramble | `glitch` | "glitch short", "digital glitch" | 0.3 | 0 |
| Snap-to-road / magnetic lock | `snap` | "magnetic snap", "lock click" | 0.4 | 0 |
| DB rises / heavy object lands | `thud` | "low thud", "soft bass hit" | 0.4 | 0 |
| Sparkle bullets / chips / tag | `sparkle` | "sparkle", "twinkle" | 0.22 | 0 |
| Shimmer on wipe / glow text | `shimmer` | "shimmer", "magic swell short" | 0.25 | 2 |
| Neon outro rectangles | `neon` | "neon flicker on", "fluorescent buzz" | 0.4 | 0 |
| Electric hum under long glowing holds (optional, only if it is SFX-like) | `bedHum` | "electric hum loop" | 0.05 | 0 |
| Clock on screen | `clockTick` loop for its lifetime | "clock ticking loop" | 0.12 | 0 |
| Mouse click on cut to a screen recording | `click` | "mouse click" | 0.3 | 0 |

### 13.3 Mixing and timing rules

- **Sync point.** Whooshes start *before* the visual (lead 2–6 f) so their peak lands on the motion's midpoint. Pops and impacts land **exactly** on the first visible frame. Risers **end** on the hit.
- **Density.** At most about **2–3 cues per second**. Don't stack more than 2 cues in the same 3 frames. Thin long staggers (30 pins → 5–6 pops).
- **VO first.** Keep SFX peaks around −18 to −12 dBFS under a −6 dBFS VO. Linear `volume` 0.15–0.55 as tabled; beds at 0.04–0.08.
- **Duck under speech.** Lower beds and loops (`bedData`, `bedHum`, `clockTick`) by about 40% while the VO is talking. Leave one-shot cues alone.
- **Silence is allowed.** Small label blur-ins and ambient loops other than beds have no sound. Long holds may be SFX-silent.
- **Variation.** Rotate variants. Never use the identical file twice within 1 s.
- **Cue sheet.** Also write `out/sfx_cues.csv` (`frame,seconds,cue,file,volume`) so the user can review and replace sounds.

---

## 14. Narrative structure template

The reference follows this arc. Map the VO onto it and adapt it, but keep the order and rhythm.

| # | Part | Typical length | Visual approach |
|---|---|---|---|
| 1 | **Cold-open hook** | 25–30 s | Real product UI (a map card popping in, tilting into 3D), quick facts (counter "0→5 Sec"), the scale of things (phone grid, many pins/cars), a whip to a related system, then a big translucent "?" |
| 2 | **Brand sting** | about 6 s | Hard cut to the user's logo animation (or skip it). The watermark is hidden here. |
| 3 | **Problem framing** | 30–60 s | Push into a single hero (a DB cylinder). A colour morph to red on "millions", then a grey neutral "Storage". A write enters it. Fan-out to consumers (One Write → 3 readers with coloured lanes). |
| 4 | **Naive approach + scale shock** | 30–60 s | A data table plus a query chip. The line turns red. Push-in to the red stat "5,000,000 / sec" with streaks and a giant dark-red numeral. "X = Y" headline with red particles, then a red strike-through. |
| 5 | **The fix, piece by piece** | several 20–40 s sections | Each section: vertical push → typed metallic title or headline → hero visual → elements unfold on each spoken component → long hold with loops and beats. Use proof inserts (blog/doc screenshot) for credibility. |
| 6 | **Edge cases / real world** | 30–90 s | Cinematic AI b-roll with 2D overlays; a duel or race (A vs B) with badges, arrows, success/fail and an alarm flash; a clock for timeouts. |
| 7 | **The whole design** | 15–30 s | Return to the master diagram (persisted), add the last component, pull back and untilt, then a blur-wave title: "**Real trick** that makes the whole design work". |
| 8 | **Polish details** | 30–60 s | Smaller technical points with their own metaphors (road + noisy GPS → smoothing → snap). |
| 9 | **Recap** | 20–40 s | Dim card row lighting up per point; an evolution pipeline; a one-line recap with a word highlighter. |
| 10 | **Interview questions** | 15–20 s | 3 numbered glass question cards with red risky phrases and 3D focus pulls on each. |
| 11 | **Outro** | about 8 s | Collapse to a chip, pure-black background, neon logo line-draw, letter scramble, neon frames, end on a hold. |

---

## 15. Scene recipe catalogue

Each recipe lists the beats as frame offsets from the scene start (or from its trigger word).

**R1. Hero product card (cold open)** — spotlight: bottom
1. Light UI card (map) pops: scale 0.15 → 1 and rotate −12° → 0 with the `pop` spring and motion blur, in 8 f. Brand pill above its top-left.
2. Cars fade in and drive.
3. +50 f: tilt into 3D (rotateX 25°, scale 1.35, 8 f); hold 4 s; untilt (8 f).
4. Counter to the right: the card group slides left 60 px; digits step every 6 f.
5. A grid of 24 small phones builds in about 20 f (1 f stagger); content swaps by mosaic wipe; pins pop with a 1–2 f stagger; routes draw (6 f).
6. A pill grows from a seed line under the card.
7. Whip-pan into a 3D side layout, with three cards sliding in 6–7 f apart; whip back out.
8. A big grey "?" fades in over the card.

**R2. Hero object + label + morph** — spotlight: top (after a bloom push)
1. A DB rises from below (dark → bright) over about 12 f.
2. On "millions": hue morph to red over 10 f, and the label wipes in above it.
3. Strike the label; morph to grey; a big label wipes in below.
4. An arrow draws down; a doc travels into the DB (30 f); the doc scales up (6 f) and morphs into an app tile.

**R3. One source → N readers (fan-out)** — spotlight: top
1. The source tile appears at the left inside a 3D-tilted camera (rotateY −15°).
2. Coloured dashed connectors draw out (10 f).
3. Empty cards appear and fill one by one **on their words** (icon, then title wipe).
4. A two-step camera pull-back untilts the layout.
5. Long hold with a "?" glyph flash and micro-zoom.
- Later re-entries of the same diagram add one card each time.

**R4. Table → scale shock** — spotlight: top
1. Push in the table (small).
2. A dim background silhouette (map pin) fades in; a SQL chip appears; a dashed link turns red with glow.
3. Push-in: the table goes 0.55 → 0.9×; the red "5,000,000" wipes in over 8 f, then "/ sec".
4. Giant dark-red "1" behind; red streaks run throughout.
5. Pull back; seed-line cards grow; connectors draw.
6. Highlight pulses and red marker boxes on each spoken property.

**R5. A ↔ B flow with a problem then a fix** — spotlight: top
1. Side cards are already present.
2. Headline "X = Y" with a red operator; red particles stream.
3. On "but": a red strike over 16 f; hold.
4. The headline fades; the particles turn teal; the pipeline box seed-grows in the middle.
5. Stage labels and animated icons appear on each word.

**R6. Typed title → structure** — spotlight: top
1. Push in. The metallic Courier title types at 3 f/char at the centre and holds about 3 s.
2. The title rises (18 f).
3. N shard cards sliver-unfold together (16 f).
4. A red tree connector draws from the centre out (9 f); dots appear.
5. Field labels change colour on cue.
6. The shards fade (6 f), the title rises again, and a globe pops (60% → 100%, 15 f, expo-out).

**R7. Proof insert**
- **Full-bleed version:**
  1. Hard cut to the screen recording or blog, time-lapsed scroll.
  2. Hard cut back to a modified hero (e.g. a dimmed globe with an extruded hex); the piece snaps back in 2 f.
- **Tilted version:**
  1. The brand word fades and scales in (12 f).
  2. The screenshot grows from behind it as a trapezoid (rotateX 10°, perspective 1500, radius 10). Fast zoom 0.75 → 1.35 (8 f), then ease back to 1.0.
  3. A dark marker highlight runs across the key phrase.
  4. Zoom-through crossfade (18 f) into the next diagram.

**R8. Grid concept (H3 / neighbours)**
1. The globe shrinks and unwraps into a flat hex grid (33 f).
2. A big gradient wordmark appears small and faint, then scales up (18 f). The subtitle wipes in (16 f).
3. The centre cell powers up (2.2×) and back.
4. Push-in 1.12×. A neighbour chase lights cells 6 f apart.
5. A caption fades in.
6. Isolate the cluster (others fade, 9 f), zoom 2.7× (14 f), morph it into an icon, and label it with a wipe.

**R9. Comparison (A vs B shapes)**
1. Icon A moves to the left third (8 f); icon B fades in on the right.
2. 3D yaw of about 30° (14 f) to favour B. Its rays solidify and flare.
3. Snap back flat (6 f) with a glitch flicker.
4. Both fade with a 7% shrink (14 f).

**R10. Pin + stores (hot vs durable)**
1. The pin moves left (27 f). The hot card slides in from the right edge with blur, tilted.
2. Red dot clusters stream to it; rows loop.
3. Chips blur in 20 f apart.
4. The durable card flips in below while the hot card moves up (17 f).
5. Green dots stream; a progress bar sweeps.

**R11. Cinematic b-roll with overlays** — AI still/clip
1. Crossfade in. No camera move for about 10 s.
2. A pin and ring on the subject.
3. A phone mockup with a red status fades in (3 f).
4. A red dashed arrow draws (9 f); a logo pops (2 f).
5. A cyan arc draws (8 f); a label types.
6. Second shot (crossfade + push-in): a red highlight frame around the subject, two glass decision panels, and both connectors drawing outward together (13 f).
7. Exit with a dip to black.

**R12. Node → server with branches** — spotlight: bottom
1. The phone (with floor reflection) and server tile fade in 3 f apart.
2. A cyan dashed line with flowing dots draws (7 f); the label types.
3. The line mixes in red dots.
4. The camera pans left and zooms out 4% while a red elbow connector draws to a red "No …" card.
5. Later a cyan elbow connector goes to the positive card, with a clock badge.
6. Exit: a flowing dot morphs into the pin of the next scene.

**R13. Typed narration line**
1. The pin sits at the left.
2. A 30 px narration sentence types at 1 f/char.
3. A cyan sub-note blur-ins.
4. Fade out over 6 f.

**R14. k-ring / expanding search**
1. Concentric hexes pop (0.1 → 1.05 → 1, 9 f) and shift up.
2. The "k=1 → k=2 → k=3" label rises in.
3. A purple marker wipes behind each k on its word; the matching ring brightens.
4. "Rank by ETA" words blur in, with an amber marker.
5. "Raw distance" gets a pink strike.

**R15. Race / concurrency duel** — spotlight: bottom
1. The actor cards flip in together (9 f).
2. Arrows draw toward the centre; the object fades in "lights on".
3. The status badge is born (green, cooling).
4. Both cards glow on "both request".
5. RESERVED slot-roll with a glitch and orange glow.
6. The camera zooms out 8%; the DB rises behind.
7. Winner's arrow turns green; loser's turns red.
8. The loser flips out; the camera re-centres.
9. The object alarm-flashes; a clock grows from a dot and ticks.
10. A crowd of glyphs slides in, column by column, 3 f apart.

**R16. Index → candidates → authority**
1. Glowing index card with a mini-map and a candidate list.
2. An arrow and label blur in (5 f).
3. A silver DB rises (12 f) with a caps label.

**R17. Master diagram reprise**
1. Crossfade and slide back into the persistent diagram, pushed in about 15% and tilted (rotateY −6°).
2. The new card unfolds with its coloured connector.
3. A white glow highlights the key phrase.
4. Long hold.
5. Pull back and untilt (16 f); a blur-wave title appears at the top.

**R18. Road metaphor (noise → smoothing → snap)** — spotlight: bottom
1. Push-down with bloom; the road strokes on from the left (16 f).
2. The title blur-ins. Noisy red dots pop together (5 f).
3. Bullets with sparkle icons wipe in on each word; they exit.
4. A teal smoothing line draws (14 f); its title blurs in; an info card unfolds (12 f).
5. Snap: dots shrink (4 f) and the line turns into the green centre line.
6. The car loops every 3 s.
7. Zoom 1.55× on the car (freeze, yellow "100ms" tag along the tangent), then zoom out.

**R19. Recap card row** — spotlight: bottom
1. Four cards sliver-unfold together (9 f), dim. Thin 1 px connectors (#26232B) sit in the gutters.
2. Each card lights (icon 0.2 → 1, label grey → white, 5 f) on its spoken point.

**R20. Evolution pipeline**
1. Title plus a glossy DB (fade/scale 0.92 → 1, 9 f); a question pill unfolds (7 f).
2. The pill collapses, the title fades, and the DB scales to 1.45× with a glow.
3. The camera dollies out as the pipeline blurs in (15 f): query shapes → coloured DBs → branch to consumers.
4. Emphasis: nodes scale to 1.25× with glow, 4 f apart; they snap back together.

**R21. One-line recap**
1. Return to the road with the car looping and a slow push-in of 1.1×.
2. The "A · B · C · D · E" line rises in (6 f).
3. A teal highlighter jumps word by word (about 0.6 s each).

**R22. Interview questions** — spotlight: bottom
1. Three glass cards unfold (8 f; the third 2 f later) with numbered badges and red risky phrases. A heading and a lilac gradient tag sit at the top-left.
2. 3D focus pull on each question in turn as it is read, with a red brush underline swiping under the first one.
3. Return to flat.

**R23. Outro**
1. Collapse to a chip (15 f); pure black.
2. A white dot, then glowing line segments draw the logo (20 f).
3. Recolour to the gradient neon; letters scramble 0/1 → name (12 f); faint boxed binary rows sit in the background.
4. Neon frames flick on (3 f with a glow overshoot).
5. The logo shrinks into a ring badge with an orbiting spark (about 1.2 s).
6. Hold about 3 s. No fade to black.

---

## 16. Remotion implementation recipes

These are compact, idiomatic Remotion v4 snippets. Build them as shared components under `src/kit/` and compose scenes from them.

**Packages:** `remotion`, `@remotion/google-fonts`, `@remotion/paths`. Optional: `@remotion/motion-blur` and `@remotion/install-whisper-cpp` (for transcription).

### 16.1 Stage (author at 1280×720, render at any size)

```tsx
import {AbsoluteFill, useVideoConfig} from 'remotion';

export const Stage: React.FC<{children: React.ReactNode; bg?: string}> = ({children, bg = '#030005'}) => {
  const {width} = useVideoConfig();
  return (
    <AbsoluteFill style={{background: bg, overflow: 'hidden'}}>
      <div style={{position: 'absolute', width: 1280, height: 720, transform: `scale(${width / 1280})`, transformOrigin: '0 0'}}>
        {children}
      </div>
    </AbsoluteFill>
  );
};
```

### 16.2 Fonts

```ts
import {loadFont as inter} from '@remotion/google-fonts/Inter';
import {loadFont as poppins} from '@remotion/google-fonts/Poppins';
import {loadFont as mono} from '@remotion/google-fonts/JetBrainsMono';
import {loadFont as courier} from '@remotion/google-fonts/CourierPrime';

export const F = {
  sans: inter('normal', {weights: ['400', '500', '600', '700', '900'], subsets: ['latin']}).fontFamily,
  card: poppins('normal', {weights: ['400', '500', '600'], subsets: ['latin']}).fontFamily,
  mono: mono('normal', {weights: ['400', '500', '700'], subsets: ['latin']}).fontFamily,
  type: courier('normal', {weights: ['400', '700'], subsets: ['latin']}).fontFamily,
};
```

### 16.3 Easing helpers

```ts
import {Easing, interpolate, spring} from 'remotion';

export const E = {
  enter: Easing.bezier(0.16, 1, 0.3, 1),
  move: Easing.bezier(0.65, 0, 0.35, 1),
  exit: Easing.in(Easing.poly(4)),
};
export const SPRING = {
  flip: {stiffness: 200, damping: 20, mass: 1},
  rise: {stiffness: 60, damping: 15, mass: 1},
  pop: {stiffness: 180, damping: 14, mass: 0.8},
};
export const prog = (f: number, at: number, dur: number, easing = E.enter) =>
  interpolate(f, [at, at + dur], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing});
export const springAt = (f: number, fps: number, at: number, config = SPRING.flip) =>
  spring({frame: f - at, fps, config});
export const breathe = (f: number, period = 47) => 0.5 + 0.5 * Math.sin((f / period) * Math.PI * 2);
```

### 16.4 Spotlight

```tsx
export const Spotlight: React.FC<{spot: 'top' | 'bottom' | 'none'; intensity?: number}> = ({spot, intensity: a = 0.6}) => {
  if (spot === 'none') return null;
  const bg = spot === 'bottom'
    ? `radial-gradient(ellipse 750px 550px at 640px 800px, rgba(255,255,255,${0.3 * a}) 0%, rgba(255,255,255,${0.17 * a}) 25%, rgba(255,255,255,${0.07 * a}) 50%, rgba(255,255,255,${0.02 * a}) 75%, transparent 100%)`
    : `radial-gradient(ellipse 625px 300px at 640px -40px, rgba(255,255,255,${0.13 * a}) 0%, rgba(255,255,255,${0.08 * a}) 35%, rgba(255,255,255,${0.03 * a}) 65%, transparent 100%)`;
  return <AbsoluteFill style={{background: bg}} />;
};
```

### 16.5 Glass card + sliver unfold

The unfold scales around the **element's own centre**, so the wrapper owns the position box.

```tsx
export const GlassCard: React.FC<{r?: number; children?: React.ReactNode}> = ({r = 14, children}) => (
  <div style={{
    position: 'absolute', inset: 0, borderRadius: r, overflow: 'hidden',
    background: 'linear-gradient(135deg, #2D2C33 0%, #202129 38%, #0B0B0E 100%)',
    boxShadow: 'inset 1px 1px 0 rgba(255,255,255,0.14)',
  }}>
    <div style={{position: 'absolute', inset: 0, background:
      'radial-gradient(ellipse 60% 70% at 0% 0%, rgba(255,255,255,.06), transparent 70%),' +
      'linear-gradient(120deg, transparent 30%, rgba(255,255,255,.025) 42%, transparent 55%)'}} />
    {children}
  </div>
);

export const Unfold: React.FC<{x: number; y: number; w: number; h: number; at: number; out?: number;
  shell: React.ReactNode; children?: React.ReactNode; tiltY?: number; tiltX?: number}> =
({x, y, w, h, at, out, shell, children, tiltY = 0, tiltX = 0}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (f < at - 3 || (out !== undefined && f >= out + 6)) return null;
  let sx = Math.max(0.015, springAt(f, fps, at));
  if (out !== undefined) sx = Math.max(0.015, sx * (1 - prog(f, out, 6, E.exit)));
  const sy = interpolate(f, [at - 3, at], [0.25, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const blur = interpolate(f, [at, at + 10], [6, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const contentO = prog(f, at + 6, 10, E.move) * (out !== undefined ? 1 - prog(f, out - 4, 4) : 1);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h,
      transform: tiltX || tiltY ? `perspective(1200px) rotateY(${tiltY}deg) rotateX(${tiltX}deg)` : undefined}}>
      <div style={{position: 'absolute', inset: 0, transform: `scale(${sx}, ${sy})`,
        filter: `blur(${blur}px) brightness(${1 + Math.max(0, 1 - sx) * 2.5})`}}>{shell}</div>
      <div style={{position: 'absolute', inset: 0, opacity: contentO}}>{children}</div>
    </div>
  );
};
// <Unfold x={795} y={135} w={225} h={90} at={beats.riderMap} shell={<GlassCard r={14} />}> ...content </Unfold>
```

### 16.6 Text primitives

```tsx
// Default entrance: blur 8 -> 0, rise 8px, 7f. Optional exit: drift up + blur, 6f.
export const BlurIn: React.FC<{at: number; out?: number; children: React.ReactNode; style?: React.CSSProperties}> =
({at, out, children, style}) => {
  const f = useCurrentFrame();
  const p = prog(f, at, 7);
  const q = out === undefined ? 0 : prog(f, out, 6, E.exit);
  return <div style={{opacity: p * (1 - q), filter: `blur(${(1 - p) * 8 + q * 8}px)`,
    transform: `translateY(${(1 - p) * 8 - q * 10}px)`, ...style}}>{children}</div>;
};

// Soft wipe: the mask moves, the text doesn't.
export const WipeText: React.FC<{at: number; dur?: number; feather?: number; children: React.ReactNode}> =
({at, dur = 10, feather = 18, children}) => {
  const p = interpolate(useCurrentFrame(), [at, at + dur], [-feather, 100 + feather],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const m = `linear-gradient(90deg, #000 ${p}%, transparent ${p + feather}%)`;
  return <div style={{WebkitMaskImage: m, maskImage: m, display: 'inline-block'}}>{children}</div>;
};

// Typewriter: no cursor; the remainder is invisible so the line stays left-anchored at its final centred spot.
export const Typewriter: React.FC<{at: number; text: string; fpc?: number; style?: React.CSSProperties}> =
({at, text, fpc = 3, style}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const n = Math.min(text.length, Math.floor((f - at) / fpc) + 1);
  return <span style={{whiteSpace: 'pre', ...style}}>{text.slice(0, n)}
    <span style={{visibility: 'hidden'}}>{text.slice(n)}</span></span>;
};

export const metalMono: React.CSSProperties = {
  fontFamily: F.type, fontWeight: 700, fontSize: 64,
  background: 'linear-gradient(180deg, #FCF9FD 20%, #676468 90%)',
  WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
  filter: 'drop-shadow(0 3px 2px rgba(0,0,0,.85))',
};

// Blur-wave (3f stagger) or rise (5f stagger, +70px on the rise spring), one accent word via color map.
export const Words: React.FC<{at: number; text: string; mode?: 'wave' | 'rise'; color?: Record<number, string>}> =
({at, text, mode = 'wave', color = {}}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <div style={{display: 'flex', gap: '0.28em', justifyContent: 'center'}}>
      {text.split(' ').map((w, i) => {
        const s = at + i * (mode === 'rise' ? 5 : 3);
        const p = mode === 'rise' ? springAt(f, fps, s, SPRING.rise) : prog(f, s, 5);
        return <span key={i} style={{display: 'inline-block', color: color[i] ?? '#fff',
          opacity: Math.min(1, p * 1.4), filter: `blur(${(1 - p) * 10}px)`,
          transform: mode === 'rise' ? `translateY(${(1 - p) * 70}px)` : undefined}}>{w}</span>;
      })}
    </div>
  );
};

// Marker box: grows from the left (4f), holds, then retracts by its LEFT edge sliding right (4f).
export const Highlight: React.FC<{at: number; holdFor?: number; color?: string; children: React.ReactNode}> =
({at, holdFor = 6, color = '#279498', children}) => {
  const f = useCurrentFrame();
  const g = prog(f, at, 4);
  const s = Number.isFinite(holdFor) ? prog(f, at + 4 + holdFor, 4) : 0;
  return (
    <span style={{position: 'relative', display: 'inline-block', padding: '0 4px'}}>
      <span style={{position: 'absolute', top: '8%', bottom: '4%', left: `${s * 100}%`,
        width: `${(g - s) * 100}%`, background: color, borderRadius: 2}} />
      <span style={{position: 'relative'}}>{children}</span>
    </span>
  );
};

// Glowing strike-through, left -> right, 16f.
export const Strike: React.FC<{at: number; color?: string; children: React.ReactNode}> =
({at, color = '#EF161C', children}) => {
  const p = prog(useCurrentFrame(), at, 16, E.move);
  return (
    <span style={{position: 'relative', display: 'inline-block'}}>{children}
      <span style={{position: 'absolute', left: -6, top: '52%', height: 3, borderRadius: 2,
        width: `calc(${p * 100}% + ${p * 12}px)`, background: color,
        boxShadow: `0 0 6px ${color}, 0 0 14px ${color}`}} />
    </span>
  );
};
```

### 16.7 Dashed connector (draw-on, marching dashes, flowing dots)

```tsx
import {getLength, getPointAtLength} from '@remotion/paths';
import {useId, useMemo} from 'react';

export const Connector: React.FC<{d: string; at: number; dur?: number; color: string; width?: number;
  dash?: [number, number]; dots?: {spacing: number; speed: number}}> =
({d, at, dur = 10, color, width = 2, dash = [10, 6], dots}) => {
  const f = useCurrentFrame();
  const id = useId().replace(/:/g, '');
  const len = useMemo(() => getLength(d), [d]);
  const p = prog(f, at, dur);
  if (p <= 0) return null;
  return (
    <svg width={1280} height={720} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
      <mask id={`m${id}`} maskUnits="userSpaceOnUse">
        {/* reveal with a mask so the dash pattern itself never stretches */}
        <path d={d} stroke="#fff" strokeWidth={width + 8} fill="none"
          strokeDasharray={len} strokeDashoffset={len * (1 - p)} />
      </mask>
      <g mask={`url(#m${id})`} style={{filter: `drop-shadow(0 0 3px ${color})`}}>
        <path d={d} stroke={color} strokeWidth={width} fill="none" strokeLinecap="round"
          strokeDasharray={`${dash[0]} ${dash[1]}`} strokeDashoffset={-(f - at) * 1.5} />
      </g>
      {dots && p >= 1 && Array.from({length: Math.ceil(len / dots.spacing)}).map((_, i) => {
        const s = ((f - at) * dots.speed + i * dots.spacing) % len;
        const pt = getPointAtLength(d, s);
        return <circle key={i} cx={pt.x} cy={pt.y} r={4} fill={color}
          opacity={Math.min(1, s / 30, (len - s) / 30)}
          style={{filter: `drop-shadow(0 0 5px ${color}) drop-shadow(0 0 10px ${color})`}} />;
      })}
    </svg>
  );
};
```

### 16.8 Particle stream (deterministic)

```tsx
import {random} from 'remotion';

export const Stream: React.FC<{from: [number, number]; to: [number, number]; color: string;
  band?: number; count?: number; speed?: number; seed?: string}> =
({from, to, color, band = 60, count = 40, speed = 12, seed = 's'}) => {
  const f = useCurrentFrame();
  const [dx, dy] = [to[0] - from[0], to[1] - from[1]];
  const len = Math.hypot(dx, dy);
  return (
    <svg width={1280} height={720} style={{position: 'absolute', inset: 0}}>
      {Array.from({length: count}).map((_, i) => {
        const t = ((random(`${seed}o${i}`) * len + f * speed * (0.85 + 0.3 * random(`${seed}v${i}`))) % len) / len;
        const lat = (random(`${seed}l${i}`) - 0.5) * band;
        return <circle key={i} cx={from[0] + dx * t - (dy / len) * lat} cy={from[1] + dy * t + (dx / len) * lat}
          r={1.5 + random(`${seed}r${i}`)} fill={color} opacity={Math.min(1, t * 8, (1 - t) * 8)}
          style={{filter: `drop-shadow(0 0 4px ${color})`}} />;
      })}
    </svg>
  );
};
```

### 16.9 Camera, directional motion blur, push transition

```tsx
export const DirBlur: React.FC<{bx: number; by: number; children: React.ReactNode}> = ({bx, by, children}) => {
  const id = useId().replace(/:/g, '');
  const on = bx > 0.3 || by > 0.3;
  return (
    <>
      {on && <svg width={0} height={0} style={{position: 'absolute'}}>
        <filter id={`b${id}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={`${bx} ${by}`} /></filter></svg>}
      <div style={{position: 'absolute', inset: 0, filter: on ? `url(#b${id})` : undefined}}>{children}</div>
    </>
  );
};

// Keyframe track: [[frame, value, easing?], ...] -> value at frame (default easing E.move).
export type Key = [number, number, ((t: number) => number)?];
export const track = (f: number, k: Key[]) => {
  if (f <= k[0][0]) return k[0][1];
  for (let i = 1; i < k.length; i++)
    if (f <= k[i][0]) return interpolate(f, [k[i - 1][0], k[i][0]], [k[i - 1][1], k[i][1]], {easing: k[i][2] ?? E.move});
  return k[k.length - 1][1];
};

export const Camera: React.FC<{x?: Key[]; y?: Key[]; scale?: Key[]; rotX?: Key[]; rotY?: Key[];
  drift?: number; children: React.ReactNode}> = ({x, y, scale, rotX, rotY, drift = 0.03, children}) => {
  const f = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const v = (k: Key[] | undefined, fr: number, d: number) => (k ? track(fr, k) : d);
  const [cx, cy] = [v(x, f, 0), v(y, f, 0)];
  const bx = Math.min(20, Math.abs(cx - v(x, f - 1, 0)) * 0.35);
  const by = Math.min(20, Math.abs(cy - v(y, f - 1, 0)) * 0.35);
  const s = v(scale, f, 1) * (1 + drift * (f / durationInFrames));
  return (
    <DirBlur bx={bx} by={by}>
      <div style={{position: 'absolute', inset: 0, transformOrigin: '640px 360px',
        transform: `perspective(1200px) translate(${cx}px, ${cy}px) scale(${s}) rotateX(${v(rotX, f, 0)}deg) rotateY(${v(rotY, f, 0)}deg)`}}>
        {children}
      </div>
    </DirBlur>
  );
};

// Vertical push: wrap the outgoing scene in <PushOut at={...}> and the incoming one in <PushIn>.
// Overlap their <Sequence>s by about 20 frames.
export const PushOut: React.FC<{at: number; dur?: number; children: React.ReactNode}> = ({at, dur = 20, children}) => {
  const f = useCurrentFrame();
  const p = prog(f, at, dur, E.exit);
  const vel = p - prog(f - 1, at, dur, E.exit);
  return <DirBlur bx={0} by={Math.min(24, vel * 288)}>
    <div style={{position: 'absolute', inset: 0, transform: `translateY(${-p * 720}px)`}}>{children}</div></DirBlur>;
};
export const PushIn: React.FC<{distance?: number; children: React.ReactNode}> = ({distance = 720, children}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = springAt(f, fps, 0, SPRING.rise);
  const vel = p - springAt(f - 1, fps, 0, SPRING.rise);
  return <DirBlur bx={0} by={Math.min(24, vel * distance * 0.4)}>
    <div style={{position: 'absolute', inset: 0, transform: `translateY(${(1 - p) * distance}px)`}}>{children}</div></DirBlur>;
};
```

### 16.10 Sound effects

```tsx
import {Audio, Sequence, staticFile} from 'remotion';

export const SFX = {
  whoosh: {files: ['whoosh_soft_01.wav', 'whoosh_soft_02.wav', 'whoosh_soft_03.wav'], vol: 0.45, lead: 4},
  pop: {files: ['pop_ui_01.wav', 'pop_ui_02.wav', 'pop_ui_03.wav'], vol: 0.35, lead: 0},
  zip: {files: ['zip_line_01.wav', 'zip_line_02.wav'], vol: 0.3, lead: 1},
  bedData: {files: ['bed_data_stream_loop.wav'], vol: 0.06, lead: 0},
  // ... the full list from §13.1 / §13.2
} as const;
export type Cue = {at: number; sfx: keyof typeof SFX; vol?: number; dur?: number; variant?: number};

// `at` is the frame of the VISUAL event; the sound starts `lead` frames earlier. `dur` = looped bed length.
export const Sfx: React.FC<Cue> = ({at, sfx, vol, dur, variant}) => {
  const d = SFX[sfx];
  return (
    <Sequence from={Math.max(0, at - d.lead)} durationInFrames={dur} layout="none" name={`sfx:${sfx}`}>
      <Audio src={staticFile(`sfx/${d.files[(variant ?? at) % d.files.length]}`)}
        volume={vol ?? d.vol} loop={dur !== undefined} />
    </Sequence>
  );
};
export const SfxTrack: React.FC<{cues: Cue[]; enabled?: boolean}> = ({cues, enabled = true}) =>
  enabled ? <>{cues.map((c, i) => <Sfx key={i} {...c} />)}</> : null;
```

- Each scene exports its own `cues: Cue[]`, built from the same `beats` object that drives its visuals, so sound and picture can never drift apart.
- The root renders `<Audio src={staticFile('voiceover.mp3')} />`, all scenes in `<Sequence>`s, and `<SfxTrack enabled={props.sfx} />` per scene.
- Also emit `out/sfx_cues.csv` from the same data.

### 16.11 Remaining patterns (build them the same way)

- **Pin:** an SVG teardrop with a `linearGradient` (#4AD5FE → #3CBEFC → #2585FF), a dark hole, and a ring div under the tip whose opacity and scale come from `breathe(f, 47)`. Pop it in with the `pop` spring from its tip (`transformOrigin: 50% 100%`).
- **Status badge:** `scaleX` from the flip spring; fill `interpolateColors(f, [since, since + 30], [bright, dark])`; label `translateY` roll over 5 f; 1-frame glitch colours on switch.
- **Hue morph:** `filter: hue-rotate(${interpolate(f, [a, a + 10], [0, -150])}deg)` on a flat-colour icon, or `interpolateColors` on the SVG fills.
- **Stepped counter:** `Math.min(to, from + Math.floor((f - at) / 6))`.
- **Car on a path:** `getPointAtLength` and `getTangentAtLength` from `@remotion/paths`, with `rotate(atan2)`.
- **Road:** an SVG path drawn twice — a 44 px #221F27 stroke, and a 2 px dashed (`12 14`) #9A979F stroke. Draw it on with a mask like the connector (16 f).
- **Light bloom:** an `AbsoluteFill` radial-gradient whose white alpha goes 0 → 0.5 → 0 over 27 f.
- **Background glyph:** a huge `div` with the glyph in #641115, `maskImage: linear-gradient(#000 40%, transparent)`, behind the content.
- **Screenshot tilt:** `<Img>` with `transform: perspective(1500px) rotateX(10deg) scale(s)`, radius 10. Zoom with `track` keys [0 → 0.75, 8 → 1.35 (enter), 50 → 1.0 (move)].
- **3D card focus:** a parent with `perspective(1200px) rotateY(±12deg)`; unfocused children get `filter: blur(2.5px)`.
- **Grid of siblings:** map over an array and compute positions from pitch/gutter numbers in §8. Never hand-place each one.
- **Determinism:** use `random(seed)` from remotion for all randomness. Never use `Math.random()`.

### 16.12 Project structure

```
src/
  Root.tsx              // composition (1920x1080, 30fps, duration from VO), <Audio> VO, scenes in <Sequence>
  data/transcript.json  // word timestamps
  data/beats.ts         // scenes + beats in frames (single source of truth for visuals AND sfx)
  kit/                  // primitives from §16
  scenes/               // one file per scene, using recipe names from §15
public/
  voiceover.mp3
  sfx/ ...              // Epidemic Sound files (names from §13.1)
  assets/ ...           // screenshots, logos, 3D icons, b-roll
  brand/logo.png
```

---

## 17. QA checklist

Render a still at every beat and step through each transition at full fps.

**Look**
- [ ] Background is flat #030005 and there is exactly **one** spotlight (top or bottom), static within the scene.
- [ ] No grain, vignette, light leaks or background particles.
- [ ] Cards have the diagonal gradient, a top/left rim only, and **no drop shadow**.
- [ ] Each component's colour is consistent everywhere: icon, tag, connector, dots.
- [ ] At most 2 accents per frame (+ red for problems). One coloured keyword per line.
- [ ] Fonts: Inter, Poppins, JetBrains Mono and Courier Prime, at sizes from §7.2.
- [ ] Content is centred on x = 640, with at least 60 px side margins and 30%+ empty space.
- [ ] Watermark slot is static top-right and hidden during the sting, full-white inserts and the outro.

**Motion**
- [ ] Text enters by blur-in or wipe; cards by sliver-unfold or flip. No plain pop-fades on text.
- [ ] No springy bounce beyond about 5%; exits are faster than entrances.
- [ ] Every fast move has directional motion blur.
- [ ] No hold longer than about 5 s without an ambient loop, and none longer than about 6 s without a beat.
- [ ] Every reveal lands on its spoken word (check against `transcript.json`; within ±2 f).
- [ ] Hero objects persist across beats. Hard cuts are used only for b-roll and the brand sting.
- [ ] Section changes use the vertical push; big chapters add the bloom.

**Audio**
- [ ] Only VO + SFX. **No music or ambience added.**
- [ ] SFX on every push, unfold, connector draw, state change and stat reveal. Small labels stay silent. At most about 2–3 cues per second.
- [ ] Whooshes lead by 2–6 f; pops and impacts are frame-exact.
- [ ] SFX are clearly under the VO.
- [ ] SFX stem and `sfx_cues.csv` are exported.

---

## 18. Appendix: reference video timeline

The timeline is condensed. Times are mm:ss in the source.

| Time | Scene | Notes |
|---|---|---|
| 00:00–00:27 | Cold open: Uber map card pops; 3D tilt; "0→5 Sec" counter; phone grid; mosaic swap; pins and routes; "Matching System" pill; whip to the pricing cards; "?" | Change every 1.5–3 s; bottom spotlight |
| 00:27–00:34 | Brand sting (hard cut) | Replace with your own |
| 00:34–00:48 | Map widens; ~25 cars; phone grid; ~30 pins burst | |
| 00:48–01:09 | Push up + bloom → DB rises; blue→red "Millions"; grey "Storage"; doc writes into DB | Spotlight switches to top |
| 01:09–01:31 | Doc morphs into a "One Write" tile → 3 dashed lanes → Rider Map / Matching / Analytics | 3D, then pull-back; 14 s hold |
| 01:31–02:26 | Push → table + SQL chip → red link → "5,000,000 / sec" with streaks → table feeds 3 cards (Point / Range / History) | Pulses and red markers |
| 02:30–03:30 | "5M Pings = 5M Writes", red particles → strike → teal particles, pipeline (Validate / Dedupe / Adaptive sample) | |
| 03:30–04:14 | Push → typed "find nearby drivers" → 5 shards + red tree → hex globe | |
| 04:14–04:18 | Hard cut: H3 blog screen recording | Full-bleed b-roll |
| 04:18–05:18 | Globe → flat hex grid, "H3 / Geospatial Index", neighbour chase, Hexagon vs Square 3D yaw, "Partition by geography" | Purple accent |
| 05:18–06:13 | Blob → pin, "Where do all those locations actually live"; Redis (hot) + Cassandra (durable) tilted cards with streams | |
| 06:13–06:39 | AI night airport with overlays (offline phone, Redis, decision panels) | Crossfades, dip to black |
| 06:39–07:22 | Driver App → Dispatcher → branches; data dot → pin; "1 WRITE / 3 READERS"; readers with lane tags | |
| 07:22–07:44 | Typed narration; k-ring hexes; "Rank by ETA" / ~~Raw distance~~ | |
| 07:44–08:23 | User A vs B race: AVAILABLE → RESERVED, DB, win/lose arrows, alarm flash, clock, crowd | Busiest scene (one event every ~2.5 s) |
| 08:23–08:35 | "Uber" wordmark → tilted blog screenshot with highlight → zoom-through → Location Index → Candidates → Authoritative State | |
| 08:35–09:07 | Master diagram reprise + Analytics; blur-wave title "Real trick that makes the whole design work" | |
| 09:07–09:58 | Push-down + bloom → road; "Raw GPS is Noisy"; Kalman filter; Map Matching snap; zoom on car "100ms" | Bottom spotlight |
| 09:58–10:23 | Recap row of 4 cards lighting one by one | |
| 10:23–10:53 | "Small Scale / Which Database?" → DB evolution pipeline | |
| 10:53–11:10 | Road reprise; "Filtered · Partitioned · Indexed · Routed · Smoothed" with highlighter | |
| 11:10–11:28 | "Uber / System Design Interview" question cards with 3D focus pulls | |
| 11:28–11:36 | Neon brand outro, ending on a hold | Pure black |
