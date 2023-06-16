import accordions from './headless/accordion';
import { HeadlessComponent } from './headless/headless';
import { panel } from './headless/panel';
import { tabs } from './headless/tabs';

export const UI: HeadlessComponent = (Alpine) =>
  Alpine.plugin([accordions, panel, tabs]);

export default UI;
