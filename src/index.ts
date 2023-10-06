import type { PluginCallback } from 'alpinejs';

import {
  accordion,
  accordionGroup,
  accordions,
  dragScroll,
  panel,
  swipeDetect,
  tabs,
} from './headless';
import { screen } from './magics';

export const NTMagics: PluginCallback = (Alpine) => Alpine.plugin([screen]);

export const UI: PluginCallback = (Alpine) =>
  Alpine.plugin([accordions, dragScroll, panel, swipeDetect, tabs, NTMagics]);

export default UI;

export {
  accordion,
  accordionGroup,
  accordions,
  dragScroll,
  panel,
  tabs,
  screen,
  PluginCallback,
};
