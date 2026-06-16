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
      isSelected($el: HTMLElement): boolean {
        return this.tabs[this.activeTab] === $el;
      },
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
      const activateCurrent = () => (tabGroup.activeTab = tabIndex);
      Alpine.bind(el, {
        ':tabindex': () => Number(tabIndex === tabGroup.activeTab) - 1,
        ':aria-selected': () => tabIndex === tabGroup.activeTab,
        '@click': activateCurrent,
        '@keydown.space.stop.prevent': activateCurrent,
        '@keydown.enter.stop.prevent': activateCurrent,
      });
    },
    panel: (tabGroup, el, _directive, { Alpine }) => {
      const panelIndex = tabGroup.panels.push(el) - 1;
      Alpine.bind(el, {
        ':tab-index': () => (panelIndex !== tabGroup.activeTab ? -1 : 0),
        ':aria-hidden': () => panelIndex !== tabGroup.activeTab,
        ':class'() {
          if (panelIndex === tabGroup.activeTab) {
            return 'panel-current';
          }
          if (panelIndex > tabGroup.activeTab) {
            return 'panel-next';
          }
          if (panelIndex < tabGroup.activeTab) {
            return 'panel-previous';
          }
        },
      });
    },
  },
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
