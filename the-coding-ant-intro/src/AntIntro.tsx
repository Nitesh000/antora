import React, { useMemo } from "react";
import {
  AbsoluteFill,
  cancelRender,
  continueRender,
  delayRender,
  Easing,
  interpolate,
  random,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import original from "./logo.json";
import smooth from "./logo_smooth.json";

// JetBrains Mono (variable, OFL) bundled locally so renders work offline
const MONO = "JetBrains Mono Local";
const fontHandle = delayRender("Loading JetBrains Mono", { timeoutInMilliseconds: 120000, retries: 2 });
const face = new FontFace(MONO, `url(${staticFile("fonts/JetBrainsMono-latin-var.woff2")}) format("woff2")`, {
  weight: "100 800",
});
face
  .load()
  .then(() => {
    document.fonts.add(face);
    continueRender(fontHandle);
  })
  .catch((err) => cancelRender(err));

export const FPS = 60;
export const DURATION = 420; // 7 s, ends on a held lockup with a blinking cursor

export type AntIntroProps = {
  ink: "white" | "black";
  bg: "transparent" | "black" | "white";
  logoStyle: "original" | "smooth";
};

const INK = { white: "#FFFFFF", black: "#000000" } as const;
const BG = { transparent: "transparent", black: "#000000", white: "#FFFFFF" } as const;

// ---- timeline (frames @ 60 fps) ---------------------------------------------
const T = {
  cursorIn: 4, // block cursor fades in, blinks
  typed: [22, 28, 34], // "<", "/", ">"
  open: 48, // "<" and "/>" slide apart to frame the logo (22f)
  compile: 58, // pixel cells assemble from the centre outward
  compileSpan: 54,
  cell: 12,
  snap: 128, // scanline sweeps, cells resolve into the crisp vector logo (24f)
  pulse: 152,
  bracketsOut: 156,
  twitch: 166, // antennae flick
  blink: 196,
  lockup: 214, // logo moves left, wordmark arrives (36f)
  the: 232,
  word: 242, // "Coding Ant" types at 4f/char
  twitch2: 330,
  blink2: 372,
};

// ---- layout (1920x1080 design space) ------------------------------------------
const CX = 960;
const CY = 540;
const BR_FS = 190; // bracket font size
const ADV = 0.6; // JetBrains Mono advance (em)
const LOGO_H0 = 560; // logo height while compiling (centre)
const LOGO_H1 = 380; // logo height in the final lockup
const WORD_FS = 120;
const THE_FS = 46;
const GAP = 80;

const E = {
  enter: Easing.bezier(0.16, 1, 0.3, 1),
  move: Easing.bezier(0.65, 0, 0.35, 1),
  exit: Easing.in(Easing.poly(4)),
};
const prog = (f: number, at: number, dur: number, easing = E.enter) =>
  interpolate(f, [at, at + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });

// damped flick in degrees
const flick = (f: number, at: number, amp: number) => {
  const t = f - at;
  return t < 0 ? 0 : amp * Math.exp(-t / 14) * Math.sin((2 * Math.PI * t) / 16);
};

// eyelid closed amount 0..1 (close 4f, hold 2f, open 5f)
const blink = (f: number, at: number) =>
  interpolate(f, [at, at + 4, at + 6, at + 11], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: E.move,
  });

// terminal cursor: solid while busy, otherwise 0.5s on / 0.5s off
const cursorOn = (f: number, busyUntil: number) => f < busyUntil || Math.floor((f - busyUntil) / 30) % 2 === 0;

type LogoData = typeof original;

