import type { Alpine, PluginCallback } from 'alpinejs';

import { HeadlessHandler, RootHandler, headless } from './headless';

type GroupData = {
  active: number | null;
  id: number;
  addAccordion: (initial: boolean) => AccordionData;
};
const groupMap = new WeakMap<HTMLElement, GroupData>();

const getGroup = (el: HTMLElement, Alpine: Alpine) => {
  const root = Alpine.findClosest(el, groupMap.has.bind(groupMap));
  return groupMap.get(root);
};

const handleAccordionGroup: RootHandler<GroupData> = (
  el,
  _,
  { Alpine, effect },
) => {
  const groupData = Alpine.reactive({
    active: null as number | null,
    id: 0,
    addAccordion(initial: boolean) {
      const thisId = this.id++;
      const accordionInstance = Alpine.reactive({
        active: initial,
      });
      effect(() => {
        if (accordionInstance.active) {
          this.active = thisId;
        } else if (this.active === thisId) {
          this.active = null;
        }
      });
      effect(() => {
        if (this.active === thisId) {
          accordionInstance.active = true;
        } else {
          accordionInstance.active = false;
        }
      });
      return accordionInstance;
    },
  });
  groupMap.set(el, groupData);
  return groupData;
};

export const accordionGroup: PluginCallback = (Alpine) =>
  Alpine.directive('accordion-group', handleAccordionGroup);

type AccordionData = {
  active: boolean;
};
const handleAccordionRoot: RootHandler<AccordionData> = (
  el,
  { modifiers: [initialState = 'closed'] },
  { Alpine },
) =>
  getGroup(el, Alpine)?.addAccordion(initialState === 'open') ??
  Alpine.reactive({
    active: initialState === 'open',
  });

const controlForce = {
  open: true,
  close: false,
  toggle: null,
};

type controlType = keyof typeof controlForce;

const handleAccordionControl: HeadlessHandler<AccordionData> = (
  accordionData,
  el,
  { modifiers: [force = 'toggle'] },
  { Alpine },
) => {
  Alpine.bind(el, {
    'x-on:click': () => {
      accordionData.active =
        controlForce[force as controlType] ?? !accordionData.active;
    },
    ':aria-expanded': () => accordionData.active,
  });
};
const handleAccordionContainer: HeadlessHandler<AccordionData> = (
  accordionData,
  el,
  _,
  { Alpine },
) => {
  Alpine.bind(el, {
    'x-show': () => accordionData.active,
  });
};

const accordionHandlers = {
  control: handleAccordionControl,
  container: handleAccordionContainer,
};

export const accordion = headless(
  'accordion',
  handleAccordionRoot,
  accordionHandlers,
);

export const accordions: PluginCallback = (Alpine) => {
  accordionGroup(Alpine);
  accordion(Alpine);
};
export default accordions;
