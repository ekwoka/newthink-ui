import { HeadlessComponent } from './headless/headless';
import { panel } from './headless/panel';
import { tabs } from './headless/tabs';

export const UI: HeadlessComponent = (Alpine) => Alpine.plugin([panel, tabs]);

export default UI;
