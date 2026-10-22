import React from "react";
import { Composition } from "remotion";
import { AntIntro, AntIntroProps, DURATION, FPS } from "./AntIntro";

// 4K UHD, 60 fps. Everything is authored in a 1920x1080 design space and scaled.
const base = { durationInFrames: DURATION, fps: FPS, width: 3840, height: 2160 };

const variants: { id: string; props: AntIntroProps }[] = [
  // transparent (render as ProRes 4444 with alpha)
  { id: "AntIntro-White", props: { ink: "white", bg: "transparent", logoStyle: "original" } },
  { id: "AntIntro-Black", props: { ink: "black", bg: "transparent", logoStyle: "original" } },
  // solid previews
  { id: "AntIntro-White-OnBlack", props: { ink: "white", bg: "black", logoStyle: "original" } },
  { id: "AntIntro-Black-OnWhite", props: { ink: "black", bg: "white", logoStyle: "original" } },
];

export const RemotionRoot: React.FC = () => (
  <>
    {variants.map((v) => (
      <Composition key={v.id} id={v.id} component={AntIntro} defaultProps={v.props} {...base} />
    ))}
  </>
);