export const AntIntro: React.FC<AntIntroProps> = ({ ink: inkName, bg, logoStyle }) => {
  const f = useCurrentFrame();
  const { width } = useVideoConfig();
  const ink = INK[inkName];
  const L: LogoData = logoStyle === "smooth" ? (smooth as LogoData) : original;

  // logo scale/position: centre (compile) -> left (lockup)
  const [bx0, by0, bx1, by1] = L.bbox;
  const bw = bx1 - bx0;
  const bh = by1 - by0;
  const s0 = LOGO_H0 / bh;
  const s1 = LOGO_H1 / bh;
  const wordW = 10 * ADV * WORD_FS + 0.62 * WORD_FS; // "Coding Ant" + cursor
  const lockW = bw * s1 + GAP + wordW;
  const lockLeft = CX - lockW / 2;
  const lx1 = lockLeft + (bw * s1) / 2; // logo centre x in lockup
  const k = prog(f, T.lockup, 36);
  const s = interpolate(k, [0, 1], [s0, s1]);
  const cx = interpolate(k, [0, 1], [CX, lx1]);
  const pulse = 1 + 0.025 * Math.sin(Math.PI * prog(f, T.pulse, 12, E.move));

  return (
    <AbsoluteFill style={{ backgroundColor: BG[bg] }}>
      <div
        style={{
          position: "absolute",
          width: 1920,
          height: 1080,
          transform: `scale(${width / 1920})`,
          transformOrigin: "0 0",
          color: ink,
          fontFamily: MONO,
        }}
      >
        <Brackets f={f} ink={ink} halfLogo={(bw * s0) / 2} />
        <Logo
          f={f}
          L={L}
          ink={ink}
          style={{
            position: "absolute",
            left: cx - ((bx0 + bw / 2) * s) * pulse,
            top: CY - ((by0 + bh / 2) * s) * pulse,
            width: 750 * s * pulse,
            height: 750 * s * pulse,
          }}
        />
        <Wordmark f={f} ink={ink} left={lockLeft + bw * s1 + GAP} />
      </div>
    </AbsoluteFill>
  );
};

// ---- "</>" typed at the centre, then split open to frame the logo ---------------
const Brackets: React.FC<{ f: number; ink: string; halfLogo: number }> = ({ f, ink, halfLogo }) => {
  const a = ADV * BR_FS;
  // centred input: "▌" -> "<▌" -> "</▌" -> "</>▌", the row re-centres with a short ease after each key
  const rowLeft = CX - a / 2 - T.typed.reduce((acc, t) => acc + prog(f, t, 4) * (a / 2), 0);
  const open = prog(f, T.open, 22);
  const out = prog(f, T.bracketsOut, 12, E.exit);
  const lLeft = interpolate(open, [0, 1], [rowLeft, CX - halfLogo - 70 - a]) - out * 40;
  const rLeft = interpolate(open, [0, 1], [rowLeft + a, CX + halfLogo + 70]) + out * 40;
  const nTyped = T.typed.filter((t) => f >= t).length;

  // cursor: blinks, gets pushed by typing, then collapses into the centre (compile origin)
  const curX = rowLeft + nTyped * a;
  const collapse = prog(f, T.open, 12, E.move);
  const curIn = prog(f, T.cursorIn, 10);
  const showCur = f < T.open + 12 && cursorOn(f, T.typed[2] + 10);
  const cw = 0.55 * BR_FS;
  const ch = 0.78 * BR_FS;

  const text: React.CSSProperties = {
    position: "absolute",
    top: CY - BR_FS * 0.56,
    fontSize: BR_FS,
    lineHeight: 1,
    fontWeight: 500,
    whiteSpace: "pre",
    opacity: 0.9 * (1 - out),
    filter: `blur(${out * 10}px)`,
  };
  return (
    <>
      {nTyped >= 1 && <div style={{ ...text, left: lLeft }}>{"<"}</div>}
      {nTyped >= 2 && <div style={{ ...text, left: rLeft }}>{"/>".slice(0, nTyped - 1)}</div>}
      {showCur && (
        <div
          style={{
            position: "absolute",
            left: interpolate(collapse, [0, 1], [curX + (a - cw) / 2, CX - cw / 2]),
            top: CY - ch / 2,
            width: cw,
            height: ch,
            background: ink,
            opacity: curIn,
            transform: `scale(${1 - collapse})`,
          }}
        />
      )}
    </>
  );
};

