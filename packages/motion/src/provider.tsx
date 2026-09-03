"use client";

import * as React from "react";
import { MotionConfig } from "framer-motion";

export type MotionIntensity = "none" | "subtle" | "expressive" | "dramatic";

interface ExpressiveContextValue {
  intensity: MotionIntensity;
  reducedMotion: "system" | "always" | "never";
}

const ExpressiveContext = React.createContext<ExpressiveContextValue>({
  intensity: "expressive",
  reducedMotion: "system",
});

export const useExpressive = () => React.useContext(ExpressiveContext);

interface ExpressiveProviderProps {
  children: React.ReactNode;
  intensity?: MotionIntensity;
  reducedMotion?: "system" | "always" | "never";
}

export function ExpressiveProvider({
  children,
  intensity = "expressive",
  reducedMotion = "system",
}: ExpressiveProviderProps) {
  return (
    <ExpressiveContext.Provider value={{ intensity, reducedMotion }}>
      <MotionConfig reducedMotion={reducedMotion === "system" ? "user" : reducedMotion}>
        {children}
      </MotionConfig>
    </ExpressiveContext.Provider>
  );
}
