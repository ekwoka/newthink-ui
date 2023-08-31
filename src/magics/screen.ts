import type { Alpine } from 'alpinejs';

import { AlpinePlugin } from '../types';

export const screen: AlpinePlugin = (Alpine) => {
  Alpine.magic('screen', () => (breakpoint: string | number) => {
    const breakSize =
      typeof breakpoint === 'number'
        ? breakpoint
        : breakpoints[breakpoint] ?? Number(breakpoint);
    if (!breakSize) {
      console.error(
        `Invalid breakpoint: $screen(${JSON.stringify(breakpoint)})`,
      );
      return false;
    }
    const signal = getMediaSignal(breakSize, Alpine);
    return signal.value;
  });
};

// Configuration
const defaultBreakpoints: Record<string, number> = {
  xs: 320,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

const breakpoints = defaultBreakpoints;
const mediaSignals: Record<number, { value: boolean }> = {};

const getMediaSignal = (breakpoint: number, Alpine: Alpine) => {
  return mediaSignals[breakpoint] ?? createMediaSignal(breakpoint, Alpine);
};

const createMediaSignal = (breakpoint: number, Alpine: Alpine) => {
  const mediaMatch = window.matchMedia(`(min-width: ${breakpoint}px)`);
  const signal = Alpine.reactive({
    value: mediaMatch.matches,
  });
  mediaSignals[breakpoint] = signal;
  mediaMatch.addEventListener('change', (e) => {
    signal.value = e.matches;
  });
  return signal;
};
