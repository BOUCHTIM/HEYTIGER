"use client";

import { GrainGradient, grainGradientPresets } from '@paper-design/shaders-react';

export type SectionGrainPreset = 'red' | 'black' | 'green';

interface SectionGrainProps {
  preset: SectionGrainPreset;
  colorBack?: string;
  colors?: string[];
  noise?: number;
  intensity?: number;
  /** animation speed — pass 0 to freeze (reduced motion) */
  speed?: number;
  /** layer opacity over the section background */
  opacity?: number;
}

const PRESETS: Record<SectionGrainPreset, { colorBack: string; colors: string[] }> = {
  red: {
    colorBack: '#C54834',
    colors: ['#D86A3A', '#7A1E0A'],
  },
  black: {
    colorBack: '#111111',
    colors: ['#1C1C1C', '#050505'],
  },
  green: {
    colorBack: '#1C4D2C',
    colors: ['#2A6B40', '#0D2918'],
  },
};

export default function SectionGrain({
  preset,
  colorBack,
  colors,
  noise = 0.45,
  intensity = 0.55,
  speed = 0.6,
  opacity = 1,
}: SectionGrainProps) {
  const base = PRESETS[preset];

  return (
    <GrainGradient
      {...grainGradientPresets[0]}
      colorBack={colorBack ?? base.colorBack}
      colors={colors ?? base.colors}
      noise={noise}
      intensity={intensity}
      speed={speed}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        width: '100%',
        height: '100%',
        opacity,
        pointerEvents: 'none',
      }}
    />
  );
}
