import { RootHandler, headless } from './headless';

type PanelState = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

const handleRoot: RootHandler<PanelState> = (el, _, { Alpine }) => {
  const panelState = Alpine.reactive({
    isOpen: false,
    open() {
      this.isOpen = true;
    },
    close() {
      this.isOpen = false;
    },
    toggle() {
      return this.isOpen ? this.close() : this.open();
    },
  });

  Alpine.bind(el, {
    'x-id': () => ['x-panel'],
  });

  return panelState;
};

export const panel = headless('panel', handleRoot, {
  summary: (panelState, el, _, { Alpine }) => {
    Alpine.bind(el, {
      ':aria-expanded': () => panelState.isOpen,
      ':aria-controls': '$id("x-panel")',
    });
  },
  content: (panelState, el, _, { Alpine }) => {
    Alpine.bind(el, {
      'x-show': () => panelState.isOpen,
    });
  },
});
