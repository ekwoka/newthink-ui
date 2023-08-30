import {
  accordion,
  accordionGroup,
  accordions,
  dragScroll,
  panel,
  tabs,
} from './headless';
import { screen } from './magics';
import type { AlpinePlugin } from './types';

export const NTMagics: AlpinePlugin = (Alpine) => Alpine.plugin([screen]);

export const UI: AlpinePlugin = (Alpine) =>
  Alpine.plugin([accordions, dragScroll, panel, tabs, NTMagics]);

export default UI;

export {
  accordion,
  accordionGroup,
  accordions,
  dragScroll,
  panel,
  tabs,
  screen,
  AlpinePlugin,
};
