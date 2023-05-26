import { headless } from './headless';

export const tabs = headless(
  'tabs',
  (_el, _directive, { Alpine, evaluate }) => {
    const tabGroup: {
      activeTab: number;
      tabs: HTMLElement[];
      panels: HTMLElement[];
      $focus: FocusMagic;
    } = Alpine.reactive({
      activeTab: 0,
      tabs: [] as HTMLElement[],
      panels: [] as HTMLElement[],
      $focus: evaluate('$focus') as FocusMagic,
    });
    return tabGroup;
  },
  {
    list: (tabGroup, el, _directive, { Alpine }) => {
      const focusNext = () => tabGroup.$focus.wrap().next();
      const focusPrevious = () => tabGroup.$focus.wrap().previous();

      Alpine.bind(el, {
        ':role': () => 'tablist',
        '@keydown.arrow-left.stop.prevent': focusPrevious,
        '@keydown.arrow-right.stop.prevent': focusNext,
        '@keydown.arrow-up.stop.prevent': focusPrevious,
        '@keydown.arrow-down.stop.prevent': focusNext,
      });
    },
    tab: (tabGroup, el, _directive, { Alpine }) => {
      const tabIndex = tabGroup.tabs.push(el) - 1;
      Alpine.bind(el, {
        ':tabindex': () => Number(tabIndex === tabGroup.activeTab) - 1,
        ':aria-selected': () => tabIndex === tabGroup.activeTab,
        '@click': () => tabGroup.$focus.focus(el),
        '@focus': () => (tabGroup.activeTab = tabIndex),
      });
    },
    panel: (tabGroup, el, _directive, { Alpine }) => {
      const panelIndex = tabGroup.panels.push(el) - 1;
      Alpine.bind(el, {
        'x-show': () => panelIndex === tabGroup.activeTab,
        ':hidden': () => panelIndex !== tabGroup.activeTab,
        ':aria-hidden': () => panelIndex !== tabGroup.activeTab,
      });
    },
  }
);

type FocusMagic = {
  within(el: HTMLElement): FocusMagic;
  withoutScrolling(): FocusMagic;
  noscroll(): FocusMagic;
  withWrapAround(): FocusMagic;
  wrap(): FocusMagic;
  focusable(el: HTMLElement): boolean;
  previouslyFocused(): HTMLElement;
  lastFocused(): HTMLElement;
  focused(): HTMLElement;
  focusables(): HTMLElement[];
  all(): HTMLElement[];
  isFirst(el: HTMLElement): boolean;
  isLast(el: HTMLElement): boolean;
  getFirst(): HTMLElement;
  getLast(): HTMLElement;
  getNext(): HTMLElement;
  getPrevious(): HTMLElement;
  first(): HTMLElement;
  last(): HTMLElement;
  next(): HTMLElement;
  previous(): HTMLElement;
  prev(): HTMLElement;
  focus(el: HTMLElement): void;
};
