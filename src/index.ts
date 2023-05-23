import { HeadlessComponent } from './headless/headless';
import { panel } from './headless/panel';

export const UI: HeadlessComponent = (Alpine) => Alpine.plugin([panel]);

export default UI;