// ---- the ant: pixel compile -> scanline snap -> crisp vector, antennae + eyes alive ----
const Logo: React.FC<{ f: number; L: LogoData; ink: string; style: React.CSSProperties }> = ({ f, L, ink, style }) => {
  const [, by0, , by1] = L.bbox;
  const G = L.grid;

  // cells start from the centre outward with a little jitter
  const order = useMemo(() => {
    const ds = L.cells.map(([x, y], i) => Math.hypot(x + G / 2 - 375, y + G / 2 - 380) + random(`c${i}`) * 120);
    const max = Math.max(...ds);
    return ds.map((d) => d / max);
  }, [L, G]);

  const snapP = prog(f, T.snap, 24, E.move);
  const scanY = f < T.snap ? -1 : interpolate(snapP, [0, 1], [by0 - 12, by1 + 12]);
  const scanO = f < T.snap ? 0 : interpolate(f, [T.snap, T.snap + 3, T.snap + 20, T.snap + 26], [0, 1, 1, 0], {
    extrapolateRight: "clamp",
  });

  const aL = -(flick(f, T.twitch, 7) + flick(f, T.twitch2, 4));
  const aR = flick(f, T.twitch + 5, 7) + flick(f, T.twitch2 + 4, 4);
  const lid = Math.max(blink(f, T.blink), blink(f, T.blink2));
  const vectorDone = f >= T.snap + 24;

  return (
    <svg viewBox="0 0 750 750" style={{ ...style, overflow: "visible" }}>
      <defs>
        <clipPath id="antReveal">
          <rect x={-100} y={-100} width={950} height={Math.max(0, scanY + 100)} />
        </clipPath>
        <linearGradient id="antSweep" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={ink} stopOpacity={0} />
          <stop offset="1" stopColor={ink} stopOpacity={0.28} />
        </linearGradient>
      </defs>

      {/* pixel cells (the "compile") */}
      {!vectorDone && (
        <g fill={ink}>
          {L.cells.map(([x, y], i) => {
            const p = prog(f, T.compile + order[i] * T.compileSpan, T.cell);
            if (p <= 0) return null;
            const passed = interpolate(scanY - (y + G), [0, 40], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const o = p * (1 - passed);
            if (o <= 0.001) return null;
            const ccx = x + G / 2;
            const ccy = y + G / 2;
            const sc = 0.3 + 0.7 * p;
            const ox = (375 - ccx) * (1 - p) * 0.22;
            const oy = (380 - ccy) * (1 - p) * 0.22;
            const sz = (G - 2) * sc;
            return (
              <rect key={i} x={ccx - sz / 2 + ox} y={ccy - sz / 2 + oy} width={sz} height={sz} rx={1.5} opacity={o} />
            );
          })}
        </g>
      )}

      {/* crisp vector logo, revealed by the scanline */}
      <g clipPath={vectorDone ? undefined : "url(#antReveal)"} fill={ink} fillRule="evenodd">
        <path d={L.head} />
        <g transform={`rotate(${aL} ${L.pivotL[0]} ${L.pivotL[1]})`}>
          <path d={L.antennaL} />
        </g>
        <g transform={`rotate(${aR} ${L.pivotR[0]} ${L.pivotR[1]})`}>
          <path d={L.antennaR} />
        </g>
        {/* eyelids: ink-coloured rects that close over the eye holes */}
        {lid > 0 &&
          L.eyes.map(([x, y, w, h], i) => (
            <rect key={i} x={x - 2} y={y - 2} width={w + 4} height={(h + 4) * lid} rx={3} />
          ))}
      </g>

      {/* scanline + soft trailing light */}
      {scanO > 0 && (
        <g opacity={scanO}>
          <rect x={10} y={scanY - 60} width={730} height={60} fill="url(#antSweep)" />
          <rect
            x={0}
            y={scanY - 1.5}
            width={750}
            height={3}
            fill={ink}
            style={{ filter: `drop-shadow(0 0 4px ${ink}) drop-shadow(0 0 12px ${ink})` }}
          />
        </g>
      )}
    </svg>
  );
};

// ---- wordmark: "the" + typed "Coding Ant" + blinking block cursor -------------------
const Wordmark: React.FC<{ f: number; ink: string; left: number }> = ({ f, ink, left }) => {
  const word = "Coding Ant";
  const perChar = 4;
  const typedEnd = T.word + word.length * perChar;
  const n = f < T.word ? 0 : Math.min(word.length, Math.floor((f - T.word) / perChar) + 1);
  const theP = prog(f, T.the, 10);
  const curShow = f >= T.word - 6 && cursorOn(f, typedEnd + 6);
  const curIn = prog(f, T.word - 6, 6);

  return (
    <div style={{ position: "absolute", left, top: CY, transform: "translateY(-50%)" }}>
      <div
        style={{
          fontSize: THE_FS,
          fontWeight: 500,
          letterSpacing: "0.08em",
          lineHeight: 1,
          marginBottom: 14,
          marginLeft: 6,
          opacity: 0.6 * theP,
          filter: `blur(${(1 - theP) * 8}px)`,
          transform: `translateY(${(1 - theP) * 10}px)`,
        }}
      >
        the
      </div>
      <div style={{ fontSize: WORD_FS, fontWeight: 800, lineHeight: 1, whiteSpace: "pre", display: "flex", alignItems: "flex-end" }}>
        <span>{word.slice(0, n)}</span>
        <span
          style={{
            display: "inline-block",
            width: 0.55 * WORD_FS,
            height: 0.74 * WORD_FS,
            marginLeft: 0.06 * WORD_FS,
            marginBottom: 0.05 * WORD_FS,
            background: ink,
            opacity: curShow ? curIn : 0,
          }}
        />
      </div>
    </div>
  );
};
